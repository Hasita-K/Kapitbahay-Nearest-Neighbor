// Button.tsx
// The web version was one component that took an arbitrary `className` string
// ("primary wide", "icon-button ghost", etc.) and let CSS handle every visual
// variant. RN has no CSS classes, so this stays a thin Pressable wrapper —
// screens pass an array of StyleSheet objects via `style` to get the same
// composability (e.g. style={[styles.primary, styles.wide]}).
import React from 'react';
import { AccessibilityRole, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

type ButtonProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
};

export function Button({
  children,
  style,
  onPress,
  disabled,
  accessibilityLabel,
  accessibilityRole = 'button',
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.base,
        style,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {children}
    </Pressable>
  );
}

type AppButtonProps = ButtonProps & {
  variant?: 'primary' | 'text' | 'iconPale' | 'iconGhost';
  wide?: boolean;
};

// Compatibility wrapper for screens that still use the original variant API.
export function AppButton({ variant = 'text', wide = false, style, children, ...props }: AppButtonProps) {
  return (
    <Button
      {...props}
      style={[styles.variantBase, styles[variant], wide && styles.wide, style]}
    >
      {children}
    </Button>
  );
}

const styles = StyleSheet.create({
  base: {},
  // matches .button:active { transform: scale(0.97) }
  pressed: { transform: [{ scale: 0.97 }] },
  // matches .button:disabled { opacity: .45 }
  disabled: { opacity: 0.45 },
  variantBase: { alignItems: 'center', justifyContent: 'center' },
  primary: {
    minHeight: 52,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    backgroundColor: '#a9c097',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 7,
  },
  text: { padding: 8 },
  iconPale: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#dce6d4' },
  iconGhost: { width: 40, height: 40, borderRadius: 20 },
  wide: { width: '100%' },
});
