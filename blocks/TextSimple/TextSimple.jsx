import styles from './SimpleText.module.scss';

const TextSimple = (props) => {

  //////////////////////////////////////
  // RENDER
  return (
    <section className={styles.textSimple}>
      <p>{props.text_simple_text_block}</p>
    </section>
  );
};

export default TextSimple;