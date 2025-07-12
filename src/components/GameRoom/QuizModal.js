import React, { useState } from 'react';
import './Modal.css';

const QuizModal = ({ content, onComplete, onClose }) => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const quiz = content.content;
  const questions = quiz.questions || [];

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }));
  };

  const submitQuiz = () => {
    calculateScore();
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
  };

  const handleComplete = () => {
    onComplete(content.id || `quiz-${Date.now()}`, score);
  };

  const allQuestionsAnswered = questions.every((_, index) => answers[index]);

  if (!quiz || !questions.length) {
    return (
      <div className="modal-content quiz-modal">
        <div className="modal-header">
          <h2>Error</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>No quiz content available</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="modal-content quiz-modal">
        <div className="modal-header">
          <h2>🎉 Quiz Results: {quiz.quizTitle}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="quiz-results">
            <div className="score-display">
              <h3>Your Score: {score}%</h3>
              <div className="score-circle">
                <span className="score-number">{score}</span>
              </div>
              <p className="score-message">
                {score >= 80 ? "🌟 Excellent work!" : 
                 score >= 60 ? "👍 Good job!" : 
                 "💪 Keep practicing!"}
              </p>
            </div>
            
            <div className="results-breakdown">
              <h4>📋 Detailed Results:</h4>
              {questions.map((question, index) => (
                <div key={index} className="result-item">
                  <div className="question-text">
                    <strong>Q{index + 1}:</strong> {question.questionText}
                  </div>
                  <div className={`answer ${answers[index] === question.correctAnswer ? 'correct' : 'incorrect'}`}>
                    <span className="answer-label">Your answer:</span> {answers[index]}
                    {answers[index] === question.correctAnswer ? (
                      <span className="correct-indicator"> ✅</span>
                    ) : (
                      <div className="correct-answer">
                        <span className="correct-indicator">❌</span>
                        <br />
                        <strong>Correct answer:</strong> {question.correctAnswer}
                      </div>
                    )}
                  </div>
                  {question.explanation && (
                    <div className="explanation">
                      <strong>💡 Explanation:</strong> {question.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn complete-btn" onClick={handleComplete}>
            Complete Quiz ✅
          </button>
        </div>
      </div>
    );
  }

  // Show all questions in a scrollable format
  return (
    <div className="modal-content quiz-modal">
      <div className="modal-header">
        <h2>{quiz.quizTitle}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="quiz-info">
        <div className="quiz-progress">
          {Object.keys(answers).length} of {questions.length} questions answered
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="modal-body quiz-scrollable">
        <div className="all-questions">
          {questions.map((question, index) => (
            <div key={index} className="question-container">
              <div className="question-header">
                <h4>Question {index + 1}</h4>
                {answers[index] && <span className="answered-indicator">✓ Answered</span>}
              </div>
              
              <div className="question-text">{question.questionText}</div>
              
              <div className="options-container">
                {question.options.map((option, optionIndex) => (
                  <label 
                    key={optionIndex} 
                    className={`option-label ${answers[index] === option ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={() => handleAnswerSelect(index, option)}
                      className="option-input"
                    />
                    <span className="option-text">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="modal-footer">
        <div className="quiz-submission">
          <div className="submission-info">
            <p>
              {allQuestionsAnswered 
                ? "All questions answered! Ready to submit." 
                : `Please answer all questions (${Object.keys(answers).length}/${questions.length} completed)`
              }
            </p>
          </div>
          <button 
            className={`btn submit-btn ${allQuestionsAnswered ? 'enabled' : 'disabled'}`}
            onClick={submitQuiz}
            disabled={!allQuestionsAnswered}
          >
            Submit Quiz 📝
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
