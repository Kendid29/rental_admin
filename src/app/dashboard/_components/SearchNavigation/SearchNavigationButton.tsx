import { useEffect, useState } from 'react';

import { Button, Typography } from '@mui/material';

import { Command, Search } from 'lucide-react';
import { useTranslation } from '@/lib/hooks/useTranslation';

import SearchNavigation from '.';

const SearchNavigationButton = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <Button
        startIcon={<Search size={'1rem'} />}
        endIcon={
          <div className="ml-12 flex items-center gap-1 text-sm">
            <kbd>
              <Command size={'0.8rem'} />
            </kbd>
            <Typography className="text-sm">+</Typography>
            <kbd className="mt-0.5">K</kbd>
          </div>
        }
        size="small"
        className="hidden rounded-lg bg-white! text-base md:flex"
        variant="outlined"
        color="gray"
        onClick={() => setOpen(true)}
      >
        {t.common.search}...
      </Button>
      <SearchNavigation open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default SearchNavigationButton;
