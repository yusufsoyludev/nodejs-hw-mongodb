import { ContactCollection } from '../db/models/contact.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter = {},
  userId,
}) => {
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactCollection.find({
    ...filter,
    userId,
  })
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const countQuery = ContactCollection.countDocuments({
    ...filter,
    userId,
  });

  const [contacts, totalItems] = await Promise.all([contactsQuery, countQuery]);

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
export const getContactById = async (contactId, userId) => {
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
