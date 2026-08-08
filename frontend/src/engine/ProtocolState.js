/**
 * Global Reactive Protocol State Manager
 * Tracks Lender Liquidity Pool, User Investor Balance, Active Loans, and Whitelisted Vendors.
 * All monetary values are in ₹ INR.
 */

class ProtocolStateManager {
  constructor() {
    this.lenderPool = 4100000;       // Total protocol capital available (₹)
    this.userInvestment = 410000;    // User's active deposit in the pool (₹)
    this.userYieldEarned = 14965;    // User's earned protocol interest (₹)
    this.totalBorrowed = 1025000;    // Active outstanding loan capital (₹)
    this.whitelistedVendors = [
      { domain: "modal.com", category: "GPU Compute", trustScore: 99 },
      { domain: "runpod.io", category: "GPU Compute", trustScore: 98 },
      { domain: "together.ai", category: "LLM Inference", trustScore: 97 },
      { domain: "uniswap.v3", category: "DeFi Router", trustScore: 95 },
      { domain: "chainlink.oracle", category: "Data Oracle", trustScore: 100 }
    ];
    this.activeLoans = [
      {
        id: "loan_9921",
        agentName: "Nexus-7 (Compute Agent)",
        agentDID: "did:agent:0x89F3b219a10E812cD0294711AA190A521098bcAA",
        loanAmount: 41000,
        interestRate: 4.2,
        expectedPayoff: 53300,
        vendor: "modal.com",
        status: "ACTIVE",
        disbursedAmount: 39360,
        createdAt: "2026-08-01 15:30"
      },
      {
        id: "loan_4412",
        agentName: "Aether-X (Arbitrage Agent)",
        agentDID: "did:agent:0x34C8971Bae771923A8712111bb910A0019C48911",
        loanAmount: 82000,
        interestRate: 6.5,
        expectedPayoff: 91840,
        vendor: "uniswap.v3",
        status: "ACTIVE",
        disbursedAmount: 82000,
        createdAt: "2026-08-01 15:45"
      }
    ];

    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l(this.getState()));
  }

  depositCapital(amount) {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return false;
    this.lenderPool += num;
    this.userInvestment += num;
    this.notify();
    return true;
  }

  withdrawCapital(amount) {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0 || num > this.userInvestment || num > this.lenderPool) return false;
    this.lenderPool -= num;
    this.userInvestment -= num;
    this.notify();
    return true;
  }

  addCustomLoan(loan) {
    this.activeLoans.unshift(loan);
    this.lenderPool -= loan.loanAmount;
    this.totalBorrowed += loan.loanAmount;
    this.notify();
  }

  repayLoan(loanId, repaidPrincipal, repaidInterest) {
    const loan = this.activeLoans.find(l => l.id === loanId);
    if (loan) {
      loan.status = "REPAID";
      this.lenderPool += (repaidPrincipal + repaidInterest);
      this.totalBorrowed = Math.max(0, this.totalBorrowed - loan.loanAmount);
      
      // Give user a share of interest based on their pool ownership ratio
      const userShare = (this.userInvestment / Math.max(1, this.lenderPool)) * repaidInterest;
      this.userYieldEarned += Math.round(userShare * 100) / 100;

      this.notify();
    }
  }

  addVendorWhitelist(domain, category, trustScore) {
    if (!this.whitelistedVendors.some(v => v.domain === domain)) {
      this.whitelistedVendors.push({ domain, category, trustScore });
      this.notify();
    }
  }

  getState() {
    return {
      lenderPool: this.lenderPool,
      userInvestment: this.userInvestment,
      userYieldEarned: this.userYieldEarned,
      totalBorrowed: this.totalBorrowed,
      whitelistedVendors: [...this.whitelistedVendors],
      activeLoans: [...this.activeLoans]
    };
  }
}

export const ProtocolState = new ProtocolStateManager();
