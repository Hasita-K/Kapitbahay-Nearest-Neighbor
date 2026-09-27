// Colors translated from the original CSS custom properties (:root variables).
// React Native has no CSS variables, so these are plain JS constants instead.
export const colors = {
  ivory: "#f4efe1",
  paper: "#fffaf0",
  sage: "#a9c097",
  sageDeep: "#78906a",
  sagePale: "#dce6d4",
  water: "#bfdce0",
  waterPale: "#e0eef0",
  blush: "#f0c7c9",
  blushPale: "#f8e5e2",
  coral: "#e98f6e",
  brown: "#5c5347",
  brownSoft: "#85796c",
  line: "rgba(92, 83, 71, 0.13)",
};

// The original used the Fraunces/Nunito web fonts via @import. To match this
// on native you'd load them with expo-font (e.g. @expo-google-fonts/fraunces
// and @expo-google-fonts/nunito) and reference the loaded family name here.
// Until those are wired up, this falls back to each platform's built-in serif
// and default system font.
export const fonts = {
  serif: "serif",
  sans: undefined, // undefined = RN's default system font
};