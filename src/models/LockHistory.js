const mongoose = require('mongoose');

const lockHistorySchema = new mongoose.Schema(
  {
    appId: {
      type: String,
      required: true,
      default: 'production-statistics-manager',
    },
    action: {
      type: String,
      required: true,
      enum: ['LOCK', 'UNLOCK'],
    },
    reason: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    performedBy: {
      type: String,
      default: 'admin',
    },
    clientInfo: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
lockHistorySchema.index({ appId: 1, createdAt: -1 });

module.exports = mongoose.model('LockHistory', lockHistorySchema);