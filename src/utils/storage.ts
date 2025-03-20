import { Translation, TranslationHistory } from '../types';

const STORAGE_KEY = 'sql_translator_history';

export const saveTranslation = (translation: Translation) => {
  const history = getHistory();
  history.translations.unshift(translation);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const getHistory = (): TranslationHistory => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { translations: [] };
  }
  return JSON.parse(stored);
};

export const clearHistory = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ translations: [] }));
};