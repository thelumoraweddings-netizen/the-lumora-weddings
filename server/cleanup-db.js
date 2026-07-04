const mongoose = require('mongoose');
require('dotenv').config();
const Quotation = require('./models/Quotation');

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const result = await Quotation.deleteMany({
      $or: [
        { clientName: 'Integration Test Client' },
        { id: { $exists: false } },
        { id: null }
      ]
    });

    console.log('Deleted bad quotations:', result.deletedCount);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

cleanup();
