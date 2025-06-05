import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import JobDetailScreen from './screens/JobDetailScreen';
import EquipmentRemarkScreen from './screens/EquipmentRemarkScreen'; // Only if used
import { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="JobDetail" component={JobDetailScreen} />
        {/* Remove or comment this line if not used */}
        {/* <Stack.Screen name="Equipment" component={EquipmentScreen} /> */}
        <Stack.Screen name="EquipmentRemark" component={EquipmentRemarkScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
