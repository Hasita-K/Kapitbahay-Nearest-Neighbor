// HomeScreen.tsx — converted from the HomeScreen function and
// .map-screen/.map-topbar/.pond-map/.map-note/.floating-actions CSS.
//
// One structural change from the web version: there, "showAdd" and "go" were
// passed down from the top-level App component that owned all screen state.
// Here, HomeScreen is a tab screen inside VillageTabs (see BottomNav.tsx), so
// it gets `navigation` for free from React Navigation, and owns the "show the
// add-villager modal" state locally instead of receiving it as a prop.
//
// Villager data (including each villager's own pantry contents) now lives in
// data/villagers.ts instead of a local array here, so FriendPantryScreen can
// look the same villager up by name and show what's actually in their fridge.
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '../components/Icon';
import { Hut } from '../components/Hut';
import { WatercolorMarks } from '../components/WatercolorMarks';
import { AddVillagerModal } from '../components/AddVillagerModal';
import { BottomNav } from '../navigation/BottomNav';
import { colors, fonts, shadows } from '../theme/theme';
import { apiErrorMessage } from '../services/api';
import { getFridgeItems, getMyProfile, getVillages, type Profile, type Village } from '../services/data';
import type { Screen } from '../types';

type Neighbor = { id: string; name: string; note: string };

export function HomeScreen({ navigation, activeVillageId }: { navigation: { navigate: (screen: Screen, params?: Record<string, string>) => void }; activeVillageId?: string }) {
  const [showAdd, setShowAdd] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [villages, setVillages] = useState<Village[]>([]);
  const [neighbors, setNeighbors] = useState<Neighbor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      setError('');
      const [nextProfile, nextVillages] = await Promise.all([getMyProfile(), getVillages()]);
      setProfile(nextProfile);
      setVillages(nextVillages);
      const village = nextVillages.find((item) => item.villages_id === activeVillageId) || nextVillages[0];
      const members = (village?.members || []).filter((member) => member.user_id !== nextProfile.id);
      const nextNeighbors = await Promise.all(members.map(async (member) => {
        const items = await getFridgeItems(member.user_id);
        const shared = items.filter((item) => item.count > 0);
        return { id: member.user_id, name: member.username, note: shared.slice(0, 2).map((item) => item.name).join(' & ') || 'Pantry is quiet' };
      }));
      setNeighbors(nextNeighbors);
    } catch (e) { setError(apiErrorMessage(e)); }
    finally { setLoading(false); }
  }, [activeVillageId]);

  useEffect(() => { void loadData(); }, [loadData]);

  return (
    <View style={styles.screen}>
      <LinearGradient colors={['#e5eeee', colors.waterPale, colors.ivory]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.topbar}>
        <View>
          <Text style={styles.eyebrow}>Good morning, {profile?.username || 'neighbor'}</Text>
          <Text style={styles.title}>{villages.find((item) => item.villages_id === activeVillageId)?.name || villages[0]?.name || 'Your village'}</Text>
        </View>
      </View>
      <View style={styles.pondMap}>
        <WatercolorMarks />
        <View style={styles.mapNote}>
          <Text style={styles.mapNoteLabel}>Today in the village</Text>
          <Text style={styles.mapNoteValue}>{neighbors.length} pantries are open</Text>
        </View>
        {neighbors.map((neighbor, index) => (
          <Hut key={neighbor.id} name={neighbor.name} note={neighbor.note}
            position={index % 3 === 0 ? { top: 220 + Math.floor(index / 3) * 190, right: 40 }
              : index % 3 === 1 ? { top: 390 + Math.floor(index / 3) * 180, left: 30, scale: 0.9 }
              : { right: 36, bottom: 118 + Math.floor(index / 3) * 170, scale: 0.82 }}
            onPress={() => navigation.navigate('friend-pantry', { ownerId: neighbor.id, friendName: neighbor.name })} />
        ))}
        {loading ? <ActivityIndicator style={styles.status} color={colors.sageDeep} /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!loading && !villages.length ? <Text style={styles.empty}>Create a village to start sharing with neighbors.</Text> : null}
        <View style={[styles.koi, { left: 185, top: 390, transform: [{ rotate: '45deg' }] }]} />
        <View style={[styles.koi, { left: 205, top: 418, transform: [{ rotate: '-40deg' }] }]} />
      </View>
      <View style={styles.floatingActions}>
        <Pressable style={styles.addButton} onPress={() => setShowAdd(true)}>
          <Icon name="plus" size={16} color={colors.brown} /><Text style={styles.addLabel}>Add villager</Text>
        </Pressable>
      </View>
      <BottomNav current="home" onNavigate={(screen) => navigation.navigate(screen)} />
      <AddVillagerModal visible={showAdd} villageId={(villages.find((item) => item.villages_id === activeVillageId) || villages[0])?.villages_id} onAdded={() => void loadData()} onClose={() => setShowAdd(false)} />
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
  status: { position: 'absolute', alignSelf: 'center', top: '48%' },
  error: { position: 'absolute', alignSelf: 'center', top: '52%', marginHorizontal: 25, color: colors.coral, textAlign: 'center', fontFamily: fonts.sans, zIndex: 8 },
  empty: { position: 'absolute', top: 240, left: 35, right: 35, color: colors.brownSoft, textAlign: 'center', fontFamily: fonts.sans },
});
