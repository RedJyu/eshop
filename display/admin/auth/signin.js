import template from '../layout.js';

const getError = (errors, prop) => {
  try {
    return errors.mapped()[prop].msg;
  } catch (error) {
    return '';
  }
};

const signinH = ({ errors }) => {
  return template({
    content: `
<div>
  <form method='POST'>
    <input name='email' placeholder='email' />
     ${getError(errors, 'email')}
    <input name='password' placeholder='password' />
     ${getError(errors, 'password')}
    <button>Sign In</button>
  </form>
</div>
`,
  });
};

export default signinH;
