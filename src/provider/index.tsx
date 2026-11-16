'use client';

import React from 'react';
import { useMemo } from 'react';

import { NextIntlClientProvider } from 'next-intl';
import NextTopLoader from 'nextjs-toploader';

import { enUS, idID, zhCN } from '@mui/material/locale';
import { createTheme } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import {
  enUS as dataGridEnUS,
  idID as dataGridIdID,
  zhCN as dataGridZhCN,
} from '@mui/x-data-grid/locales';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { ThemeProvider } from '@emotion/react';
import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react';
import { ToastContainer } from 'react-toastify';

import MuiTheme from '@/lib/mui/theme';
import { useLocaleStore } from '@/lib/zustand/locale.store';
import { translations } from '@/locales';

import ReactQueryProvider from './ReactQueryProvider';

const ToastIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'info':
      return <Info />;
    case 'error':
      return <CircleX />;
    case 'success':
      return <CircleCheck />;
    case 'warning':
      return <TriangleAlert />;
    default:
      return null;
  }
};

const sanitizeMessagesForNextIntl = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeMessagesForNextIntl);
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const cleanKey = key.includes('.') ? key.replace(/\./gu, '') : key;

    result[cleanKey] = typeof value === 'object' ? sanitizeMessagesForNextIntl(value) : value;
  }
  return result;
};

const MUI_LOCALES: Record<string, any> = {
  zh: zhCN,
  id: idID,
  en: enUS,
};

const GRID_LOCALES: Record<string, any> = {
  zh: dataGridZhCN,
  id: dataGridIdID,
  en: dataGridEnUS,
};

const ADAPTER_LOCALES: Record<string, string> = {
  zh: 'zh-cn',
  id: 'id',
  en: 'en',
};

const Providers = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { locale } = useLocaleStore();

  const messages = useMemo(() => {
    const raw = translations[locale] || translations.en;

    return sanitizeMessagesForNextIntl(raw);
  }, [locale]);

  const theme = useMemo(() => {
    const muiLocale = MUI_LOCALES[locale] || enUS;
    const gridLocale = GRID_LOCALES[locale] || dataGridEnUS;

    return createTheme(MuiTheme as any, muiLocale, gridLocale);
  }, [locale]);

  return (
    <>
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ThemeProvider theme={theme}>
          <ReactQueryProvider>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={ADAPTER_LOCALES[locale] || 'en'}
            >
              <NextIntlClientProvider locale={locale} messages={messages}>
                <NextTopLoader zIndex={9999} color={MuiTheme.palette.primary.main} height={5} />
                {children}
              </NextIntlClientProvider>
            </LocalizationProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
      <ToastContainer
        pauseOnFocusLoss={false}
        position="top-right"
        autoClose={4500}
        icon={ToastIcon}
        theme="colored"
        hideProgressBar={false}
      />
    </>
  );
};

export default Providers;
