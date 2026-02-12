import React from 'react';
import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import { CompanyProvider } from './context/CompanyContext';

function App() {
  return (
    <CompanyProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5' }}>
          <Sidebar />
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Header />
            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
              <Routes>
                <Route path="/" element={<Companies />} />
                <Route path="/company/:id" element={<CompanyDetails />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </BrowserRouter>
    </CompanyProvider>
  );
}

export default App;
