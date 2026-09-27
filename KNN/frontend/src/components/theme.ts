// theme.ts
// Pulled 1:1 from your Figma Make :root variables in index.css.
// Every screen/component should import from here instead of hardcoding hex values.

export const colors = {
  ivory: '#f4efe1',
  paper: '#fffaf0',
  sage: '#a9c097',
  sageDeep: '#78906a',
  sagePale: '#dce6d4',
  water: '#bfdce0',
  waterPale: '#e0eef0',
  blush: '#f0c7c9',
  blushPale: '#f8e5e2',
  coral: '#e98f6e',
  brown: '#5c5347',
  brownSoft: '#85796c',
  whiteWash: 'rgba(255, 252, 244, 0.82)',
  line: 'rgba(92, 83, 71, 0.13)',
};

// Web used box-shadow; RN needs shadow* props (iOS) + elevation (Android).
export const shadows = {
  // matches --shadow: 0 16px 38px rgba(87, 105, 79, 0.12)
  card: {
    shadowColor: '#57694f',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 38,
    elevation: 6,
  },
  // matches --shadow-soft: 0 8px 24px rgba(87, 105, 79, 0.09)
  soft: {
    shadowColor: '#57694f',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 24,
    elevation: 3,
  },
  // matches .primary's box-shadow: 0 10px 24px rgba(120, 144, 106, 0.2)
  primaryButton: {
    shadowColor: '#78906a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 4,
  },
};

// index.css pulls these from Google Fonts via @import. In Expo, load them with
// @expo-google-fonts/fraunces and @expo-google-fonts/nunito (see README).
export const fonts = {
  serif: 'Fraunces_400Regular',
  serifLight: 'Fraunces_300Light',
  serifMedium: 'Fraunces_500Medium',
  sans: 'Nunito_400Regular',
  sansMedium: 'Nunito_600SemiBold',
  sansBold: 'Nunito_700Bold',
};

// Reusable radii — the web version uses an asymmetric "22px 22px 22px 8px"
// on primary/secondary buttons (that little squared-off corner is a signature
// detail of this style, worth keeping).
export const radii = {
  sm: 12,
  md: 22,
  full: 999,
};