// TradeScreen.tsx
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { FoodIcon } from '../components/FoodIcon';
import { Icon } from '../components/Icon';
import { BottomNav } from '../navigation/BottomNav';
import { colors, fonts, radii, shadows } from '../theme/theme';
import type { Screen } from '../types';

type Outcome = 'pending' | 'accepted' | 'declined';

export function TradeScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [countering, setCountering] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>('pending');

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Text style={styles.eyebrow}>Village exchanges</Text>
            <Text style={styles.title}>Trades</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, shadows.soft]}>
            <Text style={styles.summaryValue}>1</Text>
            <Text style={styles.summaryLabel}>needs your reply</Text>
          </View>
          <View style={[styles.summaryCard, styles.summaryCardBlue]}>
            <Text style={styles.summaryValue}>3</Text>
            <Text style={styles.summaryLabel}>active trades</Text>
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.eyebrow}>Incoming</Text>
            <Text style={styles.sectionTitle}>Waiting for you</Text>
          </View>
          <Text style={styles.sectionMeta}>Today</Text>
        </View>

        <View
          style={[
            styles.tradeCard,
            shadows.card,
            outcome === 'accepted' && styles.tradeCardAccepted,
            outcome === 'declined' && styles.tradeCardDeclined,
          ]}
        >
          <View style={styles.tradeCardTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLabel}>M</Text>
            </View>
            <View style={styles.tradePerson}>
              <Text style={styles.tradePersonName}>Hasita proposed a trade</Text>
              <Text style={styles.tradePersonMeta}>Between your two pantries</Text>
            </View>
            <View
              style={[
                styles.statusPill,
                outcome === 'accepted' && styles.statusPillAccepted,
                outcome === 'declined' && styles.statusPillDeclined,
              ]}
            >
              <Text
                style={[
                  styles.statusPillLabel,
                  outcome === 'accepted' && styles.statusPillLabelAccepted,
                  outcome === 'declined' && styles.statusPillLabelDeclined,
                ]}
              >
                {outcome === 'pending' ? 'Pending' : outcome === 'accepted' ? 'Accepted' : 'Declined'}
              </Text>
            </View>
          </View>

          <View style={styles.exchangeRow}>
            <View style={styles.exchangeItem}>
              <Text style={styles.exchangeLabel}>Mika offers</Text>
              <View style={styles.exchangeIcon}>
                <FoodIcon name="eggs" size={40} />
              </View>
              <Text style={styles.exchangeValue}>4 eggs</Text>
              <Text style={styles.exchangeMeta}>from Mika's pantry</Text>
            </View>
            <Icon name="swap" color={colors.sageDeep} />
            <View style={styles.exchangeItem}>
              <Text style={styles.exchangeLabel}>Mika requests</Text>
              <View style={styles.exchangeIcon}>
                <FoodIcon name="calamansi" size={40} />
              </View>
              <Text style={styles.exchangeValue}>2 calamansi</Text>
              <Text style={styles.exchangeMeta}>from your pantry</Text>
            </View>
          </View>

          {outcome === 'pending' && countering && (
            <View style={styles.counterBox}>
              <Field label="You'll receive · Eggs" placeholder="How many would you like?" />
              <View style={{ height: 10 }} />
              <Field label="You'll give · Calamansi" placeholder="How many can you share?" />
            </View>
          )}

          {outcome === 'pending' && (
            <View style={styles.tradeActions}>
              <Button style={[styles.acceptAction, shadows.primaryButton]} onPress={() => setOutcome('accepted')}>
                <Text style={styles.acceptLabel}>Accept</Text>
              </Button>
              <Button style={styles.counterAction} onPress={() => setCountering((current) => !current)}>
                <Text style={styles.counterLabel}>Counter</Text>
              </Button>
              <Button style={styles.declineAction} onPress={() => setOutcome('declined')}>
                <Text style={styles.declineLabel}>Decline</Text>
              </Button>
            </View>
          )}

          {outcome !== 'pending' && (
            <View style={styles.tradeResult}>
              <Icon name={outcome === 'accepted' ? 'check' : 'leaf'} color={outcome === 'accepted' ? colors.sageDeep : colors.brownSoft} />
              <Text style={[styles.tradeResultLabel, outcome === 'declined' && { color: colors.brownSoft }]}>
                {outcome === 'accepted' ? "You accepted Mika's trade." : 'You quietly declined this trade.'}
              </Text>
            </View>
          )}
        </View>

        <View style={[styles.sectionHeading, styles.historyHeading]}>
          <View>
            <Text style={styles.eyebrow}>Recent</Text>
            <Text style={styles.sectionTitle}>Trade history</Text>
          </View>
        </View>
        <View style={styles.pastTrade}>
          <View style={styles.pastTradeIcon}>
            <FoodIcon name="eggs" size={32} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tradePersonName}>Rice for coconut milk · Tala</Text>
            <Text style={styles.tradePersonMeta}>Accepted · Yesterday</Text>
          </View>
          <Icon name="chevron" color={colors.brownSoft} />
        </View>
      </ScrollView>

      <BottomNav current="trades" onNavigate={onNavigate} />
    </View>
  );
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