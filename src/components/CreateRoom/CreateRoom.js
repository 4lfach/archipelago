import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './CreateRoom.css';

const CreateRoom = ({ gameData, setGameData }) => {
  const [hostName, setHostName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('document'))) {
      setUploadedFile(file);
    } else {
      alert('Please upload a PDF or DOCX file');
    }
  };

  const createRoom = () => {
    if (!hostName || !roomName || !uploadedFile) {
      alert('Please fill all fields and upload lecture notes');
      return;
    }

    const roomId = uuidv4().substring(0, 8);
    const newGameData = {
      roomId,
      roomName,
      host: hostName,
      participants: [{ name: hostName, id: uuidv4(), isHost: true }],
      scores: { [hostName]: 0 },
      hostNotes: uploadedFile
    };

    setGameData(newGameData);
    navigate(`/game/${roomId}`);
  };

  return (
    <div className="page-container create-room">
      <h1 className="page-title">Create Game Room</h1>
      
      <div className="form-section">
        <div className="input-group">
          <label>Your Name:</label>
          <input
            type="text"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            placeholder="Enter your name"
            className="form-input"
          />
        </div>

        <div className="input-group">
          <label>Room Name:</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            className="form-input"
          />
        </div>

        <div className="input-group">
          <label>Upload Lecture Notes (PDF/DOCX):</label>
          <div className="file-upload">
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileUpload}
              className="file-input"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="file-label">
              {uploadedFile ? uploadedFile.name : 'Choose File'}
            </label>
          </div>
        </div>

        <button onClick={createRoom} className="btn create-btn">
          Create Room 🏝️
        </button>
      </div>
    </div>
  );
};

export default CreateRoom;
