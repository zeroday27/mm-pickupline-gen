// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PickupLineGenerator from './components/PickupLineGenerator';
import AdminPanel from './components/admin/AdminPanel';
import { ThemeToggle } from './components/ThemeToggle';
import { Sparkles } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 transition-colors duration-300">
        {/* Header */}
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 dark:from-purple-900/20 dark:to-pink-900/20" />
          <div className="max-w-4xl mx-auto px-4 py-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Bumese Pickup Lines
                </h1>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 pb-8">
          <Routes>
            <Route path="/" element={<PickupLineGenerator />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
          Made with ❤️ for Myanmar
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
