import Joi from "joi";

export const userValidationSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),

  followers: Joi.array().items(Joi.string().hex().length(24)),
  following: Joi.array().items(Joi.string().hex().length(24)),
});
