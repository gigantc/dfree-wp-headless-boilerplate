import styles from './header.module.scss';
import classNames from 'classnames';
import Link from "next/link";


const Header = ({setNavOpen, open}) => (
  <header className={styles.globalHeader}>
    
    
    <Link href="/" className={styles.logo}>
      <img src="https://rrpartners.com/wp-content/themes/rrpartners/logos/current.gif" alt="R&R Partners logo" />
    </Link>
    
    <div 
      className={classNames(
        styles.hamIcon,
        "cursor-hover",
        { [styles.open]: open }
      )}
      onClick={() => setNavOpen(prev => !prev)}
    >
      <span></span>
      <span></span>
      <span></span>
    </div>


  </header>
);

export default Header;