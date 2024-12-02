import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Replace with your Firebase config file

const CallScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { calleeId, callerId, channelName } = route.params;

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef(new RTCPeerConnection());
  const callRef = useRef(doc(db, 'calls', channelName));

  useEffect(() => {
    const startCall = async () => {
      try {
        await setupMedia();
        setupCallListeners();
      } catch (error) {
        console.error('Error starting call:', error);
        Alert.alert('Error', 'Failed to start the call');
        navigation.goBack();
      }
    };

    startCall();

    return () => {
      endCall();
    };
  }, []);

  const setupMedia = async () => {
    const stream = await mediaDevices.getUserMedia({ audio: true, video: false });
    setLocalStream(stream);
    peerConnection.current.addStream(stream);
  };

  const setupCallListeners = async () => {
    // Listening for ICE candidates
    peerConnection.current.onicecandidate = async (event) => {
      if (event.candidate) {
        await setDoc(callRef.current, { iceCandidates: event.candidate.toJSON() }, { merge: true });
      }
    };

    // Listening for Remote Stream
    peerConnection.current.onaddstream = (event) => {
      setRemoteStream(event.stream);
    };

    // Listen for offer/answer changes
    onSnapshot(callRef.current, async (snapshot) => {
      const data = snapshot.data();
      if (!peerConnection.current.currentRemoteDescription && data?.answer) {
        const remoteDesc = new RTCSessionDescription(data.answer);
        await peerConnection.current.setRemoteDescription(remoteDesc);
      }

      if (data?.iceCandidates) {
        const candidate = new RTCIceCandidate(data.iceCandidates);
        await peerConnection.current.addIceCandidate(candidate);
      }
    });

    // Create offer if the current user is the caller
    if (callerId) {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      await setDoc(callRef.current, { offer: offer.toJSON() }, { merge: true });
    }
  };

  const endCall = async () => {
    peerConnection.current.close();
    setLocalStream(null);
    setRemoteStream(null);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        {calleeId ? `Calling...` : `In Call`}
      </Text>

      <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
        <Text style={styles.endCallButtonText}>End Call</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  headerText: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  endCallButton: { backgroundColor: '#FF0000', padding: 15, borderRadius: 10 },
  endCallButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default CallScreen;
