import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../ui/Icon';

/**
 * Light/Dark tema dəyişdiricisini göstərir.
 */
export const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="absolute bottom-4 right-4 no-drag-region rounded-md px-2 py-1 text-xs font-bold transition-colors bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
      aria-label={isDark ? t('switchToLightMode') : t('switchToDarkMode')}
      title={isDark ? t('switchToLightMode') : t('switchToDarkMode')}
    >
      <span className="inline-flex items-center gap-1">
        <Icon name={isDark ? 'bx-sun' : 'bx-moon'} className="text-sm" />
        {isDark ? t('themeLight') : t('themeDark')}
      </span>
    </button>
  );
};

