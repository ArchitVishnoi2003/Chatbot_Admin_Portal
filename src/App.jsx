import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PrivacyPolicy from './PrivacyPolicy';
import AdminPortal from './AdminPortal';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <Router>
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/">Privacy Policy</Link>
        <Link to="/admin">Admin Portal</Link>
      </nav>
      <Routes>
        <Route path="/" element={<PrivacyPolicy />} />
        <Route path="/admin" element={<AdminPortal />} />
      </Routes>
    </Router>
  );
}

export default App
