import React from 'react';
import { Clock, Trash2, Copy } from 'lucide-react';
import { Translation } from '../types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface Props {
  translations: Translation[];
  onClear: () => void;
}

export const TranslationHistory: React.FC<Props> = ({ translations, onClear }) => {
  if (translations.length === 0) {
    return null;
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Translation History
        </h2>
        <button
          onClick={onClear}
          className="text-red-500 hover:text-red-600 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear History
        </button>
      </div>
      <div className="space-y-4">
        {translations.map((translation) => (
          <div
            key={translation.id}
            className="bg-white rounded-lg shadow-md p-4 space-y-2"
          >
            <p className="text-gray-600">{translation.prompt}</p>
            <div className="relative">
              <SyntaxHighlighter language="sql" style={docco}>
                {translation.sql}
              </SyntaxHighlighter>
              <button
                onClick={() => handleCopy(translation.sql)}
                className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-2 py-1 rounded-md flex items-center gap-1"
              >
                <Copy className="w-4 h-4" /> Copy
              </button>
            </div>
            <p className="text-sm text-gray-400">
              {new Date(translation.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
