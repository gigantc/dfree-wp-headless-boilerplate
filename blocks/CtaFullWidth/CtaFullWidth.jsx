import styles from './CtaFullWidth.module.scss';
import Link from 'next/link';
import Arrow from './arrow.svg';

const CTAFullWidth = (props) => {


//////////////////////////////////////
// ACF FIELDS
const {
  colors_and_theme = {},
  link = {},
} = props;

const { text_color, theme_type } = colors_and_theme;
const { url = '#', title = '', target } = link;

//////////////////////////////////////
// RENDER
return (
    <section
      className={[
        styles.ctaFullWidth,
        theme_type ? styles[`ctaFullWidth--${theme_type}`] : ''
      ].join(' ')}
    >
      <div className="container">
        <Link
          className={[
            styles.giantcta,
            text_color ? styles[`giantcta--${text_color}`] : ''
          ].join(' ')}
          href={url}
          target={target}
        >
          {title}
          <Arrow />
        </Link>
      </div>
      
    </section>
  );
};

export default CTAFullWidth;