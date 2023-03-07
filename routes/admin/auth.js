import express from 'express';
import { body, validationResult } from 'express-validator';
import usersRepository from '../../repos/users.js';
import signupH from '../../display/admin/auth/signup.js';
import signinH from '../../display/admin/auth/signin.js';
import { validator, validatorSignIn } from './validators.js';

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupH({ req }));
});

router.post('/signup', validator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send(signupH({ req, errors }));
  }
  const { email, password, passwordConfirmation } = req.body;
  const user = await usersRepository.create({ email, password });
  req.session.userID = user.id;
  res.send('Registration Complete');
});

router.get('/signout', (req, res) => {
  req.session = null;
  res.send('Logged out');
});

router.get('/signin', (req, res) => {
  res.send(signinH({}));
});

router.post('/signin', validatorSignIn, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send(signinH({ errors }));
  }
  const { email } = req.body;
  const user = await usersRepository.getOneBy({ email });
  req.session.userID = user.id;
  res.send('Signed In');
});

export default router;
