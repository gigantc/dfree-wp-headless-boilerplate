import styles from './TextMainContent.module.scss';
import CTA from '@/components/CTA/CTA.jsx';

const TextMainContent = (props) => {

  console.log(props);

  //////////////////////////////////////
  // ACF FIELDS
  const { 
    headline, 
    headline_color, 
    subheading,
    theme_type,
    left_copy,
    left_copy_type, // 0=p, 1=h3
    right_copy,
    right_copy_type, // 0=cta, 1=text
    cta //contains: title, target, url
  } = props;

  //we only showing the cols if one of these exists
  const showCols = left_copy || right_copy || cta;

  

  //////////////////////////////////////
  // RENDER
  return (
    <section
      className={[
        styles.textMainContent,
        props.theme_type 
        ? styles[`textMainContent--${theme_type}`] 
        : ''
      ].join(' ')}
    >
      <div className="container">

        {headline && (
          <h1 
            className={`
            ${styles.heading} 
            ${styles[`heading--${headline_color}`]}`
            }
          >
            {headline}
          </h1>
        )}

        {subheading && (
           <h6>{subheading}</h6>
        )} 

        {showCols && (
          <div className={styles.cols}>
            <span>
              {Number(left_copy_type) === 1
              ? <h3>{left_copy}</h3>
              : <p>{left_copy}</p>}
            </span>
            <span>
              {Number(right_copy_type) === 1
              ? <p>{right_copy}</p>
              : <CTA cta={cta} />}
            </span>
          </div>
        )}

      </div>
    </section>
  );
}; 

export default TextMainContent;