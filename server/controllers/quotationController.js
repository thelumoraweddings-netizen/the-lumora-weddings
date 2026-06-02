const QuotationStorageService = require('../services/QuotationStorageService');

// Get all quotations
exports.getQuotations = async (req, res) => {
    try {
        const quotations = await QuotationStorageService.getAllQuotations();
        res.status(200).json(quotations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create or Update a quotation
exports.createQuotation = async (req, res) => {
    try {
        const success = await QuotationStorageService.saveQuotation(req.body);
        if (success) {
            res.status(201).json(req.body);
        } else {
            res.status(500).json({ error: 'Failed to save quotation' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateQuotation = exports.createQuotation;

// Delete a quotation
exports.deleteQuotation = async (req, res) => {
    try {
        const success = await QuotationStorageService.deleteQuotation(req.params.id);
        if (success) {
            res.status(200).json({ message: 'Quotation deleted successfully' });
        } else {
            res.status(500).json({ error: 'Failed to delete quotation' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
