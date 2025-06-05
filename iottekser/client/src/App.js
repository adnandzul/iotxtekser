// src/App.js
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './HomePage';
import LogTable from './components/LogTable';
import Navbar from './components/Navbar';
import ChartsPage from './components/ChartsPage';
import Charts from './components/Charts';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';

// 👇 Tambahan baru
import LoginPage from './components/LoginPage';
import DeleteLogsPage from './components/DeleteLogsPage';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/logs" element={<LogTable />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/chartspage" element={<ChartsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* ✅ Routing login dan admin page */}
            <Route path="/admin" element={<LoginPage />} />
            <Route path="/admin/delete" element={<DeleteLogsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
