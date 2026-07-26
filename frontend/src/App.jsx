import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivteRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import './index.css';

export default function App() {
  return (
    // AuthProvider wraps everything so any page can call useAuth()
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* /tasks is protected — PrivateRoute redirects to /login if not authenticated */}
          <Route
            path='/tasks'
            element={
              <PrivteRoute>
                <Tasks />
              </PrivteRoute>
            }
          />

          {/* Any unknown path redirects to /tasks
              (which itself redirects to /login if not logged in) */}
          <Route path='*' element={<Navigate to='/tasks'  replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}