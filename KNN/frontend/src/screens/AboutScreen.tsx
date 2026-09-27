import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { colors, fonts } from '../theme/theme';

export function AboutScreen({ onBack }: { onBack: () => void }) {
  return <View style={styles.screen}>
    <Button style={styles.back} onPress={onBack} accessibilityLabel="Back"><Icon name="arrow" /></Button>
    <View style={styles.mark}><Icon name="leaf" size={28} color={colors.sageDeep} /></View>
    <Text style={styles.title}>Munting Hapag</Text>
    <Text style={styles.body}>A shared pantry for your people. Trade a little, gather often, and keep good food moving through your village.</Text>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: colors.ivory },
  back: { position: 'absolute', top: 48, left: 24, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: colors.paper, transform: [{ rotate: '180deg' }] },
  mark: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 32, backgroundColor: colors.sagePale },
  title: { marginTop: 18, color: colors.brown, fontFamily: fonts.serif, fontSize: 30 },
  body: { maxWidth: 340, marginTop: 10, color: colors.brownSoft, fontFamily: fonts.sans, fontSize: 14, lineHeight: 22, textAlign: 'center' },
});
