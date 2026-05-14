import { Link } from "react-router-dom";

import "../App.css";

function Home() {
  return (
    <div className="page">
      <section className="simple-home">
        <div className="simple-home-content">
          <h1 className="easybuy-title">
            EasyBuy
          </h1>

          <p className="easybuy-subtitle">
            Making your shopping easier.
          </p>

          <div className="home-buttons">
            <Link to="/login">
              <button className="primary-button">
                Login
              </button>
            </Link>

            <Link to="/login?mode=register">
              <button className="secondary-button">
                Register
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;