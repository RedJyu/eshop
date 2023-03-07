import template from '../layout.js';

const getError = (errors, prop) => {
  try {
    return errors.mapped()[prop].msg;
  } catch (error) {
    return '';
  }
};

const signupH = ({ req, errors }) => {
  return template({
    content: `
<div>
Your ID is ${req.session.userID}
  <form method='POST'>
    <input name='email' placeholder='email' />
    ${getError(errors, 'email')}
    <input name='password' placeholder='password' />
    ${getError(errors, 'password')}
    <input name='passwordConfirmation' placeholder='password confirmation' />
    ${getError(errors, 'passwordConfirmation')}
    <button>Sign Up</button>
  </form>
</div>
`,
  });
};
export default signupH;
