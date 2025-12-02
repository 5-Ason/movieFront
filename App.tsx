
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Movies } from './pages/Movies';
import { Actors } from './pages/Actors';
import { SehuatangLibrary } from './pages/SehuatangLibrary';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="movies" element={<Movies />} />
          <Route path="actors" element={<Actors />} />
          <Route path="sehuatang" element={<SehuatangLibrary />} />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
