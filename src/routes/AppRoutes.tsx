import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import { BooksPage } from '../pages/BooksPage';
import { BookDetailsPage } from '../pages/BookDetailsPage';
import { AddBookPage } from '../pages/AddBookPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/books" element={<BooksPage />} />
        <Route
          path="/books/add"
          element={
            <ProtectedRoute>
              <AddBookPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:id"
          element={
            <ProtectedRoute>
              <BookDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};
