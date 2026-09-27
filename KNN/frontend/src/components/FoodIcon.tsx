// FoodIcon.tsx
// Web used CSS classes (food-cream, food-yolk, etc.) for fills — RN has no
// CSS cascade, so each fill color is passed as a prop straight to <Path fill>.
// Colors below are copied exactly from the .food-fill classes in index.css.
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export type FoodName =
  | 'eggs'
  | 'calamansi'
  | 'garlic'
  | 'coconut'
  | 'chili'
  | 'rice'
  | 'soup'
  | 'herbs';

const fill = {
  cream: 'rgba(255, 250, 240, 0.82)',
  yolk: 'rgba(233, 143, 110, 0.72)',
  green: 'rgba(169, 192, 151, 0.82)',
  water: 'rgba(191, 220, 224, 0.8)',
  coral: 'rgba(233, 143, 110, 0.74)',
  coralSoft: 'rgba(240, 199, 201, 0.7)',
};

// matches .food-icon { stroke: var(--brown); stroke-width: 1.45 }
const outline = {
  stroke: '#5c5347',
  strokeWidth: 1.45,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};
// matches .food-fill { stroke-width: 1.2 } — the filled shapes use a thinner outline
const filledOutline = { ...outline, strokeWidth: 1.2 };
// matches .food-detail { opacity: 0.45; stroke-width: 1 }
const detail = { ...outline, strokeWidth: 1, opacity: 0.45 };

export function FoodIcon({ name, size = 48 }: { name: FoodName; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 52 52">
      {name === 'eggs' && (
        <>
          <Path
            d="M14 37c-5-3-6-10-3-17 3-8 8-13 14-12 6 0 11 6 13 14 2 7 1 13-4 16-5 4-14 3-20-1Z"
            fill={fill.cream}
            {...filledOutline}
          />
          <Path
            d="M20 29c-1-4 1-9 5-10 5-1 9 2 9 7 0 4-3 8-8 8-3 0-5-2-6-5Z"
            fill={fill.yolk}
            {...filledOutline}
          />
        </>
      )}
      {name === 'calamansi' && (
        <>
          <Path
            d="M11 29c-2-8 4-16 12-17 9-2 17 3 18 11 2 9-4 17-13 19-8 1-15-5-17-13Z"
            fill={fill.green}
            {...filledOutline}
          />
          <Path
            d="M24 13c1-5 4-8 9-9M27 11c4-4 9-3 12 0-4 3-8 3-12 0Z"
            fill="none"
            {...outline}
          />
          <Path d="M17 25c3-3 8-5 13-5M18 30c4-2 9-3 14-2" fill="none" {...detail} />
        </>
      )}
      {name === 'garlic' && (
        <>
          <Path
            d="M8 29c0-8 6-13 13-13 1-5 3-9 5-12 2 4 3 8 3 12 8 0 14 5 15 12 1 8-6 14-18 15C15 43 8 38 8 29Z"
            fill={fill.cream}
            {...filledOutline}
          />
          <Path d="M26 16v25M20 18c-2 8-2 16 0 23M32 18c3 8 3 15 1 22" fill="none" {...outline} />
        </>
      )}
      {name === 'coconut' && (
        <>
          <Path
            d="M10 30c1-10 9-18 19-17 10 0 17 8 16 18-1 9-9 15-19 15-10-1-17-7-16-16Z"
            fill={fill.cream}
            {...filledOutline}
          />
          <Path
            d="M14 29c7 4 19 5 28 1-1 8-7 13-16 13-8-1-12-5-12-14Z"
            fill={fill.water}
            {...filledOutline}
          />
          <Path d="M14 29c7 4 19 5 28 1M21 21c1-2 3-3 5-3M32 20c2 1 3 2 3 4" fill="none" {...outline} />
          <Path d="M25 13c1-5 0-8-2-11M29 13c3-5 5-7 8-9" fill="none" {...outline} />
        </>
      )}
      {name === 'chili' && (
        <>
          <Path
            d="M9 18c8 1 15 3 20 8 5 4 9 10 14 14-8 1-16-2-22-7-6-4-10-9-12-15Z"
            fill={fill.coral}
            {...filledOutline}
          />
          <Path d="M10 19c-3-2-4-6-2-9M10 18c3-2 6-2 9-1" fill="none" {...outline} />
          <Path d="M18 24c5 2 10 6 14 10" fill="none" {...detail} />
        </>
      )}
      {name === 'rice' && (
        <>
          <Path
            d="M8 23c3-5 10-8 18-8s15 3 18 8l-4 18c-7 5-21 5-28 0L8 23Z"
            fill={fill.water}
            {...filledOutline}
          />
          <Path
            d="M9 24c3-7 10-12 18-12s15 5 17 12c-9 4-26 4-35 0Z"
            fill={fill.cream}
            {...filledOutline}
          />
          <Path d="M17 20l2-3M25 20v-4M33 20l-1-3" fill="none" {...outline} />
        </>
      )}
      {name === 'soup' && (
        <>
          <Path
            d="M7 22h38c-1 13-8 22-19 22S8 35 7 22Z"
            fill={fill.coralSoft}
            {...filledOutline}
          />
          <Path
            d="M5 21c9 4 33 4 42 0M18 15c-3-4 2-6 0-10M29 15c-3-4 2-6 0-10M38 17c-2-3 2-5 1-8"
            fill="none"
            {...outline}
          />
        </>
      )}
      {name === 'herbs' && (
        <>
          <Path d="M25 45c0-13 0-25 2-39M25 34c-6-8-11-12-17-15M27 26c5-7 10-11 16-13" fill="none" {...outline} />
          <Path
            d="M8 19c1-8 7-12 14-11 0 7-5 12-14 11ZM43 13c-1-7-6-10-12-9 0 6 4 10 12 9ZM24 33c-7 0-12 4-13 10 7 1 12-3 13-10ZM28 25c7 0 12 4 13 10-7 1-12-3-13-10Z"
            fill={fill.green}
            {...filledOutline}
          />
        </>
      )}
    </Svg>
  );
}
