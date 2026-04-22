import React, { useState, useEffect, useCallback, useRef } from 'react';

// Grid size 20x20. With 20px cell size, canvas is 400x400
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Moving Up
const BASE_SPEED = 180; // ms

interface Point {
  x: number;
  y: number;
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const directionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
    setHasStarted(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'Escape') {
        if (hasStarted && !gameOver) setIsPaused((p) => !p);
        if (!hasStarted) setHasStarted(true);
        if (gameOver) resetGame();
        return;
      }

      const { x: dx, y: dy } = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (dy !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (dy !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (dx !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (dx !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 15);
    const intervalId = setInterval(moveSnake, speed);
    
    return () => clearInterval(intervalId);
  }, [snake, direction, food, gameOver, isPaused, hasStarted, score, generateFood]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-[400px] flex justify-between items-end mb-4 border-b-2 border-glitch-cyan pb-2">
        <div className="ml-2">
          <h1 className="text-3xl font-bold text-white glitch-text tracking-widest" data-text="EXE.SNAKE">EXE.SNAKE</h1>
          <p className="text-xs text-glitch-magenta uppercase tracking-widest mt-1">PID: 8080</p>
        </div>
        <div className="flex flex-col items-end mr-2">
          <span className="text-[10px] text-gray-500 tracking-widest">MEM_ALLOC//SCORE</span>
          <span className="text-3xl font-bold text-glitch-cyan">0x{score.toString(16).toUpperCase().padStart(4, '0')}</span>
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-glitch-magenta overflow-hidden snake-grid p-0 mt-2"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute transition-all duration-75 ${isHead ? 'snake-head' : 'snake-segment'}`}
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE, 
                height: CELL_SIZE,
              }}
            />
          );
        })}

        <div
          className="absolute snake-food"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        />

        {(!hasStarted || isPaused || gameOver) && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20">
            {!hasStarted && !gameOver && (
              <div className="text-center">
                <p className="text-glitch-cyan text-2xl mb-6 tracking-widest glitch-text" data-text="AWAITING_INPUT...">AWAITING_INPUT...</p>
                <button 
                  onClick={() => setHasStarted(true)}
                  className="px-6 py-3 button-glitch text-xl"
                >
                  [ INITIALIZE ]
                </button>
              </div>
            )}

            {isPaused && hasStarted && !gameOver && (
              <h2 className="text-4xl text-white tracking-widest glitch-text" data-text="INTERRUPT">INTERRUPT</h2>
            )}

            {gameOver && (
              <div className="text-center flex flex-col items-center">
                <h2 className="text-4xl text-glitch-magenta mb-2 glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
                <div className="bg-glitch-magenta text-black px-2 py-1 mb-6 text-sm font-bold">SEGMENTATION FAULT (CORE DUMPED)</div>
                <p className="text-white mb-6 text-xl">DEC: {score} // HEX: 0x{score.toString(16).toUpperCase()}</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 button-glitch text-xl"
                >
                  [ REBOOT ]
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-2 text-sm text-gray-500 w-full max-w-[400px]">
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span>DIR_CONTROL:</span>
          <span className="text-white font-bold">[W.A.S.D] / [ARROWS]</span>
        </div>
        <div className="flex justify-between border-b border-gray-800 pb-1">
          <span>SYS_INTERRUPT:</span>
          <span className="text-white font-bold">[SPACE]</span>
        </div>
      </div>
    </div>
  );
}
