// AddVillagerModal.tsx — converted from the AddVillagerModal function and
// .modal-backdrop/.modal-sheet/.modal-leaf CSS in your Figma Make export.
// Uses RN's built-in <Modal> instead of a manually-toggled overlay div.
import React, { useState } from 'react';
import { ActivityIndicator, Modal, View, Text, StyleSheet } from 'react-native';
import { AppButton } from './Button';
import { Field } from './Field';
import { Icon } from './Icon';
import { colors, fonts, shadows } from '../theme/theme';
import { addVillageMember, lookupVillager, type Profile } from '../services/data';
import { apiErrorMessage } from '../services/api';

export function AddVillagerModal({ visible, onClose, villageId, onAdded }: { visible: boolean; onClose: () => void; villageId?: string; onAdded: () => void }) {
  const [friendCode, setFriendCode] = useState('');
  const [friend, setFriend] = useState<Profile | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const findFriend = async () => {
    setBusy(true); setError('');
    try { setFriend(await lookupVillager(friendCode)); }
    catch (e) { setError(apiErrorMessage(e)); }
    finally { setBusy(false); }
  };
  const addFriend = async () => {
    if (!friend || !villageId) { setError('Create or select a village first.'); return; }
    setBusy(true); setError('');
    try { await addVillageMember(villageId, friend.id); onAdded(); onClose(); setFriend(null); setFriendCode(''); }
    catch (e) { setError(apiErrorMessage(e)); }
    finally { setBusy(false); }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.leaf}>
            <Icon name="users" size={28} color={colors.sageDeep} />
          </View>
          <AppButton
            variant="iconGhost"
            onPress={onClose}
            accessibilityLabel="Close"
            style={styles.closeButton}
          >
            <Icon name="close" size={18} color={colors.brownSoft} />
          </AppButton>

          {!friend ? (
            <>
              <Text style={styles.eyebrow}>Grow your circle</Text>
              <Text style={styles.sheetTitle}>Add a villager</Text>
              <Text style={styles.body}>
                Ask your friend for their unique village code. Only invited friends can join.
              </Text>
              <Field label="Friend code" placeholder="e.g. TALA-0724" value={friendCode} onChangeText={setFriendCode} autoCapitalize="characters" />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <AppButton variant="primary" wide disabled={busy || !friendCode.trim()} onPress={() => void findFriend()} style={styles.actionSpacing}>
                {busy ? <ActivityIndicator color={colors.brown} /> : <>
                <Text style={styles.primaryLabel}>Find my friend</Text>
                <Icon name="arrow" size={16} color={colors.brown} />
                </>}
              </AppButton>
            </>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarLetter}>{friend.username[0]?.toUpperCase() || '?'}</Text>
              </View>
              <Text style={styles.sheetTitle}>{friend.username} found</Text>
              <Text style={styles.body}>Add them to your village?</Text>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <AppButton variant="primary" wide disabled={busy} onPress={() => void addFriend()} style={styles.actionSpacing}>
                {busy ? <ActivityIndicator color={colors.brown} /> : <>
                <Text style={styles.primaryLabel}>Add to village</Text>
                <Icon name="check" size={16} color={colors.brown} />
                </>}
              </AppButton>
              <AppButton variant="text" wide onPress={() => setFriend(null)}><Text>Try another code</Text></AppButton>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(92, 83, 71, 0.35)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 26,
    paddingTop: 34,
    ...shadows.card,
  },
  closeButton: { position: 'absolute', top: 18, right: 18 },
  leaf: {
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: colors.sagePale,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  eyebrow: { color: colors.brownSoft, fontSize: 12, fontFamily: fonts.sans },
  sheetTitle: { fontFamily: fonts.serif, fontSize: 24, color: colors.brown, marginVertical: 6 },
  body: { fontFamily: fonts.sans, fontSize: 13, color: colors.brownSoft, marginBottom: 16, lineHeight: 19 },
  actionSpacing: { marginTop: 14 },
  primaryLabel: { fontFamily: fonts.sansBold, fontSize: 15, color: colors.brown },
  gentleNote: { marginTop: 14, textAlign: 'center', fontSize: 12, color: colors.brownSoft, fontFamily: fonts.sans },
  error: { marginVertical: 8, textAlign: 'center', color: colors.coral, fontFamily: fonts.sans, fontSize: 12 },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: colors.blushPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarLetter: { fontFamily: fonts.serif, fontSize: 26, color: colors.brown },
});
