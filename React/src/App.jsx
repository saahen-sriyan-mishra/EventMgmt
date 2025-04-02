import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:email" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
