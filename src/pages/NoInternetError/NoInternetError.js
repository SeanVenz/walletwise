import React from "react";
import "./NoInternetError.scss";
import gif from "../../images/no-internet.gif";

function NoInternetError() {
  return (
    <div className="no-internet-error">
      <div className="description">
        <p>No Internet Connection</p>
      </div>
      <img src={gif}></img>
      <div className="description">
        <p>Wild Connect Wifi ain't Wifi-ing</p>
      </div>
    </div>
  );
}

export default NoInternetError;
