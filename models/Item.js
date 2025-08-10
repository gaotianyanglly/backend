import { Schema, model } from 'mongoose';

const itemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model('Item', itemSchema);