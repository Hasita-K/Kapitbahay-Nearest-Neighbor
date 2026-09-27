import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { Icon } from '../components/Icon';
import { apiErrorMessage } from '../services/api';
import { completeFoodRequest, getFoodRequests, saveRequestPhoto, thankFoodRequest, type FoodRequest } from '../services/data';
import { colors, fonts, shadows } from '../theme/theme';
import type { Screen } from '../types';

export function CompleteScreen({ requestId, onNavigate }: { requestId: string; onNavigate: (screen: Screen) => void }) {
  const [request, setRequest] = useState<FoodRequest | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try { setError(''); setRequest((await getFoodRequests()).find((item) => item.food_request_id === requestId) || null); }
    catch (e) { setError(apiErrorMessage(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [requestId]);

  const finish = async () => {
    if (!request) return;
    setBusy(true); setError('');
    try {
      let completed = request;
      if (request.status === 'accepted') completed = await completeFoodRequest(request.food_request_id);
      if (photoUrl.trim()) await saveRequestPhoto(request.food_request_id, photoUrl.trim());
      if (!completed.thanked) await thankFoodRequest(request.food_request_id);
      onNavigate('trade');
    } catch (e) { setError(apiErrorMessage(e)); await load(); }
    finally { setBusy(false); }
  };

  return <View style={styles.screen}>
    <View style={styles.lotus}>
      <View style={styles.petalLeft} />
      <View style={styles.petalCenter} />
      <View style={styles.petalRight} />
      <View style={styles.lotusBase} />
    </View>
    <Text style={styles.eyebrow}>A good exchange</Text>
    <Text style={styles.title}>{request?.receiver?.username ? `A little something for ${request.receiver.username}` : 'Trade completed'}</Text>
    <Text style={styles.body}>Thanks for sharing with your village. Mark the exchange complete and send a thank-you.</Text>
    {loading ? <Text style={styles.body}>Loading trade...</Text> : null}
    {error ? <Text style={styles.error}>{error}</Text> : null}
    {request?.status === 'accepted' && <View style={styles.photoField}><Field label="Photo link (optional)" placeholder="https://..." value={photoUrl} onChangeText={setPhotoUrl} autoCapitalize="none" /></View>}
    {!loading && !request ? <Text style={styles.error}>This trade could not be found.</Text> : null}
    {request && <Button style={[styles.primary, shadows.primaryButton]} disabled={busy || loading} onPress={() => void finish()}>
      <Text style={styles.primaryLabel}>{busy ? 'Saving...' : request.status === 'accepted' ? 'Complete and thank them' : 'Send thank-you'}</Text>
      <Icon name="leaf" color={colors.brown} />
    </Button>}
    <Button style={styles.textButton} onPress={() => onNavigate('trade')}><Text style={styles.textButtonLabel}>Back to trades</Text></Button>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: colors.ivory },
  lotus: { width: 150, height: 120, position: 'relative', marginBottom: 20 },
  petalLeft: { position: 'absolute', left: 31, top: 17, width: 45, height: 76, borderRadius: 30, transform: [{ rotate: '-34deg' }], backgroundColor: colors.blush },
  petalCenter: { position: 'absolute', left: 53, top: 3, width: 46, height: 91, borderRadius: 30, backgroundColor: colors.coral },
  petalRight: { position: 'absolute', left: 75, top: 17, width: 45, height: 76, borderRadius: 30, transform: [{ rotate: '34deg' }], backgroundColor: colors.water },
  lotusBase: { width: 110, height: 35, position: 'absolute', left: 20, bottom: 0, borderRadius: 50, backgroundColor: 'rgba(169,192,151,0.7)' },
  eyebrow: { color: colors.brownSoft, fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' },
  title: { marginTop: 8, color: colors.brown, fontFamily: fonts.serif, fontSize: 28, textAlign: 'center' },
  body: { maxWidth: 330, marginVertical: 12, color: colors.brownSoft, fontFamily: fonts.sans, fontSize: 13, lineHeight: 20, textAlign: 'center' },
  photoField: { width: '100%', marginVertical: 12 },
  error: { marginVertical: 10, color: colors.coral, textAlign: 'center', fontFamily: fonts.sans },
  primary: { width: '100%', minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 15, backgroundColor: colors.sage, borderRadius: 20 },
  primaryLabel: { color: colors.brown, fontFamily: fonts.sansBold, fontSize: 14 },
  textButton: { padding: 12, marginTop: 8 },
  textButtonLabel: { color: colors.brownSoft, fontFamily: fonts.sans },
});
