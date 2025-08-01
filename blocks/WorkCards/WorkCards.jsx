import styles from './WorkCards.module.scss';
import CTA from '@/components/CTA/CTA.jsx'
import classNames from 'classnames';

const WorkCards = (props) => {

//////////////////////////////////////
// ACF FIELDS
const {
  theme,
  cards = {}
} = props;

  //////////////////////////////////////
  // RENDER
  return (
    <section
      className={classNames(
        styles.workCards,
        theme && styles[`workCards--${theme}`],
        cards.length < 3 && styles['no-large']
      )}
    >
      <div className={`container ${styles.wrap}`}>
        {cards.length > 0 ? (
          cards.map((card, i) => (
            <div className={styles.card} key={i}>
              <div className={styles.image}>
                <img 
                  src={card.image?.source_url} 
                  alt={card.image?.alt_text} 
                />
              </div>
              <div className={styles.text}>
                <h3>{card.title}</h3>
                {card.link && (
                  <CTA cta={card.link} />
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No cards found.</div>
        )}
      </div>
    </section>
  );
};

export default WorkCards;