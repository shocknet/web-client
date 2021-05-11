import React from "react";
import "./css/index.css";

const NoticeBar = ({ icon = "link", text, visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="notice-bar">
      <i className={`fas fa-${icon}`} />
      {text}
    </div>
  );
};

export default NoticeBar;
