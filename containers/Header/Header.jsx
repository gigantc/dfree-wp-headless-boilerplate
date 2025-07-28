import styles from './header.module.scss';

import Link from "next/link";


const Header = ({siteTitle}) => (
  <header className={styles.globalHeader}>
    
    
    <Link href="/" className={styles.logo}>
      <img src="https://rrpartners.com/wp-content/themes/rrpartners/logos/current.gif" alt="R&R Partners logo" />
    </Link>
    
    <div className={styles.hamIcon}>
      <span></span>
      <span></span>
      <span></span>
    </div>


  </header>
);

export default Header;