import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-emerald-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold hover:text-emerald-200 transition">
            🌱 EcoTrack
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-emerald-200 transition px-3 py-1 rounded"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="hover:text-emerald-200 transition px-3 py-1 rounded"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-emerald-700 hover:bg-emerald-800 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-emerald-200 transition px-3 py-1 rounded"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-700 hover:bg-emerald-800 px-4 py-2 rounded transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

