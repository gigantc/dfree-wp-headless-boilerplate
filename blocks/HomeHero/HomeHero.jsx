import { useEffect, useState } from "react";
import styles from './HomeHero.module.scss';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

const HomeHero = (props) => {


  console.log(props);

  //////////////////////////////////////
  // FIELDS
  const heroImage = props.home_hero_image?.source_url;



  //////////////////////////////////////
  // RENDER
  return (
    <section className={styles.homeHero}>
      <div className={styles.imageContainer}>
        <img src={heroImage} />
      </div>

      <pre style={{ background: "#eee", padding: 10, borderRadius: 6, marginBottom: 20 }}>
        {JSON.stringify(props, null, 2)}
      </pre>

      
    </section>
  );
};

export default HomeHero;