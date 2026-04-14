import { ContactCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactCollection.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactCollection.findById(contactId);
  return contact;
};
export const updateContact = async (contactId, payload) => {
  return await ContactCollection.findByIdAndUpdate(contactId, payload, { new: true });
};
export const deleteContact = async (contactId) => {
  return await ContactCollection.findByIdAndDelete(contactId);
};
export const createContact = async (payload) => {
  const contact = await ContactCollection.create(payload);
  return contact;
};
