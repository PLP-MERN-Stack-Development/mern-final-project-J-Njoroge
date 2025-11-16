import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { carbonAPI } from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await carbonAPI.getEntries();
      setEntries(response.data);
    } catch (err) {
      console.error('Failed to fetch entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (entries.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Date', 'Category', 'Description', 'CO2 (kg)'];
    const rows = entries.map(entry => [
      new Date(entry.date).toLocaleDateString(),
      entry.category,
      entry.description,
      entry.co2kg.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecotrack-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`}
                alt={user.name}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-emerald-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total CO₂ Tracked</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {user.totalCO2?.toFixed(2) || '0.00'} kg
                </p>
              </div>

              <div className="bg-amber-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg font-semibold text-amber-700">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Statistics</h2>
              <button
                onClick={exportToCSV}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded transition"
              >
                Export CSV
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Entries</p>
                    <p className="text-2xl font-bold text-gray-800">{entries.length}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Average per Entry</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {entries.length > 0
                        ? (entries.reduce((sum, e) => sum + e.co2kg, 0) / entries.length).toFixed(2)
                        : '0.00'}{' '}
                      kg
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Recent Activity
                  </h3>
                  {entries.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No entries yet. Start tracking your carbon footprint!
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {entries.slice(0, 20).map(entry => (
                        <div
                          key={entry._id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded"
                        >
                          <div>
                            <p className="font-medium text-gray-800">{entry.description}</p>
                            <p className="text-sm text-gray-600">
                              {entry.category} • {new Date(entry.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-emerald-600 font-semibold">
                            {entry.co2kg.toFixed(2)} kg
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

