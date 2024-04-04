import React from 'react';
import Link from 'next/link';


const WelcomeScreen: React.FC = () => {
  return (
    <div className="welcome-screen">
      <h1>Welcome to the Memory Game</h1>
      <p>Memorize the location of the green squares!</p>
      <p className='rulestext'><u>Rules of the game</u></p>
        <ul>
          <li>Memorize the location of the green squares</li>
          <li>You will be given 10 seconds to memorise the squares</li>
          <li>Click on the squares to select them</li>
          <li>If you select the correct square, a green border appears</li>
          <li>If you select the wrong square, a red border appears</li>
          <li>Once you have selected all the green squares, you win and proceed to the next level</li>
          <li>If you do not select all the green squares, you lose and do not proceed</li>
        </ul>
      <button><Link className='link' href='/game' style={{ textDecoration: 'none' }}>Start Game</Link></button>
    </div>
  );
};

export default WelcomeScreen;
