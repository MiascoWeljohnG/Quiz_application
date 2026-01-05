import React, { useState, useEffect } from 'react';
import { Award, CheckCircle } from 'lucide-react';
import { QUIZ_DATA } from '../App';

const StudentDashboard = ({ currentUser, onLogout, onStartQuiz }) => {
  const [hasCompleted, setHasCompleted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const submissions = JSON.parse(localStorage.getItem('quizSubmissions') || '[]');
    const userSubmission = submissions.find(s => s.studentName === currentUser);
    
    if (userSubmission) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasCompleted(true);
      setResult(userSubmission);
    }
  }, [currentUser]);

  const isReleased = localStorage.getItem('scoresReleased') === 'true';

  return (
    <div className="studashbody">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
              <p className="text-gray-600">Welcome, {currentUser}!</p>
            </div>
            <button onClick={onLogout} className="logout-button">
              Logout
            </button>
          </div>

          {!hasCompleted ? (
            <div className="text-center py-12">
              <Award className="awardicon" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {QUIZ_DATA.title}
              </h2>
              <p className="text-gray-600 mb-6">
                Duration: {QUIZ_DATA.duration / 60} minutes | {QUIZ_DATA.questions.length} questions
              </p>
              <button onClick={onStartQuiz} className="login-button">
                Start Quiz
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Quiz Completed
              </h2>
              
              {isReleased ? (
                <div className="mt-6 bg-blue-50 p-6 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Your Score:</p>
                  <p className="text-4xl font-bold text-blue-600">
                    {result.score} / {QUIZ_DATA.questions.length}
                  </p>
                  <p className="text-sm text-gray-600 mt-4">
                    Violations: {result.violations}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Submitted: {new Date(result.timestamp).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <p className="text-gray-700">
                    Your answers have been submitted. Please wait for the instructor to release the results.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;