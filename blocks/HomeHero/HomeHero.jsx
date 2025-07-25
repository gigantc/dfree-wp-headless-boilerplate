import styles from './HomeHero.module.scss';

const HomeHero = (props) => {

  //////////////////////////////////////
  // RENDER
  return (
    <section className={styles.homeHero}>
      <h1>This is a Block and it's on the Page.</h1>
    </section>
  );
};

export default HomeHero;