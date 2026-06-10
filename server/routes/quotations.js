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

// PATCH to update assignments
router.patch('/:id/assignments', quotationController.updateQuotationAssignments);

// PATCH to update payments
router.patch('/:id/payments', quotationController.updateQuotationPayments);

// DELETE a quotation by ID
router.delete('/:id', quotationController.deleteQuotation);

module.exports = router;
