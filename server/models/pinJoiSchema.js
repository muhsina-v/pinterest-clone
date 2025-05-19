import Joi from "joi";

export const pinValidationSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required(),
  image: Joi.string().uri().required(), 
  createdBy: Joi.string().hex().length(24).required(), //obj id
});
