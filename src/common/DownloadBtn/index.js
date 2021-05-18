import React from "react";
import "./css/index.css";

const DownloadBtn = () => {
  return (
    <a
      href="https://wallet.shock.pub"
      target="_blank"
      rel="noreferrer noopener"
      className="download-shockwallet-btn"
    >
      <i className="download-shockwallet-btn-icon fas fa-user"></i>
      <p className="download-shockwallet-btn-text">Create a Shockwallet</p>
    </a>
  );
};

export default DownloadBtn;
