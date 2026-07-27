import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wraps any route that should only be visible to logged-in users.
// If there is no user in context, redirect to /login.

export default function PrivateRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to='/login' replace />;
}