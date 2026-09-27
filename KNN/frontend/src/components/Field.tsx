// Field.tsx
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, fonts } from '../theme/theme';

type FieldProps = {
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  value?: string;
  onChangeText?: (text: string) => void;
};

export function Field({ label, placeholder, secureTextEntry, keyboardType, value, onChangeText }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="rgba(92, 83, 71, 0.42)"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 7 },
  label: {
    paddingLeft: 4,
    color: colors.brownSoft,
    fontSize: 11,
    fontFamily: fonts.sansBold,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    height: 52,
    paddingHorizontal: 17,
    color: colors.brown,
    borderWidth: 1,
    borderColor: 'rgba(92, 83, 71, 0.1)',
    backgroundColor: 'rgba(244, 239, 225, 0.54)',
    fontFamily: fonts.sans,
    // matches web's asymmetric 18px 18px 18px 7px radius
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 7,
  },
});