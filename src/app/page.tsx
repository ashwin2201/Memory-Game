"use client"; 

import React, { useState } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';

import GameBoard from '../components/GameBoard';

const Home: React.FC = () => {
  return (
    <div>
      <WelcomeScreen />
    </div>
  );
};

export default Home;
