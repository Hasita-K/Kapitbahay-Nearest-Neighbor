// villagers.ts
// Each villager's own pantry contents — this is what differs per house when
// you tap into FriendPantryScreen. `position` matches the field name
// HomeScreen.tsx already passes straight to <Hut position={...} />.
import type { FoodName } from '../types';
import type { PantryTone } from './pantryItems';

export type VillagerPantryItem = {
  icon: FoodName;
  name: string;
  count: number;
  tone: PantryTone;
};

export type HutPosition = {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  scale?: number;
};

export type Villager = {
  id: string;
  name: string;
  note: string;
  position: HutPosition;
  pantry: VillagerPantryItem[];
};

export const villagers: Villager[] = [
  {
    id: 'mika',
    name: 'Mika',
    note: 'Herbs & eggs',
    position: { top: 220, right: 40 },
    pantry: [
      { icon: 'eggs', name: 'Eggs', count: 4, tone: 'sage' },
      { icon: 'herbs', name: 'Herbs', count: 6, tone: 'blue' },
      { icon: 'calamansi', name: 'Calamansi', count: 3, tone: 'blush' },
      { icon: 'garlic', name: 'Garlic', count: 2, tone: 'coral' },
    ],
  },
  {
    id: 'jo',
    name: 'Jo',
    note: 'Rice & pantry',
    position: { top: 390, left: 30, scale: 0.9 },
    pantry: [
      { icon: 'rice', name: 'Rice', count: 5, tone: 'sage' },
      { icon: 'coconut', name: 'Coconut milk', count: 3, tone: 'blue' },
      { icon: 'garlic', name: 'Garlic', count: 4, tone: 'blush' },
      { icon: 'chili', name: 'Siling labuyo', count: 2, tone: 'coral' },
    ],
  },
  {
    id: 'tala',
    name: 'Tala',
    note: 'Fruit & greens',
    position: { right: 36, bottom: 118, scale: 0.82 },
    pantry: [
      { icon: 'calamansi', name: 'Calamansi', count: 7, tone: 'sage' },
      { icon: 'herbs', name: 'Herbs', count: 4, tone: 'blue' },
      { icon: 'coconut', name: 'Coconut milk', count: 2, tone: 'blush' },
      { icon: 'soup', name: 'Sinigang mix', count: 3, tone: 'coral' },
    ],
  },
];