const formatNumberWithCommas = (value: string): string => {
  const cleanedValue = value.replace(/\D/gu, '');

  // eslint-disable-next-line regexp/no-unused-capturing-group
  return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/gu, ',');
};

export default formatNumberWithCommas;
