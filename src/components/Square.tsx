import React, { useEffect, useState } from 'react';

interface SquareProps {
  showGreen: boolean;
  handleSelection: (square: { id: React.Key; isGreen: boolean }) => void;
  square: { id: React.Key; isGreen: boolean };
  selected: boolean;
  gamePhase: string;
}

const Square: React.FC<SquareProps> = ({ showGreen, handleSelection, square, selected, gamePhase }) => {
    const [borderColor, setBorderColor] = useState('#7d7d7d');

    const handleClick = () => { 
        handleSelection(square);
        setBorderColor(square.isGreen ? '#28a745' : '#dc3545'); // wrong selection
    }
    
    // change border color based on game phase
    useEffect(() => {
        if (gamePhase === 'guess') {
            setBorderColor('#7d7d7d');
        }
        if (gamePhase === 'memorise') {
            if (showGreen) {
                setBorderColor('#28a745')
            }
            else {
                setBorderColor('#7d7d7d')
            }
        }
        if (gamePhase === 'lost' && square.isGreen && !selected) { 
            setBorderColor('#dc3545'); // show incorrect squares
        }
    }, [gamePhase]);

    return (
        <div
            onClick={handleClick}
            className='square'
            style={{ backgroundColor: showGreen ? '#28a745' : '#7d7d7d' ,
                     border: `5px solid ${borderColor}`
            }}
        ></div>
    );
    };

export default Square;
