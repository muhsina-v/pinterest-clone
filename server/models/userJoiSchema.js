import Joi from "joi";
import joiObjectId from 'joi-objectid';

Joi.objectId = joiObjectId(Joi);

export const registerValidationSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
  followers: Joi.array().items(Joi.string().hex().length(24)),
  following: Joi.array().items(Joi.string().hex().length(24)),
});

export const loginValidationSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});
