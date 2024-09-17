// src/Food.js
import React from 'react';
import './Food.css';

const Food = ({ food }) => {
  return (
    <div
      className="food"
      style={{
        left: `${food.x * 20}px`,
        top: `${food.y * 20}px`,
      }}
    />
  );
};

export default Food;
