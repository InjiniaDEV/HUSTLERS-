import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  approveMilestone,
  rejectMilestone,
  fetchContractDetails,
} from '../redux/slices/contractsSlice';
import { commonStyles } from '../theme/styles';
import { colors } from '../theme/tokens';

export default function MilestoneReviewScreen({ route, navigation }) {
  const { contractId, milestoneId, milestoneTitle, status } = route.params;
  const [reason, setReason] = useState('');

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { actionLoading, error } = useSelector((state) => state.contracts);

  const refreshAndClose = async () => {
    await dispatch(fetchContractDetails({ token, contractId }));
    navigation.goBack();
  };

  const handleApprove = async () => {
    const result = await dispatch(approveMilestone({ token, contractId, milestoneId }));
    if (!result.error) {
      await refreshAndClose();
    }
  };

  const handleReject = async () => {
    const result = await dispatch(rejectMilestone({ token, contractId, milestoneId, reason }));
    if (!result.error) {
      await refreshAndClose();
    }
  };

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.hero}>
        <Text style={commonStyles.title}>Milestone Review</Text>
        <Text style={commonStyles.subtitle}>{milestoneTitle}</Text>
        <Text style={{ marginTop: 8, color: colors.ink }}>Current status: {status}</Text>
      </View>

      <TextInput
        style={[commonStyles.input, { minHeight: 110, textAlignVertical: 'top' }]}
        placeholder="Provide reason if rejecting"
        value={reason}
        onChangeText={setReason}
        multiline
      />

      {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={commonStyles.buttonPrimary} onPress={handleApprove} disabled={actionLoading}>
        {actionLoading ? <ActivityIndicator color="#fff" /> : <Text style={commonStyles.buttonPrimaryText}>Approve and Release Payment</Text>}
      </TouchableOpacity>

      <TouchableOpacity
        style={commonStyles.buttonSecondary}
        onPress={handleReject}
        disabled={actionLoading}
      >
        <Text style={commonStyles.buttonSecondaryText}>Reject with Reason</Text>
      </TouchableOpacity>
    </View>
  );
}
