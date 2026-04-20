import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    setStatusMsg({ text: '', type: '' });
    if (!email || !password) {
      setStatusMsg({ text: 'Veuillez remplir tous les champs.', type: 'error' });
      return;
    }
    
    try {
      await register(email, password);
      setStatusMsg({ text: 'Inscription réussie ! Redirection en cours...', type: 'success' });
      if (Platform.OS === 'web') window.alert("Inscription réussie ! Vous pouvez vous connecter.");
      
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.error || "Erreur lors de l'inscription";
      setStatusMsg({ text: msg, type: 'error' });
      if (Platform.OS === 'web') window.alert(msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      
      {statusMsg.text !== '' && (
        <Text style={statusMsg.type === 'error' ? styles.errorText : styles.successText}>
          {statusMsg.text}
        </Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  errorText: {
    color: '#E74C3C',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  successText: {
    color: '#2ECC71',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2ECC71',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#3498DB',
    fontSize: 16,
  }
});
