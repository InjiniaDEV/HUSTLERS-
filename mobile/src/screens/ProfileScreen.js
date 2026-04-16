import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { commonStyles } from '../theme/styles';
import { colors } from '../theme/tokens';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.hero}>
        <Text style={commonStyles.title}>Operations Hub</Text>
        <Text style={commonStyles.subtitle}>From this screen, you can manage identity, contracts, and payouts.</Text>
      </View>

      <TouchableOpacity style={commonStyles.buttonPrimary} onPress={() => navigation.navigate('KYCUpload')}>
        <Text style={commonStyles.buttonPrimaryText}>Upload KYC Documents</Text>
      </TouchableOpacity>

      <TouchableOpacity style={commonStyles.buttonSecondary} onPress={() => navigation.navigate('Contracts')}>
        <Text style={commonStyles.buttonSecondaryText}>Open Contracts</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.walletButton} onPress={() => navigation.navigate('Wallet')}>
        <Text style={styles.walletButtonText}>Open Wallet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  walletButton: {
    backgroundColor: colors.ink,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  walletButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
