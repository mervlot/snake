import React, { useEffect, useRef, useState } from "react";

const BOARD_SIZE = 15;
const INITIAL_SNAKE = [{ x: 7, y: 7 }];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Up

function getRandomPosition(snake) {
    let position;
    do {
        position = {
            x: Math.floor(Math.random() * BOARD_SIZE),
            y: Math.floor(Math.random() * BOARD_SIZE),
        };
    } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
    return position;
}

const directions = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
};

export default function SnakeGame() {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [food, setFood] = useState(getRandomPosition(INITIAL_SNAKE));
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const moveRef = useRef(direction);
    moveRef.current = direction;

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (directions[e.key]) {
                const newDir = directions[e.key];
                if (
                    snake.length === 1 ||
                    (moveRef.current.x !== -newDir.x || moveRef.current.y !== -newDir.y)
                ) {
                    setDirection(newDir);
                }
            }
            if (gameOver && e.key === "Enter") {
                resetGame();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
        // eslint-disable-next-line
    }, [snake, gameOver]);

    useEffect(() => {
        if (gameOver) return;
        const interval = setInterval(() => {
            setSnake(prevSnake => {
                const newHead = {
                    x: prevSnake[0].x + moveRef.current.x,
                    y: prevSnake[0].y + moveRef.current.y,
                };

                if (
                    newHead.x < 0 ||
                    newHead.x >= BOARD_SIZE ||
                    newHead.y < 0 ||
                    newHead.y >= BOARD_SIZE ||
                    prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
                ) {
                    setGameOver(true);
                    return prevSnake;
                }

                let newSnake;
                if (newHead.x === food.x && newHead.y === food.y) {
                    newSnake = [newHead, ...prevSnake];
                    setFood(getRandomPosition(newSnake));
                    setScore(s => s + 1);
                } else {
                    newSnake = [newHead, ...prevSnake.slice(0, -1)];
                }
                return newSnake;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [food, gameOver]);

    function resetGame() {
        setSnake(INITIAL_SNAKE);
        setDirection(INITIAL_DIRECTION);
        setFood(getRandomPosition(INITIAL_SNAKE));
        setGameOver(false);
        setScore(0);
    }

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Snake Game</h2>
            <div style={{ margin: "10px" }}>Score: {score}</div>
            <div
                style={{
                    display: "grid",
                    gridTemplateRows: `repeat(${BOARD_SIZE}, 20px)`,
                    gridTemplateColumns: `repeat(${BOARD_SIZE}, 20px)`,
                    gap: "1px",
                    background: "#222",
                    border: "2px solid #333",
                    margin: "0 auto",
                    width: BOARD_SIZE * 21,
                    userSelect: "none",
                }}
                tabIndex={0}
            >
                {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, idx) => {
                    const x = idx % BOARD_SIZE;
                    const y = Math.floor(idx / BOARD_SIZE);
                    const isHead = snake[0].x === x && snake[0].y === y;
                    const isBody = snake.slice(1).some(seg => seg.x === x && seg.y === y);
                    const isFood = food.x === x && food.y === y;

                    return (
                        <div
                            key={idx}
                            style={{
                                width: 20,
                                height: 20,
                                background: isHead
                                    ? "#3a6"
                                    : isBody
                                        ? "#6d6"
                                        : isFood
                                            ? "#f33"
                                            : "#eee",
                                borderRadius: isFood ? "50%" : 2,
                            }}
                        />
                    );
                })}
            </div>
            {gameOver && (
                <div style={{ marginTop: 15 }}>
                    <h3 style={{ color: "#f33" }}>Game Over!</h3>
                    <button onClick={resetGame}>Restart</button>
                    <div>Press 'Enter' to restart</div>
                </div>
            )}
            <div style={{ marginTop: 10, color: "#888" }}>
                Use arrow keys to move.
            </div>
        </div>
    );
}