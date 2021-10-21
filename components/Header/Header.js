import { useRef, useState, useEffect } from 'react';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { Icon, Nav, Button } from 'rsuite';
import Link from 'next/link';

import PropTypes from 'prop-types';
import styles from './Header.module.css';

import { Roles } from '../../lib/constants';
import { ProfileButton } from '..';

const paths = {
  [Roles.USER_TYPE_USER]: ['SELF-REPORTING', 'STATISTICS'],
  [Roles.USER_TYPE_ADMIN]: ['PLATFORMS', 'STATISTICS', 'MANAGE'],
};

function Header({ session, toggleTheme }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const renderLinks = () => {
    const userPaths = [];
    Object.entries(paths).forEach(([role, paths]) => {
      if (!session.user.roles.includes(role)) return;
      userPaths.push(...paths);
    });

    return userPaths.map((path, i) => (
      <Link key={i} href={'/'.concat(path)}>
        <ul className={styles.list}>
          <Nav.Item id={path} active={router.pathname === `/${path}`}>
            {path}
          </Nav.Item>
        </ul>
      </Link>
    ));
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        isOpen
      ) {
        setIsOpen(false);
      } else if (event.target.id === 'navbar-expand-icon') {
        setIsOpen(isOpen => !isOpen);
      }

      event.stopPropagation();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuRef, isOpen]);

  return (
    <nav className={`${styles.header} rs-nav rs-nav-horizontal`}>
      <Link href="/">
        <ul className={styles.list}>
          <Nav.Item className={styles.logoWrapper}>
            <span className={styles.logo}>My Dashboard</span>
          </Nav.Item>
        </ul>
      </Link>
      {session && (
        <Icon
          id="navbar-expand-icon"
          className={styles.navbarExpandIcon}
          icon="bars"
        />
      )}
      <div
        ref={mobileMenuRef}
        className={`${styles.links} ${isOpen ? styles.open : ''}`}>
        {session && renderLinks()}

        <div className={styles.profile}>
          {session ? (
            <ProfileButton session={session} />
          ) : (
            <Nav.Item onClick={() => signIn('keycloak')}>
              <text id="logIn">Log in</text>
            </Nav.Item>
          )}
          <Button
            className={styles.themeToggle}
            appearance="ghost"
            onClick={toggleTheme}
            aria-label="toggleTheme">
            <Icon icon="moon-o" />
          </Button>
        </div>
      </div>
    </nav>
  );
}

Header.propTypes = {
  session: PropTypes.object,
  toggleTheme: PropTypes.func.isRequired,
};

export default Header;
