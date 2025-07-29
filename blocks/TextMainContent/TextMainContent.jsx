import styles from './TextMainContent.module.scss';


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
    left_copy_type, //0=p, 1=h3
    right_copy,
    right_copy_type, //0=cta, 1=text
  } = props;



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
        <h1 
          className={`
          ${styles.heading} 
          ${styles[`heading--${props.headline_color}`]}`
          }
        >
          {headline}
        </h1>
        <h6>{subheading}</h6>
        <div className={styles.cols}>
          <span>
            {Number(left_copy_type) === 1
            ? <h3>{left_copy}</h3>
            : <p>{left_copy}</p>}
          </span>
          <span>
            {Number(right_copy_type) === 1
            ? <p>{right_copy}</p>
            : <a href="#" className="cta">link</a>}
          </span>
        </div>
      </div>
    </section>
  );
}; 

export default TextMainContent;