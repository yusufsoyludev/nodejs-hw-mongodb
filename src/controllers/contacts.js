import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const getAllContactsController = async (req, res) => {
  const userId = req.user._id;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const { contactType, isFavourite } = parseFilterParams(req.query);
  const filter = {};
  if (contactType) {
    filter.contactType = contactType;
  }
  if (typeof isFavourite === 'boolean') {
    filter.isFavourite = isFavourite;
  }

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  let photo = '';
  if (req.file) {
    const uploadedPhoto = await uploadToCloudinary(req.file.buffer);
    photo = uploadedPhoto.secure_url;
  }
  const userId = req.user._id;
  const newContact = await createContact({
    ...req.body,
    userId,
    photo,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const patchContactController = async (req, res) => {
  let photo;

  
  if (req.file) {
    const uploadedPhoto = await uploadToCloudinary(req.file.buffer);
    photo = uploadedPhoto.secure_url;
  }

  const { contactId } = req.params;
  const userId = req.user._id;

  
  const updatedData = {
    ...req.body,
  };

  
  if (photo) {
    updatedData.photo = photo;
  }

  const updatedContact = await updateContact(
    contactId,
    updatedData,
    userId
  );

  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const deletedContact = await deleteContact(contactId, userId);

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
