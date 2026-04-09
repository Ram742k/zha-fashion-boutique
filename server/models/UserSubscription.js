const mongoose = require('mongoose');

const userSubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  enabled_features: [{ type: String }], // ['email', 'whatsapp', 'sms']
  plan_name: { type: String, default: 'basic' },
  expires_at: { type: Date },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = mongoose.model('UserSubscription', userSubscriptionSchema);
