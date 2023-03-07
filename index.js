import express from 'express';
import router from './routes/admin/auth.js';
import cookieSession from 'cookie-session';
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cookieSession({
    keys: ['jsh34jk3k5h3jkh5lk3ye'],
  })
);

app.use(router);

app.listen(3000, () => {
  console.log('yey!');
});
