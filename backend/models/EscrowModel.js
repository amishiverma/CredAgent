import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  type: { type: String, required: true }, 
  amount: { type: Number, required: true },
  description: { type: String },
  vendor: { type: String },
  txHash: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  // ADDED WATERFALL FIELDS:
  buyerPayment: { type: Number },
  repaidPrincipal: { type: Number },
  repaidInterest: { type: Number },
  netProfitDisbursed: { type: Number }
});

const escrowSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  agentDID: { type: String, required: true },
  loanAmount: { type: Number, required: true },
  interestRatePercent: { type: Number, required: true },
  interestAmount: { type: Number, required: true },
  totalDebt: { type: Number, required: true },
  targetVendor: { type: String, required: true },
  lockedCapital: { type: Number, required: true },
  spentCapital: { type: Number, default: 0 },
  buyerDeposit: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['INITIALIZED', 'ACTIVE', 'REPAID', 'CIRCUIT_BREAKER_FROZEN'],
    default: 'INITIALIZED' 
  },
  logs: [{ type: String }],
  transactions: [transactionSchema]
}, { timestamps: true });

export default mongoose.model('Escrow', escrowSchema);