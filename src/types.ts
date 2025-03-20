export interface Translation {
  id: string;
  prompt: string;
  sql: string;
  timestamp: number;
}

export interface TranslationHistory {
  translations: Translation[];
}