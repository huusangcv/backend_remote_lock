const AppLock = require('../models/AppLock');
const LockHistory = require('../models/LockHistory');

const DEFAULT_APP_ID = 'production-statistics-manager';

// Ensure AppLock document exists (create if not found)
const ensureAppLock = async (appId = DEFAULT_APP_ID) => {
  let appLock = await AppLock.findOne({ appId });
  if (!appLock) {
    appLock = await AppLock.create({
      appId,
      isLocked: false,
      lockReason: '',
      lockMessage: '',
    });
  }
  return appLock;
};

// @desc    Check lock status (PUBLIC - no API key needed)
// @route   GET /api/lock/status
// @route   GET /api/lock/status/:appId
const getStatus = async (req, res, next) => {
  try {
    const appId = req.params.appId || DEFAULT_APP_ID;
    const appLock = await ensureAppLock(appId);

    res.status(200).json({
      success: true,
      data: {
        appId: appLock.appId,
        isLocked: appLock.isLocked,
        lockReason: appLock.lockReason,
        lockMessage: appLock.lockMessage,
        lockedAt: appLock.lockedAt,
        updatedAt: appLock.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lock the application (ADMIN - requires API key)
// @route   POST /api/lock/lock
const lockApp = async (req, res, next) => {
  try {
    const { appId = DEFAULT_APP_ID, reason = '', message = '' } = req.body;

    const appLock = await ensureAppLock(appId);
    appLock.isLocked = true;
    appLock.lockReason = reason;
    appLock.lockMessage = message || 'Ung dung dang bi khoa boi quan tri vien.';
    appLock.lockedAt = new Date();
    appLock.lockedBy = 'admin';
    await appLock.save();

    // Log history
    await LockHistory.create({
      appId,
      action: 'LOCK',
      reason,
      message: appLock.lockMessage,
      performedBy: 'admin',
      clientInfo: {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.status(200).json({
      success: true,
      message: 'Application locked successfully',
      data: {
        appId: appLock.appId,
        isLocked: appLock.isLocked,
        lockReason: appLock.lockReason,
        lockMessage: appLock.lockMessage,
        lockedAt: appLock.lockedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unlock the application (ADMIN - requires API key)
// @route   POST /api/lock/unlock
const unlockApp = async (req, res, next) => {
  try {
    const { appId = DEFAULT_APP_ID } = req.body;

    const appLock = await ensureAppLock(appId);
    appLock.isLocked = false;
    appLock.lockReason = '';
    appLock.lockMessage = '';
    appLock.unlockedAt = new Date();
    await appLock.save();

    // Log history
    await LockHistory.create({
      appId,
      action: 'UNLOCK',
      reason: 'Unlocked by admin',
      performedBy: 'admin',
      clientInfo: {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.status(200).json({
      success: true,
      message: 'Application unlocked successfully',
      data: {
        appId: appLock.appId,
        isLocked: appLock.isLocked,
        unlockedAt: appLock.unlockedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get lock/unlock history (ADMIN - requires API key)
// @route   GET /api/lock/history
const getHistory = async (req, res, next) => {
  try {
    const { appId = DEFAULT_APP_ID, limit = 50, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [history, total] = await Promise.all([
      LockHistory.find({ appId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      LockHistory.countDocuments({ appId }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        history,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStatus,
  lockApp,
  unlockApp,
  getHistory,
};