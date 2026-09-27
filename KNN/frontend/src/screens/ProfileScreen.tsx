// ProfileScreen.tsx
import React from 'react';
import { Image } from 'react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { FoodIcon } from '../components/FoodIcon';
import { Icon } from '../components/Icon';
import { BottomNav } from '../navigation/BottomNav';
import { colors, fonts, radii, shadows } from '../theme/theme';
import type { Screen } from '../types';
import { apiErrorMessage } from '../services/api';
import { createVillage, getMyPhotos, getMyProfile, getMyProfileStats, getVillages, type Photo, type Profile, type ProfileStats, type Village } from '../services/data';
import { Field } from '../components/Field';

const galleryTints = [colors.water, colors.sage, colors.blush];
export function ProfileScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [stats, setStats] = React.useState<ProfileStats>({ deals_completed: 0, thank_you_count: 0 });
  const [photos, setPhotos] = React.useState<Photo[]>([]);
  const [villageName, setVillageName] = React.useState('');
  const [error, setError] = React.useState('');
  React.useEffect(() => { Promise.all([getMyProfile(), getMyProfileStats(), getMyPhotos(), getVillages()])
    .then(([me, nextStats, memories, villages]) => { setProfile(me); setStats(nextStats); setPhotos(memories); setVillageName(villages[0]?.name || 'No village yet'); })
    .catch((e) => setError(apiErrorMessage(e))); }, []);
  return <View style={styles.screen}><ScrollView contentContainerStyle={styles.scrollContent}>
    <View style={styles.header}><View style={{ width: 42 }} /><View style={styles.headerTitle}><Text style={styles.eyebrow}>Village profile</Text><Text style={styles.title}>Your corner</Text></View><Button style={styles.iconButtonPale} onPress={() => onNavigate('villages')} accessibilityLabel="My villages"><Icon name="map" /></Button></View>
    {error ? <Text style={styles.error}>{error}</Text> : null}
    <View style={styles.profileCard}><View style={styles.profileAvatar}><Text style={styles.profileAvatarLabel}>{profile?.username?.[0]?.toUpperCase() || '?'}</Text><Text style={styles.profileAvatarSpark}>*</Text></View>
      <Text style={styles.profileName}>{profile?.username || 'Loading profile...'}</Text><Text style={styles.profileHandle}>{profile?.unique_friend_code ? 'Friend code: ' + profile.unique_friend_code : profile?.phone_number || ''}</Text>
      <View style={styles.villageChip}><View style={styles.villageDot} /><Text style={styles.villageChipLabel}>{villageName}</Text></View></View>
    <View style={styles.statsRow}><View style={[styles.statCard, shadows.soft]}><Text style={styles.statValue}>{stats.deals_completed}</Text><Text style={styles.statLabel}>deals completed</Text></View><View style={[styles.statCard, shadows.soft]}><Text style={styles.statValue}>{stats.thank_you_count}</Text><Text style={styles.statLabel}>thank-yous received</Text></View></View>
    <View style={styles.sectionHeading}><View><Text style={styles.eyebrow}>Shared memories</Text><Text style={styles.sectionTitle}>From the village table</Text></View><Text style={styles.sectionMeta}>{photos.length} photos</Text></View>
    {photos.length ? <View style={styles.photoGrid}>{photos.map((photo, i) => <View key={photo.photo_id} style={[styles.galleryPhoto, { backgroundColor: galleryTints[i % 3] }]}><Image source={{ uri: photo.photo_url }} style={styles.galleryPhotoImage} /></View>)}</View> : <Text style={styles.empty}>Completed exchange photos will appear here.</Text>}
    <Button style={styles.logoutButton} onPress={() => onNavigate('auth')}><Text style={styles.logoutLabel}>Log out</Text><Icon name="arrow" color={colors.brownSoft} /></Button>
  </ScrollView><BottomNav current="profile" onNavigate={onNavigate} /></View>;
}
export function VillagesScreen({ onNavigate }: { onNavigate: (screen: Screen, params?: Record<string, string>) => void }) {
  const [villages, setVillages] = React.useState<Village[]>([]); const [name, setName] = React.useState(''); const [loading, setLoading] = React.useState(true); const [busy, setBusy] = React.useState(false); const [error, setError] = React.useState('');
  const load = React.useCallback(async () => { try { setError(''); setVillages(await getVillages()); } catch (e) { setError(apiErrorMessage(e)); } finally { setLoading(false); } }, []);
  React.useEffect(() => { void load(); }, [load]);
  const add = async () => { if (!name.trim()) return; setBusy(true); setError(''); try { const village = await createVillage(name.trim()); setName(''); setVillages((current) => [village, ...current]); } catch (e) { setError(apiErrorMessage(e)); } finally { setBusy(false); } };
  return <View style={styles.screen}><ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
    <View style={styles.header}><Button style={styles.iconButton} onPress={() => onNavigate('profile')} accessibilityLabel="Go back"><Icon name="arrow" /></Button><View style={styles.headerTitle}><Text style={styles.eyebrow}>Your circles</Text><Text style={styles.title}>My villages</Text></View><View style={{ width: 42 }} /></View>
    <Text style={styles.villagesIntro}>Keep each friend group in its own little pond. Your profile stays the same across all of them.</Text>
    <View style={styles.createVillage}><Field label="New village" placeholder="Name your circle" value={name} onChangeText={setName} /><Button style={styles.createButton} disabled={busy || !name.trim()} onPress={() => void add()}><Icon name="plus" color={colors.paper} /><Text style={styles.createButtonLabel}>{busy ? 'Creating...' : 'Create village'}</Text></Button></View>
    {error ? <Text style={styles.error}>{error}</Text> : null}{loading ? <Text style={styles.empty}>Loading villages...</Text> : null}{!loading && !villages.length ? <Text style={styles.empty}>No villages yet. Create one to invite neighbors.</Text> : null}
    <View style={{ paddingHorizontal: 22, gap: 12 }}>{villages.map((group, i) => <Button key={group.villages_id} style={[styles.villageRow, { backgroundColor: galleryTints[i % 3] }, shadows.soft]} onPress={() => onNavigate('home', { villageId: group.villages_id })}>
      <View style={styles.villageAvatars}>{(group.members || []).slice(0, 3).map((member, index) => <View key={member.user_id} style={[styles.villageAvatar, index > 0 && { marginLeft: -10 }]}><Text style={styles.villageAvatarLabel}>{member.username[0]?.toUpperCase() || '?'}</Text></View>)}</View>
      <View style={{ flex: 1 }}><Text style={styles.villageName}>{group.name}</Text><Text style={styles.villageMeta}>{group.members?.length || 1} villagers</Text></View><Icon name="chevron" color={colors.brownSoft} /></Button>)}</View>
    <View style={styles.villageTip}><Icon name="leaf" color={colors.sageDeep} /><Text style={styles.villageTipText}>Villagers only see the pantry you share inside their village.</Text></View>
  </ScrollView></View>;
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
  sectionTitle: { fontFamily: fonts.serif, fontSize: 20, color: colors.brown, marginTop: 2 },
  sectionMeta: { color: colors.brownSoft, fontFamily: fonts.sans, fontSize: 10 },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    marginBottom: 14,
  },
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
  profileCard: { alignItems: 'center', paddingHorizontal: 22, paddingBottom: 20 },
  profileAvatar: {
    width: 94,
    height: 94,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 47,
    backgroundColor: colors.blush,
  },
  profileAvatarLabel: { fontFamily: fonts.serif, fontSize: 38, color: colors.brown },
  profileAvatarSpark: { position: 'absolute', top: 4, right: 6, color: colors.coral, fontSize: 18 },
  error: { marginHorizontal: 22, marginVertical: 8, color: colors.coral, fontFamily: fonts.sans, textAlign: 'center' },
  empty: { marginHorizontal: 25, marginVertical: 18, color: colors.brownSoft, fontFamily: fonts.sans, textAlign: 'center' },
  galleryPhotoImage: { width: '100%', height: '100%', borderRadius: radii.md },
  createVillage: { marginHorizontal: 22, marginBottom: 22, padding: 16, gap: 12, borderRadius: radii.md, backgroundColor: colors.paper },
  createButton: { minHeight: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 17, backgroundColor: colors.sageDeep },
  createButtonLabel: { color: colors.paper, fontFamily: fonts.sansBold },
  profileName: { fontFamily: fonts.serif, fontSize: 26, color: colors.brown, marginTop: 13 },
  profileHandle: { color: colors.brownSoft, fontFamily: fonts.sans, fontSize: 11 },
  villageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 12,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: 'rgba(169,192,151,0.25)',
  },
  villageDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.sageDeep },
  villageChipLabel: { fontFamily: fonts.sans, fontSize: 10, color: colors.brown },
  statsRow: { flexDirection: 'row', gap: 10, marginHorizontal: 22, marginBottom: 28 },
  statCard: {
    flex: 1,
    padding: 18,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,250,240,0.68)',
  },
  statValue: { fontFamily: fonts.serif, fontSize: 28, color: colors.brown },
  statLabel: { color: colors.brownSoft, fontFamily: fonts.sans, fontSize: 10 },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 22,
    gap: 7,
    marginBottom: 24,
  },
  galleryPhoto: {
    width: '31.5%',
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
  },
  galleryPhotoSpark: { position: 'absolute', top: 8, right: 9, color: 'rgba(255,250,240,0.8)' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    minHeight: 48,
    marginHorizontal: 22,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 19,
    backgroundColor: 'rgba(255,250,240,0.52)',
  },
  logoutLabel: { fontFamily: fonts.sansBold, fontSize: 12, color: colors.brownSoft },
  villagesIntro: {
    marginHorizontal: 30,
    marginBottom: 28,
    color: colors.brownSoft,
    fontFamily: fonts.serif,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  villageRow: {
    minHeight: 94,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 29,
  },
  villageAvatars: { flexDirection: 'row' },
  villageAvatar: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'rgba(255,250,240,0.82)',
    backgroundColor: colors.paper,
  },
  villageAvatarLabel: { fontFamily: fonts.serif, fontSize: 12, color: colors.brown },
  villageName: { fontFamily: fonts.serif, fontSize: 17, color: colors.brown },
  villageMeta: { color: colors.brownSoft, fontFamily: fonts.sans, fontSize: 10, marginTop: 2 },
  villageTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    margin: 30,
    padding: 15,
    borderRadius: 20,
    backgroundColor: 'rgba(255,250,240,0.5)',
  },
  villageTipText: { flex: 1, color: colors.brownSoft, fontFamily: fonts.sans, fontSize: 11, lineHeight: 16 },
});