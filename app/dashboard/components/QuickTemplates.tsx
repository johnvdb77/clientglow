'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

interface QuickTemplatesProps {
  customer: any;
  isOpen: boolean;
}

const QUICK_TEMPLATES_EN = [
  {
    id: 'birthday',
    subject: 'Happy Birthday {{name}}! 🎉',
    body: `Dear {{name}},

Happy Birthday! 🎂

I hope you have a wonderful day filled with joy and happiness. To celebrate, I'd love to offer you a special birthday discount on your next order.

Thank you for being such a valued customer!

Warm wishes,
[Your Name]`,
  },
  {
    id: 'reorder',
    subject: 'Time for a refill, {{name}}?',
    body: `Hi {{name}},

I noticed it's been a while since your last order. You might be running low soon!

Would you like me to set aside your usual order? Just let me know and I'll make sure you don't run out.

Looking forward to hearing from you!

Best regards,
[Your Name]`,
  },
  {
    id: 'thankyou',
    subject: 'Thank you {{name}}!',
    body: `Dear {{name}},

Thank you so much for your continued support! I really appreciate having you as a customer.

If you ever need anything or have questions, please don't hesitate to reach out.

With gratitude,
[Your Name]`,
  },
  {
    id: 'checkin',
    subject: 'Just checking in, {{name}}',
    body: `Hi {{name}},

I wanted to reach out and see how you're doing! It's been a little while since we last connected.

Is there anything I can help you with? Any products you'd like to try or questions I can answer?

Looking forward to hearing from you!

Best,
[Your Name]`,
  },
];

const QUICK_TEMPLATES_NL = [
  {
    id: 'birthday',
    subject: 'Gefeliciteerd {{name}}! 🎉',
    body: `Beste {{name}},

Van harte gefeliciteerd met je verjaardag! 🎂

Ik hoop dat je een geweldige dag hebt vol vreugde en geluk. Om dit te vieren, wil ik je graag een speciale verjaardagskorting aanbieden op je volgende bestelling.

Bedankt dat je zo'n geweldige klant bent!

Hartelijke groeten,
[Jouw Naam]`,
  },
  {
    id: 'reorder',
    subject: 'Tijd voor een nieuwe bestelling, {{name}}?',
    body: `Hoi {{name}},

Het is alweer even geleden sinds je laatste bestelling. Misschien ben je binnenkort door je voorraad heen!

Zal ik je gebruikelijke bestelling voor je reserveren? Laat het me weten, dan zorg ik ervoor dat je niet zonder komt te zitten.

Ik hoor graag van je!

Vriendelijke groeten,
[Jouw Naam]`,
  },
  {
    id: 'thankyou',
    subject: 'Bedankt {{name}}!',
    body: `Beste {{name}},

Hartelijk dank voor je blijvende steun! Ik waardeer het enorm dat je klant bij mij bent.

Als je ooit iets nodig hebt of vragen hebt, aarzel dan niet om contact op te nemen.

Met dank,
[Jouw Naam]`,
  },
  {
    id: 'checkin',
    subject: 'Even bijpraten, {{name}}',
    body: `Hoi {{name}},

Ik wilde even contact met je opnemen om te horen hoe het met je gaat! Het is alweer een tijdje geleden dat we elkaar spraken.

Kan ik ergens mee helpen? Zijn er producten die je graag zou willen proberen of vragen die ik kan beantwoorden?

Ik hoor graag van je!

Groetjes,
[Jouw Naam]`,
  },
];

export default function QuickTemplates({ customer, isOpen }: QuickTemplatesProps) {
  const t = useTranslations();
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('clientglow_locale') || 'en';
    setLocale(savedLocale);
  }, []);
  
  if (!isOpen) return null;

  const QUICK_TEMPLATES = locale === 'nl' ? QUICK_TEMPLATES_NL : QUICK_TEMPLATES_EN;

  const fillTemplate = (text: string) => {
    return text.replace(/{{name}}/g, customer.name);
  };

  const copyTemplate = (template: typeof QUICK_TEMPLATES[0]) => {
    const subject = fillTemplate(template.subject);
    const body = fillTemplate(template.body);
    const fullText = `Subject: ${subject}\n\n${body}`;
    
    navigator.clipboard.writeText(fullText);
    alert('Email copied to clipboard!');
  };

  const openInEmail = (template: typeof QUICK_TEMPLATES[0]) => {
    const subject = fillTemplate(template.subject);
    const body = fillTemplate(template.body);
    const mailto = `mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-semibold text-gray-900 mb-3">{t('emailTemplates.quickTemplates')}</h4>
      <div className="grid grid-cols-2 gap-2">
        {QUICK_TEMPLATES.map((template) => (
          <div key={template.id} className="border rounded-lg p-3 hover:bg-gray-50">
            <p className="font-medium text-sm text-gray-900 mb-2">{t(`emailTemplates.${template.id}`)}</p>
            <div className="flex gap-2">
              <button
                onClick={() => copyTemplate(template)}
                className="flex-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200"
              >
                {t('emailTemplates.copy')}
              </button>
              <button
                onClick={() => openInEmail(template)}
                className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
              >
                {t('emailTemplates.send')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}