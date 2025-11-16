import { useState, useEffect } from 'react';
import { pledgeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PledgeCard from './PledgeCard';
import { io } from 'socket.io-client';

const PledgeWall = () => {
  const { user } = useAuth();
  const [pledges, setPledges] = useState([]);
  const [newPledge, setNewPledge] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPledges();

    // Socket.io connection
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiUrl.replace('/api', '');
    const socket = io(baseUrl, {
      withCredentials: true
    });

    socket.on('connect', () => {
      socket.emit('join-pledge-room');
    });

    socket.on('new-pledge', (pledge) => {
      setPledges(prev => [pledge, ...prev]);
    });

    socket.on('pledge-updated', (updatedPledge) => {
      setPledges(prev =>
        prev.map(p => p._id === updatedPledge._id ? updatedPledge : p)
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchPledges = async () => {
    try {
      setLoading(true);
      const response = await pledgeAPI.getPledges();
      setPledges(response.data);
    } catch (err) {
      setError('Failed to load pledges');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to make a pledge');
      return;
    }

    if (newPledge.trim().length < 10) {
      setError('Pledge must be at least 10 characters');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await pledgeAPI.createPledge({ text: newPledge });
      setPledges(prev => [response.data, ...prev]);
      setNewPledge('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create pledge');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePledgeUpdate = (updatedPledge) => {
    setPledges(prev =>
      prev.map(p => p._id === updatedPledge._id ? updatedPledge : p)
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Eco-Pledge Wall</h2>

      {user && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Make a Pledge</h3>
          <form onSubmit={handleSubmit}>
            <textarea
              value={newPledge}
              onChange={(e) => {
                setNewPledge(e.target.value);
                setError('');
              }}
              placeholder="Share your eco-pledge (minimum 10 characters)..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-3"
            />
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting || newPledge.trim().length < 10}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded transition disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Pledge'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading pledges...</div>
      ) : (
        <div className="space-y-4">
          {pledges.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pledges yet. Be the first to make a pledge!
            </div>
          ) : (
            pledges.map(pledge => (
              <PledgeCard
                key={pledge._id}
                pledge={pledge}
                onUpdate={handlePledgeUpdate}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PledgeWall;

