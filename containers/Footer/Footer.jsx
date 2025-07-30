import styles from './footer.module.scss';
import Link from 'next/link';

import InstaIcon from './instagram.svg';
import LinkedIcon from './linkedin.svg';


const Footer = () => {


  return (
    <footer className={styles.globalFooter}>
      <div className={`container ${styles.wrap}`}>
        <a href="https://logo.rrpartners.com/" target="_blank">
          <img src="https://rrpartners.com/wp-content/themes/rrpartners/logos/current_black.gif" alt="R&R Partners logo" />
        </a>

        <div className={styles.social}>
          <a href="https://www.instagram.com/rrpartners/" target="_blank"><InstaIcon /></a>
          <a href="https://www.linkedin.com/company/r&r-partners/" target="_blank"><LinkedIcon /></a>
        </div>

        <ul>
          <li><Link href="#">Careers</Link></li>
          <li><Link href="#">Privacy Policy</Link></li>
          <li><Link href="#">California Applicant & Employee Privacy Policy</Link></li>
          <li>&copy;{new Date().getFullYear()} R&amp;R Partners.<br />All rights reserved.</li>
        </ul>

      </div>
    </footer>

  );

};

export default Footer;





