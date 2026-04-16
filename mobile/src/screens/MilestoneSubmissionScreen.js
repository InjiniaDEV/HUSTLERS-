import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { submitMilestone, fetchContractDetails } from '../redux/slices/contractsSlice';
import { commonStyles } from '../theme/styles';

export default function MilestoneSubmissionScreen({ route, navigation }) {
  const { contractId, milestoneId, milestoneTitle } = route.params;
  const [description, setDescription] = useState('');
  const [imagesText, setImagesText] = useState('');

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { actionLoading, error } = useSelector((state) => state.contracts);

  const handleSubmit = async () => {
    const images = imagesText
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean)
      .slice(0, 3);

    const resultAction = await dispatch(
      submitMilestone({
        token,
        contractId,
        milestoneId,
        payload: { description, images },
      })
    );

    if (!resultAction.error) {
      await dispatch(fetchContractDetails({ token, contractId }));
      navigation.goBack();
    }
  };

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.hero}>
        <Text style={commonStyles.title}>Submit Milestone</Text>
        <Text style={commonStyles.subtitle}>{milestoneTitle}</Text>
      </View>

      <TextInput
        style={[commonStyles.input, { minHeight: 120, textAlignVertical: 'top' }]}
        placeholder="Describe completed work"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={commonStyles.input}
        placeholder="Evidence image URLs (comma separated, max 3)"
        value={imagesText}
        onChangeText={setImagesText}
      />

      {error ? <Text style={commonStyles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={commonStyles.buttonPrimary} onPress={handleSubmit} disabled={actionLoading}>
        {actionLoading ? <ActivityIndicator color="#fff" /> : <Text style={commonStyles.buttonPrimaryText}>Send Submission</Text>}
      </TouchableOpacity>
    </View>
  );
}
