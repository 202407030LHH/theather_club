import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import './styles/global.css';

// Protected Wrap
const ProtectedRoute = ({ children }) => {
  // In a real app we'd check context, but the layout structure might differ.
  // For now, we allow public access to Home but maybe restrict actions.
  return children;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />

          {/* Placeholders for other routes to avoid errors if clicked */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
