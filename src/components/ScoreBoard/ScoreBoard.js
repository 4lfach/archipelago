import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ScoreBoard.css';

const ScoreBoard = ({ gameData }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [sortedParticipants, setSortedParticipants] = useState([]);
  const [islands, setIslands] = useState([]);

  useEffect(() => {
    if (!gameData.roomId) {
      navigate('/');
      return;
    }

    // Sort participants by score
    const sorted = gameData.participants
      .map(participant => ({
        ...participant,
        score: gameData.scores[participant.name] || 0
      }))
      .sort((a, b) => b.score - a.score);

    setSortedParticipants(sorted);

    // Generate islands based on scores
    const generatedIslands = sorted.map((participant, index) => ({
      id: participant.id,
      name: participant.name,
      score: participant.score,
      rank: index + 1,
      islandSize: getIslandSize(participant.score),
      position: getIslandPosition(index, sorted.length)
    }));

    setIslands(generatedIslands);
  }, [gameData, navigate]);

  const getIslandSize = (score) => {
    if (score >= 80) return 'large';
    if (score >= 60) return 'medium';
    if (score >= 40) return 'small';
    return 'tiny';
  };

  const getIslandPosition = (index, total) => {
    const positions = [
      { top: '20%', left: '50%' }, // 1st place - center top
      { top: '40%', left: '25%' }, // 2nd place - left
      { top: '40%', left: '75%' }, // 3rd place - right
      { top: '65%', left: '40%' }, // 4th place
      { top: '65%', left: '60%' }, // 5th place
      { top: '80%', left: '30%' }, // 6th place
      { top: '80%', left: '70%' }, // 7th place
    ];
    return positions[index] || { top: '85%', left: `${20 + (index % 5) * 15}%` };
  };

  const getRankEmoji = (rank) => {
    switch (rank) {
      case 1: return '🏆';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏝️';
    }
  };

  const getIslandEmoji = (size) => {
    switch (size) {
      case 'large': return '🏝️';
      case 'medium': return '🏖️';
      case 'small': return '🗻';
      case 'tiny': return '⛰️';
      default: return '🏝️';
    }
  };

  if (!gameData.roomId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="scoreboard-container">
      <div className="scoreboard-header">
        <h1 className="page-title">🏝️ Archipelago Results</h1>
        <p className="room-name">{gameData.roomName}</p>
      </div>

      <div className="archipelago-map">
        <div className="sea-surface">
          {islands.map((island) => (
            <div
              key={island.id}
              className={`island ${island.islandSize}`}
              style={{
                top: island.position.top,
                left: island.position.left,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="island-content">
                <div className="island-emoji">
                  {getIslandEmoji(island.islandSize)}
                </div>
                <div className="island-info">
                  <div className="rank-badge">
                    {getRankEmoji(island.rank)} #{island.rank}
                  </div>
                  <div className="player-name">{island.name}</div>
                  <div className="player-score">{island.score} pts</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="leaderboard">
        <h2>🏆 Final Scores</h2>
        <div className="leaderboard-list">
          {sortedParticipants.map((participant, index) => (
            <div
              key={participant.id}
              className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}
            >
              <div className="rank">
                <span className="rank-number">{index + 1}</span>
                <span className="rank-emoji">{getRankEmoji(index + 1)}</span>
              </div>
              <div className="player-info">
                <span className="player-name">
                  {participant.name}
                  {participant.isHost && ' 👑'}
                </span>
              </div>
              <div className="score">
                {participant.score} pts
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="actions">
        <button
          onClick={() => navigate(`/game/${roomId}`)}
          className="btn back-btn"
        >
          Back to Room
        </button>
        <button
          onClick={() => navigate('/')}
          className="btn new-game-btn"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default ScoreBoard;
