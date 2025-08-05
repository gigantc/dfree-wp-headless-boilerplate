import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { NAVIGATION_OPTIONS_QUERY } from "@/queries/NavigationOptionsQuery";

import styles from './NavMenu.module.scss';
import GravityForm from '@/containers/GravityForm/GravityForm'
import classNames from 'classnames';


const NavMenu = ({ open, setOpen, props }) => {



  //////////////////////////////////////
  // ACF OPTIONS DATA
  const { data, loading, error } = useQuery(NAVIGATION_OPTIONS_QUERY);
  const optionsData = data?.navigation?.hamMenu || {};



  useEffect(() => {
    if (data) {
      console.log("-------");
      console.log(optionsData);
    }
  }, [data]);

  //////////////////////////////////////
  // RENDER
  return (
    <div
      className={classNames(
        styles.navMenu,
        { [styles.open]: open }
      )}
    >
      <div className={styles.scrollWrapper}>

        <div className={styles.col}>
          <nav>
          {optionsData.mainNavLink?.map((nav, i) => (
            <a
              href={nav.link.url}
              target={nav.link.target}
              key={i}
            >
              {nav.link.title}
            </a>
          ))}
          </nav>
        </div>


        <div className={`${styles.col} ${styles.contact}`}>
          <div className={styles.links}>
          {optionsData.contactLinks?.map((item, i) => (
            <>
              <p key={`heading-${i}`}>{item.heading}</p>
              <a 
                href={item.link.url} 
                target={item.link.target} 
                key={`link-${i}`}
              >
                {item.link.title}
              </a>
            </>
          ))}
          </div>


          <ul className={styles.social}>
            {optionsData.socialLinks?.map((item, i) => (
              <li key={`social-${i}`}>
                <a href={item.link.url} target={item.link.target}>
                  <span
                    dangerouslySetInnerHTML={{ __html: item.svgIcon }}
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>



          <div className={styles.tags}>
            {optionsData.subMenu?.map((item, i) => (
              <a 
              href={item.link.url} 
              target={item.link.target} 
              key={`sub-${i}`}
              >
                {item.link.title}
              </a>
            ))}
            <p>&copy;{new Date().getFullYear()} R&amp;R Partners.<br />All rights reserved.</p>
          </div>

        </div>


        <div className={styles.col}>
          <div className="gravityForm">
              <div className="wrap">
                <GravityForm 
                formNum={optionsData.gravityFormNum}
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