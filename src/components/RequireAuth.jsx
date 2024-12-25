import React from 'react';
    import { useAuth } from '../contexts/AuthContext';
    import { Navigate, useLocation } from 'react-router-dom';

    export function RequireAuth({ children }) {
      const { currentUser } = useAuth();
      const location = useLocation();

      if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
      }

      return children;
    }
