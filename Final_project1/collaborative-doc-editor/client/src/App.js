import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [documentContent, setDocumentContent] = useState('');
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  useEffect(() => {
    if (loggedIn) {
      socket.on('update-document', (data) => {
        setDocumentContent(data);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [loggedIn]);

  const handleInputChange = (content) => {
    socket.emit('update-document', content);
  };

  const handleLogin = () => {
    if (username.trim() !== '') {
      setLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setDocumentContent('');
    setUsernameError('');
  };

  const handleSave = () => {
    console.log('Document content saved:', documentContent);
  };

  return (
    <div className="App">
      {loggedIn ? (
        <div className="editor">
          <ReactQuill
            value={documentContent}
            onChange={(content) => handleInputChange(content)}
            modules={{ toolbar: true }}
          />
          <div className="buttons">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="login-container">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameError(''); 
            }}
          />
          {usernameError && <p className="error-message">{usernameError}</p>}
          <button onClick={handleLogin} disabled={!username.trim()}>
            Login
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
