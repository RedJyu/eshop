import express from 'express';
import usersRepository from '../../repos/users.js';

const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(`
<div>
Your ID is ${req.session.userID}
  <form method='POST'>
    <input name='email' placeholder='email' />
    <input name='password' placeholder='password' />
    <input name='passwordConfirmation' placeholder='password confirmation' />
    <button>Sign Up</button>
  </form>
</div>
  `);
});

router.post('/signup', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;
  const exists = await usersRepository.getOneBy({ email });
  if (exists) {
    return res.send('Email in use');
  }
  if (password !== passwordConfirmation) {
    return res.send('Passwords needs to be identical');
  }
  const user = await usersRepository.create({ email, password });

  req.session.userID = user.id;

  res.send('Registration Complete');
});

router.get('/signout', (req, res) => {
  req.session = null;
  res.send('Logged out');
});

router.get('/signin', (req, res) => {
  res.send(`
    <div>
  <form method='POST'>
    <input name='email' placeholder='email' />
    <input name='password' placeholder='password' />
    <button>Sign In</button>
  </form>
</div>
    `);
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await usersRepository.getOneBy({ email });

  if (!user) {
    return res.send('Email not found');
  }
  const validPassword = await usersRepository.passwordCheck(
    user.password,
    password
  );
  if (!validPassword) {
    return res.send('invalid password');
  }
  req.session.userID = user.id;
  res.send('Signed In');
});

export default router;
