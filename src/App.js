import React, { useState, useEffect, useRef } from 'react';
import Snake from './Snake';
import Food from './Food';
import './App.css';
import VolumeControl from './components/VolumeControl';
import 'bootstrap/dist/css/bootstrap.min.css';

const GRID_SIZE = 20;

const App = () => {
  const [snake, setSnake] = useState([{ x: 2, y: 2 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [score, setScore] = useState(0);
  const [snakeImage, setSnakeImage] = useState(null);
  const [audioSrc, setAudioSrc] = useState('');
  const gameIntervalRef = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const defaultMusic = `${process.env.PUBLIC_URL}/music/background.mp3`;

  const changeDirection = (e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado de scroll
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      default:
        break;
    }
  };

  const handleDirectionButtonClick = (dir) => {
    if (direction !== dir) {
      setDirection(dir);
    }
  };

  const moveSnake = () => {
    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
        default:
          break;
      }

      if (head.x === food.x && head.y === food.y) {
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        });
        setScore(score + 1);
        return [head, ...newSnake];
      }

      newSnake.pop();
      newSnake.unshift(head);

      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE ||
        newSnake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setIsGameOver(true);
        clearInterval(gameIntervalRef.current);
        if (audioRef.current) {
          audioRef.current.pause();
        }
        return prevSnake;
      }

      return newSnake;
    });
  };

  const restartGame = () => {
    setSnake([{ x: 2, y: 2 }]);
    setFood({ x: 5, y: 5 });
    setDirection('RIGHT');
    setIsGameOver(false);
    setSpeed(200);
    setScore(0);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reiniciar el audio desde el principio
      audioRef.current.play(); // Reproducir la música al iniciar el juego
    }
  };

  useEffect(() => {
    if (isGameOver || !isPlaying) return;

    document.addEventListener('keydown', changeDirection);

    gameIntervalRef.current = setInterval(moveSnake, speed);

    return () => {
      clearInterval(gameIntervalRef.current);
      document.removeEventListener('keydown', changeDirection);
    };
  }, [direction, isGameOver, isPlaying, speed]);

  useEffect(() => {
    if (isPlaying) {
      if (audioRef.current && audioSrc) {
        audioRef.current.play();
      }

      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);

      return () => {
        clearInterval(timerRef.current);
      };
    }
  }, [isPlaying, audioSrc]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSnakeImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!audioSrc) {
      setAudioSrc(defaultMusic);
    }
  }, [audioSrc]);

  return (
    <div className="App" tabIndex="0">
      <h1>Si te sirve de algo, nunca es muy tarde para ser quien tú quieras ser. No hay límite de tiempo; empieza cuando quieras. Puedes cambiar o seguir igual. La vida no tiene reglas.</h1>
      <div className="audio-controls">
        <VolumeControl audioRef={audioRef} />
        <p>Tiempo de Reproducción: {formatTime(elapsedTime)}</p>
        <p>Comidas: {score}</p>
        <div className="upload-controls">
          <label htmlFor="image-upload" className="upload-label">
            Escoge tu avatar
            <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} />
          </label>
          <label htmlFor="audio-upload" className="upload-label">
            Escoge tu música local
            <input id="audio-upload" type="file" accept="audio/*" onChange={handleAudioUpload} />
          </label>
        </div>
      </div>
      <div className="game-board" onClick={() => document.getElementById('App').focus()}>
        {isPlaying && <Snake snake={snake} snakeImage={snakeImage} />}
        {isPlaying && <Food food={food} />}
      </div>
      {isGameOver && (
        <div className="game-over">
          <h2>Game Over</h2>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
      {!isPlaying && !isGameOver && (
        <button onClick={startGame} className="start-button">Empezar a Jugar</button>
      )}
      <div className="controls-container">
        <div className="controls">
          <div className="control-row">
            <button className="control-button" onClick={() => handleDirectionButtonClick('UP')}>↑</button>
          </div>
          <div className="control-row">
            <button className="control-button" onClick={() => handleDirectionButtonClick('LEFT')}>←</button>
            <button className="control-button" onClick={() => handleDirectionButtonClick('DOWN')}>↓</button>
            <button className="control-button" onClick={() => handleDirectionButtonClick('RIGHT')}>→</button>
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        loop
      />
    </div>
  );
};

export default App;
