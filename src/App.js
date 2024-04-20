import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AppProvider } from './AppContext';
import Preorders from './pages/preorders/preorders';
import Environments from './pages/environments/environments';
import EnvironmentDetails from './pages/environments/environmentDetails';
import Configurations from './pages/configurations/configurations';
import ConfigurationDetails from './pages/configurations/ConfigurationDetails';
import Datacenters from '../src/pages/datacenters';
import AppLayout from './AppLayout';
import PreorderDetails from './pages/preorders/PreorderDetails';

function App() {
  return (
    <Router>
      <AppProvider>
        <div style={{ display: 'flex' }}>
          <div style={{ marginLeft: '20px' }}>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Preorders />} />{' '}
                <Route path="/preorders" element={<Preorders />} />
                <Route path="/preorders/:id" element={<PreorderDetails />} />
                <Route path="/environments" element={<Environments />} />
                <Route path="/environments/:id" element={<EnvironmentDetails />} />
                <Route path="/configurations" element={<Configurations />} />
                <Route path="/configurations/:id" element={<ConfigurationDetails />} />
                <Route path="/datacenters" element={<Datacenters />} />
              </Routes>
            </AppLayout>
          </div>
        </div>
      </AppProvider>
    </Router>
  );
}

export default App;
