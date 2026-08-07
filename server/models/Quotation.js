const mongoose = require('mongoose');

const QuotationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // e.g. Q-1701234567890
    clientName: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    events: { type: mongoose.Schema.Types.Mixed, default: [] },
    albums: { type: mongoose.Schema.Types.Mixed, default: [] },
    finalOuts: { type: mongoose.Schema.Types.Mixed, default: [] },
    complementary: { type: mongoose.Schema.Types.Mixed, default: [] },
    eventType: { type: String, default: '' },
    eventDate: { type: String, default: '' },
    location: { type: String, default: '' },
    additionalServices: { type: [String], default: [] },
    notes: { type: String, default: '' },
    baseAmount: { type: String, default: '' },
    discount: { type: String, default: '' },
    totalAmount: { type: String, default: '' },
    status: { type: String, default: 'Draft' },
    assignments: { type: mongoose.Schema.Types.Mixed, default: [] },
    payments: { type: mongoose.Schema.Types.Mixed, default: [] },
    createdAt: { type: Date, default: Date.now }
});

QuotationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Quotation', QuotationSchema);
