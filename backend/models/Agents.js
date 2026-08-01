import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  did: { type: String, required: true, unique: true }, // The cryptographic ID
  name: { type: String, required: true },
  owner: { type: String, required: true }, // The human wallet address
  type: { type: String, default: 'Autonomous Task Agent' },
  reputation: { type: Number, default: 700 },
  successRate: { type: Number, default: 98.5 },
  completedTasks: { type: Number, default: 0 },
  historicalDefaults: { type: Number, default: 0 },
  walletBalance: { type: Number, default: 0 },
  collateralStaked: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Agent', agentSchema);