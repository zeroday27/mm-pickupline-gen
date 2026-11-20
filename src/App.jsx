// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PickupLineGenerator from './components/PickupLineGenerator';
import AdminPanel from './components/admin/AdminPanel';
import { ThemeToggle } from './components/ThemeToggle';


function App() {
  return (
    <BrowserRouter>
      <div className="site-shell">
        <header className="masthead">
          <a href="/" aria-label="Yangon AI pickup lines home"><img src="/brand/logo-mark.svg" alt="" />Yangon AI</a>
          <ThemeToggle />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<PickupLineGenerator />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>

        <footer className="site-footer">Yangon AI <span>Made in Myanmar</span></footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
