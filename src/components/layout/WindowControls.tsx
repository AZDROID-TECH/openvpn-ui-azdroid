
import { Icon } from '../ui/Icon';

/**
 * Pəncərəni idarə etmək üçün düymələri (kiçilt, bağla) render edir.
 */
export const WindowControls = () => {
  const handleMinimize = () => window.api.minimizeWindow();
  const handleClose = () => window.api.closeToTray();

  return (
    <div className="absolute top-4 right-4 flex gap-2 no-drag-region">
      <button onClick={handleMinimize} className="p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
        <Icon name="bx-minus" className="text-lg" />
      </button>
      <button onClick={handleClose} className="p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
        <Icon name="bx-x" className="text-lg" />
      </button>
    </div>
  );
};
