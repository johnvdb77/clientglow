'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HelpPage() {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('clientglow_locale') || 'en';
    setLocale(savedLocale);
  }, []);

  const content = {
    en: {
      title: 'Getting Started',
      subtitle: 'Learn how to use ClientGlow to manage your customers',
      backToDashboard: '← Back to Dashboard',
      sections: [
        {
          icon: '📊',
          title: 'Dashboard Overview',
          description: 'When you log in, you see your main dashboard with:',
          items: [
            'Statistics: Total revenue, monthly sales, customer count, and your top customer',
            'Birthday reminders: Upcoming customer birthdays',
            'Reorder reminders: Customers who might need to reorder soon',
            'Customer list: All your customers with search and filter options'
          ]
        },
        {
          icon: '👤',
          title: 'Adding Customers',
          description: 'To add a new customer:',
          items: [
            'Click the "+ Add Customer" button',
            'Fill in their details (name and email are required)',
            'Add optional info: phone, birthday, address, preferences',
            'Select tags to organize them (VIP, New, Active, etc.)',
            'Click "Add Customer" to save'
          ]
        },
        {
          icon: '🏷️',
          title: 'Using Tags',
          description: 'Tags help you organize and filter customers:',
          items: [
            'VIP: Your most valuable customers',
            'New: Recently added customers',
            'Active: Customers who order regularly',
            'Inactive: Customers who haven\'t ordered in a while',
            'Potential: Leads who might become customers',
            'Use the filter buttons above the customer list to show specific tags'
          ]
        },
        {
          icon: '📦',
          title: 'Tracking Orders',
          description: 'To add an order for a customer:',
          items: [
            'Click on a customer to open their details',
            'Click "+ Add Order"',
            'Add products: enter name, quantity, and price',
            'Click "+ Add" for each product',
            'Set the order date and payment status',
            'Add notes if needed (discounts, samples, etc.)',
            'Click "Add Order" to save'
          ]
        },
        {
          icon: '🎂',
          title: 'Birthday Reminders',
          description: 'Never miss a customer\'s birthday:',
          items: [
            'Add birthday dates when creating customers',
            'The dashboard shows upcoming birthdays (next 30 days)',
            'Birthdays today are highlighted',
            'Use the quick email templates to send birthday wishes'
          ]
        },
        {
          icon: '🔔',
          title: 'Reorder Reminders',
          description: 'Know when customers might need to reorder:',
          items: [
            'Customers appear here when it\'s been a while since their last order',
            'Color coding shows urgency (green, yellow, red)',
            'Click "Snooze" to hide a reminder temporarily',
            'Use this to proactively reach out to customers'
          ]
        },
        {
          icon: '📧',
          title: 'Email Templates',
          description: 'Send quick, personalized emails:',
          items: [
            'Click on a customer, then click "Send Email"',
            'Choose a template: Birthday, Reorder, Thank You, or Check-in',
            'The customer\'s name is automatically filled in',
            'Click "Copy" to copy to clipboard, or "Send" to open your email app',
            'Visit the Templates page for more options'
          ]
        },
        {
          icon: '🌍',
          title: 'Language Settings',
          description: 'Switch between English and Dutch:',
          items: [
            'Find the EN/NL toggle in the top navigation',
            'Click "EN" for English or "NL" for Dutch',
            'The entire app will switch to your chosen language',
            'Your preference is saved automatically'
          ]
        }
      ]
    },
    nl: {
      title: 'Aan de slag',
      subtitle: 'Leer hoe je ClientGlow gebruikt om je klanten te beheren',
      backToDashboard: '← Terug naar Dashboard',
      sections: [
        {
          icon: '📊',
          title: 'Dashboard Overzicht',
          description: 'Wanneer je inlogt, zie je je hoofddashboard met:',
          items: [
            'Statistieken: Totale omzet, maandelijkse verkoop, aantal klanten en je topklant',
            'Verjaardagsherinneringen: Aankomende verjaardagen van klanten',
            'Herbestelherinneringen: Klanten die mogelijk binnenkort moeten herbestellen',
            'Klantenlijst: Al je klanten met zoek- en filteropties'
          ]
        },
        {
          icon: '👤',
          title: 'Klanten Toevoegen',
          description: 'Om een nieuwe klant toe te voegen:',
          items: [
            'Klik op de "+ Klant Toevoegen" knop',
            'Vul de gegevens in (naam en email zijn verplicht)',
            'Voeg optionele info toe: telefoon, verjaardag, adres, voorkeuren',
            'Selecteer labels om te organiseren (VIP, Nieuw, Actief, etc.)',
            'Klik op "Klant Toevoegen" om op te slaan'
          ]
        },
        {
          icon: '🏷️',
          title: 'Labels Gebruiken',
          description: 'Labels helpen je klanten te organiseren en filteren:',
          items: [
            'VIP: Je meest waardevolle klanten',
            'Nieuw: Recent toegevoegde klanten',
            'Actief: Klanten die regelmatig bestellen',
            'Inactief: Klanten die een tijdje niet hebben besteld',
            'Potentieel: Leads die klant kunnen worden',
            'Gebruik de filterknoppen boven de klantenlijst om specifieke labels te tonen'
          ]
        },
        {
          icon: '📦',
          title: 'Bestellingen Bijhouden',
          description: 'Om een bestelling voor een klant toe te voegen:',
          items: [
            'Klik op een klant om de details te openen',
            'Klik op "+ Bestelling Toevoegen"',
            'Voeg producten toe: vul naam, aantal en prijs in',
            'Klik op "+ Toevoegen" voor elk product',
            'Stel de besteldatum en betaalstatus in',
            'Voeg notities toe indien nodig (kortingen, samples, etc.)',
            'Klik op "Bestelling Toevoegen" om op te slaan'
          ]
        },
        {
          icon: '🎂',
          title: 'Verjaardagsherinneringen',
          description: 'Mis nooit meer een verjaardag van een klant:',
          items: [
            'Voeg verjaardagen toe bij het aanmaken van klanten',
            'Het dashboard toont aankomende verjaardagen (komende 30 dagen)',
            'Verjaardagen van vandaag worden gemarkeerd',
            'Gebruik de snelle email templates om verjaardagswensen te sturen'
          ]
        },
        {
          icon: '🔔',
          title: 'Herbestelherinneringen',
          description: 'Weet wanneer klanten mogelijk moeten herbestellen:',
          items: [
            'Klanten verschijnen hier wanneer het een tijdje geleden is sinds hun laatste bestelling',
            'Kleurcodering toont urgentie (groen, geel, rood)',
            'Klik op "Snooze" om een herinnering tijdelijk te verbergen',
            'Gebruik dit om proactief contact op te nemen met klanten'
          ]
        },
        {
          icon: '📧',
          title: 'Email Templates',
          description: 'Stuur snel gepersonaliseerde emails:',
          items: [
            'Klik op een klant, klik dan op "Email Versturen"',
            'Kies een template: Verjaardag, Herbestelling, Bedankt, of Check-in',
            'De naam van de klant wordt automatisch ingevuld',
            'Klik op "Kopiëren" om naar klembord te kopiëren, of "Versturen" om je email app te openen',
            'Bezoek de Templates pagina voor meer opties'
          ]
        },
        {
          icon: '🌍',
          title: 'Taalinstellingen',
          description: 'Wissel tussen Engels en Nederlands:',
          items: [
            'Vind de EN/NL schakelaar in de navigatie bovenaan',
            'Klik op "EN" voor Engels of "NL" voor Nederlands',
            'De hele app schakelt over naar je gekozen taal',
            'Je voorkeur wordt automatisch opgeslagen'
          ]
        }
      ]
    }
  };

  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            {t.backToDashboard}
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <img 
              src="/logo.png" 
              alt="ClientGlow" 
              className="h-16 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>

          <div className="space-y-8">
            {t.sections.map((section, index) => (
              <div key={index} className="border-b border-gray-100 pb-8 last:border-0">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{section.icon}</span>
                  <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                </div>
                <p className="text-gray-600 mb-3">{section.description}</p>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-gray-700">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/dashboard" 
            className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
          >
            {t.backToDashboard}
          </Link>
        </div>
      </div>
    </div>
  );
}