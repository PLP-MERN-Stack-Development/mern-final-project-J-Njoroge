import { useState } from 'react';
import { pledgeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PledgeCard = ({ pledge, onUpdate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const isLiked = user && pledge.likes.some(like => 
    typeof like === 'object' ? like._id === user._id : like === user._id
  );

  const handleLike = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await pledgeAPI.toggleLike(pledge._id);
      if (onUpdate) onUpdate(response.data);
    } catch (err) {
      console.error('Like error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={pledge.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(pledge.user?.name || 'User')}&background=10b981&color=fff`}
            alt={pledge.user?.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-800">{pledge.user?.name || 'Anonymous'}</p>
            <p className="text-sm text-gray-500">{formatDate(pledge.createdAt)}</p>
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{pledge.text}</p>
      
      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          disabled={!user || loading}
          className={`flex items-center gap-2 px-3 py-1 rounded transition ${
            isLiked
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } disabled:opacity-50`}
        >
          <span>{isLiked ? '❤️' : '🤍'}</span>
          <span>{pledge.likes?.length || 0}</span>
        </button>
      </div>
    </div>
  );
};

export default PledgeCard;

