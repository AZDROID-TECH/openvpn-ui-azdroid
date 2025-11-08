
import { useAppDispatch, useAppSelector } from '../../App';
import { selectConnectionState, connectVpn, disconnectVpn } from '../../features/app/appSlice';
import { cva } from 'class-variance-authority';
import AnimatedStatusIcon from './AnimatedStatusIcon';

// Halqa üçün variantlar
const ringVariants = cva('w-48 h-48 rounded-full border-8 flex items-center justify-center transition-colors duration-500', {
  variants: {
    state: {
      disconnected: 'border-gray-700',
      connecting: 'border-orange-500 animate-spin',
      connected: 'border-green-500',
      error: 'border-red-500',
    },
  },
});

// Mərkəzdəki düymə üçün variantlar
const buttonVariants = cva('w-40 h-40 rounded-full bg-gray-800 shadow-lg active:scale-95 transition-transform flex items-center justify-center no-drag-region');

export const ConnectionRing = () => {
  const dispatch = useAppDispatch();
  const connectionState = useAppSelector(selectConnectionState);

  const handleClick = () => {
    if (connectionState === 'disconnected' || connectionState === 'error') {
      dispatch(connectVpn());
    } else if (connectionState === 'connected') {
      dispatch(disconnectVpn());
    }
  };

  return (
    <div className={ringVariants({ state: connectionState })}>
      <button 
        className={buttonVariants()}
        onClick={handleClick}
        disabled={connectionState === 'connecting'}
      >
        <AnimatedStatusIcon />
      </button>
    </div>
  );
};
