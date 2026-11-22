import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PickupLineGenerator from './components/PickupLineGenerator';
import AdminPanel from './components/admin/AdminPanel';

export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<PickupLineGenerator />} />
    <Route path="/admin" element={<AdminPanel />} />
  </Routes></BrowserRouter>;
}
