import React from 'react';
import { useAppSelector } from '../../App';
import { selectConnectionState } from '../../features/app/appSlice';

interface IconWrapperProps {
  isVisible: boolean;
  children: React.ReactNode;
}

/**
 * İkonları göstərmək/gizlətmək və keçid animasiyasını idarə etmək üçün köməkçi komponent.
 */
const IconWrapper: React.FC<IconWrapperProps> = ({ isVisible, children }) => {
  const classes = `
    absolute inset-0 flex items-center justify-center
    transition-all duration-200 ease-in-out
    ${isVisible ? 'opacity-100 scale-100 delay-200' : 'opacity-0 scale-50'}
  `;
  return <div className={classes}>{children}</div>;
};

const AnimatedStatusIcon = () => {
  const state = useAppSelector(selectConnectionState);
  const iconSize = 60;

  return (
    <div className="relative" style={{ width: iconSize, height: iconSize }}>
      {/* Power Icon (Disconnected) */}
      <IconWrapper isVisible={state === 'disconnected'}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0" className="stroke-gray-500" />
          <line x1="12" y1="2" x2="12" y2="12" className="stroke-gray-500" />
        </svg>
      </IconWrapper>

      {/* Spinner (Connecting) */}
      <IconWrapper isVisible={state === 'connecting'}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full animate-spin">
          <path d="M12 2a10 10 0 1 0 10 10" className="stroke-orange-500" strokeDasharray="60 30" />
        </svg>
      </IconWrapper>

      {/* Shield + Check (Connected) */}
      <IconWrapper isVisible={state === 'connected'}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full animate-glow-green">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="stroke-green-500 fill-green-500/20" />
          <path 
            d="m9 12 2 2 4-4" 
            className="stroke-white animate-draw-check"
            strokeDasharray={10}
            strokeDashoffset={10}
          />
        </svg>
      </IconWrapper>

      {/* Error 'X' */}
      <IconWrapper isVisible={state === 'error'}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <circle cx="12" cy="12" r="10" className="stroke-red-500" />
            <line x1="15" y1="9" x2="9" y2="15" className="stroke-red-500" />
            <line x1="9" y1="9" x2="15" y2="15" className="stroke-red-500" />
        </svg>
      </IconWrapper>
    </div>
  );
};

export default AnimatedStatusIcon;