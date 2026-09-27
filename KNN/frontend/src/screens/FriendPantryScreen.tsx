// FriendPantryScreen.tsx
// Reached by tapping a villager's hut on the home map — lets you pick what
// you'd like from their pantry and what you'll offer from your own, then
// sends a combined trade request.
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { FoodIcon } from '../components/FoodIcon';
import { Icon } from '../components/Icon';
import { apiErrorMessage } from '../services/api';
import { createFoodRequest, getFridgeItems, type FridgeItem } from '../services/data';
import type { FoodName } from '../types';
import { colors, fonts, radii, shadows } from '../theme/theme';
import type { Screen } from '../types';

type FriendPantryScreenProps = {
  onNavigate: (screen: Screen) => void;
  friendId: string;
  friendName: string;
};

function OfferGrid({ items, counts, setCounts }: {
  items: FridgeItem[]; counts: number[]; setCounts: Dispatch<SetStateAction<number[]>>;
}) {
  const change = (index: number, amount: number) => setCounts((current) => current.map((count, i) =>
    i === index ? Math.max(0, Math.min(items[index].count, count + amount)) : count));
  const iconFor = (icon: string | null): FoodName => {
    const names: FoodName[] = ['eggs', 'calamansi', 'garlic', 'coconut', 'chili', 'rice', 'soup', 'herbs'];
    return names.includes(icon as FoodName) ? icon as FoodName : 'rice';
  };
  return <View style={styles.offerPicker}>{items.map((item, index) => {
    const selected = counts[index] > 0;
    return <View key={item.fridge_items_id} style={[styles.offerOption, selected && styles.offerOptionSelected]}>
      <Button style={styles.offerSelect} onPress={() => change(index, selected ? -counts[index] : 1)}>
        <FoodIcon name={iconFor(item.icon)} size={32} />
        <View style={{ flex: 1 }}><Text style={styles.offerName}>{item.name}</Text><Text style={styles.offerMeta}>{item.count} available</Text></View>
        <View style={styles.offerToggle}><Icon name={selected ? 'check' : 'plus'} size={12} color={colors.sageDeep} /></View>
      </Button>
      {selected && <View style={styles.offerQuantity}>
        <Button style={styles.quantityButton} onPress={() => change(index, -1)} accessibilityLabel={`Decrease ${item.name}`}><Icon name="minus" size={14} /></Button>
        <Text style={styles.quantityValue}>{counts[index]}</Text>
        <Button style={styles.quantityButton} onPress={() => change(index, 1)} accessibilityLabel={`Increase ${item.name}`}><Icon name="plus" size={14} /></Button>
      </View>}
    </View>;
  })}</View>;
}

export function FriendPantryScreen({ onNavigate, friendName, friendId }: FriendPantryScreenProps) {
  const [friendItems, setFriendItems] = useState<FridgeItem[]>([]);
  const [myItems, setMyItems] = useState<FridgeItem[]>([]);
  const [requestCounts, setRequestCounts] = useState<number[]>([]);
  const [offerCounts, setOfferCounts] = useState<number[]>([]);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getFridgeItems(friendId), getFridgeItems()]).then(([theirs, mine]) => {
      setFriendItems(theirs.filter((item) => item.count > 0));
      setMyItems(mine.filter((item) => item.count > 0));
      setRequestCounts(theirs.filter((item) => item.count > 0).map(() => 0));
      setOfferCounts(mine.filter((item) => item.count > 0).map(() => 0));
    }).catch((e) => setError(apiErrorMessage(e))).finally(() => setLoading(false));
  }, [friendId]);

  const selectedRequests = requestCounts.filter((count) => count > 0).length;
  const selectedOffers = offerCounts.filter((count) => count > 0).length;
  const canSubmit = selectedRequests > 0 && selectedOffers > 0 && !busy;
  const submit = async () => {
    setBusy(true); setError('');
    try {
      await createFoodRequest({ receiver_id: friendId,
        requested_items: friendItems.flatMap((item, index) => requestCounts[index] > 0 ? [{ item_id: item.fridge_items_id, qty: requestCounts[index] }] : []),
        offered_items: myItems.flatMap((item, index) => offerCounts[index] > 0 ? [{ item_id: item.fridge_items_id, qty: offerCounts[index] }] : []),
      });
      setSent(true);
    } catch (e) { setError(apiErrorMessage(e)); }
    finally { setBusy(false); }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Button style={styles.iconButton} onPress={() => onNavigate('home')} accessibilityLabel="Go back"><Icon name="arrow" /></Button>
          <Text style={styles.title}>{friendName}'s pantry</Text>
          <View style={styles.avatar}><Text style={styles.avatarLabel}>{friendName[0]?.toUpperCase() || '?'}</Text></View>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loading ? <Text style={styles.empty}>Loading pantries...</Text> : null}
        {!loading && !sent && <View style={[styles.composer, shadows.card]}>
          <View style={styles.composerSection}>
            <View style={styles.composerHeading}><View style={styles.stepBadge}><Text style={styles.stepBadgeLabel}>1</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.eyebrow}>From {friendName}'s pantry</Text><Text style={styles.composerTitle}>Choose what you need</Text></View>
              <Text style={styles.selectionCount}>{selectedRequests} selected</Text></View>
            {!friendItems.length ? <Text style={styles.empty}>Their shared pantry is empty.</Text> : <OfferGrid items={friendItems} counts={requestCounts} setCounts={setRequestCounts} />}
            <View style={styles.dividerRow}><View style={styles.dividerLine} /><View style={styles.dividerIcon}><Icon name="swap" size={17} color={colors.sageDeep} /></View><View style={styles.dividerLine} /></View>
          </View>
          <View style={[styles.composerSection, styles.offerSection]}>
            <View style={styles.composerHeading}><View style={styles.stepBadge}><Text style={styles.stepBadgeLabel}>2</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.eyebrow}>From your pantry</Text><Text style={styles.composerTitle}>Choose what you'll offer</Text></View>
              <Text style={styles.selectionCount}>{selectedOffers} selected</Text></View>
            {!myItems.length ? <Text style={styles.empty}>Add pantry items before making a trade.</Text> : <OfferGrid items={myItems} counts={offerCounts} setCounts={setOfferCounts} />}
          </View>
          <View style={styles.composerFooter}>
            <View style={styles.requestNote}><Icon name="leaf" color={colors.sageDeep} /><Text style={styles.requestNoteText}>{friendName} can accept, counter, or decline. No message is needed.</Text></View>
            <View style={styles.tradeReadiness}><Text style={styles.readinessText}>{selectedRequests > 0 ? `${selectedRequests} to receive` : 'Choose an item to receive'}</Text><Text style={styles.readinessDot}>/</Text><Text style={styles.readinessText}>{selectedOffers > 0 ? `${selectedOffers} to offer` : 'Choose an item to offer'}</Text></View>
            <Button style={[styles.primary, styles.wide, shadows.primaryButton, !canSubmit && styles.primaryDisabled]} disabled={!canSubmit} onPress={() => void submit()}>
              <Text style={styles.primaryLabel}>{busy ? 'Sending...' : 'Send trade request'}</Text><Icon name="arrow" /></Button>
          </View>
        </View>}
        {!loading && sent && <View style={styles.sentState}>
          <View style={styles.sentMark}><Icon name="check" size={28} color={colors.sageDeep} /></View><Text style={styles.eyebrow}>Request sent</Text>
          <Text style={styles.sentTitle}>Your trade is with {friendName}</Text><Text style={styles.sentBody}>You'll see it in Trades when {friendName} accepts, counters, or declines.</Text>
          <Button style={[styles.primary, styles.wide, shadows.primaryButton]} onPress={() => onNavigate('trade')}><Text style={styles.primaryLabel}>View trades</Text><Icon name="swap" /></Button>
          <Button style={styles.textButton} onPress={() => onNavigate('home')}><Text style={styles.textButtonLabel}>Back to the village</Text></Button>
        </View>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ivory },
  scrollContent: { paddingBottom: 60 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 8,
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
  title: { flex: 1, textAlign: 'center', fontFamily: fonts.serif, fontSize: 24, color: colors.brown },
  avatar: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: colors.blush,
  },
  avatarLabel: { fontFamily: fonts.serif, fontSize: 17, color: colors.brown },
  eyebrow: {
    color: colors.brownSoft,
    fontSize: 11,
    fontFamily: fonts.sansBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  composer: {
    marginHorizontal: 14,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255, 250, 240, 0.62)',
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  composerSection: { paddingHorizontal: 18, paddingTop: 22 },
  offerSection: {
    paddingTop: 4,
    paddingBottom: 22,
    backgroundColor: 'rgba(220, 230, 212, 0.3)',
  },
  composerHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginHorizontal: 14,
    marginBottom: 15,
  },
  stepBadge: {
    width: 31,
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: colors.sagePale,
  },
  stepBadgeLabel: { fontFamily: fonts.serif, fontSize: 14, color: colors.sageDeep },
  composerTitle: { fontFamily: fonts.serif, fontSize: 19, color: colors.brown, marginTop: 2 },
  selectionCount: { color: colors.brownSoft, fontFamily: fonts.sans, fontSize: 9 },
  offerPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  offerOption: {
    width: '48%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 250, 240, 0.55)',
    overflow: 'hidden',
  },
  offerOptionSelected: {
    borderColor: 'rgba(120, 144, 106, 0.45)',
    backgroundColor: 'rgba(255, 250, 240, 0.9)',
  },
  offerSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    minHeight: 68,
  },
  offerName: { fontFamily: fonts.serif, fontSize: 12, color: colors.brown },
  offerMeta: { color: colors.brownSoft, fontFamily: fonts.sans, fontSize: 8, marginTop: 2 },
  offerToggle: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: colors.sagePale,
  },
  offerQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 34,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  quantityButton: { padding: 6 },
  quantityValue: { fontFamily: fonts.serif, fontSize: 14, color: colors.brown },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    marginHorizontal: 6,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.line },
  dividerIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: colors.paper,
  },
  composerFooter: {
    paddingHorizontal: 18,
    paddingBottom: 20,
    backgroundColor: 'rgba(220, 230, 212, 0.3)',
  },
  requestNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginHorizontal: 8,
    marginVertical: 18,
  },
  requestNoteText: { flex: 1, color: colors.brownSoft, fontFamily: fonts.sans, fontSize: 11, lineHeight: 16 },
  tradeReadiness: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginBottom: 13,
  },
  readinessText: { color: colors.brownSoft, fontFamily: fonts.sans, fontSize: 9 },
  readinessDot: { color: colors.coral },
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
  primaryDisabled: { opacity: 0.45 },
  wide: { width: '100%' },
  primaryLabel: { fontFamily: fonts.sansBold, fontSize: 15, color: colors.brown },
  sentState: { alignItems: 'center', paddingTop: 90, paddingHorizontal: 30 },
  sentMark: {
    width: 74,
    height: 66,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    borderRadius: 30,
    backgroundColor: colors.sagePale,
  },
  sentTitle: { fontFamily: fonts.serif, fontSize: 30, color: colors.brown, marginTop: 6 },
  sentBody: {
    color: colors.brownSoft,
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginVertical: 16,
  },
  textButton: { marginTop: 13 },
  textButtonLabel: { color: colors.brownSoft, fontFamily: fonts.sans, fontSize: 12 },
  error: { marginHorizontal: 22, marginVertical: 8, color: colors.coral, fontFamily: fonts.sans, textAlign: 'center' },
  empty: { marginHorizontal: 25, marginVertical: 18, color: colors.brownSoft, fontFamily: fonts.sans, textAlign: 'center' },
});
