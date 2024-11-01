import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Habits } from './pages/Habits';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="habits" element={<Habits />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;