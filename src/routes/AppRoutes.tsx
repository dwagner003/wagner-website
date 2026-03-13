import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CampingPage from '../pages/CampingPage';
import NotFoundPage from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/camping" element={<CampingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
