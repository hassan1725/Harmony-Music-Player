import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import { Layout } from './components/Layout';

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Layout />
    </I18nextProvider>
  );
}

