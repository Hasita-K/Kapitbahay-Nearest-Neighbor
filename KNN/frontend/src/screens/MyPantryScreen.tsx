// MyPantryScreen.tsx
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { FoodIcon } from '../components/FoodIcon';
import { Icon } from '../components/Icon';
import { BottomNav } from '../navigation/BottomNav';
import { colors, fonts, radii, shadows, tileTones } from '../theme/theme';
import type { FoodName, Screen } from '../types';

const pantryItems: { icon: FoodName; name: string; count: number; tone: keyof typeof tileTones }[] = [
  { icon: 'eggs', name: 'Eggs', count: 6, tone: 'sage' },
  { icon: 'calamansi', name: 'Calamansi', count: 8, tone: 'blue' },
  { icon: 'garlic', name: 'Garlic', count: 3, tone: 'blush' },
  { icon: 'coconut', name: 'Coconut milk', count: 2, tone: 'blue' },
  { icon: 'chili', name: 'Siling labuyo', count: 5, tone: 'coral' },
  { icon: 'rice', name: 'Rice', count: 1, tone: 'sage' },
];

function AddItemSheet({ onClose }: { onClose: () => void }) {
  const [activeCategory, setActiveCategory] = useState(0);
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalSheet, shadows.card]}>
          <Button style={styles.closeButton} onPress={onClose} accessibilityLabel="Close">
            <Icon name="close" />
          </Button>
          <Text style={styles.eyebrow}>A little extra?</Text>
          <Text style={styles.sheetTitle}>Add to your pantry</Text>
          <View style={styles.categoryRow}>
            {['Produce', 'Pantry', 'Dairy', 'Other'].map((name, i) => (
              <Button
                key={name}
                style={[styles.categoryChip, activeCategory === i && styles.categoryChipActive]}
                onPress={() => setActiveCategory(i)}
              >
                <Text style={[styles.categoryLabel, activeCategory === i && styles.categoryLabelActive]}>{name}</Text>
              </Button>
            ))}
          </View>
          <View style={{ marginTop: 25, marginBottom: 18 }}>
            <Field label="Ingredient" placeholder="What do you have?" />
          </View>
          <Button style={[styles.primary, styles.wide, shadows.primaryButton]} onPress={onClose}>
            <Text style={styles.primaryLabel}>Add ingredient</Text>
            <Icon name="plus" />
          </Button>
        </View>
      </View>
    </Modal>
  );
}

export function MyPantryScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [counts, setCounts] = useState(pantryItems.map((item) => item.count));
  const [showAdd, setShowAdd] = useState(false);

  const adjust = (amount: number) => {
    if (selected === null) return;
    setCounts((current) => current.map((count, index) => (index === selected ? Math.max(0, count + amount) : count)));
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Button style={styles.iconButton} onPress={() => onNavigate('home')} accessibilityLabel="Go back">
            <Icon name="arrow" />
          </Button>
          <View style={styles.headerTitle}>
            <Text style={styles.eyebrow}>6 ingredients to share</Text>
            <Text style={styles.title}>My personal pantry</Text>
          </View>
          <Button style={styles.iconButtonPale} onPress={() => setShowAdd(true)} accessibilityLabel="Add an item">
            <Icon name="plus" />
          </Button>
        </View>

        <View style={styles.intro}>
          <Text style={styles.introIllustration}>◌</Text>
          <Text style={styles.introText}>Keep counts loose and friendly. A close guess is perfectly fine.</Text>
        </View>

        <View style={styles.itemGrid}>
          {pantryItems.map((item, index) => (
            <Button
              key={item.name}
              style={[
                styles.itemTile,
                { backgroundColor: tileTones[item.tone] },
                selected === index && styles.itemTileSelected,
              ]}
              onPress={() => setSelected(index)}
            >
              <FoodIcon name={item.icon} size={40} />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCount}>
                {counts[index]} {item.name === 'Rice' ? 'cup' : 'left'}
              </Text>
            </Button>
          ))}
        </View>
      </ScrollView>

      {selected !== null && (
        <View style={[styles.itemEditor, shadows.card]}>
          <View>
            <Text style={styles.eyebrow}>Update amount</Text>
            <Text style={styles.editorItemName}>{pantryItems[selected].name}</Text>
          </View>
          <View style={styles.stepper}>
            <Button style={styles.iconButton} onPress={() => adjust(-1)} accessibilityLabel="Decrease count">
              <Icon name="minus" />
            </Button>
            <Text style={styles.stepperValue}>{counts[selected]}</Text>
            <Button style={styles.iconButtonFilled} onPress={() => adjust(1)} accessibilityLabel="Increase count">
              <Icon name="plus" color={colors.paper} />
            </Button>
          </View>
        </View>
      )}

      <BottomNav current="home" onNavigate={onNavigate} />
      {showAdd && <AddItemSheet onClose={() => setShowAdd(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ivory },
  scrollContent: { paddingBottom: 140 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 8,
  },
  headerTitle: { flex: 1, alignItems: 'center' },
  eyebrow: {
    color: colors.brownSoft,
    fontSize: 11,
    fontFamily: fonts.sansBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: { fontFamily: fonts.serif, fontSize: 26, color: colors.brown, marginTop: 2 },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: 'rgba(255, 250, 240, 0.72)',
    borderWidth: 1,
    borderColor: colors.line,
  },
  iconButtonPale: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: colors.sagePale,
  },
  iconButtonFilled: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: colors.sageDeep,
  },
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 22,
    marginBottom: 22,
    padding: 14,
    borderRadius: 25,
    backgroundColor: 'rgba(191,220,224,0.27)',
  },
  introIllustration: { fontSize: 34, color: colors.sageDeep, width: 46, textAlign: 'center' },
  introText: { flex: 1, color: colors.brownSoft, fontFamily: fonts.sans, fontSize: 12, lineHeight: 17 },
  itemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 18,
    gap: 8,
  },
  itemTile: {
    width: '31%',
    minHeight: 138,
    padding: 12,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'flex-end',
    gap: 4,
  },
  itemTileSelected: { borderColor: 'rgba(120,144,106,0.55)' },
  itemName: { fontFamily: fonts.serif, fontSize: 14, color: colors.brown },
  itemCount: { fontFamily: fonts.sansBold, fontSize: 9, color: colors.brownSoft },
  itemEditor: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 96,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 17,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,250,240,0.96)',
  },
  editorItemName: { fontFamily: fonts.serif, fontSize: 19, color: colors.brown, marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepperValue: { minWidth: 20, textAlign: 'center', fontFamily: fonts.serif, fontSize: 20, color: colors.brown },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(72,77,66,0.27)' },
  modalSheet: {
    minHeight: 420,
    padding: 28,
    paddingTop: 42,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    backgroundColor: colors.paper,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 22,
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: 'rgba(255,250,240,0.72)',
  },
  sheetTitle: { fontFamily: fonts.serif, fontSize: 30, color: colors.brown, marginTop: 6 },
  categoryRow: { flexDirection: 'row', gap: 6, marginTop: 22 },
  categoryChip: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: colors.ivory,
  },
  categoryChipActive: { backgroundColor: colors.sagePale },
  categoryLabel: { fontFamily: fonts.sans, fontSize: 10, color: colors.brownSoft },
  categoryLabelActive: { color: colors.brown },
  primary: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.sage,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
    borderBottomLeftRadius: 8,
  },
  wide: { width: '100%' },
  primaryLabel: { fontFamily: fonts.sansBold, fontSize: 15, color: colors.brown },
});