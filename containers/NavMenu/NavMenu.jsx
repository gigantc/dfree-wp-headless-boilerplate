import React, { useRef, useEffect } from 'react';
import { useQuery } from "@apollo/client";
import { NAVIGATION_OPTIONS_QUERY } from "@/queries/NavigationOptionsQuery";
import gsap from "gsap";

import styles from './NavMenu.module.scss';
import GravityForm from '@/containers/GravityForm/GravityForm'
import classNames from 'classnames';
import { ToolbarAwaitUser } from '@faustwp/core/dist/cjs/components/Toolbar/Toolbar';


const NavMenu = ({ open, setOpen }) => {



  //////////////////////////////////////
  // ACF OPTIONS DATA
  const { data, loading, error } = useQuery(NAVIGATION_OPTIONS_QUERY);
  const optionsData = data?.navigation?.hamMenu || {};


  //////////////////////////////////////
  // REFS
  const menuRef = useRef();
  const linkRefs = useRef([]);
  const contactLinkRefs = useRef([]);
  const tagRefs = useRef([]);
  const socialRefs = useRef([]);
  const formRef = useRef();



  //////////////////////////////////////
  // ANIMATIONS

  //fade in/out full menu on click
  useEffect(() => {
    if (open) {
      gsap.to(menuRef.current, {
        autoAlpha: 1,
        duration: 0.4,
        ease: 'power2.out',
        pointerEvents: 'auto'
      });
    } else {
      gsap.to(menuRef.current, {
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power2.in',
        pointerEvents: 'none',
        delay: 1
      });
    }
  }, [open]);


  //all text fade in
  useEffect(() => {
      const allRefs = [
        ...linkRefs.current,
        ...contactLinkRefs.current,
        // ...socialRefs.current,
        ...tagRefs.current
      ].filter(Boolean);

    if (open) {
      gsap.fromTo(
        allRefs,
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    } else {
      gsap.to(allRefs, {
        autoAlpha: 0,
        y: 50,
        duration: 0.3,
        stagger: 0.04,
        ease: 'power2.in',
      });
    }
  }, [open]);


  //social and form links
  useEffect(() => {
      const allRefs = [
        ...socialRefs.current,
        formRef.current,
      ].filter(Boolean);

    if (open) {
      gsap.fromTo(
        allRefs,
        { opacity: 0, y:30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay:1.2,
          stagger: 0.4,
          ease: 'power2.out',
        }
      );
    } else {
      gsap.to(allRefs, {
        opacity: 0,
        y: 30,
        duration: 0.3,
        stagger: 0.04,
        ease: 'power2.in',
      });
    }
  }, [open]);


  //////////////////////////////////////
  // RENDER
  return (
    <div
      ref={menuRef}
      className={classNames(
        styles.navMenu,
        // { [styles.open]: open }
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
              ref={el => linkRefs.current[i] = el}
            >
              {nav.link.title}
            </a>
          ))}
          </nav>
        </div>


        <div className={`${styles.col} ${styles.contact}`}>
          
          <div className={styles.links}>
          {optionsData.contactLinks?.map((item, i) => (
            <div 
            key={i}
            ref={el => contactLinkRefs.current[i] = el}
            >
              <p>{item.heading}</p>
              <a 
                href={item.link.url} 
                target={item.link.target} 
                key={`link-${i}`}
              >
                {item.link.title}
              </a>
            </div>
          ))}
          </div>


          <ul className={styles.social}>
            {optionsData.socialLinks?.map((item, i) => (
              <li 
              key={`social-${i}`}
              ref={el => socialRefs.current[i] = el}
              >
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
                ref={el => tagRefs.current[i] = el}
              >
                {item.link.title}
              </a>
            ))}
            <p
              ref={el => tagRefs.current[
                // force to always comes last!
                optionsData.subMenu?.length || 0
              ] = el}
            >
              &copy;{new Date().getFullYear()} R&amp;R Partners.<br />All rights reserved.
            </p>
          </div>

        </div>

        
        <div className={styles.gravityForm} ref={formRef}>
          <p>Sign up for our newsletter</p>
          <GravityForm 
            formNum={optionsData.gravityFormNum}
            theme="yellow"
          />
        </div>

      </div>
      
    </div>
  );
};

export default NavMenu;