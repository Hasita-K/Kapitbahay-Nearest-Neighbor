import { type ReactNode } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { colors, fonts } from "./theme";

// ---------- Icon ----------
// react-native-svg's <Svg>/<Path>/<Circle> stand in for raw <svg>/<path>/<circle>.
export type IconName =
  | "home"
  | "pantry"
  | "user"
  | "users"
  | "plus"
  | "arrow"
  | "bell"
  | "chevron"
  | "close"
  | "camera"
  | "leaf"
  | "check"
  | "minus"
  | "map"
  | "swap";

function IconShape({ name }: { name: IconName }) {
  switch (name) {
    case "home":
      return (
        <>
          <Path d="M3.5 10.5 12 3l8.5 7.5" />
          <Path d="M5.5 9.5v10h13v-10M9.5 19.5v-6h5v6" />
        </>
      );
    case "pantry":
      return (
        <>
          <Path d="M4.5 7.5h15v13h-15zM3.5 7.5h17M7 7.5V4h10v3.5M12 8v12.5" />
          <Path d="M9.5 13h-2M16.5 13h-2" />
        </>
      );
    case "user":
      return (
        <>
          <Circle cx={12} cy={8} r={4} />
          <Path d="M4.5 21c.6-4.3 3.1-6.5 7.5-6.5s6.9 2.2 7.5 6.5" />
        </>
      );
    case "users":
      return (
        <>
          <Circle cx={9} cy={8} r={3.2} />
          <Circle cx={17.5} cy={9} r={2.4} />
          <Path d="M3.5 20c.4-3.8 2.3-5.8 5.5-5.8s5.1 2 5.5 5.8M15 15c3.3-.5 5.2 1.1 5.5 4" />
        </>
      );
    case "plus":
      return <Path d="M12 5v14M5 12h14" />;
    case "arrow":
      return <Path d="m9 5 7 7-7 7" />;
    case "bell":
      return (
        <>
          <Path d="M6 17h12l-1.5-2.5V10a4.5 4.5 0 0 0-9 0v4.5L6 17Z" />
          <Path d="M10 20h4" />
        </>
      );
    case "chevron":
      return <Path d="m8.5 5 7 7-7 7" />;
    case "close":
      return <Path d="m6 6 12 12M18 6 6 18" />;
    case "camera":
      return (
        <>
          <Path d="M4 8.5h3l1.5-2h7l1.5 2h3v10H4z" />
          <Circle cx={12} cy={13.5} r={3} />
        </>
      );
    case "leaf":
      return (
        <>
          <Path d="M19 4C11 4 5 8 5 15c4.5 1.4 10.7-1.2 14-11Z" />
          <Path d="M5 20c1.4-5.1 4.7-8.5 10-11" />
        </>
      );
    case "check":
      return <Path d="m5 12 4.5 4.5L19 7" />;
    case "minus":
      return <Path d="M5 12h14" />;
    case "map":
      return (
        <>
          <Path d="m3.5 5 5-2 7 2 5-2v16l-5 2-7-2-5 2zM8.5 3v16M15.5 5v16" />
        </>
      );
    case "swap":
      return (
        <>
          <Path d="M4 8h14M15 5l3 3-3 3M20 16H6M9 13l-3 3 3 3" />
        </>
      );
  }
}

export function Icon({
  name,
  size = 20,
  color = colors.brown,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <IconShape name={name} />
    </Svg>
  );
}
// Note: the shared stroke styling (stroke width 1.7, round caps/joins, currentColor)
// that the CSS .icon class applied globally has to be set per-Path here instead.
// Simplest fix: pass stroke/strokeWidth/strokeLinecap/strokeLinejoin as props on
// every <Path>/<Circle> above, or wrap IconShape's output and clone each child
// with those props. Left as plain shapes for now to keep this readable — add
// stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"
// to each Path/Circle before shipping this for real.

// ---------- Button ----------
type ButtonVariant = "plain" | "segment" | "primary" | "secondary" | "icon";

export function Button({
  children,
  variant = "plain",
  active = false,
  wide = false,
  onPress,
  disabled,
  style,
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  active?: boolean;
  wide?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const variantStyle =
    variant === "primary"
      ? styles.primary
      : variant === "secondary"
      ? styles.secondary
      : variant === "segment"
      ? [styles.segmentButton, active && styles.segmentButtonActive]
      : variant === "icon"
      ? styles.iconButton
      : null;

  const textColor =
    variant === "segment" && !active ? colors.brownSoft : colors.brown;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.buttonBase,
        variantStyle,
        wide && styles.wide,
        disabled && styles.disabled,
        style,
      ]}
    >
      {typeof children === "string" ? (
        <Text style={[styles.buttonText, { color: textColor }]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

// ---------- Field ----------
export function Field({
  label,
  placeholder,
  secureTextEntry,
  keyboardType,
}: {
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="rgba(92, 83, 71, 0.42)"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={styles.fieldInput}
      />
    </View>
  );
}

// ---------- WatercolorMarks ----------
// The original used blurred SVG/CSS radial gradients (wash-blue, wash-sage,
// lily pads, koi, flowers) that don't have a direct RN equivalent without an
// extra blur library (e.g. expo-blur only blurs *content behind* a view, not
// gradients like this). This is a simplified stand-in using soft, overlapping
// semi-transparent circles positioned absolutely — same idea, less detail.
export function WatercolorMarks({ compact = false }: { compact?: boolean }) {
  return (
    <View pointerEvents="none" style={[styles.marks, compact && { opacity: 0.65 }]}>
      <View style={[styles.washBlue]} />
      <View style={[styles.washSage]} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 14,
  },
  wide: {
    width: "100%",
  },
  disabled: {
    opacity: 0.45,
  },
  primary: {
    minHeight: 54,
    paddingHorizontal: 20,
    backgroundColor: colors.sage,
    borderRadius: 22,
    flexDirection: "row",
    gap: 10,
  },
  secondary: {
    minHeight: 54,
    paddingHorizontal: 20,
    backgroundColor: colors.waterPale,
    borderRadius: 22,
    flexDirection: "row",
    gap: 10,
  },
  segmentButton: {
    height: 42,
    borderRadius: 15,
    flex: 1,
  },
  segmentButtonActive: {
    backgroundColor: colors.paper,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255, 250, 240, 0.72)",
    borderWidth: 1,
    borderColor: colors.line,
  },
  field: {
    gap: 7,
  },
  fieldLabel: {
    color: colors.brownSoft,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    paddingLeft: 4,
  },
  fieldInput: {
    height: 52,
    paddingHorizontal: 17,
    color: colors.brown,
    borderWidth: 1,
    borderColor: "rgba(92, 83, 71, 0.1)",
    borderRadius: 18,
    backgroundColor: "rgba(244, 239, 225, 0.54)",
  },
  marks: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  washBlue: {
    position: "absolute",
    width: 260,
    height: 190,
    right: -55,
    top: 20,
    borderRadius: 999,
    backgroundColor: "rgba(191, 220, 224, 0.4)",
    transform: [{ rotate: "-12deg" }],
  },
  washSage: {
    position: "absolute",
    width: 210,
    height: 130,
    left: -32,
    bottom: -22,
    borderRadius: 999,
    backgroundColor: "rgba(169, 192, 151, 0.42)",
    transform: [{ rotate: "9deg" }],
  },
});