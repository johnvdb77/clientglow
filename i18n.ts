import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // For now, we'll detect language from localStorage in the client
  // This is a simplified setup for client-side only
  const locale = 'en'; // Default
  
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});