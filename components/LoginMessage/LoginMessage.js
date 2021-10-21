import { Button } from 'rsuite';
import { signIn } from 'next-auth/client';

function LoginMessage() {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ marginTop: '19px' }}>
        You must login or register to use the Dashboard.
      </p>

      <Button
        style={{ marginTop: '200px' }}
        text-align="center"
        appearance="primary"
        onClick={() => signIn('keycloak')}>
        Login or Register
      </Button>
    </div>
  );
}

export default LoginMessage;
