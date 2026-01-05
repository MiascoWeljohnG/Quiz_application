import React, { useState, useEffect } from 'react';
import { Users, Eye, EyeOff } from 'lucide-react';
import { QUIZ_DATA } from '../App';

const InstructorDashboard = ({ currentUser, onLogout }) => {
  const [submissions, setSubmissions] = useState([]);
  const [scoresReleased, setScoresReleased] = useState(false);

  useEffect(() => {
    loadSubmissions();
    setScoresReleased(localStorage.getItem('scoresReleased') === 'true');
  }, []);

  const loadSubmissions = () => {
    const data = JSON.parse(localStorage.getItem('quizSubmissions') || '[]');
    setSubmissions(data);
  };

  const releaseScores = () => {
    localStorage.setItem('scoresReleased', 'true');
    setScoresReleased(true);
  };

  const hideScores = () => {
    localStorage.setItem('scoresReleased', 'false');
    setScoresReleased(false);
  };

  return (
    <div className="studashbody">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Instructor Dashboard</h1>
              <p className="text-gray-600">Welcome, {currentUser}!</p>
            </div>
            <button onClick={onLogout} className="logout-button">
              Logout
            </button>
          </div>

          <div className="instudashbody mb-6 flex justify-between items-center">
            <button
              onClick={scoresReleased ? hideScores : releaseScores}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
                scoresReleased
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {scoresReleased ? (
                <>
                  <EyeOff className="w-5 h-5" />
                  Hide Results
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" />
                  Release Results
                </>
              )}
            </button>
            
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              scoresReleased ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-yellow-800'
            }`}>
              <Users className="w-5 h-5" />
              <span className="font-medium">
                Status: {scoresReleased ? 'Scores Released' : 'Scores Hidden'}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th>Name</th>
                  <th>Score</th>
                  <th>Violations</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                      No submissions yet
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800">{sub.studentName}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-blue-600">
                          {sub.score} / {QUIZ_DATA.questions.length}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${
                          sub.violations >= 3 ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {sub.violations}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(sub.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;