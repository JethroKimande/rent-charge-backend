const express = require('express');
const PaymentReceipt = require('../models/PaymentReceipt');
const Tenant = require('../models/Tenant');
const Invoice = require('../models/Invoice');
const authMiddleware = require('../middleware/auth');
const { generatePDF } = require('../utils/pdfGenerator');
const { sendNotification } = require('../utils/notifier');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const receipts = await PaymentReceipt.find().populate('tenantId invoiceId');
    res.json({ status: 'success', receipts });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const receiptData = req.body;
    const { tenantId, invoiceId, amountPaid } = receiptData;
    const tenant = await Tenant.findById(tenantId);
    const invoice = await Invoice.findById(invoiceId);
    if (!tenant || !invoice) {
      return res.status(404).json({ status: 'error', message: 'Tenant or Invoice not found' });
    }

    // Partial Payment Logic: Apply to oldest unpaid invoice
    const unpaidInvoices = await Invoice.find({
      tenantId,
      status: { $in: ['Pending', 'Overdue'] },
    }).sort({ invoiceDate: 1 });

    let remainingPayment = amountPaid - receiptData.deductions;
    for (let inv of unpaidInvoices) {
      if (remainingPayment <= 0) break;
      const due = inv.totalAmountDue - inv.amountPaid;
      if (due <= remainingPayment) {
        inv.amountPaid = inv.totalAmountDue;
        inv.status = 'Paid';
        remainingPayment -= due;
      } else {
        inv.amountPaid += remainingPayment;
        inv.status = 'Partial';
        remainingPayment = 0;
      }
      await inv.save();
    }

    receiptData.remainingBalance = remainingPayment;
    const receipt = new PaymentReceipt(receiptData);
    await receipt.save();

    // Update tenant
    tenant.amountPaid += amountPaid - receiptData.deductions;
    tenant.paymentStatus = tenant.totalAmountDue <= tenant.amountPaid ? 'Full Payment' : 'Pending';
    await tenant.save();

    // Send Notification
    await sendNotification(tenant.contact, {
      subject: 'Payment Receipt Confirmation',
      text: `Your payment of ${amountPaid} has been received. Transaction Reference: ${receiptData.transactionReference}`,
    });

    // Generate PDF
    const pdf = await generatePDF(receipt, 'Payment Receipt');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${receiptData.transactionReference}.pdf`);
    res.send(pdf);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const receipt = await PaymentReceipt.findById(req.params.id).populate('tenantId invoiceId');
    if (!receipt) {
      return res.status(404).json({ status: 'error', message: 'Receipt not found' });
    }
    res.json({ status: 'success', receipt });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const receipt = await PaymentReceipt.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!receipt) {
      return res.status(404).json({ status: 'error', message: 'Receipt not found' });
    }
    res.json({ status: 'success', message: 'Receipt updated successfully', receipt });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const receipt = await PaymentReceipt.findByIdAndDelete(req.params.id);
    if (!receipt) {
      return res.status(404).json({ status: 'error', message: 'Receipt not found' });
    }
    res.json({ status: 'success', message: 'Receipt deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;