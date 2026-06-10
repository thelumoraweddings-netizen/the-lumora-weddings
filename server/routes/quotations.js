const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');

// GET all quotations
router.get('/', quotationController.getQuotations);

// POST a new quotation
router.post('/', quotationController.createQuotation);

// PUT to update an existing quotation by ID
router.put('/:id', quotationController.updateQuotation);

// PATCH to update just the status of a quotation
router.patch('/:id/status', quotationController.updateQuotationStatus);

// DELETE a quotation by ID
router.delete('/:id', quotationController.deleteQuotation);

module.exports = router;
