import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../App';
import { resetApp, showModal } from '../../features/app/appSlice';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const ResetModal = ({ isOpen }: { isOpen: boolean }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleReset = () => {
    dispatch(resetApp());
  };

  const handleClose = () => {
    dispatch(showModal('none'));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('resetModalTitle')}>
      <p className="text-sm text-gray-400 mb-6">{t('resetModalMessage')}</p>
      <div className="flex gap-4">
        <Button variant="secondary" onClick={handleClose} className="flex-1">
          {t('cancelButton')}
        </Button>
        <Button variant="danger" onClick={handleReset} className="flex-1">
          {t('confirmResetButton')}
        </Button>
      </div>
    </Modal>
  );
};