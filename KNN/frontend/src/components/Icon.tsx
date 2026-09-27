// Icon.tsx
// Direct port of your Icon component. The <path> "d" data is untouched —
// geometry doesn't change between web SVG and react-native-svg, only the
// wrapper components and how stroke styling is applied.
import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '../theme/theme';

export type IconName =
  | 'home'
  | 'pantry'
  | 'user'
  | 'users'
  | 'plus'
  | 'arrow'
  | 'bell'
  | 'chevron'
  | 'close'
  | 'camera'
  | 'leaf'
  | 'check'
  | 'minus'
  | 'map'
  | 'swap';

type Props = {
  name: IconName;
  size?: number;
  color?: string; // web used stroke: currentColor — RN needs it passed explicitly
};

export function Icon({ name, size = 20, color = colors.brown }: Props) {
  // matches .icon { stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; fill: none }
  const s = {
    stroke: color,
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'home' && (
        <>
          <Path d="M3.5 10.5 12 3l8.5 7.5" {...s} />
          <Path d="M5.5 9.5v10h13v-10M9.5 19.5v-6h5v6" {...s} />
        </>
      )}
      {name === 'pantry' && (
        <>
          <Path d="M4.5 7.5h15v13h-15zM3.5 7.5h17M7 7.5V4h10v3.5M12 8v12.5" {...s} />
          <Path d="M9.5 13h-2M16.5 13h-2" {...s} />
        </>
      )}
      {name === 'user' && (
        <>
          <Circle cx={12} cy={8} r={4} {...s} />
          <Path d="M4.5 21c.6-4.3 3.1-6.5 7.5-6.5s6.9 2.2 7.5 6.5" {...s} />
        </>
      )}
      {name === 'users' && (
        <>
          <Circle cx={9} cy={8} r={3.2} {...s} />
          <Circle cx={17.5} cy={9} r={2.4} {...s} />
          <Path d="M3.5 20c.4-3.8 2.3-5.8 5.5-5.8s5.1 2 5.5 5.8M15 15c3.3-.5 5.2 1.1 5.5 4" {...s} />
        </>
      )}
      {name === 'plus' && <Path d="M12 5v14M5 12h14" {...s} />}
      {name === 'arrow' && <Path d="m9 5 7 7-7 7" {...s} />}
      {name === 'bell' && (
        <>
          <Path d="M6 17h12l-1.5-2.5V10a4.5 4.5 0 0 0-9 0v4.5L6 17Z" {...s} />
          <Path d="M10 20h4" {...s} />
        </>
      )}
      {name === 'chevron' && <Path d="m8.5 5 7 7-7 7" {...s} />}
      {name === 'close' && <Path d="m6 6 12 12M18 6 6 18" {...s} />}
      {name === 'camera' && (
        <>
          <Path d="M4 8.5h3l1.5-2h7l1.5 2h3v10H4z" {...s} />
          <Circle cx={12} cy={13.5} r={3} {...s} />
        </>
      )}
      {name === 'leaf' && (
        <>
          <Path d="M19 4C11 4 5 8 5 15c4.5 1.4 10.7-1.2 14-11Z" {...s} />
          <Path d="M5 20c1.4-5.1 4.7-8.5 10-11" {...s} />
        </>
      )}
      {name === 'check' && <Path d="m5 12 4.5 4.5L19 7" {...s} />}
      {name === 'minus' && <Path d="M5 12h14" {...s} />}
      {name === 'map' && (
        <Path d="m3.5 5 5-2 7 2 5-2v16l-5 2-7-2-5 2zM8.5 3v16M15.5 5v16" {...s} />
      )}
      {name === 'swap' && (
        <Path d="M4 8h14M15 5l3 3-3 3M20 16H6M9 13l-3 3 3 3" {...s} />
      )}
    </Svg>
  );
}
