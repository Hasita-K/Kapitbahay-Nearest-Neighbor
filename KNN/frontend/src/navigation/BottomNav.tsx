// BottomNav.tsx
// The web version rendered its own bottom nav manually and swapped screens by
// hand (useState<Screen> + conditional rendering). In RN, use React
// Navigation's bottom-tabs navigator instead — it gives you this bar, screen
// transitions, and back-gesture handling for free. This file shows how to
// register the tabs; it replaces manual <BottomNav> usage entirely.
//
// Requires:
//   npx expo install @react-navigation/native @react-navigation/bottom-tabs
//   npx expo install react-native-screens react-native-safe-area-context
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '../components/Icon';
import { colors, fonts } from '../theme/theme';

// Replace these with your real screens as you convert them.
import { HomeScreen } from '../screens/HomeScreen';
import { MyPantryScreen } from '../screens/MyPantryScreen';
import { TradeScreen } from '../screens/TradeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export function VillageTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brown,
        tabBarInactiveTintColor: colors.brownSoft,
        tabBarStyle: { backgroundColor: colors.paper, borderTopColor: colors.line },
        tabBarLabelStyle: { fontFamily: fonts.sansMedium, fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="Village"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Pantry"
        component={MyPantryScreen}
        options={{ tabBarIcon: ({ color, size }) => <Icon name="pantry" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Trades"
        component={TradeScreen}
        options={{ tabBarIcon: ({ color, size }) => <Icon name="swap" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Me"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <Icon name="user" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}
