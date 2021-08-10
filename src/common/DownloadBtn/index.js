import React from "react";
import "./css/index.css";

const DownloadBtn = () => {
  return (
    <a
      href="https://My.Lightning.Page"
      target="_blank"
      rel="noreferrer noopener"
      className="download-shockwallet-btn"
    >
      <i className="download-shockwallet-btn-icon fas fa-user"></i>
      <p className="download-shockwallet-btn-text">Create a Lightning Page</p>
    </a>
  );
};

export default DownloadBtn;
