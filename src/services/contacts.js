import { ContactCollection } from '../db/models/contact.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter = {},
}) => {
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactCollection.find(filter)
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const countQuery = ContactCollection.countDocuments(filter);

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

export const getContactById = async (contactId) => {
  const contact = await ContactCollection.findById(contactId);
  return contact;
};
export const updateContact = async (contactId, payload) => {
  return await ContactCollection.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
};
export const deleteContact = async (contactId) => {
  return await ContactCollection.findByIdAndDelete(contactId);
};
export const createContact = async (payload) => {
  const contact = await ContactCollection.create(payload);
  return contact;
};
