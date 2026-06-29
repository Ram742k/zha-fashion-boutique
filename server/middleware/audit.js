const AuditLog = require('../models/AuditLog');

const logAudit = async (userId, action, details, req) => {
  try {
    const ip = req ? (req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress) : 'system';
    const audit = new AuditLog({
      user: userId,
      action,
      details,
      ip_address: ip
    });
    await audit.save();
  } catch (err) {
    console.error('Audit logging failed:', err);
  }
};

module.exports = { logAudit };
