import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../api/axios';

export default function AdminScreen() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const validateUser = async (id) => {
    try {
      await api.put(`/admin/users/${id}/validate`);
      fetchUsers();
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de valider cet utilisateur');
    }
  };

  const changeRole = async (id, newRole) => {
    try {
      await api.put(`/admin/users/${id}`, { role: newRole });
      fetchUsers();
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de changer le rôle');
    }
  };

  const deleteUser = async (id) => {
    Alert.alert('Confirmation', 'Supprimer ce compte ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/admin/users/${id}`);
            fetchUsers();
          } catch (err) {
            Alert.alert('Erreur', 'Impossible de supprimer');
          }
      }}
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.email}>{item.email} ({item.role})</Text>
      <Text style={item.is_validated ? styles.validated : styles.pending}>
        Statut : {item.is_validated ? 'Validé' : 'En attente'}
      </Text>
      
      <View style={styles.actions}>
        {!item.is_validated && (
          <TouchableOpacity style={[styles.btn, styles.btnValid]} onPress={() => validateUser(item.id)}>
            <Text style={styles.btnText}>Valider</Text>
          </TouchableOpacity>
        )}
        {item.role !== 'Admin' && (
          <TouchableOpacity style={[styles.btn, styles.btnRole]} onPress={() => changeRole(item.id, 'Admin')}>
             <Text style={styles.btnText}>Promouvoir Admin</Text>
          </TouchableOpacity>
        )}
        {item.role !== 'Editor' && (
           <TouchableOpacity style={[styles.btn, styles.btnRole]} onPress={() => changeRole(item.id, 'Editor')}>
             <Text style={styles.btnText}>Mettre Editeur</Text>
           </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.btn, styles.btnDelete]} onPress={() => deleteUser(item.id)}>
          <Text style={styles.btnText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administration</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2C3E50',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495E',
  },
  validated: {
    color: '#27AE60',
    marginTop: 5,
  },
  pending: {
    color: '#E67E22',
    marginTop: 5,
    fontWeight: 'bold',
  },
  actions: {
    marginTop: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10, // Not perfectly supported on all RN versions, replace with margins if needed
  },
  btn: {
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  btnValid: {
    backgroundColor: '#2ECC71',
  },
  btnRole: {
    backgroundColor: '#F1C40F',
  },
  btnDelete: {
    backgroundColor: '#E74C3C',
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  }
});
