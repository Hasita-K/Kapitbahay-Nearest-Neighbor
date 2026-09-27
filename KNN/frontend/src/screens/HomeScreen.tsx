// HomeScreen.tsx — PLACEHOLDER. Replace with the real "village map" screen
// (the HomeScreen function in your Figma Make App.tsx), following the same
// conversion pattern used for AuthScreen.tsx.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme/theme';

export function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Village</Text>
      <Text style={styles.body}>Coming soon — this replaces the pond/village map screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ivory, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontFamily: fonts.serif, fontSize: 28, color: colors.brown, marginBottom: 8 },
  body: { fontFamily: fonts.sans, fontSize: 14, color: colors.brownSoft, textAlign: 'center' },
});
