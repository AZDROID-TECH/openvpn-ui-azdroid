import { PropsWithChildren } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

/**
 * Tətbiqdə istifadə ediləcək ümumi modal komponenti.
 */
export const Modal = ({ isOpen, onClose, title, children }: PropsWithChildren<ModalProps>) => {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-11/12 max-w-sm rounded-lg border border-gray-300 bg-white/90 text-gray-900 p-6 text-center shadow-xl dark:border-white/10 dark:bg-gray-800/80 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()} // Modalın içərisinə kliklədikdə bağlanmasının qarşısını alır
      >
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        {children}
      </div>
    </div>
  );
};
