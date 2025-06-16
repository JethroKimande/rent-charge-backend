const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  tenantName: { type: String, required: true },
  premiseNumber: { type: String, required: true },
  contact: { type: String, required: true },
  rentDueDate: { type: Date, required: true },
  waterMeterReading: {
    previous: { type: Number, default: 0 },
    current: { type: Number, default: 0 },
  },
  waterConsumption: { type: Number, default: 0 },
  totalAmountDue: { type: Number, default: 0 },
  amountPaid: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['Pending', 'Full Payment'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Tenant', tenantSchema);