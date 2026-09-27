// WatercolorMarks.tsx
// The web version used CSS blur() filters + radial-gradient backgrounds for
// the soft "wash" blobs. RN's View has no blur filter, so this approximates
// it with large, very-transparent, softly-colored circles instead — close
// enough at this size that the blur is barely perceptible even on web.
// If you want a true gaussian blur, add `expo-blur`'s <BlurView> as a wrapper,
// but note BlurView blurs whatever sits *behind* it, not its own fill color,
// so it isn't a drop-in replacement for CSS blur() on a gradient.
//
// Requires: npx expo install expo-linear-gradient
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/theme';

export function WatercolorMarks({ compact = false }: { compact?: boolean }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* wash-blue */}
      <View style={[styles.wash, styles.washBlue, compact && styles.washBlueCompact]} />
      {/* wash-sage */}
      <View style={[styles.wash, styles.washSage, compact && styles.washSageCompact]} />

      {/* lily-one */}
      <LinearGradient
        colors={['rgba(137,166,120,0.86)', 'rgba(183,203,168,0.68)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.lilyOne}
      >
        <View style={styles.lilyBloom}>
          <View style={styles.lilyBloomCenter} />
        </View>
      </LinearGradient>

      {/* lily-two (no bloom — "b { display: none }" on web) */}
      <LinearGradient
        colors={['rgba(137,166,120,0.86)', 'rgba(183,203,168,0.68)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.lilyTwo}
      />

      <Text style={styles.flowerOne}>✦</Text>
      <Text style={styles.flowerTwo}>·</Text>

      {/* koi */}
      <LinearGradient
        colors={[colors.coral, 'rgba(255,250,240,0.95)', colors.coral]}
        locations={[0.25, 0.5, 0.67]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.koi}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wash: { position: 'absolute', opacity: 0.5 },
  washBlue: {
    width: 260,
    height: 190,
    right: -55,
    top: 20,
    borderRadius: 999,
    backgroundColor: 'rgba(147, 197, 204, 0.35)',
    transform: [{ rotate: '-12deg' }],
  },
  washBlueCompact: { width: 180, height: 140 },
  washSage: {
    width: 210,
    height: 130,
    left: -32,
    bottom: -22,
    borderRadius: 999,
    backgroundColor: 'rgba(169, 192, 151, 0.4)',
    transform: [{ rotate: '9deg' }],
  },
  washSageCompact: { width: 150, height: 100 },
  lilyOne: {
    position: 'absolute',
    right: -12,
    bottom: 34,
    width: 96,
    height: 58,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  lilyTwo: {
    position: 'absolute',
    right: 100,
    bottom: -4,
    width: 60,
    height: 40,
    borderRadius: 20,
    opacity: 0.72,
    transform: [{ rotate: '15deg' }],
  },
  lilyBloom: {
    width: 38,
    height: 26,
    borderRadius: 999,
    backgroundColor: 'rgba(240, 199, 201, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lilyBloomCenter: {
    width: 11,
    height: 11,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 250, 240, 0.9)',
  },
  flowerOne: { position: 'absolute', top: 56, right: 70, fontSize: 20, color: colors.coral },
  flowerTwo: { position: 'absolute', top: 105, right: 35, fontSize: 28, color: colors.coral },
  koi: {
    position: 'absolute',
    right: 70,
    bottom: 98,
    width: 36,
    height: 11,
    borderRadius: 999,
    transform: [{ rotate: '-28deg' }],
  },
});
