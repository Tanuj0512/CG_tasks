// const { userSchema } = require('../validation/validation');

// const validateUser = (req, res, next) => {
//   const { error } = userSchema.validate(req.body, { abortEarly: false });//continue to find all errors instead of stopping at one place 
//   if (error) {
//     const errorMessages = error.details.map(detail => detail.message);
//     return res.status(400).json({ errors: errorMessages });
//   }
//   next();
// };

// module.exports = { validateUser }; 