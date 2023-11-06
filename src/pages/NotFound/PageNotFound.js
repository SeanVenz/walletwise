import React from "react";
import "./PageNotFound.scss";
import { Link } from "react-router-dom";
import potatoMagni from "../../images/big-potato.png";

function PageNotFound() {
  return (
    <div className="page-not-found">
      <h1>Whoops!</h1>
      <p>404 Page Not Found</p>
      <div className="img-holder">
        <img src={potatoMagni} alt="Logo"></img>
        <img src={potatoMagni} alt="Logo"></img>
      </div>
      <p className="pad-left">
        Looks like this page already finished its Thesis and went on vacation.
      </p>
      <p>
        Go back to the <Link to="/student/market">Market</Link> Instead.
      </p>
    </div>
  );
}

export default PageNotFound;
