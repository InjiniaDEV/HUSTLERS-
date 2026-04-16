import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContractDetails } from '../redux/slices/contractsSlice';
import { commonStyles } from '../theme/styles';
import { colors } from '../theme/tokens';

export default function ContractDetailsScreen({ route, navigation }) {
  const { contractId } = route.params;
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { current, escrow, loading, error } = useSelector((state) => state.contracts);

  React.useEffect(() => {
    if (token && contractId) {
      dispatch(fetchContractDetails({ token, contractId }));
    }
  }, [dispatch, token, contractId]);

  const isHustler = user?.role === 'hustler';

  if (loading && !current) {
    return (
      <View style={commonStyles.screen}>
        <ActivityIndicator size="large" color={colors.ocean} />
      </View>
    );
  }

  return (
    <View style={commonStyles.screen}>
      {current ? (
        <>
          <View style={commonStyles.hero}>
            <Text style={commonStyles.title}>{current.title}</Text>
            <Text style={commonStyles.subtitle}>{current.description || 'No contract description available.'}</Text>
          </View>

          <View style={commonStyles.card}>
            <Text style={{ fontWeight: '700', color: colors.ink }}>Escrow Snapshot</Text>
            <Text style={{ marginTop: 6, color: colors.ocean }}>
              Remaining: KES {escrow?.remainingAmount ?? 0} / Funded: KES {escrow?.fundedAmount ?? 0}
            </Text>
            <Text style={{ marginTop: 6, color: colors.ink }}>Status: {current.status}</Text>
          </View>

          {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}

          <FlatList
            data={current.milestones || []}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={commonStyles.card}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.ink }}>{item.title}</Text>
                <Text style={{ marginTop: 4, color: colors.ocean }}>{item.description || 'No details added.'}</Text>
                <Text style={{ marginTop: 8, color: colors.ink }}>Amount: KES {item.amount}</Text>
                <Text style={{ marginTop: 4, color: colors.ink }}>Status: {item.status}</Text>
                {item.rejectionReason ? (
                  <Text style={{ marginTop: 4, color: colors.danger }}>Reason: {item.rejectionReason}</Text>
                ) : null}

                {isHustler ? (
                  <TouchableOpacity
                    style={commonStyles.buttonSecondary}
                    onPress={() =>
                      navigation.navigate('MilestoneSubmission', {
                        contractId: current._id,
                        milestoneId: item._id,
                        milestoneTitle: item.title,
                      })
                    }
                  >
                    <Text style={commonStyles.buttonSecondaryText}>Submit Work Proof</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={commonStyles.buttonPrimary}
                    onPress={() =>
                      navigation.navigate('MilestoneReview', {
                        contractId: current._id,
                        milestoneId: item._id,
                        milestoneTitle: item.title,
                        status: item.status,
                      })
                    }
                  >
                    <Text style={commonStyles.buttonPrimaryText}>Review Milestone</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        </>
      ) : (
        <Text style={commonStyles.errorText}>Contract not found.</Text>
      )}
    </View>
  );
}
