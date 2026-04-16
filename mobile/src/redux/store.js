import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import contractsReducer from './slices/contractsSlice';
import walletReducer from './slices/walletSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    contracts: contractsReducer,
    wallet: walletReducer,
  },
});

export default store;
