import styles from './HomeHero.module.scss';


const HeroBlock = ({ heroTextField }) => (
  <section className="{styles.homeHero}">
    <h1>{heroTextField}</h1>
  </section>
);

export default HeroBlock;