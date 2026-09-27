// TradeScreen.tsx — PLACEHOLDER. Replace with the real trade request screen
// (the TradeScreen function in your Figma Make App.tsx) — the
// pending/countered/accepted/rejected/completed state machine logic ports
// over unchanged; only the JSX/styling needs converting.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme/theme';

export function TradeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Trades</Text>
      <Text style={styles.body}>Coming soon — this replaces the trade request flow screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ivory, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontFamily: fonts.serif, fontSize: 28, color: colors.brown, marginBottom: 8 },
  body: { fontFamily: fonts.sans, fontSize: 14, color: colors.brownSoft, textAlign: 'center' },
});
