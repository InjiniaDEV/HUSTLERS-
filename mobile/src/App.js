import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './redux/store';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import OtpScreen from './screens/OtpScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ProfileScreen from './screens/ProfileScreen';
import KycUploadScreen from './screens/KycUploadScreen';
import ContractsScreen from './screens/ContractsScreen';
import ContractDetailsScreen from './screens/ContractDetailsScreen';
import MilestoneSubmissionScreen from './screens/MilestoneSubmissionScreen';
import MilestoneReviewScreen from './screens/MilestoneReviewScreen';
import WalletScreen from './screens/WalletScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="OTP" component={OtpScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="KYCUpload" component={KycUploadScreen} />
          <Stack.Screen name="Contracts" component={ContractsScreen} />
          <Stack.Screen name="ContractDetails" component={ContractDetailsScreen} options={{ title: 'Contract Details' }} />
          <Stack.Screen name="MilestoneSubmission" component={MilestoneSubmissionScreen} options={{ title: 'Submit Milestone' }} />
          <Stack.Screen name="MilestoneReview" component={MilestoneReviewScreen} options={{ title: 'Milestone Review' }} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
