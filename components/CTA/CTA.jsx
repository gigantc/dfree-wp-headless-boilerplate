import styles from './CTA.module.scss';
import Link from 'next/link';
import Arrow from './arrow.svg';

const CTA = ({ cta }) => {

  return (
    <Link className={styles.cta} href={cta.url} target={cta.target}>
      {cta.title}
      <Arrow />
    </Link>
  );
};

export default CTA;










