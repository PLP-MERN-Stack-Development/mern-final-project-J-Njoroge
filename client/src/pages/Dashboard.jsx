import { useState, useEffect } from 'react';
import { carbonAPI } from '../services/api';
import ActivityForm from '../components/ActivityForm';
import CarbonChart from '../components/CarbonChart';
import PledgeWall from '../components/PledgeWall';

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('track');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [entriesRes, statsRes] = await Promise.all([
        carbonAPI.getEntries(),
        carbonAPI.getStats()
      ]);
      setEntries(entriesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEntryCreated = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-gray-600 text-sm">Total CO₂</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {stats.totalCO2?.toFixed(2) || '0.00'} kg
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Total Entries</p>
                <p className="text-3xl font-bold text-amber-600">
                  {stats.totalEntries || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600 text-sm">Average per Entry</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalEntries > 0
                    ? (stats.totalCO2 / stats.totalEntries).toFixed(2)
                    : '0.00'}{' '}
                  kg
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('track')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'track'
                  ? 'border-b-2 border-emerald-600 text-emerald-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Track Activity
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'charts'
                  ? 'border-b-2 border-emerald-600 text-emerald-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Charts & Analytics
            </button>
            <button
              onClick={() => setActiveTab('pledges')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'pledges'
                  ? 'border-b-2 border-emerald-600 text-emerald-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Pledge Wall
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'track' && (
          <div className="max-w-2xl mx-auto">
            <ActivityForm onSuccess={handleEntryCreated} />
            
            {/* Recent Entries */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Entries</h2>
              {entries.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No entries yet. Log your first activity above!
                </p>
              ) : (
                <div className="space-y-3">
                  {entries.slice(0, 10).map(entry => (
                    <div
                      key={entry._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{entry.description}</p>
                        <p className="text-sm text-gray-600">
                          {entry.category} • {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-emerald-600 font-bold">
                        {entry.co2kg.toFixed(2)} kg CO₂
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'charts' && (
          <div>
            <CarbonChart stats={stats} entries={entries} />
          </div>
        )}

        {activeTab === 'pledges' && (
          <div>
            <PledgeWall />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

