const express = require('express');
const Invoice = require('../models/Invoice');
const Tenant = require('../models/Tenant');
const authMiddleware = require('../middleware/auth');
const { generatePDF } = require('../utils/pdfGenerator');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('tenantId');
    res.json({ status: 'success', invoices });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tenantId, totalAmountDue, dueDate } = req.body;
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ status: 'error', message: 'Tenant not found' });
    }
    const invoiceNumber = `INV-${Date.now()}`;
    const invoice = new Invoice({ tenantId, invoiceNumber, totalAmountDue, dueDate });
    await invoice.save();
    tenant.totalAmountDue += totalAmountDue;
    await tenant.save();
    const pdf = await generatePDF(invoice, 'Invoice');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${invoiceNumber}.pdf`);
    res.send(pdf);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('tenantId');
    if (!invoice) {
      return res.status(404).json({ status: 'error', message: 'Invoice not found' });
    }
    res.json({ status: 'success', invoice });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!invoice) {
      return res.status(404).json({ status: 'error', message: 'Invoice not found' });
    }
    res.json({ status: 'success', message: 'Invoice updated successfully', invoice });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ status: 'error', message: 'Invoice not found' });
    }
    res.json({ status: 'success', message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;