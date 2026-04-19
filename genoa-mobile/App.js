import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// --- ÉCRAN DE CONNEXION ---
// --- ÉCRAN DE CONNEXION & INSCRIPTION ---
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Permet de basculer entre Connexion et Inscription

  // ⚠️ IMPORTANT : REMPLACE CETTE URL PAR TON LIEN NGROK ! (sans le / à la fin)
  const API_URL = "https://gumminess-unbaked-primary.ngrok-free.dev";
  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    // On choisit la bonne route selon le mode (login ou register)
    const endpoint = isLogin ? '/auth/login' : '/auth/register';

    try {
      // On envoie la requête au serveur
      // Dans App.js, vérifie cette partie :
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim(), // On enlève les espaces inutiles
          password: password 
        })
      });
      
      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          Alert.alert("Succès", "Bienvenue !");
          // Si on est connecté, on passe à l'arbre
          navigation.navigate('Arbre');
        } else {
          Alert.alert("Inscription réussie", data.message);
          // Après l'inscription, on repasse sur la vue de connexion
          setIsLogin(true);
        }
      } else {
        // Le serveur nous a renvoyé une erreur (ex: mauvais mot de passe)
        Alert.alert("Erreur", data.error || "Une erreur est survenue.");
      }
    } catch (error) {
      Alert.alert("Erreur réseau", "Impossible de joindre le serveur. As-tu bien mis le lien Ngrok ?");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🌳 Genoa</Text>
      <Text style={styles.subtitle}>Votre arbre généalogique intelligent</Text>

      <Text style={{fontSize: 20, marginBottom: 15, fontWeight: 'bold'}}>
        {isLogin ? "Connexion" : "Créer un compte"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Adresse e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <Button title={isLogin ? "Se connecter" : "S'inscrire"} onPress={handleAuth} />
      
      <View style={{ marginTop: 20 }}>
        <Button 
          title={isLogin ? "Pas de compte ? S'inscrire" : "Déjà un compte ? Se connecter"} 
          color="gray"
          onPress={() => setIsLogin(!isLogin)} // Inverse le mode
        />
      </View>
    </SafeAreaView>
  );
}
// --- ÉCRAN PRINCIPAL (L'ARBRE) ---
function TreeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Arbre Familial</Text>
      <Text>La liste des membres apparaîtra ici.</Text>
    </View>
  );
}

// --- CONFIGURATION DE LA NAVIGATION ---
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} // On cache l'en-tête pour le login
        />
        <Stack.Screen 
          name="Arbre" 
          component={TreeScreen} 
          options={{ title: 'Arbre Généalogique', headerLeft: null }} // Empêche de revenir au login sans se déconnecter
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- STYLES (StyleSheet comme vu en cours) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: 'white',
  },
});