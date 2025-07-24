import styles from './loader.module.scss';

const Loader = ({ isLoading }) => {
  return (
    <div className={`loadingContainer ${styles.loadingContainer} ${isLoading ? "visible" : "hidden"}`}>
      <div className={styles.loader}></div>
    </div>
  );
}

export default Loader;
