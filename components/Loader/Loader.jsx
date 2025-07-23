import './Loader.scss'

const Loader = ({ isLoading }) => {
  return (
    <div className={`loadingContainer ${isLoading ? "visible" : "hidden"}`}>
      <div className="smokin">
        <div className="cig">
          <div className="filter"></div>
          <div className="tobacco"></div>
          <div className="fire"></div>
        </div>
        <p>Loading</p>
      </div>
    </div>
  );
}

export default Loader;
