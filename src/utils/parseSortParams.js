const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

const sortFields = [
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
];

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = sortFields.includes(sortBy) ? sortBy : '_id';
  const parsedSortOrder =
    sortOrder === SORT_ORDER.DESC ? SORT_ORDER.DESC : SORT_ORDER.ASC;

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};