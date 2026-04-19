import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList } from 'react-native';
import api from '../api/axios';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (text) => {
    setQuery(text);
    if (!text) {
      setResults([]);
      return;
    }
    try {
      const res = await api.get(`/search?q=${text}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
      <Text style={styles.info}>Genre : {item.gender}</Text>
      {item.isPrivate && <Text style={styles.private}>[Privé]</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher par nom ou prénom..."
        value={query}
        onChangeText={handleSearch}
      />
      
      <FlatList
        data={results}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#F5F7FA' },
  searchBar: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
    marginBottom: 20
  },
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50' },
  info: { color: '#7F8C8D', marginTop: 5 },
  private: { color: '#E74C3C', marginTop: 5, fontWeight: 'bold' }
});
