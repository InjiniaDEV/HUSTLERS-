import React from 'react';
import { render } from '@testing-library/react-native';
import KycUploadScreen from '../src/screens/KycUploadScreen';
import KycReviewDashboard from '../src/screens/KycReviewDashboard';

describe('Mobile KYC Flow', () => {
  it('renders KYC upload screen', () => {
    const { getByText } = render(<KycUploadScreen />);
    expect(getByText('KYC Document Upload')).toBeTruthy();
  });

  it('renders KYC review dashboard', () => {
    const { getByText } = render(<KycReviewDashboard />);
    expect(getByText('KYC Review Dashboard')).toBeTruthy();
  });
});
