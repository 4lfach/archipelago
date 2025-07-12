import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import GameGraph from './GameGraph';
import './GameRoom.css';

const GameRoom = ({ gameData, setGameData }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [playerFile, setPlayerFile] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [playerProgress, setPlayerProgress] = useState({});

  useEffect(() => {
    if (!gameData.roomId) {
      navigate('/');
      return;
    }
    setShareLink(window.location.href);
    
    const currentUser = gameData.participants.find(p => p.isHost);
    if (currentUser) {
      setHasJoined(true);
    }
  }, [gameData, navigate]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('document'))) {
      setPlayerFile(file);
    } else {
      alert('Please upload a PDF or DOCX file');
    }
  };

  const joinGame = () => {
    if (!playerName || !playerFile) {
      alert('Please enter your name and upload lecture notes');
      return;
    }

    const newParticipant = {
      name: playerName,
      id: uuidv4(),
      isHost: false,
      file: playerFile
    };

    const updatedGameData = {
      ...gameData,
      participants: [...gameData.participants, newParticipant],
      scores: { ...gameData.scores, [playerName]: 0 }
    };

    setGameData(updatedGameData);
    setHasJoined(true);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Share link copied to clipboard!');
  };

  const startGame = () => {
    if (gameData.participants.length < 1) {
      alert('Need at least 1 participant to start the game!');
      return;
    }
    setGameStarted(true);
  };

  const updatePlayerProgress = (nodeId, completed, score = 0) => {
    setPlayerProgress(prev => ({
      ...prev,
      [nodeId]: { completed, score }
    }));
  };

  if (!gameData.roomId) {
    return <div>Loading...</div>;
  }

  const isHost = gameData.participants.some(p => p.isHost && hasJoined);

  if (gameStarted) {
    return (
      <GameGraph 
        gameData={gameData}
        playerProgress={playerProgress}
        updatePlayerProgress={updatePlayerProgress}
        onGameComplete={() => navigate(`/scoreboard/${roomId}`)}
      />
    );
  }

  return (
    <div className="page-container game-room">
      <h1 className="page-title">🏝️ {gameData.roomName}</h1>
      
      <div className="room-info">
        <div className="room-id">
          <strong>Room ID: </strong>{gameData.roomId}
        </div>
        
        <div className="share-section">
          <div className="share-link">
            <input 
              type="text" 
              value={shareLink} 
              readOnly 
              className="link-input"
            />
            <button onClick={copyShareLink} className="btn copy-btn">
              Copy Link
            </button>
          </div>
        </div>
      </div>

      {!hasJoined && (
        <div className="join-form">
          <h2>Join the Game</h2>
          <div className="input-group">
            <label>Your Name:</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="form-input"
            />
          </div>

          <div className="input-group">
            <label>Upload Your Lecture Notes (PDF/DOCX):</label>
            <div className="file-upload">
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileUpload}
                className="file-input"
                id="player-file-upload"
              />
              <label htmlFor="player-file-upload" className="file-label">
                {playerFile ? playerFile.name : 'Choose File'}
              </label>
            </div>
          </div>

          <button onClick={joinGame} className="btn join-btn">
            Join Game 🌊
          </button>
        </div>
      )}

      <div className="participants-section">
        <h2>Participants ({gameData.participants.length})</h2>
        <div className="participants-list">
          {gameData.participants.map((participant, index) => (
            <div key={participant.id} className="participant-card">
              <div className="participant-info">
                <span className="participant-name">
                  {participant.name}
                  {participant.isHost && ' 👑'}
                </span>
                <span className="participant-status">
                  ✅ Notes uploaded
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isHost && (
        <div className="host-controls">
          <button onClick={startGame} className="btn start-btn">
            Start Learning Journey 🎯
          </button>
          <p className="host-info">
            As the host, you can start the learning journey when ready!
          </p>
        </div>
      )}
    </div>
  );
};

export default GameRoom;
