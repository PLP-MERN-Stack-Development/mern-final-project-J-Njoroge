import mongoose from 'mongoose';

const carbonEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['transport', 'energy', 'food', 'waste', 'shopping', 'other']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  co2kg: {
    type: Number,
    required: true,
    min: [0, 'CO2 cannot be negative']
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update user's totalCO2 when a new entry is created
carbonEntrySchema.post('save', async function() {
  const User = mongoose.model('User');
  const entries = await mongoose.model('CarbonEntry').find({ user: this.user });
  const total = entries.reduce((sum, entry) => sum + entry.co2kg, 0);
  await User.findByIdAndUpdate(this.user, { totalCO2: total });
});

// Update user's totalCO2 when an entry is deleted
carbonEntrySchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const User = mongoose.model('User');
    const entries = await mongoose.model('CarbonEntry').find({ user: doc.user });
    const total = entries.reduce((sum, entry) => sum + entry.co2kg, 0);
    await User.findByIdAndUpdate(doc.user, { totalCO2: total });
  }
});

export default mongoose.model('CarbonEntry', carbonEntrySchema);

