
import { Icon } from '../ui/Icon';

/**
 * Pəncərəni idarə etmək üçün düymələri (kiçilt, bağla) render edir.
 */
export const WindowControls = () => {
  const handleMinimize = () => window.api.send('minimize-app');
  const handleClose = () => window.api.send('quit-app');

  return (
    <div className="absolute top-4 right-4 flex gap-2 no-drag-region">
      <button onClick={handleMinimize} className="p-1 text-gray-400 hover:text-white transition-colors">
        <Icon name="bx-minus" className="text-lg" />
      </button>
      <button onClick={handleClose} className="p-1 text-gray-400 hover:text-white transition-colors">
        <Icon name="bx-x" className="text-lg" />
      </button>
    </div>
  );
};
