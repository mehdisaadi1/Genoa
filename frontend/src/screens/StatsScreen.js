import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import api from '../api/axios';

export default function StatsScreen() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) {
    return <View style={styles.container}><Text>Chargement...</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Statistiques Familiales</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre total de membres</Text>
        <Text style={styles.value}>{stats.totalMembers}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Répartition</Text>
        <Text style={styles.valueSub}>Hommes : {stats.menCount}</Text>
        <Text style={styles.valueSub}>Femmes : {stats.womenCount}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Espérance de vie moyenne</Text>
        <Text style={styles.value}>{stats.lifeExpectancy} ans</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2C3E50',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3498DB',
  },
  valueSub: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2980B9',
    marginTop: 5,
  }
});
