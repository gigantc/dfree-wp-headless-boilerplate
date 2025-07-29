import styles from './ImageFullWidth.module.scss';

const ImageFullWidth = (props) => {

//////////////////////////////////////
  // ACF FIELDS
  const { 
    image_type, // 0=contained, 1=full
    image, 
  } = props;

  const src = image?.source_url;
  const alt = image?.alt_text || '';

  // Don't render they don't add an image
  if (!src) return null; 

  return (
    <section className={styles.imageFullWidth}>
      {Number(image_type) === 1 ? (

        <img src={src} alt={alt} />
        
      ) : (

        <div className="container">
          <img src={src} alt={alt} className={styles.contained} />
        </div>

      )}
    </section>
  );
};

export default ImageFullWidth;