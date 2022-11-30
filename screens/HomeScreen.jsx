import { View, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import React from 'react'
import LineasScreen from './LineasScreen';
import { MD3Colors } from 'react-native-paper';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator 
            screenOptions={{
                tabBarShowLabel: false,
                //navigationBarColor: "#121212",
                //statusBarColor: "#121212",
                //headerTintColor: "#121212",
                headerStyle: { backgroundColor: '#121212' },
                headerTitleStyle: { color: MD3Colors.neutral80 },
                tabBarStyle: { backgroundColor: '#121212' } 
            }}>
            <Tab.Screen name='lineas' component={LineasScreen} 
                options={{
                    headerShown: false,
                    title: "Ruta de ida",
                    tabBarIcon: (({ color, size }) => (
                        <MaterialIcons name="alt-route" size={size} color={color} />))
                }}
            />
            <Tab.Screen name='mapVuelta' component={LineasScreen}
                options={{
                    title: "Ruta de vuelta",
                    headerShown: false,
                    tabBarIcon: (({ color, size }) => (
                        <MaterialCommunityIcons name="bus" size={size} color={color} />))
                }}
            />

        </Tab.Navigator>
    )
}