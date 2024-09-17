// src/VolumeControl.js
import React, { useState, useEffect } from 'react';

const VolumeControl = ({ audioRef }) => {
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);

  return (
    <div className="volume-control">
      <label htmlFor="volume">Volume</label>
      <input
        id="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
      />
    </div>
  );
};

export default VolumeControl;
