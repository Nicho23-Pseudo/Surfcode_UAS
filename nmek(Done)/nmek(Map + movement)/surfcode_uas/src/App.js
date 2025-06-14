/*import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import InitialScreen from './components/InitialScreen/InitialScreen';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/

// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InitialScreen from './components/InitialScreen/InitialScreen';
import Map from './components/InitialScreen/Map';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<InitialScreen />} />
                <Route path="/map" element={<Map />} />
            </Routes>
        </Router>
    );
}

export default App;