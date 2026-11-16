/**
 * Token-based fuzzy matching using Set for speed.
 * Matches items if all query tokens are found in the item string (case-insensitive).
 * @param {T[]} data Array of strings or objects to search.
 * @param {string} query Space-separated search string.
 * @param {string} key Key to search in the object.
 * @returns {T[]} Filtered array of matching items.
 */
const fastTokenFuzzySearch = <T extends string | Record<string, string>>(
  data: T[],
  query: string,
  key?: string,
): T[] => {
  if (!query.trim()) return data;

  const queryTokens = new Set(query.toLowerCase().split(/\s+/u).filter(Boolean));

  return data.filter((item) => {
    if (typeof item === 'string') {
      const itemStr = item.toLowerCase();

      for (const token of queryTokens) {
        if (!itemStr.includes(token)) return false;
      }
      return true;
    }
    if (key && item[key]) {
      const itemStr = item[key].toLowerCase();

      for (const token of queryTokens) {
        if (!itemStr.includes(token)) return false;
      }
      return true;
    }
    return false;
  });
};

export default fastTokenFuzzySearch;
