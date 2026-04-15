const parseBoolean = (value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};
export const parseFilterParams = (query) => {
  const { contactType, type, isFavourite } = query;
  const parsedType = contactType || type;
  const parsedFavourite = parseBoolean(isFavourite);
  return {
    contactType: parsedType,
    isFavourite: parsedFavourite,
  };
};
