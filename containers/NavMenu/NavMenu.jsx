import styles from './NavMenu.module.scss';
import GravityForm from '@/containers/GravityForm/GravityForm'

import Link from "next/link";


const NavMenu = ({ open, setOpen, props }) => {





  //////////////////////////////////////
  // RENDER
  return (
    <div 
      className={[
        styles.navMenu,
        open ? styles.open : ''
      ].join(' ')}
    >
      <div className={styles.scrollWrapper}>

        <div className={styles.col}>
          <nav>
            <a href="#">Item</a> 
            <a href="#">Item</a>
            <a href="#">Item</a>
            <a href="#">Item</a>
            <a href="#">Item</a>
            <a href="#">Item</a>
          </nav>
        </div>


        <div className={`${styles.col} ${styles.contact}`}>
        <div className="links">
            <p>Heading</p>
            <a href="#" target="">link</a>
            <p>Heading</p>
            <a href="#" target="">link</a>
            <p>Heading</p>
            <a href="#" target="">link</a>
          </div>


          <ul className={styles.social}>
            <li>
              <a href="#" target="">
                    ICON
              </a>
            </li>
            <li>
              <a href="#" target="">
                    ICON
              </a>
            </li>
          </ul>



          <div className={styles.tags}>
            <a href="#" target="">Page or Link</a>
            <a href="#" target="">Page or Link</a>
            <a href="#" target="">Page or Link</a>
            <p>&copy;{new Date().getFullYear()} R&amp;R Partners.<br />All rights reserved.</p>
          </div>

        </div>


        <div className={styles.col}>
          <div className="gravityForm">
              <div className="wrap">
                <GravityForm 
                formNum="1"
                theme = "yellow"
                />
              </div>
             
          </div>
        </div>

      </div>
    </div>
  );
};

export default NavMenu;