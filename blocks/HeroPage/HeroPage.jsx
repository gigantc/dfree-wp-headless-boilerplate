import styles from './HeroPage.module.scss';

const HeroPage = (props) => {

  //////////////////////////////////////
  // ACF FIELDS
  const { 
    hero_type, 
    image, 
    video_link
  } = props;

  const heroImage = image?.source_url;


  //////////////////////////////////////
  // RENDER
  return (
    <section className={styles.hero}>
      <div className={styles.mediaContainer}>
        {hero_type === "image" && (
          <img src={heroImage} alt={image?.alt_text || ""} />
        )}
        {hero_type === "video" && (
          <video autoPlay muted loop playsInline preload="auto" >
            <source src={video_link} type="video/mp4" />
          </video>
        )}
      </div>
    </section>
  );
};

export default HeroPage;