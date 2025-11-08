import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch } from '../../App';
import { showModal, resetApp } from '../../features/app/appSlice';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const passwordSchema = z.object({
  password: z.string().min(1, 'Şifrə boş ola bilməz'),
});
type PasswordForm = z.infer<typeof passwordSchema>;

export const AuthFailedModal = ({ isOpen }: { isOpen: boolean }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const handleClose = () => dispatch(showModal('none'));
  
  const handleRetry = (data: PasswordForm) => {
    // TODO: İstifadəçi adını mövcud konfiqurasiyadan almalıyıq.
    // Hələlik bu məntiq tam deyil.
    // dispatch(saveCredentialsAndConnect({ username: 'TODO', password: data.password }));
    console.log("Retry with new password", data.password);
    handleClose();
  };

  const handleReset = () => {
    dispatch(resetApp());
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('authFailedTitle')}>
      <p className="text-sm text-gray-400 mb-4">{t('authFailedMessage')}</p>
      <form onSubmit={handleSubmit(handleRetry)} className="flex flex-col gap-4">
        <Input
          type="password"
          placeholder={t('newPasswordPlaceholder')}
          {...register('password')}
        />
        {errors.password && <p className="text-red-500 text-xs mt-1 text-left">{errors.password.message}</p>}
        <div className="flex gap-2">
            <Button variant="secondary" type="button" onClick={handleClose} className="flex-1">
                {t('cancelButton')}
            </Button>
            <Button variant="primary" type="submit" className="flex-1">
                {t('retryButton')}
            </Button>
        </div>
        <Button variant="danger" type="button" onClick={handleReset} className="w-full">
            {t('resetAppButton')}
        </Button>
      </form>
    </Modal>
  );
};