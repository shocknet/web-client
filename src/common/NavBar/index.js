import React from "react";
import "./css/index.css";

// Placeholder to center flexbox alignment
const placeholderIcon = <div className="navbar-icon"></div>;

const NavBar = ({ title, goBack }) => {
  return (
    <div className="navbar">
      {goBack ? (
        <div className="navbar-icon" onClick={goBack}>
          <i className="fas fa-arrow-left" />
        </div>
      ) : (
        placeholderIcon
      )}
      <p className="navbar-title">{title}</p>
      {placeholderIcon}
    </div>
  );
};

export default NavBar;
