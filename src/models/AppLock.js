const mongoose = require('mongoose');

const appLockSchema = new mongoose.Schema(
  {
    appId: {
      type: String,
      required: true,
      unique: true,
      default: 'production-statistics-manager',
      index: true,
    },
    isLocked: {
      type: Boolean,
      required: true,
      default: false,
    },
    lockReason: {
      type: String,
      default: '',
    },
    lockMessage: {
      type: String,
      default: '',
    },
    lockedAt: {
      type: Date,
      default: null,
    },
    unlockedAt: {
      type: Date,
      default: null,
    },
    lockedBy: {
      type: String,
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AppLock', appLockSchema);