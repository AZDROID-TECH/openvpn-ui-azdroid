import { useTranslation } from 'react-i18next';
import { Icon } from '../components/ui/Icon';
import { useAppDispatch, useAppSelector } from '../App';
import { selectConnectionState, showModal } from '../features/app/appSlice';
import { WindowControls } from '../components/layout/WindowControls';
import { ConnectionRing } from '../components/features/ConnectionRing';
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher';

/**
 * Əsas tətbiq ekranı. Konfiqurasiya mövcud olduqda göstərilir.
 */
const MainPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const connectionState = useAppSelector(selectConnectionState);

  const handleResetClick = () => {
    dispatch(showModal('reset'));
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-900 text-white overflow-hidden drag-region">
      {/* Arxa fon üçün bulanıq effekt */}
      <div className="absolute w-48 h-48 bg-gradient-to-r from-orange-500 to-gray-800 rounded-full blur-3xl opacity-50" />
      
      <div className="relative w-[380px] h-[580px] bg-gray-800/60 backdrop-blur-md border border-white/10 flex flex-col justify-between items-center p-6 text-center">
        <WindowControls />
        <LanguageSwitcher />

        <header className="flex flex-col items-center gap-2 pt-8">
          <Icon name="bxs-lock-open" className="text-7xl text-orange-500" />
          <div className="text-center">
            <h1 className="text-xl font-bold opacity-90">{t('appName')}</h1>
            <p className="text-xs text-gray-400 opacity-70">{t('fromAzdroid')}</p>
          </div>
        </header>

        <main className="flex flex-col items-center gap-4">
          <ConnectionRing />
          <div id="status-text" className="font-medium text-gray-300 h-6">
            {t(`status.${connectionState}`)}
          </div>
        </main>

        <footer className="pb-2">
          <button onClick={handleResetClick} className="p-2 text-gray-500 hover:text-white transition-colors no-drag-region">
            <Icon name="bx-reset" className="text-2xl" />
          </button>
        </footer>
      </div>
    </div>
  );
};

export default MainPage;