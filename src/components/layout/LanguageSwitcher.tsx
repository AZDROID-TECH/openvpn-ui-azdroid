import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: 'az' | 'en') => {
    i18n.changeLanguage(lng);
  };

  const langButtonClass = (lang: 'az' | 'en') => 
    `font-bold text-xs px-2 py-1 rounded-md transition-colors ${
      i18n.language === lang 
        ? 'bg-orange-600 text-white' 
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`;

  return (
    <div className="absolute bottom-4 left-4 flex gap-2 no-drag-region">
      <button onClick={() => changeLanguage('az')} className={langButtonClass('az')}>
        AZ
      </button>
      <button onClick={() => changeLanguage('en')} className={langButtonClass('en')}>
        EN
      </button>
    </div>
  );
};