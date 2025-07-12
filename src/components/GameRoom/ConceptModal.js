import React from 'react';
import './Modal.css';

const ConceptModal = ({ content, onComplete, onClose }) => {
  const concept = content.content;
  
  const handleComplete = () => {
    onComplete(content.id || `concept-${Date.now()}`, 10);
  };

  if (!concept) {
    return (
      <div className="modal-content concept-modal">
        <div className="modal-header">
          <h2>Error</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>No content available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-content concept-modal">
      <div className="modal-header">
        <h2>{concept.conceptTitle}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="modal-body">
        <div className="concept-content">
          <div dangerouslySetInnerHTML={{ __html: concept.conceptExplanation }} />
        </div>
        
        {/* Show related quizzes */}
        {concept.quizzes && concept.quizzes.length > 0 && (
          <div className="related-section">
            <h3>🎯 Related Quizzes:</h3>
            <ul className="related-list">
              {concept.quizzes.map((quiz, index) => (
                <li key={index} className="related-item">
                  <strong>{quiz.quizTitle}</strong>
                  <p>{quiz.questions?.length || 0} questions</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Show additional materials */}
        {concept.additionalMaterials && concept.additionalMaterials.length > 0 && (
          <div className="related-section">
            <h3>📚 Additional Learning Materials:</h3>
            <ul className="related-list">
              {concept.additionalMaterials.map((material, index) => (
                <li key={index} className="related-item">
                  <strong>{material.title}</strong>
                  <p>{material.description}</p>
                  <a href={material.url} target="_blank" rel="noopener noreferrer" className="source-link">
                    🔗 Open {material.type}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="modal-footer">
        <button className="btn complete-btn" onClick={handleComplete}>
          Complete ✅
        </button>
      </div>
    </div>
  );
};

export default ConceptModal;
