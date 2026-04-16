import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContracts } from '../redux/slices/contractsSlice';
import { commonStyles } from '../theme/styles';
import { colors } from '../theme/tokens';

function statusColor(status) {
  if (status === 'in_progress') return colors.warning;
  if (status === 'closed') return colors.success;
  if (status === 'funded') return colors.ocean;
  return colors.ink;
}

export default function ContractsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { list, loading, error } = useSelector((state) => state.contracts);

  const role = user?.role === 'hustler' ? 'hustler' : 'manager';

  const loadContracts = useCallback(() => {
    if (token) {
      dispatch(fetchContracts({ token, role }));
    }
  }, [dispatch, token, role]);

  React.useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.hero}>
        <Text style={commonStyles.title}>Contract Pulse</Text>
        <Text style={commonStyles.subtitle}>
          Track milestones, escrow health, and delivery momentum in one place.
        </Text>
      </View>

      {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}

      {loading && list.length === 0 ? (
        <ActivityIndicator size="large" color={colors.ocean} />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item._id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadContracts} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={commonStyles.card}
              onPress={() => navigation.navigate('ContractDetails', { contractId: item._id })}
            >
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.ink }}>{item.title}</Text>
              <Text style={{ marginTop: 6, color: colors.ocean }} numberOfLines={2}>
                {item.description || 'No description added yet.'}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                <Text style={{ color: colors.ink, fontWeight: '600' }}>KES {item.budget}</Text>
                <Text style={{ color: statusColor(item.status), fontWeight: '700' }}>{item.status}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={commonStyles.card}>
              <Text style={{ color: colors.ocean }}>No contracts yet. New contracts will appear here.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
