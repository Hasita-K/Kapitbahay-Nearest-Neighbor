// Field.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme/theme';

type Props = {
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'phone-pad';
  value?: string;
  onChangeText?: (text: string) => void;
};

export function Field({ label, placeholder, secureTextEntry, keyboardType = 'default', value, onChangeText }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="rgba(92, 83, 71, 0.42)"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 7 },
  label: {
    paddingLeft: 4,
    color: colors.brownSoft,
    fontSize: 11,
    fontFamily: fonts.sansBold,
    letterSpacing: 0.8,
  },
  input: {
    height: 52,
    paddingHorizontal: 17,
    color: colors.brown,
    fontFamily: fonts.sans,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(92, 83, 71, 0.1)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 7,
    backgroundColor: 'rgba(244, 239, 225, 0.54)',
  },
});
