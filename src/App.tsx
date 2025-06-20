import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { Dashboard } from './components/Dashboard/Dashboard';

function App() {
  const { isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <div className="auth-container">
          {showLogin ? (
            <Login onToggleForm={toggleForm} />
          ) : (
            <Register onToggleForm={toggleForm} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
