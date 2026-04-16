import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient, { authHeaders } from '../../api/client';

export const fetchWalletBalance = createAsyncThunk('wallet/fetchBalance', async (token, thunkAPI) => {
  try {
    const res = await apiClient.get('/wallet/balance', { headers: authHeaders(token) });
    return res.data.balance;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to fetch balance.' });
  }
});

export const fetchWalletTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async ({ token, page = 1, limit = 20 }, thunkAPI) => {
    try {
      const res = await apiClient.get(`/wallet/transactions?page=${page}&limit=${limit}`, {
        headers: authHeaders(token),
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to fetch transactions.' });
    }
  }
);

export const requestWithdrawal = createAsyncThunk(
  'wallet/requestWithdrawal',
  async ({ token, amount, phoneNumber }, thunkAPI) => {
    try {
      const res = await apiClient.post(
        '/wallet/withdraw',
        { amount, phoneNumber },
        { headers: authHeaders(token) }
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: 'Withdrawal request failed.' });
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    balance: 0,
    transactions: [],
    page: 1,
    totalPages: 0,
    loading: false,
    actionLoading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearWalletMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Unable to fetch wallet balance.';
      })
      .addCase(fetchWalletTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload.transactions || [];
        state.page = action.payload.page || 1;
        state.totalPages = action.payload.totalPages || 0;
      })
      .addCase(fetchWalletTransactions.rejected, (state, action) => {
        state.error = action.payload?.message || 'Unable to fetch transactions.';
      })
      .addCase(requestWithdrawal.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.balance = action.payload.balance;
        state.success = action.payload.message || 'Withdrawal initiated.';
      })
      .addCase(requestWithdrawal.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message || 'Withdrawal failed.';
      });
  },
});

export const { clearWalletMessages } = walletSlice.actions;
export default walletSlice.reducer;
