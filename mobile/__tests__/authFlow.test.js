// __tests__/authFlow.test.js
// Jest tests for mobile authentication flow (Register, Login, OTP, Reset Password)
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../src/App';

describe('Mobile Auth Flow', () => {
  it('renders login screen', () => {
    const { getByPlaceholderText } = render(<App />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });

  // Add more UI interaction tests for registration, OTP, reset password, etc.
});
