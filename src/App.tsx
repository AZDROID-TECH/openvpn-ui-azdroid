import { useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store/store';
import { 
  initializeApp, 
  selectAppStatus, 
  selectHasConfig, 
  selectCurrentModal,
  setConnectionState,
  setAuthFailed,
  ConnectionState
} from './features/app/appSlice';

import MainPage from './pages/MainPage';
import SetupPage from './pages/SetupPage';
import { ResetModal } from './components/features/ResetModal';
import { AuthFailedModal } from './components/features/AuthFailedModal';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function App() {
  const dispatch = useAppDispatch();
  const appStatus = useAppSelector(selectAppStatus);
  const hasConfig = useAppSelector(selectHasConfig);
  const currentModal = useAppSelector(selectCurrentModal);

  useEffect(() => {
    dispatch(initializeApp());

    // Main prosesdən gələn hadisələri dinləyirik
    const unsubscribeVpnStatus = window.api.on('vpn-status-changed', (status: ConnectionState) => {
      dispatch(setConnectionState(status));
    });

    const unsubscribeAuthFailed = window.api.on('auth-failed', () => {
      dispatch(setAuthFailed());
    });

    // Komponent unmount olduqda listener-ləri təmizləyirik
    return () => {
      unsubscribeVpnStatus();
      unsubscribeAuthFailed();
    };
  }, [dispatch]);

  if (appStatus === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <h2 className="text-xl animate-pulse">Yüklənir...</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      {hasConfig ? <MainPage /> : <SetupPage />}
      
      {/* Modalları render edirik */}
      <ResetModal isOpen={currentModal === 'reset'} />
      <AuthFailedModal isOpen={currentModal === 'auth-failed'} />
    </div>
  );
}

export default App;