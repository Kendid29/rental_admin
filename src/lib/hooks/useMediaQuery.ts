
'use client';

import { useEffect, useState } from 'react';

import { isServer } from '@tanstack/react-query';
type UseMediaQueryOptions = {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
};

/**
 * Custom React hook to evaluate a CSS media query and respond to changes.
 * @param {string} query The media query to evaluate.
 * @param {Object} [options] Optional settings.
 * @param {boolean} [options.defaultValue=false] Default value for SSR or initial state.
 * @param {boolean} [options.initializeWithValue=true] Whether to initialize with the current value.
 * @returns {boolean} Whether the media query currently matches.
 */
const useMediaQuery = (
  query: string,
  { defaultValue = false, initializeWithValue = true }: UseMediaQueryOptions = {},
): boolean => {
  const getMatches = (_query: string): boolean => {
    if (isServer) {
      return defaultValue;
    }
    return window.matchMedia(_query).matches;
  };

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query);
    }
    return defaultValue;
  });

  // Handles the change event of the media query.
  const handleChange = () => {
    setMatches(getMatches(query));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const matchMedia = window.matchMedia(query);
    let isMounted = true;

    // Triggered at the first client-side load and if query changes
    if (isMounted) {
      handleChange();
    }

    // Use deprecated `addListener` and `removeListener` to support Safari < 14 (#135)
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener('change', handleChange);
    }

    return () => {
      isMounted = false;

      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener('change', handleChange);
      }
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
