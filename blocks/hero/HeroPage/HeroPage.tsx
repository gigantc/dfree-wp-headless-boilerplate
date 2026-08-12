import styles from "./HeroPage.module.scss";

type HeroPageProps = {
  headline?: string;
  subheadline?: string;
};

const HeroPage = ({ headline, subheadline }: HeroPageProps) => (
  <section className={styles.hero}>
    <div className="container">
      {headline ? <h1>{headline}</h1> : null}
      {subheadline ? <p className={styles.subheadline}>{subheadline}</p> : null}
    </div>
  </section>
);

export default HeroPage;
