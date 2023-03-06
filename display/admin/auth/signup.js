import template from '../layout.js';

const signupH = ({ req }) => {
  return template({
    content: `
<div>
Your ID is ${req.session.userID}
  <form method='POST'>
    <input name='email' placeholder='email' />
    <input name='password' placeholder='password' />
    <input name='passwordConfirmation' placeholder='password confirmation' />
    <button>Sign Up</button>
  </form>
</div>
`,
  });
};
export default signupH;
