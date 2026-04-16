import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient, { authHeaders } from '../../api/client';

export const fetchContracts = createAsyncThunk(
  'contracts/fetchContracts',
  async ({ token, role = 'manager' }, thunkAPI) => {
    try {
      const res = await apiClient.get(`/contracts?role=${role}`, {
        headers: authHeaders(token),
      });
      return res.data.contracts || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to load contracts.' });
    }
  }
);

export const fetchContractDetails = createAsyncThunk(
  'contracts/fetchContractDetails',
  async ({ token, contractId }, thunkAPI) => {
    try {
      const res = await apiClient.get(`/contracts/${contractId}`, {
        headers: authHeaders(token),
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to load contract details.' });
    }
  }
);

export const submitMilestone = createAsyncThunk(
  'contracts/submitMilestone',
  async ({ token, contractId, milestoneId, payload }, thunkAPI) => {
    try {
      const res = await apiClient.patch(
        `/contracts/${contractId}/milestones/${milestoneId}/submit`,
        payload,
        { headers: authHeaders(token) }
      );
      return { contractId, milestone: res.data.milestone };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: 'Milestone submission failed.' });
    }
  }
);

export const approveMilestone = createAsyncThunk(
  'contracts/approveMilestone',
  async ({ token, contractId, milestoneId }, thunkAPI) => {
    try {
      const res = await apiClient.patch(
        `/contracts/${contractId}/milestones/${milestoneId}/approve`,
        {},
        { headers: authHeaders(token) }
      );
      return { contractId, result: res.data.result };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: 'Approval failed.' });
    }
  }
);

export const rejectMilestone = createAsyncThunk(
  'contracts/rejectMilestone',
  async ({ token, contractId, milestoneId, reason }, thunkAPI) => {
    try {
      const res = await apiClient.patch(
        `/contracts/${contractId}/milestones/${milestoneId}/reject`,
        { reason },
        { headers: authHeaders(token) }
      );
      return { contractId, milestone: res.data.milestone };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: 'Rejection failed.' });
    }
  }
);

const contractsSlice = createSlice({
  name: 'contracts',
  initialState: {
    list: [],
    current: null,
    escrow: null,
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    clearContractError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Unable to fetch contracts.';
      })
      .addCase(fetchContractDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.contract;
        state.escrow = action.payload.escrow;
      })
      .addCase(fetchContractDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Unable to fetch contract details.';
      })
      .addCase(submitMilestone.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(submitMilestone.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(submitMilestone.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message || 'Submission failed.';
      })
      .addCase(approveMilestone.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(approveMilestone.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(approveMilestone.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message || 'Approval failed.';
      })
      .addCase(rejectMilestone.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(rejectMilestone.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(rejectMilestone.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload?.message || 'Rejection failed.';
      });
  },
});

export const { clearContractError } = contractsSlice.actions;
export default contractsSlice.reducer;
