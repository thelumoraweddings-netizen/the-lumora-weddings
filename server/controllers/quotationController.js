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
        const quotationData = req.body;
        const savedQuotation = await QuotationStorageService.saveQuotation(quotationData);
        res.status(201).json(savedQuotation);
    } catch (err) {
        console.error('Error saving quotation:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateQuotation = exports.createQuotation;

// Delete a quotation
exports.deleteQuotation = async (req, res) => {
    try {
        const deleted = await QuotationStorageService.deleteQuotation(req.params.id);
        if (deleted) {
            res.status(200).json({ message: 'Quotation deleted successfully' });
        } else {
            res.status(404).json({ error: 'Quotation not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
