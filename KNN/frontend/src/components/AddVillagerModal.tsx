// AddVillagerModal.tsx — converted from the AddVillagerModal function and
// .modal-backdrop/.modal-sheet/.modal-leaf CSS in your Figma Make export.
// Uses RN's built-in <Modal> instead of a manually-toggled overlay div.
import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { AppButton } from './Button';
import { Field } from './Field';
import { Icon } from './Icon';
import { colors, fonts, shadows } from '../theme/theme';

export function AddVillagerModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [added, setAdded] = useState(false);

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

          {!added ? (
            <>
              <Text style={styles.eyebrow}>Grow your circle</Text>
              <Text style={styles.sheetTitle}>Add a villager</Text>
              <Text style={styles.body}>
                Ask your friend for their unique village code. Only invited friends can join.
              </Text>
              <Field label="Friend code" placeholder="e.g. TALA-0724" />
              <AppButton variant="primary" wide onPress={() => setAdded(true)} style={styles.actionSpacing}>
                <Text style={styles.primaryLabel}>Find my friend</Text>
                <Icon name="arrow" size={16} color={colors.brown} />
              </AppButton>
              <Text style={styles.gentleNote}>
                Your code is <Text style={{ fontFamily: fonts.sansBold }}>ANA-1842</Text>
              </Text>
            </>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarLetter}>T</Text>
              </View>
              <Text style={styles.sheetTitle}>Tala found you</Text>
              <Text style={styles.body}>She'll be added to San Isidro Circle.</Text>
              <AppButton variant="primary" wide onPress={onClose} style={styles.actionSpacing}>
                <Text style={styles.primaryLabel}>Welcome Tala</Text>
                <Icon name="check" size={16} color={colors.brown} />
              </AppButton>
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
