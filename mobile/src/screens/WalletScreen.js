import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWalletBalance,
  fetchWalletTransactions,
  requestWithdrawal,
  clearWalletMessages,
} from '../redux/slices/walletSlice';
import { commonStyles } from '../theme/styles';
import { colors } from '../theme/tokens';

export default function WalletScreen() {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { balance, transactions, loading, actionLoading, error, success } = useSelector((state) => state.wallet);

  React.useEffect(() => {
    if (token) {
      dispatch(fetchWalletBalance(token));
      dispatch(fetchWalletTransactions({ token }));
    }

    return () => {
      dispatch(clearWalletMessages());
    };
  }, [dispatch, token]);

  const handleWithdraw = async () => {
    const result = await dispatch(
      requestWithdrawal({ token, amount: Number(amount), phoneNumber })
    );

    if (!result.error) {
      setAmount('');
      setPhoneNumber('');
      dispatch(fetchWalletTransactions({ token }));
    }
  };

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.hero}>
        <Text style={commonStyles.title}>Wallet Studio</Text>
        <Text style={commonStyles.subtitle}>Balance visibility, payout requests, and transparent movement history.</Text>
        <Text style={{ marginTop: 12, fontSize: 26, fontWeight: '800', color: colors.ink }}>KES {balance}</Text>
      </View>

      <View style={commonStyles.card}>
        <Text style={{ fontWeight: '700', color: colors.ink, marginBottom: 8 }}>Withdraw Funds</Text>
        <TextInput
          style={commonStyles.input}
          placeholder="Amount (KES)"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput
          style={commonStyles.input}
          placeholder="M-Pesa phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}
        {success ? <Text style={{ color: colors.success, marginBottom: 8 }}>{success}</Text> : null}

        <TouchableOpacity style={commonStyles.buttonPrimary} onPress={handleWithdraw} disabled={actionLoading}>
          {actionLoading ? <ActivityIndicator color="#fff" /> : <Text style={commonStyles.buttonPrimaryText}>Request Withdrawal</Text>}
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.ocean} />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id || item.reference}
          ListHeaderComponent={<Text style={{ fontWeight: '700', marginBottom: 10, color: colors.ink }}>Recent Transactions</Text>}
          renderItem={({ item }) => (
            <View style={commonStyles.card}>
              <Text style={{ fontWeight: '700', color: colors.ink }}>{item.type}</Text>
              <Text style={{ color: colors.ocean, marginTop: 4 }}>{item.description}</Text>
              <Text style={{ marginTop: 6, color: colors.ink }}>KES {item.amount}</Text>
              <Text style={{ marginTop: 4, color: colors.ocean }}>{item.reference}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ color: colors.ocean }}>No transactions yet.</Text>}
        />
      )}
    </View>
  );
}
