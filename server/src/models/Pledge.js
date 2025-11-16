import mongoose from 'mongoose';

const pledgeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Please provide a pledge text'],
    trim: true,
    maxlength: [500, 'Pledge cannot be more than 500 characters'],
    minlength: [10, 'Pledge must be at least 10 characters']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Pledge', pledgeSchema);

