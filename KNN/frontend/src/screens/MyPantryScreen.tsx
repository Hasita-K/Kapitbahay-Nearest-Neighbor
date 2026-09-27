// MyPantryScreen.tsx — PLACEHOLDER. Replace with the real personal pantry
// screen (the MyPantryScreen function in your Figma Make App.tsx). It already
// has Field, Icon, and FoodIcon available to reuse — most of the work left is
// the item grid layout.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme/theme';

export function MyPantryScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>My Pantry</Text>
      <Text style={styles.body}>Coming soon — this replaces the personal fridge/pantry screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ivory, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontFamily: fonts.serif, fontSize: 28, color: colors.brown, marginBottom: 8 },
  body: { fontFamily: fonts.sans, fontSize: 14, color: colors.brownSoft, textAlign: 'center' },
});
