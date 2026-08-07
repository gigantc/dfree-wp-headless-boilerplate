import styles from "./HeroPage.module.scss";

type HeroPageProps = {
  headline?: string;
  subheadline?: string;
};

export default function HeroPage({ headline, subheadline }: HeroPageProps) {
  return (
    <section className={styles.hero}>
      <div className="container">
        {headline ? <h1>{headline}</h1> : null}
        {subheadline ? <p className={styles.subheadline}>{subheadline}</p> : null}
      </div>
    </section>
  );
}
