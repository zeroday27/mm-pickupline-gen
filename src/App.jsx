// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PickupLineGenerator from './components/PickupLineGenerator';
import AdminPanel from './components/admin/AdminPanel';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-950 dark:to-gray-900">
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<PickupLineGenerator />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;