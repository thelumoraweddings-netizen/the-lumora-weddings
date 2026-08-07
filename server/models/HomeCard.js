const mongoose = require('mongoose');

const HomeCardSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  img: { type: String, default: '' },
  cat: { type: String, required: true },
  title: { type: String, required: true },
  link: { type: String, default: '' },
  order: { type: Number, default: 0 },
  
  // Inner Page Fields
  innerTitle: { type: String, default: '' },
  innerDescription1: { type: String, default: '' },
  innerDescription2: { type: String, default: '' },
  heroLeft: { type: String, default: '' },
  heroCenter: { type: String, default: '' },
  heroRight: { type: String, default: '' },
  galleryImages: { type: [String], default: [] },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

HomeCardSchema.index({ order: 1 });

module.exports = mongoose.model('HomeCard', HomeCardSchema);
