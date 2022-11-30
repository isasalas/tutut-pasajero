import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import LineasScreen from './screens/LineasScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MD3Colors } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Provider as PaperProvider, MD2DarkTheme } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import InternosScreen from './screens/InternosScreen';
import DispScreen from './screens/DispScreen';

const theme = {

  ...MD2DarkTheme
};

export default function App() {

  const Stack = createStackNavigator();

  return (
    <PaperProvider theme={{
      
      dark: true,
      ...MD2DarkTheme
    }}>
      <NavigationContainer >
        <Stack.Navigator initialRouteName='home'
         /* screenOptions={{
            contentStyle: { backgroundColor: '#12121200', flex: 1 }
          }}*/
        >
          <Stack.Screen name="linea" component={LineasScreen}

            options={{
              headerShown: false, 
              gestureEnabled: false,

            }} />
          <Stack.Screen name="disp" component={DispScreen}

            options={{
              headerShown: false,
              gestureEnabled: false,

            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

