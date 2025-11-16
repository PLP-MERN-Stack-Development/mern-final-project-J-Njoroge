import { useState } from 'react';
import { carbonAPI } from '../services/api';

const ActivityForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    activityType: '',
    amount: '',
    co2kg: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = {
    transport: ['car', 'bus', 'train', 'plane', 'bike', 'walk'],
    energy: ['electricity', 'gas', 'heating'],
    food: ['meat', 'dairy', 'vegetables', 'grains'],
    waste: ['plastic', 'paper', 'organic'],
    shopping: ['clothing', 'electronics', 'general'],
    other: ['default']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        category: formData.category,
        description: formData.description,
        date: formData.date
      };

      if (formData.co2kg) {
        data.co2kg = parseFloat(formData.co2kg);
      } else if (formData.activityType && formData.amount) {
        data.activityType = formData.activityType;
        data.amount = parseFloat(formData.amount);
      } else {
        setError('Please provide either CO2 value or activity details');
        setLoading(false);
        return;
      }

      await carbonAPI.createEntry(data);
      setFormData({
        category: '',
        description: '',
        activityType: '',
        amount: '',
        co2kg: '',
        date: new Date().toISOString().split('T')[0]
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Log Activity</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select category</option>
            {Object.keys(categories).map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="e.g., Drove to work"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {formData.category && categories[formData.category] && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity Type
            </label>
            <select
              name="activityType"
              value={formData.activityType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select type</option>
              {categories[formData.category].map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (optional)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="e.g., 10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Or CO2 (kg) *
            </label>
            <input
              type="number"
              name="co2kg"
              value={formData.co2kg}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="e.g., 2.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Log Activity'}
        </button>
      </form>
    </div>
  );
};

export default ActivityForm;

