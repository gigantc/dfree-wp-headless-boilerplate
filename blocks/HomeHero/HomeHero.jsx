import styles from './HomeHero.module.scss';

const HomeHero = (props) => {

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
    </section>
  );
};

export default HomeHero;