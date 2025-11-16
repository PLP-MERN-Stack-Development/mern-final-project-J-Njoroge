import Pledge from '../models/Pledge.js';

// @desc    Get all pledges
// @route   GET /api/pledge
// @access  Public
export const getPledges = async (req, res) => {
  try {
    const pledges = await Pledge.find()
      .populate('user', 'name avatar')
      .populate('likes', 'name')
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json(pledges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new pledge
// @route   POST /api/pledge
// @access  Private
export const createPledge = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ message: 'Pledge must be at least 10 characters' });
    }

    const pledge = await Pledge.create({
      user: req.user._id,
      text: text.trim()
    });

    const populatedPledge = await Pledge.findById(pledge._id)
      .populate('user', 'name avatar')
      .populate('likes', 'name');

    // Emit socket event for real-time update
    if (req.io) {
      req.io.to('pledge-room').emit('new-pledge', populatedPledge);
    }

    res.status(201).json(populatedPledge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like/Unlike a pledge
// @route   POST /api/pledge/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
  try {
    const pledge = await Pledge.findById(req.params.id);
    
    if (!pledge) {
      return res.status(404).json({ message: 'Pledge not found' });
    }

    const userId = req.user._id.toString();
    const likeIndex = pledge.likes.findIndex(
      id => id.toString() === userId
    );

    if (likeIndex > -1) {
      // Unlike
      pledge.likes.splice(likeIndex, 1);
    } else {
      // Like
      pledge.likes.push(userId);
    }

    await pledge.save();

    const populatedPledge = await Pledge.findById(pledge._id)
      .populate('user', 'name avatar')
      .populate('likes', 'name');

    // Emit socket event for real-time update
    if (req.io) {
      req.io.to('pledge-room').emit('pledge-updated', populatedPledge);
    }

    res.json(populatedPledge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get global CO2 saved (sum of all users' totalCO2)
// @route   GET /api/pledge/global-co2
// @access  Public
export const getGlobalCO2 = async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const users = await User.find({}, 'totalCO2');
    const globalCO2 = users.reduce((sum, user) => sum + (user.totalCO2 || 0), 0);
    
    res.json({ globalCO2: parseFloat(globalCO2.toFixed(2)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

