import React, { useState, useEffect, useCallback } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { QUIZ_DATA } from '../App';

const QuizPage = ({ currentUser, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_DATA.duration);
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitQuiz = useCallback(() => {
    if (isSubmitted) return;
    
    let score = 0;
    QUIZ_DATA.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    const submission = {
      studentName: currentUser,
      score: score,
      violations: violations,
      timestamp: new Date().toISOString(),
      answers: answers
    };

    const submissions = JSON.parse(localStorage.getItem('quizSubmissions') || '[]');
    
    const existingIndex = submissions.findIndex(s => s.studentName === currentUser);
    if (existingIndex !== -1) {
      submissions[existingIndex] = submission;
    } else {
      submissions.push(submission);
    }
    
    localStorage.setItem('quizSubmissions', JSON.stringify(submissions));
    
    setIsSubmitted(true);
    onComplete();
  }, [answers, violations, isSubmitted, currentUser, onComplete]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      submitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitQuiz]);

  // Tab switching detection
  useEffect(() => {
    let violationTimeout = null;

    const recordViolation = () => {
      if (violationTimeout) {
        clearTimeout(violationTimeout);
      }

      violationTimeout = setTimeout(() => {
        setViolations(v => {
          const newViolations = v + 1;
          setShowWarning(true);
          
          if (newViolations >= 3) {
            submitQuiz();
          }
          
          return newViolations;
        });
      }, 100);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation();
      }
    };

    const handleBlur = () => {
      recordViolation();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      if (violationTimeout) {
        clearTimeout(violationTimeout);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [submitQuiz]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const currentQ = QUIZ_DATA.questions[currentQuestion];

  return (
    <div className="studashbody">
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
              Warning!
            </h3>
            <p className="text-gray-600 text-center mb-4">
              You switched tabs or minimized the window. This has been logged as a violation.
            </p>
            <p className="text-red-600 text-center font-semibold mb-4">
              Violations: {violations} / 3
            </p>
            {violations >= 3 && (
              <p className="text-red-600 text-center font-semibold mb-4">
                Maximum violations reached. Quiz will be auto-submitted.
              </p>
            )}
            <button
              onClick={() => setShowWarning(false)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Continue Quiz
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="clock-icon" />
              <span className={`text-lg font-semibold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-800'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Violations: <span className="font-semibold text-red-600">{violations}/3</span>
              </span>
              <span className="text-sm text-gray-600">
                Question {currentQuestion + 1} / {QUIZ_DATA.questions.length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-3 mb-8">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(currentQ.id, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  answers[currentQ.id] === index
                    ? 'border-[#ab2c2c] bg-red-50'
                    : 'border-gray-200 hover:border-[#ab2c2c]'
                }`}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="previous-button"
            >
              Previous
            </button>

            {currentQuestion === QUIZ_DATA.questions.length - 1 ? (
              <button onClick={submitQuiz} className="submit-button">
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(Math.min(QUIZ_DATA.questions.length - 1, currentQuestion + 1))}
                className="next-button"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;