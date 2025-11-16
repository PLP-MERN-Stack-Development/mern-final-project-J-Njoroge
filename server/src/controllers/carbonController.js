import CarbonEntry from '../models/CarbonEntry.js';

// CO2 calculation factors (kg CO2 per unit)
const CO2_FACTORS = {
  transport: {
    car: 0.21, // per km
    bus: 0.089, // per km
    train: 0.041, // per km
    plane: 0.255, // per km
    bike: 0, // per km
    walk: 0 // per km
  },
  energy: {
    electricity: 0.5, // per kWh
    gas: 2.0, // per m³
    heating: 0.3 // per kWh
  },
  food: {
    meat: 27.0, // per kg
    dairy: 3.2, // per kg
    vegetables: 2.0, // per kg
    grains: 1.4 // per kg
  },
  waste: {
    plastic: 2.5, // per kg
    paper: 0.8, // per kg
    organic: 0.5 // per kg
  },
  shopping: {
    clothing: 15.0, // per item
    electronics: 50.0, // per item
    general: 5.0 // per item
  },
  other: {
    default: 1.0 // per unit
  }
};

// Calculate CO2 based on category and activity
export const calculateCO2 = (category, activityType, amount) => {
  const factors = CO2_FACTORS[category] || CO2_FACTORS.other;
  const factor = factors[activityType] || factors.default || 1.0;
  return parseFloat((factor * amount).toFixed(2));
};

// @desc    Get all carbon entries for user
// @route   GET /api/carbon
// @access  Private
export const getCarbonEntries = async (req, res) => {
  try {
    const entries = await CarbonEntry.find({ user: req.user._id })
      .sort({ date: -1 })
      .populate('user', 'name email');
    
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new carbon entry
// @route   POST /api/carbon
// @access  Private
export const createCarbonEntry = async (req, res) => {
  try {
    const { category, description, activityType, amount, co2kg, date } = req.body;

    // Validation
    if (!category || !description) {
      return res.status(400).json({ message: 'Please provide category and description' });
    }

    // Calculate CO2 if not provided
    let calculatedCO2 = co2kg;
    if (!calculatedCO2 && activityType && amount) {
      calculatedCO2 = calculateCO2(category, activityType, parseFloat(amount));
    }

    if (!calculatedCO2 && calculatedCO2 !== 0) {
      return res.status(400).json({ message: 'Please provide CO2 value or activity details' });
    }

    const entry = await CarbonEntry.create({
      user: req.user._id,
      category,
      description,
      co2kg: calculatedCO2,
      date: date || new Date()
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get carbon statistics
// @route   GET /api/carbon/stats
// @access  Private
export const getCarbonStats = async (req, res) => {
  try {
    const entries = await CarbonEntry.find({ user: req.user._id });
    
    // Total CO2
    const totalCO2 = entries.reduce((sum, entry) => sum + entry.co2kg, 0);
    
    // By category
    const byCategory = {};
    entries.forEach(entry => {
      byCategory[entry.category] = (byCategory[entry.category] || 0) + entry.co2kg;
    });
    
    // By date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEntries = entries.filter(e => new Date(e.date) >= thirtyDaysAgo);
    
    const byDate = {};
    recentEntries.forEach(entry => {
      const dateKey = new Date(entry.date).toISOString().split('T')[0];
      byDate[dateKey] = (byDate[dateKey] || 0) + entry.co2kg;
    });
    
    res.json({
      totalCO2,
      byCategory,
      byDate,
      totalEntries: entries.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete carbon entry
// @route   DELETE /api/carbon/:id
// @access  Private
export const deleteCarbonEntry = async (req, res) => {
  try {
    const entry = await CarbonEntry.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await CarbonEntry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

