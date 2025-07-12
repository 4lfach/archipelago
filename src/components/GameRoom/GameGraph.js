import React, { useState, useCallback, useEffect } from 'react';
import ConceptModal from './ConceptModal';
import QuizModal from './QuizModal';
import AdditionalMaterialModal from './AdditionalMaterial';
import { gamifiedLectureData } from '../../data/lectureData';
import './GameGraph.css';

const GameGraph = ({ gameData, playerProgress, updatePlayerProgress, onGameComplete }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalType, setModalType] = useState('');

  const handleItemClick = useCallback((type, content, id) => {
    console.log('Button clicked:', type, content);
    setModalContent({ type, content, id });
    setModalType(type);
    setModalOpen(true);
  }, []);

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
    setModalType('');
  };

  const handleComplete = (nodeId, score = 0) => {
    updatePlayerProgress(nodeId, true, score);
    closeModal();
    
    // Check if all items are completed
    const allItems = [];
    gamifiedLectureData.coreConcepts.forEach((concept, conceptIndex) => {
      allItems.push(`concept-${conceptIndex}`);
      concept.quizzes.forEach((_, quizIndex) => {
        allItems.push(`quiz-${conceptIndex}-${quizIndex}`);
      });
      concept.additionalMaterials.forEach((_, materialIndex) => {
        allItems.push(`material-${conceptIndex}-${materialIndex}`);
      });
    });
    
    const allCompleted = allItems.every(itemId => 
      playerProgress[itemId]?.completed || itemId === nodeId
    );
    
    if (allCompleted) {
      setTimeout(() => {
        onGameComplete();
      }, 1000);
    }
  };

  // Check if previous concept is completed for unlock logic
  const isPreviousConceptCompleted = (conceptIndex) => {
    if (conceptIndex === 0) return true; // First concept is always unlocked
    return playerProgress[`concept-${conceptIndex - 1}`]?.completed || false;
  };

  const isConceptCompleted = (conceptIndex) => {
    return playerProgress[`concept-${conceptIndex}`]?.completed || false;
  };

  return (
    <div className="game-graph-container">
      <div className="graph-header">
        <h1>🎓 {gamifiedLectureData.title}</h1>
        <p>{gamifiedLectureData.description}</p>
      </div>
      
      <div className="graph-layout">
        {gamifiedLectureData.coreConcepts.map((concept, conceptIndex) => {
          const conceptUnlocked = isPreviousConceptCompleted(conceptIndex);
          const conceptCompleted = isConceptCompleted(conceptIndex);
          const branchesUnlocked = conceptCompleted;

          return (
            <div key={conceptIndex} className="concept-column">
              {/* Quiz Branches (above core concept) */}
              <div className="quiz-branches">
                {concept.quizzes.map((quiz, quizIndex) => {
                  const quizId = `quiz-${conceptIndex}-${quizIndex}`;
                  const quizCompleted = playerProgress[quizId]?.completed;
                  
                  return (
                    <div key={quizIndex} className="branch-item quiz-branch">
                      {/* Connector line from concept to quiz */}
                      <div className={`branch-connector quiz-connector ${branchesUnlocked ? 'unlocked' : 'locked'}`}></div>
                      
                      <button
                        className={`quiz-button ${quizCompleted ? 'completed' : ''} ${!branchesUnlocked ? 'locked' : ''}`}
                        onClick={() => branchesUnlocked && handleItemClick('quiz', quiz, quizId)}
                        disabled={!branchesUnlocked}
                      >
                        <div className="button-content">
                          <div className="button-header">
                            <span className="button-title">{quiz.quizTitle}</span>
                            {quizCompleted && <span className="completion-badge">✅</span>}
                            {!branchesUnlocked && <span className="lock-badge">🔒</span>}
                          </div>
                          <p className="button-description">
                            🎯 {quiz.questions?.length || 0} questions
                          </p>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Core Concept (center) */}
              <div className="concept-center">
                {/* Horizontal connector to previous concept */}
                {conceptIndex > 0 && (
                  <div className={`horizontal-connector ${conceptUnlocked ? 'unlocked' : 'locked'}`}></div>
                )}
                
                <button
                  className={`concept-button ${conceptCompleted ? 'completed' : ''} ${!conceptUnlocked ? 'locked' : ''}`}
                  onClick={() => conceptUnlocked && handleItemClick('concept', concept, `concept-${conceptIndex}`)}
                  disabled={!conceptUnlocked}
                >
                  <div className="button-content">
                    <div className="button-header">
                      <h3>{concept.conceptTitle}</h3>
                      {conceptCompleted && <span className="completion-badge">✅</span>}
                      {!conceptUnlocked && <span className="lock-badge">🔒</span>}
                    </div>
                    <p className="concept-description">Core Concept {conceptIndex + 1}</p>
                    <div className="concept-number">{conceptIndex + 1}</div>
                  </div>
                </button>

                {/* Horizontal connector to next concept */}
                {conceptIndex < gamifiedLectureData.coreConcepts.length - 1 && (
                  <div className={`horizontal-connector right ${conceptCompleted ? 'unlocked' : 'locked'}`}></div>
                )}
              </div>

              {/* Material Branches (below core concept) */}
              <div className="material-branches">
                {concept.additionalMaterials.map((material, materialIndex) => {
                  const materialId = `material-${conceptIndex}-${materialIndex}`;
                  const materialCompleted = playerProgress[materialId]?.completed;
                  
                  return (
                    <div key={materialIndex} className="branch-item material-branch">
                      {/* Connector line from concept to material */}
                      <div className={`branch-connector material-connector ${branchesUnlocked ? 'unlocked' : 'locked'}`}></div>
                      
                      <button
                        className={`material-button ${materialCompleted ? 'completed' : ''} ${!branchesUnlocked ? 'locked' : ''}`}
                        onClick={() => branchesUnlocked && handleItemClick('material', material, materialId)}
                        disabled={!branchesUnlocked}
                      >
                        <div className="button-content">
                          <div className="button-header">
                            <span className="button-title">{material.title}</span>
                            {materialCompleted && <span className="completion-badge">✅</span>}
                            {!branchesUnlocked && <span className="lock-badge">🔒</span>}
                          </div>
                          <div className="material-meta">
                            <span className="material-type">📚 {material.type}</span>
                          </div>
                          <p className="button-description">
                            {material.description.substring(0, 60)}...
                          </p>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="game-modal-overlay" onClick={closeModal}>
          <div className="game-modal" onClick={(e) => e.stopPropagation()}>
            {modalType === 'concept' && (
              <ConceptModal
                content={modalContent}
                onComplete={handleComplete}
                onClose={closeModal}
              />
            )}
            {modalType === 'quiz' && (
              <QuizModal
                content={modalContent}
                onComplete={handleComplete}
                onClose={closeModal}
              />
            )}
            {modalType === 'material' && (
              <AdditionalMaterialModal
                content={modalContent}
                onComplete={handleComplete}
                onClose={closeModal}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameGraph;
