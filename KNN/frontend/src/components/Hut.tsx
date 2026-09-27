// Hut.tsx — converted from the Hut function + .hut/.hut-house/.hut-roof/
// .hut-door/.hut-label CSS classes in your Figma Make export.
import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme/theme';

type Position = { top?: number; right?: number; left?: number; bottom?: number; scale?: number };

export function Hut({
  name,
  note,
  position,
  onPress,
}: {
  name: string;
  note: string;
  position: Position;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`Open ${name}'s pantry`}
      style={[
        styles.hut,
        {
          top: position.top,
          right: position.right,
          left: position.left,
          bottom: position.bottom,
          transform: position.scale ? [{ scale: position.scale }] : undefined,
        },
      ]}
    >
      <View style={styles.house}>
        <View style={styles.roof} />
        <View style={styles.door} />
      </View>
      <View style={styles.label}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.note}>{note}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hut: { position: 'absolute', width: 132, alignItems: 'center' },
  house: {
    width: 82,
    height: 56,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 18,
    backgroundColor: '#e0c6a3', // web used a diagonal gradient #ebd2b1 -> #d6b899;
    // swap this View for <LinearGradient colors={['#ebd2b1', '#d6b899']} .../>
    // if you want the exact two-tone look
    shadowColor: '#5c5347',
    shadowOffset: { width: 0, height: 13 },
    shadowOpacity: 0.12,
    shadowRadius: 26,
    elevation: 4,
  },
  roof: {
    width: 96,
    height: 42,
    position: 'absolute',
    top: -22,
    left: -7,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#94ac83', // web gradient #819b76 -> #aabd98
    transform: [{ rotate: '-2deg' }],
  },
  door: {
    width: 20,
    height: 28,
    position: 'absolute',
    right: 15,
    bottom: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    backgroundColor: 'rgba(92, 83, 71, 0.48)',
  },
  label: {
    minWidth: 105,
    marginTop: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 250, 240, 0.9)',
    shadowColor: '#5c5347',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  name: { fontFamily: fonts.serifMedium, fontSize: 16, color: colors.brown },
  note: { fontFamily: fonts.sans, fontSize: 9, color: colors.brownSoft, marginTop: 1 },
});
