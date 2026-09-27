import { StyleSheet, Text, View } from "react-native";
import { Button, Field, Icon, WatercolorMarks } from "./sharedTheme";
import { colors, fonts } from "./theme";

export function LoginScreen({
  onEnter,
  onSwitchToSignup,
}: {
  onEnter: () => void;
  onSwitchToSignup: () => void;
}) {
  return (
    <View style={styles.screen}>
      <View style={styles.authArt}>
        <WatercolorMarks />
        <View style={styles.brandMark}>
          <Icon name="leaf" size={22} color={colors.sageDeep} />
        </View>
        <View style={styles.authCopy}>
          <Text style={styles.eyebrow}>A shared pantry for your people</Text>
          <Text style={styles.displayTitle}>Munting{"\n"}Hapag</Text>
          <Text style={styles.smallCopy}>Trade a little. Gather often.</Text>
        </View>
      </View>

      <View style={styles.authPanel}>
        <View style={styles.segmented}>
          <Button variant="segment" active>
            Log in
          </Button>
          <Button variant="segment" onPress={onSwitchToSignup}>
            Sign up
          </Button>
        </View>

        <View style={styles.formStack}>
          <Field label="Username or phone" placeholder="maria_luisa" />
          <Field label="Password" placeholder="••••••••••" secureTextEntry />
        </View>

        <Button variant="primary" wide onPress={onEnter}>
          <Text style={styles.primaryButtonText}>Enter your village</Text>
          <Icon name="arrow" size={18} color={colors.brown} />
        </Button>

        <Text style={styles.gentleNote}>No scores, no strangers — just people you invite.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  authArt: {
    minHeight: 260,
    backgroundColor: colors.waterPale,
  },
  brandMark: {
    position: "absolute",
    top: 34,
    left: 34,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 250, 240, 0.72)",
  },
  authCopy: {
    paddingTop: 94,
    paddingHorizontal: 35,
    paddingBottom: 30,
  },
  eyebrow: {
    color: colors.brownSoft,
    fontSize: 13,
  },
  displayTitle: {
    marginVertical: 8,
    fontFamily: fonts.serif,
    fontWeight: "300",
    fontSize: 44,
    lineHeight: 44,
    color: colors.brown,
  },
  smallCopy: {
    color: colors.brownSoft,
    fontSize: 13,
  },
  authPanel: {
    flex: 1,
    marginTop: -24,
    paddingTop: 30,
    paddingHorizontal: 28,
    paddingBottom: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: "rgba(255, 250, 240, 0.92)",
  },
  segmented: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 22,
    padding: 4,
    borderRadius: 18,
    backgroundColor: "rgba(169, 192, 151, 0.16)",
  },
  formStack: {
    gap: 14,
    marginBottom: 20,
  },
  primaryButtonText: {
    fontWeight: "700",
    color: colors.brown,
  },
  gentleNote: {
    marginTop: 16,
    color: colors.brownSoft,
    textAlign: "center",
    fontSize: 12,
  },
});