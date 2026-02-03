'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode, useState, useEffect } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [locale, setLocale] = useState('en');
  const [messages, setMessages] = useState<any>(null);

  useEffect(() => {
    // Get saved language or default to English
    const savedLocale = localStorage.getItem('clientglow_locale') || 'en';
    setLocale(savedLocale);
    
    // Load messages
    import(`../messages/${savedLocale}.json`).then((msgs) => {
      setMessages(msgs.default);
    });
  }, []);

  if (!messages) return null;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}