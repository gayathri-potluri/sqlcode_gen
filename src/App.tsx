import React, { useState, useEffect } from 'react';
import { Translation } from './types';
import { saveTranslation, getHistory, clearHistory } from './utils/storage';
import { TranslationHistory } from './components/TranslationHistory';
import { Database, Loader2 } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import './App.css'; 

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Translation[]>([]);

  useEffect(() => {
    setHistory(getHistory().translations);
  }, []);

  const handleTranslate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Convert the following English text to a SQL query. Only return the SQL query without any explanation: "${prompt}"`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const sql = data.candidates[0].content.parts[0].text;
      const translation: Translation = {
        id: Date.now().toString(),
        prompt,
        sql,
        timestamp: Date.now(),
      };
      saveTranslation(translation);
      setHistory([translation, ...history]);
      setResult(sql);
    } catch (error) {
      console.error('Translation error:', error);
      setResult('Error generating SQL query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 animate-bg-move opacity-30"></div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Database className="w-8 h-8 text-blue-500" />
            SQL CODE GENERATOR
          </h1>
          <p className="mt-2 text-gray-600">
            Convert English to SQL queries using AI.
          </p>
          <p className="mt-2 text-gray-600">
          Enter a simple request in plain English, and the AI will generate the perfect SQL query for you!
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your query in English"
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleTranslate}
              disabled={loading || !prompt.trim()}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Translating...
                </>
              ) : (
                'Translate to SQL'
              )}
            </button>
          </div>
          {result && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Generated SQL:</h2>
              <SyntaxHighlighter language="sql" style={docco}>
                {result}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
        <TranslationHistory translations={history} onClear={handleClearHistory} />
      </div>
      <footer className="text-center text-gray-600 mt-8 py-800">
        <p>Created by <a href="https://github.com/gayathri-potluri" className="text-blue-500 hover:underline">Gayathri</a></p>
      </footer>
    </div>
  );
}
export default App;
