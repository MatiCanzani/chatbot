import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isChatCompleted } = useAppContext();

  return isChatCompleted ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
