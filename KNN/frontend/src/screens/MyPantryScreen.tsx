// MyPantryScreen.tsx
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { FoodIcon } from '../components/FoodIcon';
import { Icon } from '../components/Icon';
import { BottomNav } from '../navigation/BottomNav';
import { colors, fonts, radii, shadows, tileTones } from '../theme/theme';
import type { Screen } from '../types';
import { apiErrorMessage } from '../services/api';
import { createFridgeItem, deleteFridgeItem, getFridgeItems, updateFridgeItem, type FridgeItem } from '../services/data';
import type { FoodName } from '../types';

function AddItemSheet({ onClose, onAdd, busy }: { onClose: () => void; onAdd: (name: string, count: number) => Promise<void>; busy: boolean }) {
  const [name, setName] = useState('');
  const [count, setCount] = useState('1');
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalSheet, shadows.card]}>
          <Button style={styles.closeButton} onPress={onClose} accessibilityLabel="Close">
            <Icon name="close" />
          </Button>
          <Text style={styles.eyebrow}>A little extra?</Text>
          <Text style={styles.sheetTitle}>Add to your pantry</Text>
          <View style={{ marginTop: 25, marginBottom: 18 }}>
            <Field label="Ingredient" placeholder="What do you have?" value={name} onChangeText={setName} />
            <View style={{ height: 12 }} />
            <Field label="Amount" placeholder="1" keyboardType="numeric" value={count} onChangeText={setCount} />
          </View>
          <Button style={[styles.primary, styles.wide, shadows.primaryButton]} disabled={busy || !name.trim()} onPress={() => onAdd(name.trim(), Math.max(0, Number(count) || 0))}>
            <Text style={styles.primaryLabel}>Add ingredient</Text>
            <Icon name="plus" />
          </Button>
        </View>
      </View>
    </Modal>
  );
}

export function MyPantryScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [selected, setSelected] = useState<FridgeItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadItems = async () => {
    try { setError(''); setItems(await getFridgeItems()); }
    catch (e) { setError(apiErrorMessage(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { void loadItems(); }, []);

  const adjust = async (amount: number) => {
    if (!selected) return;
    const count = Math.max(0, selected.count + amount);
    setBusy(true);
    setSelected({ ...selected, count });
    setItems((current) => current.map((item) => item.fridge_items_id === selected.fridge_items_id ? { ...item, count } : item));
    try { await updateFridgeItem(selected.fridge_items_id, { count }); }
    catch (e) { setError(apiErrorMessage(e)); void loadItems(); }
    finally { setBusy(false); }
  };

  const addItem = async (name: string, count: number) => {
    setBusy(true);
    try {
      const item = await createFridgeItem({ name, count });
      setItems((current) => [...current, item]);
      setShowAdd(false);
    } catch (e) { setError(apiErrorMessage(e)); }
    finally { setBusy(false); }
  };

  const removeItem = async () => {
    if (!selected) return;
    try {
      await deleteFridgeItem(selected.fridge_items_id);
      setItems((current) => current.filter((item) => item.fridge_items_id !== selected.fridge_items_id));
      setSelected(null);
    } catch (e) { setError(apiErrorMessage(e)); }
  };

  const foodIcon = (icon: string | null): FoodName => {
    const names: FoodName[] = ['eggs', 'calamansi', 'garlic', 'coconut', 'chili', 'rice', 'soup', 'herbs'];
    return names.includes(icon as FoodName) ? icon as FoodName : 'rice';
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Button style={styles.iconButton} onPress={() => onNavigate('home')} accessibilityLabel="Go back">
            <Icon name="arrow" />
          </Button>
          <View style={styles.headerTitle}>
            <Text style={styles.eyebrow}>{items.length} ingredients to share</Text>
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

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loading ? <Text style={styles.empty}>Loading your pantry…</Text> : null}
        {!loading && !items.length && !error ? <Text style={styles.empty}>Your pantry is empty. Add an ingredient to get started.</Text> : null}
        <View style={styles.itemGrid}>
          {items.map((item, index) => (
            <Button
              key={item.fridge_items_id}
              style={[
                styles.itemTile,
                { backgroundColor: Object.values(tileTones)[index % Object.values(tileTones).length] },
                selected?.fridge_items_id === item.fridge_items_id && styles.itemTileSelected,
              ]}
              onPress={() => setSelected(item)}
            >
              <FoodIcon name={foodIcon(item.icon)} size={40} />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCount}>{item.count} left</Text>
            </Button>
          ))}
        </View>
      </ScrollView>

      {selected && (
        <View style={[styles.itemEditor, shadows.card]}>
          <View>
            <Text style={styles.eyebrow}>Update amount</Text>
            <Text style={styles.editorItemName}>{selected.name}</Text>
          </View>
          <View style={styles.stepper}>
            <Button style={styles.iconButton} disabled={busy || selected.count <= 0} onPress={() => void adjust(-1)} accessibilityLabel="Decrease count">
              <Icon name="minus" />
            </Button>
            <Text style={styles.stepperValue}>{selected.count}</Text>
            <Button style={styles.iconButtonFilled} disabled={busy} onPress={() => void adjust(1)} accessibilityLabel="Increase count">
              <Icon name="plus" color={colors.paper} />
            </Button>
          </View>
          <Button onPress={() => void removeItem()} accessibilityLabel="Remove ingredient"><Icon name="close" color={colors.coral} /></Button>
        </View>
      )}

      <BottomNav current="my-pantry" onNavigate={onNavigate} />
      {showAdd && <AddItemSheet onClose={() => setShowAdd(false)} onAdd={addItem} busy={busy} />}
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
  empty: { marginHorizontal: 25, marginVertical: 20, color: colors.brownSoft, fontFamily: fonts.sans, textAlign: 'center' },
  error: { marginHorizontal: 22, marginVertical: 10, color: colors.coral, fontFamily: fonts.sans, textAlign: 'center' },
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
