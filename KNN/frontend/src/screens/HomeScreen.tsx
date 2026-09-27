// HomeScreen.tsx — converted from the HomeScreen function and
// .map-screen/.map-topbar/.pond-map/.map-note/.floating-actions CSS.
//
// One structural change from the web version: there, "showAdd" and "go" were
// passed down from the top-level App component that owned all screen state.
// Here, HomeScreen is a tab screen inside VillageTabs (see BottomNav.tsx), so
// it gets `navigation` for free from React Navigation, and owns the "show the
// add-villager modal" state locally instead of receiving it as a prop.
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '../components/Icon';
import { Hut } from '../components/Hut';
import { WatercolorMarks } from '../components/WatercolorMarks';
import { AddVillagerModal } from '../components/AddVillagerModal';
import { BottomNav } from '../navigation/BottomNav';
import { colors, fonts, shadows } from '../theme/theme';

// matches the `villagers` array + .hut-mika/.hut-jo/.hut-tala position rules
const villagers = [
  { name: 'Hasita', note: 'Herbs & eggs', position: { top: 220, right: 40 } },
  { name: 'Reese', note: 'Rice & pantry', position: { top: 390, left: 30, scale: 0.9 } },
  { name: 'Shanelle', note: 'Fruit & greens', position: { right: 36, bottom: 118, scale: 0.82 } },
];

export function HomeScreen({ navigation }: any) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <View style={styles.screen}>
      {/* matches .map-screen's linear-gradient background */}
      <LinearGradient
        colors={['#e5eeee', colors.waterPale, colors.ivory]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.topbar}>
        <View>
          <Text style={styles.eyebrow}>Good morning, John</Text>
          <Text style={styles.title}>UCF Friends Circle</Text>
        </View>
      </View>

      <View style={styles.pondMap}>
        <WatercolorMarks />

        <View style={styles.mapNote}>
          <Text style={styles.mapNoteLabel}>Today in the village</Text>
          <Text style={styles.mapNoteValue}>3 pantries are open</Text>
        </View>

        {villagers.map((v) => (
          <Hut
            key={v.name}
            name={v.name}
            note={v.note}
            position={v.position}
            // FriendPantryScreen isn't registered as a route yet — once you
            // convert it, add it to the root Stack.Navigator in App.tsx
            // (e.g. options={{ presentation: 'card' }}) and this will work.
            onPress={() => navigation.navigate('FriendPantry', { villager: v.name })}
          />
        ))}

        {/* matches .koi-pair's two small decorative fish */}
        <View style={[styles.koi, { left: 185, top: 390, transform: [{ rotate: '45deg' }] }]} />
        <View style={[styles.koi, { left: 205, top: 418, transform: [{ rotate: '-40deg' }] }]} />
      </View>

      <View style={styles.floatingActions}>
        <Pressable style={styles.addButton} onPress={() => setShowAdd(true)}>
          <Icon name="plus" size={16} color={colors.brown} />
          <Text style={styles.addLabel}>Add villager</Text>
        </Pressable>
      </View>

      <BottomNav current="home" onNavigate={(screen) => navigation.navigate(screen)} />
      <AddVillagerModal visible={showAdd} onClose={() => setShowAdd(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, overflow: 'hidden' },
  topbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    paddingTop: 50, // web used 26px, +safe-area-ish allowance for RN status bar
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  eyebrow: { color: colors.brownSoft, fontSize: 12, fontFamily: fonts.sans },
  title: { fontFamily: fonts.serif, fontSize: 27, color: colors.brown, marginTop: 2 },
  pondMap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 82, overflow: 'hidden' },
  mapNote: { position: 'absolute', top: 108, left: 24, zIndex: 2, gap: 4 },
  mapNoteLabel: {
    color: colors.brownSoft,
    fontSize: 10,
    fontFamily: fonts.sansBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  mapNoteValue: { fontFamily: fonts.serif, fontSize: 16, color: colors.brown },
  koi: {
    position: 'absolute',
    width: 31,
    height: 9,
    borderRadius: 999,
    backgroundColor: colors.coral,
    opacity: 0.7,
  },
  floatingActions: { position: 'absolute', right: 18, bottom: 97, zIndex: 7 },
  addButton: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 7,
    backgroundColor: colors.sage,
    ...shadows.soft,
  },
  addLabel: { fontSize: 11, fontFamily: fonts.sansBold, color: colors.brown },
});
