// src/Snake.js
import React from 'react';
import './Snake.css';

const Snake = ({ snake, snakeImage }) => {
  return (
    <div className="snake-container">
      {snake.map((segment, index) => (
        <div
          key={index}
          className="snake-segment"
          style={{
            left: `${segment.x * 20}px`,
            top: `${segment.y * 20}px`,
            backgroundImage: snakeImage ? `url(${snakeImage})` : 'none',
          }}
        />
      ))}
    </div>
  );
};

export default Snake;
