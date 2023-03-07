import { body, validationResult } from 'express-validator';
import usersRepository from '../../repos/users.js';

const validator = [
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be valid email')
    .custom(async (email) => {
      const exists = await usersRepository.getOneBy({ email });
      if (exists) {
        throw new Error('Email in use');
      }
    }),

  body('password')
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('Must be between 5 and 20 characters'),

  body('passwordConfirmation')
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('Must be between 5 and 20 characters')
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Password must mach');
      }
    }),
];
export default validator;
