import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Notices from './pages/Notices';
import Calendar from './pages/Calendar';
import Photos from './pages/Photos';
import Members from './pages/Members';
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

          {/* 메인 라우트들 */}
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />

          <Route path="/notices" element={
            <Layout>
              <Notices />
            </Layout>
          } />

          <Route path="/calendar" element={
            <Layout>
              <Calendar />
            </Layout>
          } />

          <Route path="/photos" element={
            <Layout>
              <Photos />
            </Layout>
          } />

          <Route path="/members" element={
            <Layout>
              <Members />
            </Layout>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
