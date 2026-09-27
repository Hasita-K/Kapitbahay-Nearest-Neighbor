// BottomNav.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { colors, fonts, shadows } from '../theme/theme';
import { HomeScreen } from '../screens/HomeScreen';
import { MyPantryScreen } from '../screens/MyPantryScreen';
import { TradeScreen } from '../screens/TradeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import type { Screen } from '../types';
import type { AuthSession } from '../services/auth';

type Tab = 'home' | 'my-pantry' | 'trades' | 'profile';

type BottomNavProps = {
  current: Tab;
  onNavigate: (screen: Screen) => void;
};

export function BottomNav({ current, onNavigate }: BottomNavProps) {
  return (
    <View style={[styles.nav, shadows.card]}>
      <Button style={[styles.tab, current === 'home' && styles.tabActive]} onPress={() => onNavigate('home')}>
        <Icon name="home" size={20} color={current === 'home' ? colors.sageDeep : colors.brownSoft} />
        <Text style={[styles.label, current === 'home' && styles.labelActive]}>Village</Text>
      </Button>
      <Button style={[styles.tab, current === 'my-pantry' && styles.tabActive]} onPress={() => onNavigate('my-pantry')}>
        <Icon name="pantry" size={20} color={current === 'my-pantry' ? colors.sageDeep : colors.brownSoft} />
        <Text style={[styles.label, current === 'my-pantry' && styles.labelActive]}>Pantry</Text>
      </Button>
      <Button style={[styles.tab, current === 'trades' && styles.tabActive]} onPress={() => onNavigate('trade')}>
        <Icon name="swap" size={20} color={current === 'trades' ? colors.sageDeep : colors.brownSoft} />
        <Text style={[styles.label, current === 'trades' && styles.labelActive]}>Trades</Text>
      </Button>
      <Button style={[styles.tab, current === 'profile' && styles.tabActive]} onPress={() => onNavigate('profile')}>
        <Icon name="user" size={20} color={current === 'profile' ? colors.sageDeep : colors.brownSoft} />
        <Text style={[styles.label, current === 'profile' && styles.labelActive]}>Me</Text>
      </Button>
    </View>
  );
}

// App.tsx mounts this component as its Main screen. Keep the tab selection
// here so the converted screens can share the custom bottom navigation.
export function VillageTabs({ session: _session }: { session: AuthSession | null }) {
  const [current, setCurrent] = useState<Tab>('home');
  const navigate = (screen: Screen) => {
    if (screen === 'home') setCurrent('home');
    if (screen === 'my-pantry') setCurrent('my-pantry');
    if (screen === 'trade') setCurrent('trades');
    if (screen === 'profile') setCurrent('profile');
  };

  if (current === 'home') {
    return <HomeScreen navigation={{ navigate: (screen: Screen) => navigate(screen) }} />;
  }
  if (current === 'trades') return <TradeScreen onNavigate={navigate} />;
  if (current === 'profile') return <ProfileScreen onNavigate={navigate} />;
  return <MyPantryScreen onNavigate={navigate} />;
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 14,
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 25,
    backgroundColor: 'rgba(255,250,240,0.94)',
  },
  tab: {
    flex: 1,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderRadius: 19,
  },
  tabActive: {
    backgroundColor: 'rgba(169,192,151,0.2)',
  },
  label: {
    fontSize: 9,
    fontFamily: fonts.sans,
    color: colors.brownSoft,
  },
  labelActive: {
    color: colors.sageDeep,
  },
});
