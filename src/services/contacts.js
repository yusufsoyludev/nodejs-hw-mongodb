import { ContactCollection } from '../db/models/contact.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
  userId,
}) => {
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactCollection.find({
    ...filter,
    userId,
  });
  const contactsCountQuery = ContactCollection.countDocuments({
    ...filter,
    userId,
  });
  const [contacts, totalItems] = await Promise.all([
    (await contactsQuery.skip(skip).limit(perPage)).toSorted({
      [sortBy]: sortOrder,
    }),
    contactsCountQuery,
  ]);
  const totalPages = Math.ceil(totalItems / perPage);
  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};
export const getContactById = async (getContactById, userId) => {
  return await ContactCollection.findOne({
    _id: contactId,
    userId,
  });
};
export const createContact = async (payload) => {
  return await ContactCollection.create(payload);
};
export const updateContact = async (contactId, payload, userId) => {
  return await ContactCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true },
  );
};
export const deleteContact = async (contactId, userId) => {
  return await ContactCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
};
