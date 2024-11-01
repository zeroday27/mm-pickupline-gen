// src/App.jsx
import React from 'react';
import PickupLineGenerator from './components/PickupLineGenerator';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  return (
    <div>
      <ThemeToggle />
      <PickupLineGenerator />
    </div>
  );
}

export default App;