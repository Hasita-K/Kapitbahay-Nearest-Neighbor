// Button.tsx
// The web version used one <button> with CSS modifier classes
// (primary, secondary, wide, icon-button, ghost, text-button). RN has no
// cascading classes, so each variant becomes an explicit prop that picks a
// style object instead.
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, fonts, radii, shadows } from '../theme/theme';

type Variant = 'primary' | 'secondary' | 'text' | 'icon' | 'iconPale' | 'iconGhost';

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  wide?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function AppButton({
  children,
  variant = 'primary',
  wide = false,
  onPress,
  disabled,
  style,
  accessibilityLabel,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        wide && styles.wide,
        pressed && { opacity: 0.85 },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.label, variant === 'text' && styles.textLabel]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    // matches the web's asymmetric "22px 22px 22px 8px" corner treatment —
    // RN's borderRadius shorthand doesn't support 4 independent corners on
    // Android reliably, so set each corner explicitly.
    borderTopLeftRadius: radii.md,
    borderTopRightRadius: radii.md,
    borderBottomRightRadius: radii.md,
    borderBottomLeftRadius: 8,
  },
  wide: { alignSelf: 'stretch' },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
    letterSpacing: 0.3,
    color: colors.brown,
  },
  textLabel: { color: colors.brownSoft, fontFamily: fonts.sansMedium },
});

const variantStyles: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: colors.sage, ...shadows.primaryButton },
  secondary: {
    backgroundColor: colors.waterPale,
    borderWidth: 1,
    borderColor: 'rgba(120, 144, 106, 0.12)',
  },
  text: { minHeight: 44, backgroundColor: 'transparent' },
  icon: {
    width: 42,
    height: 42,
    minHeight: 42,
    paddingHorizontal: 0,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255, 250, 240, 0.72)',
    borderWidth: 1,
    borderColor: colors.line,
  },
  iconPale: {
    width: 42,
    height: 42,
    minHeight: 42,
    paddingHorizontal: 0,
    borderRadius: radii.full,
    backgroundColor: colors.sagePale,
  },
  iconGhost: {
    width: 42,
    height: 42,
    minHeight: 42,
    paddingHorizontal: 0,
    borderRadius: radii.full,
    backgroundColor: 'transparent',
  },
};
