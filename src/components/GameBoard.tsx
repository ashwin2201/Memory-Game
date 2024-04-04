"use client"

import React, { useState, useEffect } from 'react';
import Square from './Square';

// Interface for our memory game squares
interface Square {
    id: React.Key;
    isGreen: boolean;
}

// Initial parameters for the game
const INITIAL_TIME_LEFT = 10; // 10 second timer
const INITIAL_LEVEL = 1;
const INITIAL_GREEN_SQUARES = 3;
const INITIAL_TIME_TAKEN = 0;

const GameBoard: React.FC = () => {
    const [squares, setSquares] = useState<Square[]>([]);
    const [selectedSquares, setSelectedSquares] = useState<Square[]>([]);
    const [timeLeft, setTimeLeft] = useState<number>(INITIAL_TIME_LEFT);
    const [startTime, setStartTime] = useState<number>(INITIAL_TIME_TAKEN);
    const [timeTaken, setTimeTaken] = useState<number>(INITIAL_TIME_TAKEN);
    const [gamePhase, setGamePhase] = useState<'welcome' | 'memorise' | 'guess' | 'won' | 'lost'>('welcome');
    const [level, setLevel] = useState<number>(INITIAL_LEVEL);
    const [greenSquares, setGreenSquares] = useState<number>(INITIAL_GREEN_SQUARES);

    // Level requirements to indicate the grid size and number of green squares
    const levelRequirements = (level: number) => {
        switch(level) {
            case 1: return { gridSize: 9, numGreenSquares: 3 };
            case 2: return { gridSize: 9, numGreenSquares: 4 };
            case 3: return { gridSize: 16, numGreenSquares: 4 };
            case 4: return { gridSize: 16, numGreenSquares: 5 };
            case 5: return { gridSize: 16, numGreenSquares: 6 };
            case 6: return { gridSize: 25, numGreenSquares: 5 };
            case 7: return { gridSize: 25, numGreenSquares: 6 };
            case 8: return { gridSize: 25, numGreenSquares: 7 };
            case 9: return { gridSize: 36, numGreenSquares: 6 };
            case 10: return { gridSize: 36, numGreenSquares: 7 };
            default: return { gridSize: 9, numGreenSquares: 3 }; // default to level 1 requirements
        }
    }

    // restart the game
    const restartGame = () => {
        setLevel(1);
        setSquares([]);
        setSelectedSquares([]);
        setTimeLeft(INITIAL_TIME_LEFT); 
        setGamePhase('welcome');
    }

    // generate the squares for the game
    const shuffleSquares = () => {
        const { gridSize, numGreenSquares } = levelRequirements(level);
        setGreenSquares(numGreenSquares);

        const initSquares = Array(gridSize).fill(null);
        const shuffledSquares = [...initSquares]
            .map((square) => ({ ...square, id: Math.random(), isGreen: false }));
        let greenCount = 0;
        while (greenCount < numGreenSquares) {
            const randomIndex = Math.floor(Math.random() * initSquares.length);
        
            if (!shuffledSquares[randomIndex].isGreen) {
                shuffledSquares[randomIndex].isGreen = true;
                greenCount += 1;
            } 
        }
        setSquares(shuffledSquares);
        setGamePhase('memorise');
    }

    // retry the level
    const handleRetry = () => {
        setGamePhase('memorise');
        setSelectedSquares([]);
        shuffleSquares();
        setTimeLeft(INITIAL_TIME_LEFT); 
    };

    // countdown
    useEffect(() => {
        if (gamePhase === 'memorise') {
            if (timeLeft === 0) {
                setGamePhase('guess');
            } else {
                const timerId = setTimeout(() => {
                    setTimeLeft(timeLeft - 1);
                }, 1000);
                return () => clearTimeout(timerId);
            }
        }
  
    }, [timeLeft, gamePhase]);

    // handle choice each time a square is clicked
    const handleSelection = (square: Square) => {
        if (gamePhase === 'guess') {
            setSelectedSquares([...selectedSquares, square]);
        }
    }

    // next level
    useEffect(() => {
        if (gamePhase === 'won') {
            setSquares([]);
            setSelectedSquares([]);
            shuffleSquares();
            setTimeLeft(INITIAL_TIME_LEFT);
            setGamePhase('memorise'); 
        }
    }, [level])

    // evaluate selection
    useEffect(() => {
        if (selectedSquares.length === greenSquares) {
            const correct = selectedSquares.every((square: { id: React.Key, isGreen: boolean }) => square.isGreen);
            if (correct) {
                alert('You win!');
                setGamePhase('won');
            } else {
                alert('You lose!');
                setGamePhase('lost');
            }
            
        }
    }, [selectedSquares])

    // measure time taken to solve the puzzle
    useEffect(() => {
        if (gamePhase === 'guess') {
            setStartTime(Date.now());
        }
        else if (gamePhase === 'won' || gamePhase === 'lost') {
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;
            setTimeTaken(Math.round(duration * 100) / 100);
        }
    }, [gamePhase]);
    
    
    return (
    <div className="game">
        {gamePhase === 'welcome' && 
        <div>
            <p>Please get ready as we will now start the game </p>
            <button onClick={shuffleSquares}>Start game</button>
         </div>}
        {gamePhase === 'memorise' && <p>Memorise the squares! Time left: {timeLeft}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.sqrt(squares.length)}, 1fr)`, gap: '10px' }}>
            {
                squares.map((square: { id: React.Key, isGreen: boolean }) => (
                    <Square
                        key={square.id}
                        showGreen={gamePhase !== 'guess' ? square.isGreen : false}
                        square={square}
                        handleSelection={handleSelection}
                        gamePhase={gamePhase}
                        selected={selectedSquares.some((selectedSquare: { id: React.Key }) => selectedSquare.id === square.id)}
                    />
                ))
            }
        </div>
        {gamePhase === 'won' && level < 10 && <div>
                                    <p>Congratulations! We shall now begin level {level+1}</p>
                                    <p>You took {timeTaken} seconds to solve this puzzle</p>
                                    <button onClick={() => setLevel(level + 1)}>Proceed to level {level+1}</button>
                                </div>}
        {gamePhase === 'won' && level === 10 && <div>
                                    <p>Congratulations! You have completed all levels. Well done!</p>
                                    <button onClick={restartGame}>Play again</button>
                                </div>}
        {gamePhase === 'lost' && <button onClick={handleRetry}>Try again</button>}
    </div>
    );
};

export default GameBoard;
