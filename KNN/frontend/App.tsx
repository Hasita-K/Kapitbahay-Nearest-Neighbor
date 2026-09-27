// App.tsx — replaces your current boilerplate KNN/frontend/App.tsx
import React from 'react';
import { useFonts, Fraunces_300Light, Fraunces_400Regular, Fraunces_500Medium } from '@expo-google-fonts/fraunces';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthScreen } from './src/screens/AuthScreen';
import { VillageTabs } from './src/navigation/BottomNav';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Fraunces_300Light,
    Fraunces_400Regular,
    Fraunces_500Medium,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  if (!fontsLoaded) return null; // swap for a splash/loading view if you want one

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth">
          {(props) => (
            <AuthScreen
              onEnter={() => props.navigation.replace('Main')}
              onAbout={() => props.navigation.navigate('About')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Main" component={VillageTabs} />
        {/* Add AboutScreen here once converted */}
        {/* Add AddVillagerModal here with options={{ presentation: 'modal' }} once converted */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
