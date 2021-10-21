import { Footer as FooterComponent } from 'rsuite';
import styles from './Footer.module.css';

function Footer() {
  return (
    <FooterComponent className={styles.footer}>
      <i>
        Developed as part of the{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.ucl.ac.uk/computer-science/collaborate/ucl-industry-exchange-network-ucl-ixn">
          UCL Industry Exchange Network
        </a>
      </i>
    </FooterComponent>
  );
}

export default Footer;
