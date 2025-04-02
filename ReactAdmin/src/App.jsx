import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './pages/Admin';
import VendorAtt from './pages/SpringBackend_VenAtt';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/AdminDashBoard" element={<Admin />} />
        <Route path="/vendor-att" element={<VendorAtt />} />
      </Routes>
    </Router>
  );
}

export default App;