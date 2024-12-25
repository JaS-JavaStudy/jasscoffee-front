import { Navigate } from 'react-router-dom';
import { checkAdminPermission } from '../apis/userapis/admin';

const ProtectedRoute = ({ element }) => {
  if (!checkAdminPermission()) {
    return <Navigate to="/unauthorized" replace />;
  }
  return element; 
};

export default ProtectedRoute;
