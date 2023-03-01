import express from 'express';
import usersRepository from './repos/users.js';
import cookieSession from 'cookie-session';
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cookieSession({
    keys: ['jsh34jk3k5h3jkh5lk3ye'],
  })
);

app.get('/', (req, res) => {
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

app.post('/', async (req, res) => {
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

app.listen(3000, () => {
  console.log('yey!');
});
