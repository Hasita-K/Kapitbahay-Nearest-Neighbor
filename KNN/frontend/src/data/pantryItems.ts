// pantryItems.ts
// Shared pantry data — used by MyPantryScreen (your own pantry) and
// FriendPantryScreen (a villager's pantry, for composing a trade).
import type { FoodName } from '../types';

export type PantryTone = 'sage' | 'blue' | 'blush' | 'coral';

export type PantryItem = {
  icon: FoodName;
  name: string;
  count: number;
  tone: PantryTone;
};

export const pantryItems: PantryItem[] = [
  { icon: 'eggs', name: 'Eggs', count: 6, tone: 'sage' },
  { icon: 'calamansi', name: 'Calamansi', count: 8, tone: 'blue' },
  { icon: 'garlic', name: 'Garlic', count: 3, tone: 'blush' },
  { icon: 'coconut', name: 'Coconut milk', count: 2, tone: 'blue' },
  { icon: 'chili', name: 'Siling labuyo', count: 5, tone: 'coral' },
  { icon: 'rice', name: 'Rice', count: 1, tone: 'sage' },
];