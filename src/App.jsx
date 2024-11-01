// src/App.jsx
import React from 'react';
import PickupLineGenerator from './components/PickupLineGenerator';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-950 dark:to-gray-900 transition-colors duration-200 p-4">
      <ThemeToggle />
      <PickupLineGenerator />
    </div>
  );
}

export default App;