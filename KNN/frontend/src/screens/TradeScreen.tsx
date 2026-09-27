// TradeScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { FoodIcon } from '../components/FoodIcon';
import { Icon } from '../components/Icon';
import { BottomNav } from '../navigation/BottomNav';
import { colors, fonts, radii, shadows } from '../theme/theme';
import type { Screen, FoodName } from '../types';
import { apiErrorMessage } from '../services/api';
import { acceptFoodRequest, counterFoodRequest, getFoodRequests, getMyProfile, rejectFoodRequest, thankFoodRequest, updateFoodOffer, type FoodRequest } from '../services/data';

export function TradeScreen({ onNavigate }: { onNavigate: (screen: Screen, params?: Record<string, string>) => void }) {
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setError('');
      const [profile, trades] = await Promise.all([getMyProfile(), getFoodRequests()]);
      setUserId(profile.id); setRequests(trades);
    } catch (e) { setError(apiErrorMessage(e)); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const act = async (request: FoodRequest, action: 'accept' | 'reject' | 'counter' | 'offer' | 'thank') => {
    setBusyId(request.food_request_id); setError('');
    try {
      if (action === 'accept') await acceptFoodRequest(request.food_request_id);
      if (action === 'reject') await rejectFoodRequest(request.food_request_id);
      if (action === 'counter') await counterFoodRequest(request.food_request_id);
      if (action === 'offer') await updateFoodOffer(request.food_request_id,
        request.offered_items.map((row) => ({ item_id: row.item_id, qty: row.qty })));
      if (action === 'thank') await thankFoodRequest(request.food_request_id);
      await load();
    } catch (e) { setError(apiErrorMessage(e)); }
    finally { setBusyId(''); }
  };

  const activeCount = requests.filter((request) => ['pending', 'countered'].includes(request.status)).length;
  const waitingCount = requests.filter((request) => request.awaiting_response_from === userId).length;
  const iconFor = (icon: string | null | undefined): FoodName => {
    const names: FoodName[] = ['eggs', 'calamansi', 'garlic', 'coconut', 'chili', 'rice', 'soup', 'herbs'];
    return names.includes(icon as FoodName) ? icon as FoodName : 'rice';
  };

  return <View style={styles.screen}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}><View style={styles.headerTitle}><Text style={styles.eyebrow}>Village exchanges</Text><Text style={styles.title}>Trades</Text></View></View>
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, shadows.soft]}><Text style={styles.summaryValue}>{waitingCount}</Text><Text style={styles.summaryLabel}>needs your reply</Text></View>
        <View style={[styles.summaryCard, styles.summaryCardBlue]}><Text style={styles.summaryValue}>{activeCount}</Text><Text style={styles.summaryLabel}>active trades</Text></View>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? <Text style={styles.empty}>Loading trades...</Text> : null}
      {!loading && requests.length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>No trades yet</Text><Text>Visit a neighbor's pantry to start an exchange.</Text></View> : null}
      {requests.map((request) => {
        const isRequester = request.requester_id === userId;
        const other = isRequester ? request.receiver : request.requester;
        const myTurn = request.awaiting_response_from === userId;
        const isBusy = busyId === request.food_request_id;
        const offered = request.offered_items || [];
        const requested = request.requested_food_items || [];
        return <View key={request.food_request_id} style={[styles.tradeCard, shadows.card,
          request.status === 'accepted' && styles.tradeCardAccepted, request.status === 'rejected' && styles.tradeCardDeclined]}>
          <View style={styles.tradeCardTop}><View style={styles.avatar}><Text style={styles.avatarLabel}>{other?.username?.[0]?.toUpperCase() || '?'}</Text></View>
            <View style={styles.tradePerson}><Text style={styles.tradePersonName}>{other?.username || 'A villager'} proposed a trade</Text><Text style={styles.tradePersonMeta}>{isRequester ? 'You sent this request' : 'Incoming village request'}</Text></View>
            <View style={styles.statusPill}><Text style={styles.statusPillLabel}>{request.status}</Text></View>
          </View>
          <View style={styles.exchangeRow}>
            <View style={styles.exchangeItem}><Text style={styles.exchangeLabel}>{isRequester ? 'You offer' : 'They offer'}</Text>
              {offered.map((row) => <View key={row.item_id} style={styles.itemLine}><FoodIcon name={iconFor(row.item?.icon)} size={30} /><Text style={styles.exchangeValue}>{row.qty} x {row.item?.name || 'Pantry item'}</Text></View>)}
            </View>
            <Icon name="swap" color={colors.sageDeep} />
            <View style={styles.exchangeItem}><Text style={styles.exchangeLabel}>{isRequester ? 'You request' : 'They request'}</Text>
              {requested.map((row) => <View key={row.item_id} style={styles.itemLine}><FoodIcon name={iconFor(row.item?.icon)} size={30} /><Text style={styles.exchangeValue}>{row.qty} x {row.item?.name || 'Pantry item'}</Text></View>)}
            </View>
          </View>
          <Text style={styles.turnNote}>{myTurn ? 'It is your turn to respond.' : request.status === 'accepted' ? 'This trade was accepted.' : request.status === 'completed' ? 'This trade is complete.' : ''}</Text>
          {myTurn && ['pending', 'countered'].includes(request.status) && <View style={styles.tradeActions}>
            {request.status === 'pending' && !isRequester ? <>
              <Button disabled={isBusy} style={[styles.acceptAction, shadows.primaryButton]} onPress={() => void act(request, 'accept')}><Text style={styles.acceptLabel}>Accept</Text></Button>
              <Button disabled={isBusy} style={styles.counterAction} onPress={() => void act(request, 'counter')}><Text style={styles.counterLabel}>Counter</Text></Button>
              <Button disabled={isBusy} style={styles.declineAction} onPress={() => void act(request, 'reject')}><Text style={styles.declineLabel}>Decline</Text></Button>
            </> : <>
              <Button disabled={isBusy} style={styles.counterAction} onPress={() => void act(request, 'offer')}><Text style={styles.counterLabel}>Send offer</Text></Button>
              <Button disabled={isBusy} style={styles.declineAction} onPress={() => void act(request, 'reject')}><Text style={styles.declineLabel}>Decline</Text></Button>
            </>}
          </View>}
          {request.status === 'accepted' && isRequester && <Button style={[styles.acceptAction, styles.actionWide]} disabled={isBusy} onPress={() => onNavigate('complete', { requestId: request.food_request_id })}><Text style={styles.acceptLabel}>Mark exchange complete</Text></Button>}
          {request.status === 'completed' && isRequester && !request.thanked && <Button style={[styles.acceptAction, styles.actionWide]} disabled={isBusy} onPress={() => void act(request, 'thank')}><Text style={styles.acceptLabel}>Send thank-you</Text></Button>}
        </View>;
      })}
    </ScrollView>
    <BottomNav current="trades" onNavigate={onNavigate} />
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ivory },
  scrollContent: { paddingBottom: 140 },
  header: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 8 },
  headerTitle: { alignItems: 'center' },
  eyebrow: {
    color: colors.brownSoft,
    fontSize: 11,
    fontFamily: fonts.sansBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: { fontFamily: fonts.serif, fontSize: 26, color: colors.brown, marginTop: 2, textAlign: 'center' },
  summaryRow: { flexDirection: 'row', gap: 10, marginHorizontal: 22, marginBottom: 28 },
  summaryCard: {
    flex: 1,
    padding: 17,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,250,240,0.7)',
  },
  summaryCardBlue: { backgroundColor: 'rgba(191,220,224,0.34)' },
  summaryValue: { fontFamily: fonts.serif, fontSize: 25, color: colors.brown },
  summaryLabel: { color: colors.brownSoft, fontFamily: fonts.sans, fontSize: 10 },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    marginBottom: 14,
  },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 20, color: colors.brown, marginTop: 2 },
  sectionMeta: { color: colors.brownSoft, fontFamily: fonts.sans, fontSize: 10 },
  historyHeading: { marginTop: 30 },
  tradeCard: {
    marginHorizontal: 22,
    padding: 18,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,250,240,0.78)',
    borderWidth: 1,
    borderColor: colors.line,
  },
  tradeCardAccepted: { backgroundColor: 'rgba(220,230,212,0.64)' },
  tradeCardDeclined: { backgroundColor: 'rgba(255,250,240,0.52)' },
  tradeCardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: colors.blush,
  },
  avatarLabel: { fontFamily: fonts.serif, fontSize: 17, color: colors.brown },
  tradePerson: { flex: 1 },
  tradePersonName: { fontFamily: fonts.serif, fontSize: 15, color: colors.brown },
  tradePersonMeta: { color: colors.brownSoft, fontFamily: fonts.sans, fontSize: 9, marginTop: 2 },
  statusPill: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 13, backgroundColor: colors.blushPale },
  statusPillAccepted: { backgroundColor: colors.sagePale },
  statusPillDeclined: { backgroundColor: 'rgba(92,83,71,0.07)' },
  statusPillLabel: { color: colors.coral, fontFamily: fonts.sansBold, fontSize: 9 },
  statusPillLabelAccepted: { color: colors.sageDeep },
  statusPillLabelDeclined: { color: colors.brownSoft },
  exchangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: radii.md,
    backgroundColor: colors.waterPale,
  },
  exchangeItem: { flex: 1, alignItems: 'center' },
  exchangeIcon: { marginVertical: 7 },
  exchangeLabel: {
    color: colors.brownSoft,
    fontSize: 8,
    fontFamily: fonts.sansBold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  exchangeValue: { fontFamily: fonts.serif, fontSize: 15, color: colors.brown },
  exchangeMeta: { color: colors.brownSoft, fontFamily: fonts.sans, fontSize: 9, marginTop: 2 },
  counterBox: { marginBottom: 14 },
  tradeActions: { flexDirection: 'row', gap: 7 },
  acceptAction: {
    flex: 0.8,
    minHeight: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sage,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderBottomRightRadius: 17,
    borderBottomLeftRadius: 6,
  },
  acceptLabel: { fontFamily: fonts.sansBold, fontSize: 11, color: colors.brown },
  counterAction: {
    flex: 1,
    minHeight: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.waterPale,
    borderRadius: 17,
  },
  counterLabel: { fontFamily: fonts.sansBold, fontSize: 11, color: colors.brown },
  declineAction: {
    flex: 1,
    minHeight: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(92,83,71,0.06)',
    borderRadius: 17,
  },
  declineLabel: { fontFamily: fonts.sansBold, fontSize: 11, color: colors.brownSoft },
  tradeResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,250,240,0.6)',
  },
  tradeResultLabel: { color: colors.sageDeep, fontFamily: fonts.sans, fontSize: 11 },
  itemLine: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  turnNote: { color: colors.brownSoft, fontSize: 11, marginBottom: 8 },
  error: { marginHorizontal: 22, marginBottom: 14, color: colors.coral, fontFamily: fonts.sans, textAlign: 'center' },
  empty: { marginHorizontal: 22, marginVertical: 28, padding: 20, color: colors.brownSoft, fontFamily: fonts.sans, textAlign: 'center' },
  emptyTitle: { marginBottom: 7, color: colors.brown, fontFamily: fonts.serif, fontSize: 20 },
  actionWide: { minHeight: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 17, marginTop: 8 },
  pastTrade: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 22,
    padding: 14,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,250,240,0.55)',
  },
  pastTradeIcon: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,250,240,0.72)',
  },
});