/**
 * Parse date range string into start_at and finish_at dates
 * @param {string} dateRange Date range string in format "YYYY-MM-DD - YYYY-MM-DD"
 * @returns {{start_at: string, finish_at: string}} Object with start_at and finish_at dates
 */
const parseDateRange = (dateRange: string) => {
  const [start_at, finish_at] = dateRange.split(' to ');

  return { start_at, finish_at };
};

export default parseDateRange;
