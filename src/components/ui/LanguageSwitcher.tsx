'use client';

import React, { useState } from 'react';

import { Button, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';

import { Check, Globe } from 'lucide-react';

import { useTranslation } from '@/lib/hooks/useTranslation';

interface LanguageSwitcherProps {
  variant?: 'header' | 'compact' | 'outlined';
  className?: string;
}

const LOCALE_LABELS: Record<string, string> = {
  zh: '中文',
  id: 'ID',
  en: 'EN',
};

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { locale, setLocale } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (newLocale: 'en' | 'zh' | 'id') => {
    setLocale(newLocale);
    handleClose();
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <Button
        variant={variant === 'outlined' ? 'outlined' : 'text'}
        color="inherit"
        onClick={handleClick}
        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all duration-200 hover:bg-gray-100"
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Globe size={18} className="text-gray-600" />
        <span className="text-xs font-semibold tracking-wider text-gray-800 uppercase">
          {LOCALE_LABELS[locale] || 'EN'}
        </span>
      </Button>

      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              mt: 1,
              minWidth: 160,
              borderRadius: 2,
              p: 0.5,
              border: '1px solid #e5e7eb',
            },
          },
        }}
      >
        <MenuItem
          onClick={() => handleSelect('id')}
          selected={locale === 'id'}
          className="my-0.5 rounded-md"
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            <span className="text-base">🇮🇩</span>
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" className={locale === 'id' ? 'font-semibold' : ''}>
              Bahasa Indonesia
            </Typography>
          </ListItemText>
          {locale === 'id' && <Check size={16} className="text-primary-500 ml-2" />}
        </MenuItem>

        <MenuItem
          onClick={() => handleSelect('en')}
          selected={locale === 'en'}
          className="my-0.5 rounded-md"
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            <span className="text-base">🇬🇧</span>
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" className={locale === 'en' ? 'font-semibold' : ''}>
              English
            </Typography>
          </ListItemText>
          {locale === 'en' && <Check size={16} className="text-primary-500 ml-2" />}
        </MenuItem>

        <MenuItem
          onClick={() => handleSelect('zh')}
          selected={locale === 'zh'}
          className="my-0.5 rounded-md"
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            <span className="text-base">🇨🇳</span>
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" className={locale === 'zh' ? 'font-semibold' : ''}>
              简体中文
            </Typography>
          </ListItemText>
          {locale === 'zh' && <Check size={16} className="text-primary-500 ml-2" />}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default LanguageSwitcher;
