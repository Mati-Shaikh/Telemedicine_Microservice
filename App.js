// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from './screens/LoginScreen';
import DiseaseDetailScreen from './screens/DiseaseDetailScreen';
import DoctorListScreen from './screens/DoctorListScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import AppointmentScreen from './screens/AppointmentScreen';
import ConsultScreen from './screens/ConsultScreen';
import EducationScreen from './screens/EducationScreen';
import ChatScreen from './screens/ChatScreen';
import DoctorChatRoom from './screens/DoctorChat';
import DoctorChat from './screens/DoctorChat';
import DoctorCallList from './screens/DoctorsCallList';
import AudioCall from './screens/AudioCall';
import DoctorConsultScreen from './screens/DoctorConsultScreen';
import PatientsListScreen from './screens/PatientsListScreen';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Appointment':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Consult':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'Education':
              iconName = focused ? 'book' : 'book-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Appointment" component={AppointmentScreen} />
      <Tab.Screen name="Consult" component={ConsultScreen} />
      <Tab.Screen name="Education" component={EducationScreen} />
    </Tab.Navigator>
  );
};



const TabNavigatorDoctor = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Appointment':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Consult':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'Education':
              iconName = focused ? 'book' : 'book-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Appointment" component={AppointmentScreen} />
      <Tab.Screen name="Consult" component={DoctorConsultScreen} />
      <Tab.Screen name="Education" component={EducationScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="DoctorChatRoom"
          component={DoctorChatRoom}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainApp"
          component={TabNavigator}
        />
        <Stack.Screen
                  name="MainAppDoctor"
                  component={TabNavigatorDoctor}
                />
         <Stack.Screen
          name="DoctorListScreen"
          component={DoctorListScreen}
        />
        <Stack.Screen
                  name="PatientsListScreen"
                  component={PatientsListScreen}
                />


        <Stack.Screen
    name="DiseaseDetail"
    component={DiseaseDetailScreen}
    options={{ headerShown: false }}
  />
  <Stack.Screen name="DoctorCallList" component={DoctorCallList} />
<Stack.Screen name="AudioCall" component={AudioCall} />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            headerShown: true,
            title: 'Chat Consultation'
          }}
        />
        <Stack.Screen
                  name="Chat2"
                  component={DoctorChat}
                  options={{
                    headerShown: true,
                    title: 'Chat Consultation'
                  }}
                />
      </Stack.Navigator>
    </NavigationContainer>
  );
}