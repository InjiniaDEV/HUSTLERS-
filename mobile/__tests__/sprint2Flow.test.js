import React from 'react';
import { render } from '@testing-library/react-native';
import ProfileScreen from '../src/screens/ProfileScreen';
import WalletScreen from '../src/screens/WalletScreen';

jest.mock('../src/redux/slices/walletSlice', () => ({
  fetchWalletBalance: () => ({ type: 'wallet/fetchBalance' }),
  fetchWalletTransactions: () => ({ type: 'wallet/fetchTransactions' }),
  requestWithdrawal: () => ({ type: 'wallet/requestWithdrawal' }),
  clearWalletMessages: () => ({ type: 'wallet/clearWalletMessages' }),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector) =>
    selector({
      auth: { token: 'token', user: { role: 'manager' } },
      wallet: {
        balance: 0,
        transactions: [],
        loading: false,
        actionLoading: false,
        error: null,
        success: null,
      },
    }),
}));

describe('Sprint 2 Mobile Flow', () => {
  it('renders profile workflow entry points', () => {
    const { getByText } = render(<ProfileScreen navigation={{ navigate: jest.fn() }} />);

    expect(getByText('Operations Hub')).toBeTruthy();
    expect(getByText('Open Contracts')).toBeTruthy();
    expect(getByText('Open Wallet')).toBeTruthy();
  });

  it('renders wallet management surface', () => {
    const { getByText, getByPlaceholderText } = render(<WalletScreen />);

    expect(getByText('Wallet Studio')).toBeTruthy();
    expect(getByPlaceholderText('Amount (KES)')).toBeTruthy();
    expect(getByPlaceholderText('M-Pesa phone number')).toBeTruthy();
  });
});
