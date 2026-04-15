const parseNumber = (value, defaultValue) => {
  if (typeof value !== 'string') return defaultValue;
  const parsedValue = Number.parseInt(value, 10);
  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    return defaultValue;
  }
  return parsedValue;
};
export const parsePaginationParams = (query) => {
  const { page, perPage } = query;
  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);
  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
