import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Sample disease data
const diseases = [
  {
    id: '1',
    name: 'Diabetes',
    shortDescription: 'A disease that occurs when blood glucose is too high',
    causes: [
      'Insufficient insulin production',
      'Insulin resistance',
      'Genetic factors',
      'Obesity'
    ],
    symptoms: [
      'Increased thirst',
      'Frequent urination',
      'Extreme hunger',
      'Unexplained weight loss'
    ],
    treatment: 'Management through diet, exercise, and medication'
  },
  {
    id: '2',
    name: 'Hypertension',
    shortDescription: 'High blood pressure that can lead to severe health complications',
    causes: [
      'Age',
      'Obesity',
      'Genetics',
      'High sodium intake'
    ],
    symptoms: [
      'Headaches',
      'Shortness of breath',
      'Nosebleeds',
      'Visual changes'
    ],
    treatment: 'Lifestyle changes and medication'
  },
  // Add more diseases as needed
];

const DiseaseInfoScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredDiseases = diseases.filter(disease =>
    disease.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDiseaseCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.diseaseCard}
      onPress={() => navigation.navigate('DiseaseDetail', { disease: item })}
    >
      <View style={styles.diseaseInfo}>
        <Text style={styles.diseaseName}>{item.name}</Text>
        <Text style={styles.diseaseDescription}>{item.shortDescription}</Text>
        <View style={styles.symptomsList}>
          {item.symptoms.slice(0, 2).map((symptom, index) => (
            <Text key={index} style={styles.symptomTag}>
              {symptom}
            </Text>
          ))}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#007AFF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Information</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search diseases..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredDiseases}
        renderItem={renderDiseaseCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  diseaseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  diseaseInfo: {
    flex: 1,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  diseaseDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  symptomsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  symptomTag: {
    backgroundColor: '#E3F2FD',
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginTop: 4,
    fontSize: 12,
    color: '#1976D2',
  },
});

export default DiseaseInfoScreen;