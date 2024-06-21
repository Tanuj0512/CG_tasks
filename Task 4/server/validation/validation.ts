import { NextFunction , Request, Response} from "express";
import * as Joi from "joi";
const userSchema = Joi.object({
    firstName: Joi.string()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.base': `"First Name" should be a type of 'text'`,
        'string.empty': `"First Name" cannot be an empty field`,
        'string.min': `"First Name" should have a minimum length of 3`,
        'string.max': `"First Name" should have a maximum length of 30`,
        'any.required': `"First Name" is a required field`
      }),
    lastName: Joi.string()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.base': `"Last Name" should be a type of 'text'`,
        'string.empty': `"Last Name" cannot be an empty field`,
        'string.min': `"Last Name" should have a minimum length of 3`,
        'string.max': `"Last Name" should have a maximum length of 30 `,
        'any.required': `"Last Name" is a required field`
      }),
    dob: Joi.date()
      .required()
      .messages({ //for custom error message
        'date.base': `"Date of Birth" should be a valid date`,
        'any.required': `"Date of Birth" is a required field`
      }),
    address: Joi.string()
      .min(5)
      .max(100)
      .required()
      .messages({
        'string.base': `"Address" should be a type of 'text'`,
        'string.empty': `"Address" cannot be an empty field`,
        'string.min': `"Address" should have a minimum length of 3`,
        'string.max': `"Address" should have a maximum length of 30`,
        'any.required': `"Address" is a required field`
      }),
    mobile: Joi.string()
      .pattern(/^[0-9]+$/)
      .length(10)
      .required()
      .messages({
        'string.base': `"Mobile" should be a type of 'text'`,
        'string.empty': `"Mobile" cannot be an empty field`,
        'string.pattern.base': `"Mobile" should only contain digits`,
        'string.length': `"Mobile" should be exactly 10 digits long`,
        'any.required': `"Mobile" is a required field`
      })
  });
  
  const validateUser = (req: Request, res: Response, next: NextFunction) => {
    const { error } = userSchema.validate(req.body, { abortEarly: false });
  
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({ errors: errorMessages });
    }
  
    next(); // Move next() here to ensure validation success message is not sent prematurely
  };

  export default validateUser;