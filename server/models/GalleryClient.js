const mongoose = require('mongoose');

const GalleryClientSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // custom id e.g. client-1234
  categoryId: { type: String, required: true },
  name: { type: String, required: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  content: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  images: { type: [String], default: [] },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GalleryClient', GalleryClientSchema);
