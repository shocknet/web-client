import React, { useState, useEffect } from "react";
import "./css/index.css";

const Counter = ({ value = 0 }) => {
  const [currentValue, setCurrentValue] = useState(0);

  const [counterAnimation, setCounterAnimation] = useState("initial");

  useEffect(() => {
    setTimeout(() => setCounterAnimation("goUp"), 0);
    setTimeout(() => setCurrentValue(value), 200);
    setTimeout(() => setCounterAnimation("waitDown"), 200);
    setTimeout(() => setCounterAnimation("initial"), 400);
  }, [currentValue, value]);

  return (
    <div className="counter-container">
      <span className={counterAnimation}>{currentValue}</span>
    </div>
  );
};

export default Counter;
