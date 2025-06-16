const express = require('express');
const Tenant = require('../models/Tenant');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.json({ status: 'success', tenants });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const tenantData = req.body;
    tenantData.waterConsumption = tenantData.waterMeterReading.current - tenantData.waterMeterReading.previous;
    const tenant = new Tenant(tenantData);
    await tenant.save();
    res.status(201).json({ status: 'success', message: 'Tenant added successfully', tenant });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ status: 'error', message: 'Tenant not found' });
    }
    res.json({ status: 'success', tenant });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const tenantData = req.body;
    if (tenantData.waterMeterReading) {
      tenantData.waterConsumption = tenantData.waterMeterReading.current - tenantData.waterMeterReading.previous;
    }
    tenantData.updatedAt = Date.now();
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, tenantData, { new: true });
    if (!tenant) {
      return res.status(404).json({ status: 'error', message: 'Tenant not found' });
    }
    res.json({ status: 'success', message: 'Tenant updated successfully', tenant });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) {
      return res.status(404).json({ status: 'error', message: 'Tenant not found' });
    }
    res.json({ status: 'success', message: 'Tenant deleted successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;