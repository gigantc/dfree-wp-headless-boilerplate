import styles from './HomeHero.module.scss';

const HomeHero = (props) => {

  //////////////////////////////////////
  // RENDER
  return (
    <section className={styles.homeHero}>
      <h1>{props.home_hero_title}</h1>
      <p>{props.home_hero_subheading}</p>
    </section>
  );
};

export default HomeHero;