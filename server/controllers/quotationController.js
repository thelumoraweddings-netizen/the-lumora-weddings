const Quotation = require('../models/Quotation');

// Get all quotations
exports.getQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find().sort({ createdAt: -1 });
        res.status(200).json(quotations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create or Update a quotation
exports.createQuotation = async (req, res) => {
    try {
        const quotationData = req.body;
        // Upsert based on the custom 'id' field (e.g. Q-1234)
        const updatedQuotation = await Quotation.findOneAndUpdate(
            { id: quotationData.id },
            quotationData,
            { new: true, upsert: true }
        );
        res.status(201).json(updatedQuotation);
    } catch (err) {
        console.error('Error saving quotation:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateQuotation = exports.createQuotation;

// Delete a quotation
exports.deleteQuotation = async (req, res) => {
    try {
        // Delete by custom 'id' field
        const deleted = await Quotation.findOneAndDelete({ id: req.params.id });
        if (deleted) {
            res.status(200).json({ message: 'Quotation deleted successfully' });
        } else {
            res.status(404).json({ error: 'Quotation not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
