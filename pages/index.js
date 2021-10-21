import { useRouter } from 'next/router';
import Head from 'next/head';
import { useRef } from 'react';
import PropTypes from 'prop-types';

import { Header } from '../components';
import { Button, Message } from 'rsuite';
import { signIn, getSession } from 'next-auth/client';
import styles from './index.module.css';

const errors = {
  configuration: {
    heading: 'Server error',
    message: (
      <div>
        <p>There is a problem with the server configuration.</p>
        <p>Check the server logs for more information.</p>
      </div>
    ),
  },
  accessdenied: {
    heading: 'Access Denied',
    message: (
      <div>
        <p>You do not have permission to sign in.</p>
        <p>
          <Button
            appearance="primary"
            onClick={() => signIn('keycloak', { callbackUrl: '/' })}>
            Sign in
          </Button>
        </p>
      </div>
    ),
  },
  verification: {
    heading: 'Unable to sign in',
    message: (
      <div>
        <p>The sign in link is no longer valid.</p>
        <p>It may have be used already or it may have expired.</p>
        <p>
          <Button
            appearance="primary"
            onClick={() => signIn('keycloak', { callbackUrl: '/' })}>
            Sign in
          </Button>
        </p>
      </div>
    ),
  },
  invaliduser: {
    heading: 'Unable to sign in',
    message: (
      <div>
        <p>There was an error logging in. Please try again.</p>
        <p>
          <Button
            appearance="primary"
            onClick={() => signIn('keycloak', { callbackUrl: '/' })}>
            Sign in
          </Button>
        </p>
      </div>
    ),
  },
};

export async function getServerSideProps(context) {
  return { props: { session: await getSession(context) } };
}

function Home({ session, toggleTheme }) {
  const router = useRouter();
  const featuresRef = useRef(null);

  const showError = error => {
    error = error.toLowerCase();
    const key = Object.keys(errors).find(e => error.indexOf(e) > -1);

    if (key) {
      const details = errors[key];
      return (
        <Message
          type="error"
          closable
          title={details.heading}
          description={details.message}
        />
      );
    }

    console.error('Unknown error');
    return null;
  };

  return (
    <div>
      <Head>
        <title>My Quality Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header session={session} toggleTheme={toggleTheme} />

      <div className={styles.squares}>
        <div className={styles.container}>
          {router.query && router.query.error && showError(router.query.error)}
          <main className={styles.mainContent}>
            <h1 className={styles.title}>Welcome to My Dashboard</h1>
            {!session && (
              <div className={styles.loginButton}>
                <div className={styles.titleleft}>
                  <h2>Get started</h2>
                </div>
                <p
                  style={{
                    width: '60%',
                    margin: 'auto',
                    marginBottom: '5px',
                    textAlign: 'left',
                  }}>
                  If this is your first time using the My Dashboard, please
                  contact the person who shared this platform with you to
                  provide you with a unique URL. This will automatically link
                  your account to the platform that the URL belongs, so you can
                  start completing self-reports and viewing your statistics.
                </p>

                <Button
                  style={{ marginTop: '15px' }}
                  id="loginOrRegister"
                  appearance="primary"
                  onClick={() => signIn('keycloak')}>
                  Login or Register
                </Button>
              </div>
            )}

            {session && <div className={styles.spacing}></div>}

            <div className={styles.features} ref={featuresRef}>
              <div className={styles.feature}>
                <img
                  src="/images/icons8-todo-list-96.png"
                  alt="Self-report icon"
                  width={96}
                  height={96}
                />

                <p style={{ textAlign: 'left' }}>
                  In a matter of minutes, complete your self-reporting on the
                  device of your choosing. The self-reporting website is clear
                  and simple to use, allowing you to quickly record your recent
                  experience. Remember to submit your answers because they are
                  not saved automatically.
                </p>
              </div>

              <div className={styles.feature}>
                <img
                  src="/images/icons8-combo-chart-96.png"
                  alt="Statistics graph icon"
                  width={96}
                  height={96}
                />
                <p style={{ textAlign: 'left' }}>
                  Track your self-reporting from any device and at any time. The
                  statistics page provides you a lot of flexibility, allowing
                  you to modify data ranges and whether or not your
                  submissions were part of a mentoring session. 
                </p>
              </div>

              <div className={styles.feature}>
                <img
                  src="/images/icons8-people-96.png"
                  alt="Mentoring people icon"
                  width={96}
                  height={96}
                />
                <p style={{ textAlign: 'left' }}>
                  Complete your self-reporting by yourself or as part of a
                  mentoring session.You and your platform administrator may then
                  utilise these valuable relevant insights to start discussions
                  about how you and your platform administator can improve.
                </p>
              </div>
            </div>
          </main>
        </div>

        <div className={styles.cube}></div>
        <div className={styles.cube}></div>
        <div className={styles.cube}></div>
        <div className={styles.cube}></div>
        <div className={styles.cube}></div>
        <div className={styles.cube}></div>
      </div>
    </div>
  );
}

Home.propTypes = {
  session: PropTypes.object.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Home;
