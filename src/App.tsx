import { useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState, AppDispatch } from './store/store';
import {
  initializeApp,
  selectAppStatus,
  selectHasConfig,
  selectCurrentModal,
  setConnectionState,
  setAuthFailed,
} from './features/app/appSlice';

import MainPage from './pages/MainPage';
import SetupPage from './pages/SetupPage';
import { ResetModal } from './components/features/ResetModal';
import { AuthFailedModal } from './components/features/AuthFailedModal';
import { useTheme } from './hooks/useTheme';
import type { ConnectionState } from './types/ipc';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function App() {
  const { t } = useTranslation();
  useTheme();
  const dispatch = useAppDispatch();
  const appStatus = useAppSelector(selectAppStatus);
  const hasConfig = useAppSelector(selectHasConfig);
  const currentModal = useAppSelector(selectCurrentModal);

  useEffect(() => {
    dispatch(initializeApp());

    // Main prosesindən gələn hadisələri dinləyirik
    const unsubscribeVpnStatus = window.api.onVpnStatusChanged((status: ConnectionState) => {
      dispatch(setConnectionState(status));
    });

    const unsubscribeAuthFailed = window.api.onAuthFailed(() => {
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
      <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <h2 className="text-xl animate-pulse">{t('loading')}</h2>
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
