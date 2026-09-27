// FriendPantryScreen.tsx — converted from the FriendPantryScreen function +
// .trade-composer/.composer-section/.offer-picker/.offer-option/.request-sent
// CSS. This is the screen HomeScreen navigates to when you tap a Hut.
//
// Register this as a root Stack.Screen in App.tsx, e.g.:
//   <Stack.Screen name="FriendPantry" component={FriendPantryScreen} />
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { AppButton } from '../components/Button';
import { Icon } from '../components/Icon';
import { FoodIcon } from '../components/FoodIcon';
import { colors, fonts, shadows } from '../theme/theme';
import { pantryItems, PantryItem } from '../data/pantryItems';

// The original file reuses the same mock `pantryItems` array for both "my
// pantry" and "the friend's pantry" (trimmed to 4) since there's no second
// user's real data yet — kept as-is here for fidelity.
const friendItems = pantryItems.slice(0, 4);

export function FriendPantryScreen({ route, navigation }: any) {
  const friendName = route?.params?.villager ?? 'Mika';

  const [requestCounts, setRequestCounts] = useState(friendItems.map(() => 0));
  const [offerCounts, setOfferCounts] = useState(pantryItems.map(() => 0));
  const [sent, setSent] = useState(false);

  const selectedRequests = requestCounts.filter((c) => c > 0).length;
  const selectedOffers = offerCounts.filter((c) => c > 0).length;

  const changeCount = (
    index: number,
    amount: number,
    items: PantryItem[],
    setter: React.Dispatch<React.SetStateAction<number[]>>,
  ) => {
    setter((current) =>
      current.map((count, i) => (i === index ? Math.max(0, Math.min(items[index].count, count + amount)) : count)),
    );
  };

  const toggleCount = (index: number, setter: React.Dispatch<React.SetStateAction<number[]>>) => {
    setter((current) => current.map((count, i) => (i === index ? (count > 0 ? 0 : 1) : count)));
  };

  if (sent) {
    return (
      <View style={styles.sentScreen}>
        <View style={styles.sentMark}>
          <Icon name="check" size={28} color={colors.sageDeep} />
        </View>
        <Text style={styles.eyebrow}>Request sent</Text>
        <Text style={styles.sheetTitle}>Your trade is with {friendName}</Text>
        <Text style={styles.bodyCopy}>
          You'll see it in Trades when {friendName} accepts, counters, or declines.
        </Text>
        <AppButton variant="primary" wide onPress={() => navigation.navigate('Main', { screen: 'Trades' })}>
          <Text style={styles.primaryLabel}>View trades</Text>
          <Icon name="swap" size={16} color={colors.brown} />
        </AppButton>
        <AppButton variant="text" onPress={() => navigation.navigate('Main', { screen: 'Village' })}>
          Back to the village
        </AppButton>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        title={`${friendName}'s pantry`}
        eyebrow="San Isidro Circle"
        action={
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{friendName[0]}</Text>
          </View>
        }
      />
      {/* onBack from the original ScreenHeader isn't wired up in this shared
          component yet — add an onBack prop to ScreenHeader if you want the
          back chevron here; navigation.goBack() is what it should call. */}

      <View style={styles.composer}>
        <View style={styles.composerSection}>
          <View style={styles.composerHeading}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeLabel}>1</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.eyebrow}>From {friendName}'s pantry</Text>
              <Text style={styles.composerHeadingTitle}>Choose what you need</Text>
            </View>
            <Text style={styles.selectionCount}>{selectedRequests} selected</Text>
          </View>

          <View style={styles.offerPicker}>
            {friendItems.map((item, index) => (
              <OfferOption
                key={item.name}
                item={item}
                count={requestCounts[index]}
                verb="Request"
                onToggle={() => toggleCount(index, setRequestCounts)}
                onDecrease={() => changeCount(index, -1, friendItems, setRequestCounts)}
                onIncrease={() => changeCount(index, 1, friendItems, setRequestCounts)}
              />
            ))}
          </View>

          <View style={styles.flowDivider}>
            <View style={styles.flowLine} />
            <View style={styles.flowBadge}>
              <Icon name="swap" size={17} color={colors.sageDeep} />
            </View>
            <View style={styles.flowLine} />
          </View>
        </View>

        <View style={[styles.composerSection, styles.offerSection]}>
          <View style={styles.composerHeading}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeLabel}>2</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.eyebrow}>From your pantry</Text>
              <Text style={styles.composerHeadingTitle}>Choose what you'll offer</Text>
            </View>
            <Text style={styles.selectionCount}>{selectedOffers} selected</Text>
          </View>

          <View style={styles.offerPicker}>
            {pantryItems.map((item, index) => (
              <OfferOption
                key={item.name}
                item={item}
                count={offerCounts[index]}
                verb="Offer"
                onToggle={() => toggleCount(index, setOfferCounts)}
                onDecrease={() => changeCount(index, -1, pantryItems, setOfferCounts)}
                onIncrease={() => changeCount(index, 1, pantryItems, setOfferCounts)}
              />
            ))}
          </View>
        </View>

        <View style={styles.composerFooter}>
          <View style={styles.requestNote}>
            <Icon name="leaf" size={16} color={colors.sageDeep} />
            <Text style={styles.requestNoteLabel}>
              {friendName} can accept, counter, or decline. No message is needed.
            </Text>
          </View>
          <View style={styles.readiness}>
            <Text style={styles.readinessLabel}>
              {selectedRequests > 0 ? `${selectedRequests} to receive` : 'Choose an item to receive'}
            </Text>
            <Text style={styles.readinessDot}>·</Text>
            <Text style={styles.readinessLabel}>
              {selectedOffers > 0 ? `${selectedOffers} to offer` : 'Choose an item to offer'}
            </Text>
          </View>
          <AppButton
            variant="primary"
            wide
            disabled={selectedRequests === 0 || selectedOffers === 0}
            onPress={() => setSent(true)}
          >
            <Text style={styles.primaryLabel}>Send trade request</Text>
            <Icon name="arrow" size={16} color={colors.brown} />
          </AppButton>
        </View>
      </View>
    </ScrollView>
  );
}

// Reused for both the "request" grid and the "offer" grid — converted from
// the repeated .offer-option/.offer-select/.offer-quantity markup.
function OfferOption({
  item,
  count,
  verb,
  onToggle,
  onDecrease,
  onIncrease,
}: {
  item: PantryItem;
  count: number;
  verb: 'Request' | 'Offer';
  onToggle: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  const selected = count > 0;
  return (
    <View style={[styles.offerOption, selected && styles.offerOptionSelected]}>
      <Pressable
        style={styles.offerSelect}
        onPress={onToggle}
        accessibilityLabel={`${selected ? 'Remove' : verb} ${item.name}`}
      >
        <FoodIcon name={item.icon} size={34} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.offerName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.offerMeta}>{item.count} available</Text>
        </View>
        <View style={styles.offerMark}>
          <Icon name={selected ? 'check' : 'plus'} size={12} color={colors.sageDeep} />
        </View>
      </Pressable>
      <View style={[styles.offerQuantity, !selected && styles.offerQuantityInactive]}>
        {selected ? (
          <>
            <Pressable onPress={onDecrease} accessibilityLabel={`Decrease ${item.name}`} style={styles.qtyButton}>
              <Icon name="minus" size={14} color={colors.brown} />
            </Pressable>
            <Text style={styles.qtyValue}>{count}</Text>
            <Pressable onPress={onIncrease} accessibilityLabel={`Increase ${item.name}`} style={styles.qtyButton}>
              <Icon name="plus" size={14} color={colors.brown} />
            </Pressable>
          </>
        ) : (
          <Text style={styles.qtyValue}>0</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ivory },
  content: { paddingBottom: 42 },
  avatar: {
    width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.blush,
  },
  avatarLetter: { fontFamily: fonts.serif, fontSize: 17, color: colors.brown },

  composer: {
    marginHorizontal: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(92, 83, 71, 0.07)',
    borderTopLeftRadius: 32, borderTopRightRadius: 32, borderBottomRightRadius: 11, borderBottomLeftRadius: 32,
    backgroundColor: 'rgba(255, 250, 240, 0.62)',
    ...shadows.card,
  },
  composerSection: { paddingTop: 22, paddingHorizontal: 18 },
  offerSection: { paddingTop: 4, paddingBottom: 22, backgroundColor: 'rgba(220, 230, 212, 0.35)' },
  composerHeading: { flexDirection: 'row', alignItems: 'center', gap: 9, marginHorizontal: 14, marginBottom: 15 },
  stepBadge: {
    width: 31, height: 31, alignItems: 'center', justifyContent: 'center',
    borderRadius: 16, backgroundColor: colors.sagePale,
  },
  stepBadgeLabel: { fontFamily: fonts.serif, fontSize: 14, color: colors.sageDeep },
  composerHeadingTitle: { fontFamily: fonts.serif, fontSize: 20, color: colors.brown, marginTop: 2 },
  eyebrow: { color: colors.brownSoft, fontSize: 9, fontFamily: fonts.sans },
  selectionCount: { color: colors.brownSoft, fontSize: 9, fontFamily: fonts.sans },

  flowDivider: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 20, marginTop: 18 },
  flowLine: { flex: 1, height: 1, backgroundColor: colors.line },
  flowBadge: {
    width: 38, height: 38, alignItems: 'center', justifyContent: 'center',
    borderRadius: 19, backgroundColor: colors.paper, ...shadows.soft,
  },

  offerPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  offerOption: {
    width: '48.5%', height: 104, overflow: 'hidden', borderWidth: 1, borderColor: 'transparent',
    borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottomRightRadius: 7, borderBottomLeftRadius: 18,
    backgroundColor: 'rgba(255, 250, 240, 0.55)',
  },
  offerOptionSelected: { borderColor: 'rgba(120, 144, 106, 0.45)', backgroundColor: 'rgba(255, 250, 240, 0.9)' },
  offerSelect: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8 },
  offerName: { fontFamily: fonts.serifMedium, fontSize: 12, color: colors.brown },
  offerMeta: { color: colors.brownSoft, fontSize: 8, fontFamily: fonts.sans, marginTop: 2 },
  offerMark: {
    width: 18, height: 18, alignItems: 'center', justifyContent: 'center',
    borderRadius: 9, backgroundColor: colors.sagePale,
  },
  offerQuantity: {
    height: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderTopWidth: 1, borderTopColor: colors.line,
  },
  offerQuantityInactive: { opacity: 0 },
  qtyButton: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' },
  qtyValue: { minWidth: 30, textAlign: 'center', fontFamily: fonts.serifMedium, fontSize: 14, color: colors.brown },

  composerFooter: { paddingHorizontal: 18, paddingBottom: 20, backgroundColor: 'rgba(220, 230, 212, 0.55)' },
  requestNote: { flexDirection: 'row', alignItems: 'center', gap: 11, marginVertical: 18, marginHorizontal: 8 },
  requestNoteLabel: { flex: 1, fontSize: 11, lineHeight: 16, color: colors.brownSoft, fontFamily: fonts.sans },
  readiness: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 13 },
  readinessLabel: { color: colors.brownSoft, fontSize: 9, fontFamily: fonts.sans },
  readinessDot: { color: colors.coral },
  primaryLabel: { fontFamily: fonts.sansBold, fontSize: 15, color: colors.brown },

  sentScreen: { flex: 1, alignItems: 'center', paddingTop: 110, paddingHorizontal: 30, backgroundColor: colors.ivory },
  sentMark: {
    width: 74, height: 66, alignItems: 'center', justifyContent: 'center', marginBottom: 25,
    borderRadius: 30, backgroundColor: colors.sagePale, transform: [{ rotate: '-5deg' }],
  },
  sheetTitle: { fontFamily: fonts.serif, fontSize: 24, color: colors.brown, marginVertical: 8, textAlign: 'center' },
  bodyCopy: { fontSize: 13, color: colors.brownSoft, textAlign: 'center', marginBottom: 26, lineHeight: 19, fontFamily: fonts.sans },
});
