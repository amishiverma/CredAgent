export const MOCK_AGENTS = [
  {
    id: "agent-001",
    name: "Nexus-7 (Compute & Fine-Tuning Agent)",
    did: "did:agent:0x89F3b219a10E812cD0294711AA190A521098bcAA",
    parentOrg: "OpenCompute Labs Inc. (0x71C...89B)",
    reputationScore: 815,
    tier: "Tier A+ (Prime)",
    completedTasks: 142,
    successRate: 98.6,
    totalBorrowed: "$48,500 USDC",
    totalRepaid: "$48,500 USDC",
    defaultRate: 0.0,
    whitelistedVendors: ["modal.com", "runpod.io", "together.ai", "openrouter.ai"],
    description: "Autonomously acquires GPU compute to execute fine-tuning jobs for enterprise clients upon escrow deposit confirmation.",
    maxCreditLimit: 5000,
    suggestedInterestRate: 4.2
  },
  {
    id: "agent-002",
    name: "Aether-X (Cross-DEX Arbitrage Agent)",
    did: "did:agent:0x34C8971Bae771923A8712111bb910A0019C48911",
    parentOrg: "Aetheria Quantitative (0x3F2...11A)",
    reputationScore: 755,
    tier: "Tier A (Standard)",
    completedTasks: 89,
    successRate: 94.3,
    totalBorrowed: "$18,200 USDC",
    totalRepaid: "$18,200 USDC",
    defaultRate: 0.0,
    whitelistedVendors: ["uniswap.v3", "aerodrome.finance", "chainlink.oracle"],
    description: "Executes micro-yield arbitrage opportunities between decentralized liquidity pools with instant atomic repayment.",
    maxCreditLimit: 2500,
    suggestedInterestRate: 6.5
  },
  {
    id: "agent-003",
    name: "Shadow-V (Unverified Experimental Agent)",
    did: "did:agent:0x0091FF2818A12311099277A66152431092817751",
    parentOrg: "Anonymous Agent Org (0x000...000)",
    reputationScore: 480,
    tier: "Tier D (High Risk)",
    completedTasks: 12,
    successRate: 66.7,
    totalBorrowed: "$1,200 USDC",
    totalRepaid: "$1,100 USDC",
    defaultRate: 8.3,
    whitelistedVendors: ["unrestricted"],
    description: "Experimental un-sandboxed agent with high task failure variance and unverified delegation signatures.",
    maxCreditLimit: 250,
    suggestedInterestRate: 18.5
  }
];

export const WHITELISTS = [
  { domain: "modal.com", category: "GPU Compute", trustScore: 99 },
  { domain: "runpod.io", category: "GPU Compute", trustScore: 98 },
  { domain: "together.ai", category: "LLM Inference", trustScore: 97 },
  { domain: "uniswap.v3", category: "DeFi Router", trustScore: 95 },
  { domain: "chainlink.oracle", category: "Data Oracle", trustScore: 100 }
];
