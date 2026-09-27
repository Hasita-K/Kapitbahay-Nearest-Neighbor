// AuthScreen.tsx
// A full, representative conversion of one screen — use this as the template
// for MyPantryScreen, TradeScreen, ProfileScreen, etc. The pattern per screen
// is always: div -> View, p/span/small/b -> Text, button -> AppButton,
// className styling -> a StyleSheet.create() block using theme.ts tokens.
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppButton } from '../components/Button';
import { Field } from '../components/Field';
import { Icon } from '../components/Icon';
import { WatercolorMarks } from '../components/WatercolorMarks';
import { colors, fonts } from '../theme/theme';

type Mode = 'login' | 'signup';

export function AuthScreen({ onEnter, onAbout }: { onEnter: () => void; onAbout: () => void }) {
  const [mode, setMode] = useState<Mode>('login');

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={[colors.waterPale, colors.ivory]}
        locations={[0, 0.75]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.authArt}
      >
        <WatercolorMarks />
        <AppButton variant="iconPale" onPress={onAbout} accessibilityLabel="About Munting Hapag" style={styles.brandMark}>
          <Icon name="leaf" size={22} color={colors.sageDeep} />
        </AppButton>
        <View style={styles.authCopy}>
          <Text style={styles.eyebrow}>A shared pantry for your people</Text>
          <Text style={styles.displayTitle}>Munting{'\n'}Hapag</Text>
          <Text style={styles.smallCopy}>Trade a little. Gather often.</Text>
        </View>
      </LinearGradient>

      <View style={styles.authPanel}>
        <View style={styles.segmented}>
          <AppButton
            variant="text"
            style={[styles.segmentButton, mode === 'login' && styles.segmentButtonActive]}
            onPress={() => setMode('login')}
          >
            <Text style={[styles.segmentLabel, mode === 'login' && styles.segmentLabelActive]}>Log in</Text>
          </AppButton>
          <AppButton
            variant="text"
            style={[styles.segmentButton, mode === 'signup' && styles.segmentButtonActive]}
            onPress={() => setMode('signup')}
          >
            <Text style={[styles.segmentLabel, mode === 'signup' && styles.segmentLabelActive]}>Sign up</Text>
          </AppButton>
        </View>

        <View style={styles.formStack}>
          {mode === 'signup' && <Field label="Username" placeholder="What should villagers call you?" />}
          <Field
            label={mode === 'login' ? 'Username or phone' : 'Phone number'}
            placeholder={mode === 'login' ? 'maria_luisa' : '+63 917 123 4567'}
            keyboardType={mode === 'signup' ? 'phone-pad' : 'default'}
          />
          <Field label="Password" placeholder="••••••••••" secureTextEntry />
        </View>

        <AppButton variant="primary" wide onPress={onEnter}>
          <Text style={styles.primaryLabel}>
            {mode === 'login' ? 'Enter your village' : 'Plant your first village'}
          </Text>
          <Icon name="arrow" size={18} color={colors.brown} />
        </AppButton>
        <Text style={styles.gentleNote}>No scores, no strangers — just people you invite.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ivory },
  authArt: { minHeight: 352, position: 'relative', overflow: 'hidden' },
  brandMark: { position: 'absolute', top: 34, left: 34, zIndex: 3 },
  authCopy: { paddingTop: 94, paddingHorizontal: 35, paddingBottom: 30, zIndex: 2 },
  eyebrow: { color: colors.brownSoft, fontSize: 13, fontFamily: fonts.sans },
  displayTitle: {
    marginVertical: 8,
    fontFamily: fonts.serifLight,
    fontSize: 52,
    lineHeight: 48,
    color: colors.brown,
    letterSpacing: -1,
  },
  smallCopy: { color: colors.brownSoft, fontSize: 13, fontFamily: fonts.sans },
  authPanel: {
    flex: 1,
    marginTop: -24,
    paddingTop: 30,
    paddingHorizontal: 28,
    paddingBottom: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: 'rgba(255, 250, 240, 0.98)',
    zIndex: 4,
    // note: web used backdrop-filter: blur(10px) here too — RN has no
    // equivalent for a translucent-blur-over-content effect without
    // expo-blur's <BlurView>, and that requires the content behind it to
    // actually be visible through the view hierarchy. Safe to drop for now;
    // the near-opaque background color reads almost identically.
  },
  segmented: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 22,
    padding: 4,
    borderRadius: 18,
    backgroundColor: 'rgba(169, 192, 151, 0.16)',
  },
  segmentButton: { flex: 1, height: 42, borderRadius: 15, minHeight: 42 },
  segmentButtonActive: { backgroundColor: colors.paper },
  segmentLabel: { fontSize: 13, fontFamily: fonts.sansBold, color: colors.brownSoft },
  segmentLabelActive: { color: colors.brown },
  formStack: { gap: 14, marginBottom: 20 },
  primaryLabel: { fontFamily: fonts.sansBold, fontSize: 15, color: colors.brown },
  gentleNote: { marginTop: 16, textAlign: 'center', fontSize: 12, color: colors.brownSoft, fontFamily: fonts.sans },
});
