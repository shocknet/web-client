import React from "react";

const Loader = ({ text = "Loading..." }) => (
  <div className="loading-wall">
    <div className="loading-wall-icon">
      <span class="loading-circle loading-circle-1"></span>
      <span class="loading-circle loading-circle-2"></span>
      <span class="loading-circle loading-circle-3"></span>
      <span class="loading-circle loading-circle-4"></span>
      <span class="loading-circle loading-circle-5"></span>
    </div>
    <div className="loading-wall-text">{text}</div>
  </div>
);

export default Loader;
