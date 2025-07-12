import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateRoom from './components/CreateRoom/CreateRoom';
import GameRoom from './components/GameRoom/GameRoom';
import ScoreBoard from './components/ScoreBoard/ScoreBoard';
import SeaBackground from './components/SeaBackground/SeaBackground';
import Navigation from './components/Navigation/Navigation';
import './App.css';

function App() {
  const [gameData, setGameData] = useState({
    roomId: null,
    participants: [],
    scores: {},
    hostNotes: null
  });

  return (
    <Router>
      <div className="App">
        <SeaBackground />
        <Navigation />
        <div className="content">
          <Routes>
            <Route 
              path="/" 
              element={<CreateRoom gameData={gameData} setGameData={setGameData} />} 
            />
            <Route 
              path="/game/:roomId" 
              element={<GameRoom gameData={gameData} setGameData={setGameData} />} 
            />
            <Route 
              path="/scoreboard/:roomId" 
              element={<ScoreBoard gameData={gameData} />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
