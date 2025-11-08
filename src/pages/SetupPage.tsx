import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Icon } from '../components/ui/Icon';
import { useAppDispatch } from '../App';
import { selectFile, saveCredentialsAndConnect } from '../features/app/appSlice';
import { LanguageSwitcher } from '../components/layout/LanguageSwitcher';
import { WindowControls } from '../components/layout/WindowControls';
import appIcon from '../../build/icons/512x512.png'; // DÜZƏLİŞ: İkonun yeni və düzgün yolu

const credentialsSchema = z.object({
  username: z.string().min(1, 'İstifadəçi adı boş ola bilməz'),
  password: z.string().min(1, 'Şifrə boş ola bilməz'),
});

type CredentialsForm = z.infer<typeof credentialsSchema>;

const SetupPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<'selectFile' | 'credentials' | 'animating'>('selectFile');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CredentialsForm>({
    resolver: zodResolver(credentialsSchema),
  });

  const handleFileSelect = async () => {
    const result = await dispatch(selectFile()).unwrap();
    if (result) {
      setStep('animating');
      setTimeout(() => setStep('credentials'), 400); // Animasiya müddəti qədər gözlə
    }
  };

  const onSubmit = (data: CredentialsForm) => {
    dispatch(saveCredentialsAndConnect(data));
  };

  const getStep1Classes = () => {
    if (step === 'selectFile') return 'animate-fade-in-up';
    if (step === 'animating') return 'animate-fade-out-up';
    return 'hidden';
  };

  const getStep2Classes = () => {
    if (step === 'credentials') return 'animate-fade-in-up';
    return 'hidden';
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center text-center p-8 bg-gradient-to-b from-gray-800 to-gray-900 text-white drag-region relative">
      <WindowControls />
      <LanguageSwitcher />
      <div className="flex-grow flex items-center justify-center w-full">
        <div className="w-full max-w-sm">
          {/* Addım 1: Fayl seçimi */}
          <div className={`flex flex-col items-center gap-8 ${getStep1Classes()}`}>
            <img 
              src={appIcon} 
              alt="OpenVPN Logo" 
              className="w-24 h-24 animate-float filter drop-shadow-[0_5px_15px_rgba(234,126,35,0.3)]"
            />
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                {t('welcomeTitle')}
              </h2>
              <p className="text-sm text-gray-400 max-w-xs mx-auto">{t('welcomeMessage')}</p>
            </div>
            <Button onClick={handleFileSelect} className="w-full no-drag-region" size="lg">
              <Icon name="bxs-folder-open" className="mr-2 text-xl" />
              {t('selectFileButton')}
            </Button>
          </div>

          {/* Addım 2: Məlumatların daxil edilməsi */}
          <div className={`flex flex-col gap-6 ${getStep2Classes()}`}>
            <h3 className="text-xl font-semibold">{t('credentialsTitle')}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className='w-full'>
                <Input
                  id="username"
                  type="text"
                  placeholder={t('usernamePlaceholder')}
                  {...register('username')}
                  disabled={isSubmitting}
                  className="no-drag-region"
                />
                {errors.username && <p className="text-red-500 text-xs mt-1 text-left">{errors.username.message}</p>}
              </div>
              <div className='w-full'>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('passwordPlaceholder')}
                  {...register('password')}
                  disabled={isSubmitting}
                  className="no-drag-region"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1 text-left">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full no-drag-region" size="lg" disabled={isSubmitting}>
                {isSubmitting ? t('status.connecting') : t('saveAndConnectButton')}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <footer className="w-full text-center pb-2 no-drag-region">
        <a href="https://azdroid.tech" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-orange-500 transition-colors">
          {t('createdBy')}
        </a>
      </footer>
    </div>
  );
};

export default SetupPage;
