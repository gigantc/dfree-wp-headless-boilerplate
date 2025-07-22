import styles from './header.module.scss';

import Link from "next/link";


const Header = ({siteTitle}) => (
  <header className={styles.globalHeader}>
    <Link href="/">
      <h1>{siteTitle}</h1>
    </Link>
  </header>
);

export default Header;