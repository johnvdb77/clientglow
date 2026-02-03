'use client';

import { useState, useEffect } from 'react';

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('clientglow_locale') || 'en';
    setLocale(savedLocale);
  }, []);

  const switchLanguage = (newLocale: string) => {
    localStorage.setItem('clientglow_locale', newLocale);
    setLocale(newLocale);
    window.location.reload(); // Reload to apply new language
  };

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border px-2 py-1">
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition ${
          locale === 'en' 
            ? 'bg-purple-600 text-white' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage('nl')}
        className={`px-3 py-1 rounded text-sm font-medium transition ${
          locale === 'nl' 
            ? 'bg-purple-600 text-white' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        NL
      </button>
    </div>
  );
}