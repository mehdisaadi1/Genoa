import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';

import TreeScreen from '../screens/TreeScreen';
import StatsScreen from '../screens/StatsScreen';
import AdminScreen from '../screens/AdminScreen';

import SearchScreen from '../screens/SearchScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Tab.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: '#3498DB' },
            headerTintColor: '#fff',
            tabBarActiveTintColor: '#3498DB',
            tabBarInactiveTintColor: 'gray',
        }}
    >
      <Tab.Screen name="Arbre" component={TreeScreen} />
      <Tab.Screen name="Recherche" component={SearchScreen} />
      <Tab.Screen name="Statistiques" component={StatsScreen} />
      {user?.role === 'Admin' && (
        <Tab.Screen name="Admin" component={AdminScreen} />
      )}
    </Tab.Navigator>
  );
}
