import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name should be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name should have at least 3 characters',
    'string.max': 'Name should have at most 20 characters',
    'any.required': 'Name is required',
  }),

  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Phone number should be a string',
    'string.empty': 'Phone number is required',
    'string.min': 'Phone number should have at least 3 characters',
    'string.max': 'Phone number should have at most 20 characters',
    'any.required': 'Phone number is required',
  }),

  email: Joi.string().email().min(3).max(20).messages({
    'string.email': 'Email must be valid',
    'string.min': 'Email should have at least 3 characters',
    'string.max': 'Email should have at most 20 characters',
  }),

  isFavourite: Joi.boolean(),

  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'any.only': 'Contact type must be one of: work, home, personal',
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.min': 'Name should have at least 3 characters',
    'string.max': 'Name should have at most 20 characters',
  }),

  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.min': 'Phone number should have at least 3 characters',
    'string.max': 'Phone number should have at most 20 characters',
  }),

  email: Joi.string().email().min(3).max(20).messages({
    'string.email': 'Email must be valid',
    'string.min': 'Email should have at least 3 characters',
    'string.max': 'Email should have at most 20 characters',
  }),

  isFavourite: Joi.boolean(),

  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'any.only': 'Contact type must be one of: work, home, personal',
  }),
}).min(1);
