import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    // Check password for instructor role
    if (role === 'instructor') {
      if (password !== 'admin123') {
        setError('Incorrect password for instructor');
        return;
      }
    }

    onLogin(name.trim(), role);
  };

  return (
    <div className="loginbody">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Application</h1>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="label">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Enter your name"
            />
          </div>

          {role === 'instructor' && (
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter instructor password"
              />
            </div>
          )}
          
          <div>
            <label className="label">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-field"
            >
              <option className="option" value="student">Student</option>
              <option className="option" value="instructor">Instructor</option>
            </select>
          </div>

          {error && (
            <div className="error-message">{error}</div>
          )}
          
          <button onClick={handleLogin} className="login-button">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;