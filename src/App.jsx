import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import HomePage from './pages/HomePage';
import TumorPrediction from './pages/TumorPrediction';
import TumorClassification from './pages/TumorClassification';
import DataManagement from './pages/DataManagement';
import DataExport from './pages/DataExport';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="tumor-prediction" element={<TumorPrediction />} />
          <Route path="tumor-classification" element={<TumorClassification />} />
          <Route path="data-management" element={<DataManagement />} />
          <Route path="data-export" element={<DataExport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
