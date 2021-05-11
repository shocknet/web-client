import React from "react";
import "./css/index.css";

const Divider = ({ text }) => {
  return (
    <div className="divider-container">
      <div className="dash" />
      <p className="divider-text">{text}</p>
      <div className="dash" />
    </div>
  );
};

export default Divider;
