import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/store';
import { Credentials } from '../../types/credentials';

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

interface AppState {
  status: 'loading' | 'ready';
  hasConfig: boolean;
  connectionState: ConnectionState;
  modal: 'none' | 'reset' | 'auth-failed';
}

const initialState: AppState = {
  status: 'loading',
  hasConfig: false,
  connectionState: 'disconnected',
  modal: 'none',
};

// == Async Thunks ==
export const initializeApp = createAsyncThunk('app/initializeApp', async () => {
  const { hasConfig } = await window.api.invoke('get-initial-config');
  return hasConfig;
});

export const selectFile = createAsyncThunk('app/selectFile', async () => {
  const fileSelected = await window.api.invoke('open-file-dialog');
  return fileSelected;
});

export const saveCredentialsAndConnect = createAsyncThunk('app/saveCredentials', async (credentials: Credentials) => {
  await window.api.invoke('save-credentials', credentials);
  window.api.send('connect-vpn');
  // Bu thunk-ın uğurlu olduğunu bildirmək üçün true qaytarırıq.
  return true;
});

export const connectVpn = createAsyncThunk('app/connectVpn', async () => {
  window.api.send('connect-vpn');
});

export const disconnectVpn = createAsyncThunk('app/disconnectVpn', async () => {
  window.api.send('disconnect-vpn');
});

export const resetApp = createAsyncThunk('app/resetApp', async () => {
    await window.api.invoke('reset-app');
});


export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setConnectionState: (state, action: PayloadAction<ConnectionState>) => {
      state.connectionState = action.payload;
    },
    showModal: (state, action: PayloadAction<AppState['modal']>) => {
        state.modal = action.payload;
    },
    setAuthFailed: (state) => {
        state.connectionState = 'disconnected';
        state.modal = 'auth-failed';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeApp.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.hasConfig = action.payload;
        state.status = 'ready';
      })
      .addCase(resetApp.fulfilled, (state) => {
        state.hasConfig = false;
        state.connectionState = 'disconnected';
        state.modal = 'none';
      })
      .addCase(saveCredentialsAndConnect.fulfilled, (state, action) => {
        if (action.payload) {
            state.hasConfig = true;
        }
      });
  },
});

export const { setConnectionState, showModal, setAuthFailed } = appSlice.actions;

export const selectAppStatus = (state: RootState) => state.app.status;
export const selectHasConfig = (state: RootState) => state.app.hasConfig;
export const selectConnectionState = (state: RootState) => state.app.connectionState;
export const selectCurrentModal = (state: RootState) => state.app.modal;

export default appSlice.reducer;