import 'leaflet/dist/leaflet.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home/Home';  // Sửa đường dẫn import từ components thành pages
import Test from './pages/Test/Test'

import './App.css';
import React from 'react';

function App() {
  return (

    <BrowserRouter>
      <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="Test" element={<Test />} />
            {/* <Route path="/visual" element={<Visual />} /> */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
