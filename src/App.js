import 'leaflet/dist/leaflet.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home/Home';  // Sửa đường dẫn import từ components thành pages
import Test from './pages/Test/Test'
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <div className="App" style={{ overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="Test" element={<Test />} />
            
            {/* Admin Routes */}
            <Route path="/admin-page/login" element={<AdminLogin />} />
            <Route
              path="/admin-page/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-page"
              element={<Navigate to="/admin-page/dashboard" replace />}
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
