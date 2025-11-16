import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pledgeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [globalCO2, setGlobalCO2] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlobalCO2();
    const interval = setInterval(fetchGlobalCO2, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchGlobalCO2 = async () => {
    try {
      const response = await pledgeAPI.getGlobalCO2();
      setGlobalCO2(response.data.globalCO2);
    } catch (err) {
      console.error('Failed to fetch global CO2:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            🌱 EcoTrack
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Track Your Carbon Footprint & Join the Climate Action Movement
          </p>
          
          {/* Global CO2 Counter */}
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto mb-8">
            <h2 className="text-2xl font-bold text-emerald-600 mb-2">
              Global CO₂ Saved
            </h2>
            {loading ? (
              <div className="text-4xl font-bold text-gray-400">Loading...</div>
            ) : (
              <div className="text-5xl font-bold text-emerald-700">
                {globalCO2.toLocaleString()} kg
              </div>
            )}
            <p className="text-gray-500 mt-2">Tracked by EcoTrack users worldwide</p>
          </div>

          {!user ? (
            <div className="flex gap-4 justify-center">
              <Link
                to="/register"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg transition text-lg"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white hover:bg-gray-100 text-emerald-600 font-bold py-3 px-8 rounded-lg border-2 border-emerald-600 transition text-lg"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link
                to="/dashboard"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg transition text-lg"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Track Emissions</h3>
            <p className="text-gray-600">
              Log your daily activities and automatically calculate your carbon footprint
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Visualize Data</h3>
            <p className="text-gray-600">
              See your progress with interactive charts and detailed analytics
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Make Pledges</h3>
            <p className="text-gray-600">
              Join the community and share your eco-pledges in real-time
            </p>
          </div>
        </div>

        {/* SDG Badge */}
        <div className="text-center mt-16">
          <div className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg">
            <p className="font-semibold">SDG 13: Climate Action</p>
            <p className="text-sm">United Nations Sustainable Development Goals</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

