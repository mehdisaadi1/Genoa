import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import api from '../api/axios';

export default function MemberFormScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('M');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSave = async () => {
    try {
      await api.post('/members', {
        firstName,
        lastName,
        gender,
        isPrivate
      });
      Alert.alert('Succès', 'Membre ajouté à l\'arbre');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de créer le membre');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nouveau Membre</Text>

      <Text style={styles.label}>Prénom</Text>
      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

      <Text style={styles.label}>Nom</Text>
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

      <Text style={styles.label}>Sexe (M/F)</Text>
      <TextInput style={styles.input} value={gender} onChangeText={setGender} />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Données privées ?</Text>
        <Switch value={isPrivate} onValueChange={setIsPrivate} />
      </View>

      <Button title="Enregistrer" onPress={handleSave} color="#2ECC71" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 5, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  }
});
