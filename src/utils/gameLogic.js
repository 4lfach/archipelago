// Utility functions for game logic

export const generateQuestions = (lectureNotes) => {
  // This would normally process the lecture notes and generate questions
  // For now, we'll return sample questions
  const sampleQuestions = [
    {
      id: 1,
      question: "What is the main topic discussed in the lecture?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: 0
    },
    {
      id: 2,
      question: "Which concept was emphasized in the notes?",
      options: ["Concept 1", "Concept 2", "Concept 3", "Concept 4"],
      correct: 1
    },
    {
      id: 3,
      question: "What is the key takeaway from this material?",
      options: ["Takeaway A", "Takeaway B", "Takeaway C", "Takeaway D"],
      correct: 2
    }
  ];

  return sampleQuestions;
};

export const calculateScore = (answers, questions) => {
  let correct = 0;
  answers.forEach((answer, index) => {
    if (answer === questions[index].correct) {
      correct++;
    }
  });
  
  return Math.round((correct / questions.length) * 100);
};

export const generateRandomScore = () => {
  return Math.floor(Math.random() * 100) + 1;
};

export const processLectureNotes = async (file) => {
  // This would normally process PDF/DOCX files
  // For now, we'll simulate processing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        processed: true,
        content: `Processed content from ${file.name}`,
        wordCount: Math.floor(Math.random() * 5000) + 1000
      });
    }, 2000);
  });
};

export const createRoomId = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

export const validateFileType = (file) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ];
  
  return allowedTypes.includes(file.type);
};

export const calculateFinalScore = (playerProgress) => {
  let totalScore = 0;
  let completedNodes = 0;
  
  Object.values(playerProgress).forEach(progress => {
    if (progress.completed) {
      totalScore += progress.score || 0;
      completedNodes++;
    }
  });
  
  return {
    totalScore,
    completedNodes,
    averageScore: completedNodes > 0 ? Math.round(totalScore / completedNodes) : 0
  };
};

export const getNodePosition = (index, total, type) => {
  // Calculate positions for different node types in the graph
  const basePositions = {
    concept: { x: index * 400 + 200, y: 200 },
    quiz: { x: index * 400 + 50, y: 350 },
    material: { x: index * 400 + 350, y: 50 }
  };
  
  return basePositions[type] || { x: 100, y: 100 };
};

export const generateNodeId = (type, conceptIndex, itemIndex = 0) => {
  return `${type}-${conceptIndex}-${itemIndex}`;
};
