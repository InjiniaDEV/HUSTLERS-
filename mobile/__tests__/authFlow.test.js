import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen';

jest.mock('../src/redux/slices/authSlice', () => ({
  login: () => ({ type: 'auth/login' }),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector) => selector({ auth: { loading: false, error: null } }),
}));

describe('Mobile Auth Flow', () => {
  it('renders login screen', () => {
    const { getByPlaceholderText } = render(<LoginScreen navigation={{ navigate: jest.fn() }} />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });
});
