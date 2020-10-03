import React, { useState, useEffect } from "react";
import "./css/Counter.css";

const Counter = ({ value = 0 }) => {
  const [currentValue, setCurrentValue] = useState(0);

  const [counterAnimation, setCounterAnimation] = useState("initial");

  useEffect(() => {
    console.log("Value changed!", value, currentValue);
    setTimeout(() => setCounterAnimation("goUp"), 0);
    setTimeout(() => setCurrentValue(value), 200);
    setTimeout(() => setCounterAnimation("waitDown"), 200);
    setTimeout(() => setCounterAnimation("initial"), 400);
  }, [value]);

  return (
    <div className="counter-container">
      <span className={counterAnimation}>{currentValue}</span>
    </div>
  );
};

export default Counter;
