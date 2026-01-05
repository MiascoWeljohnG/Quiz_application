import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import QuizPage from './components/QuizPage';
import InstructorDashboard from './components/InstructorDashboard';
import './App.css';

// Sample Quiz Data - exported to be shared across components
// eslint-disable-next-line react-refresh/only-export-components
export const QUIZ_DATA = {
  id: 'quiz-001',
  title: 'React Fundamentals Quiz',
  duration: 600, // 10 minutes in seconds
  questions: [
    {
      id: 1,
      question: 'What is React?',
      options: [
        'A JavaScript library for building user interfaces',
        'A CSS framework',
        'A database management system',
        'A server-side language'
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      question: 'What is JSX?',
      options: [
        'A JavaScript XML syntax extension',
        'A CSS preprocessor',
        'A testing framework',
        'A package manager'
      ],
      correctAnswer: 0
    },
    {
      id: 3,
      question: 'What hook is used for side effects in React?',
      options: [
        'useState',
        'useEffect',
        'useContext',
        'useReducer'
      ],
      correctAnswer: 1
    },
    {
      id: 4,
      question: 'What is the Virtual DOM?',
      options: [
        'A real browser DOM',
        'A lightweight copy of the actual DOM',
        'A CSS framework',
        'A JavaScript engine'
      ],
      correctAnswer: 1
    },
    {
      id: 5,
      question: 'What does props stand for?',
      options: [
        'Properties',
        'Proposals',
        'Protocols',
        'Programs'
      ],
      correctAnswer: 0
    }
  ]
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [UserRole, setUserRole] = useState(null);
  const [page, setPage] = useState('login');

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setPage('login');
  };

  const handleLogin = (name, role) => {
    setCurrentUser(name);
    setUserRole(role);
    setPage(role === 'student' ? 'student-dashboard' : 'instructor-dashboard');
  };

  // Render appropriate page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (page === 'student-dashboard') {
    return (
      <StudentDashboard
        currentUser={currentUser}
        onLogout={handleLogout}
        onStartQuiz={() => setPage('quiz')}
      />
    );
  }

  if (page === 'quiz') {
    return (
      <QuizPage
        currentUser={currentUser}
        onComplete={() => setPage('student-dashboard')}
      />
    );
  }

  if (page === 'instructor-dashboard') {
    return (
      <InstructorDashboard
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  return <LoginPage onLogin={handleLogin} />;
};

export default App;