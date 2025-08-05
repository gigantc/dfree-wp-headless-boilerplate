import styles from './HeroPage.module.scss';
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";



const HeroPage = (props) => {

  const imageRef = useRef(null);

  //////////////////////////////////////
  // ACF FIELDS
  const { 
    hero_type, 
    image, 
    video_link
  } = props;

  const heroImage = image?.source_url;


  //////////////////////////////////////
  // ANIMATIONS
  useEffect(() => {
    if (!imageRef.current) return;



    //super simple fade in for now.
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, scale: 0.85 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
        delay:1,
        scrollTrigger: {
          trigger: imageRef.current,
          // when top of hero hits 80% viewport
          start: "top 80%", 
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);


  //////////////////////////////////////
  // RENDER
  return (
    <section className={styles.hero}>
      <div className={styles.mediaContainer}>
        {hero_type === "image" && (
          <img src={heroImage} alt={image?.alt_text || ""} ref={imageRef} />
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