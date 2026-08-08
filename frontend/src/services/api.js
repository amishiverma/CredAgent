const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  } catch (err) {
    console.warn('Backend offline, using fallback:', err);
    return { status: 'offline' };
  }
}

export async function fetchAgents() {
  try {
    const res = await fetch(`${API_BASE_URL}/agents`);
    return await res.json();
  } catch (err) {
    console.warn('Backend offline:', err);
    return null;
  }
}

export async function createAgent(agentData) {
  try {
    const res = await fetch(`${API_BASE_URL}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agentData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend offline:', err);
    return null;
  }
}

export async function evaluateUnderwriting(requestData) {
  try {
    const res = await fetch(`${API_BASE_URL}/underwrite/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend offline:', err);
    return null;
  }
}

export async function fetchEscrows() {
  try {
    // cache: 'no-store' prevents 304 browser cache returning stale pre-payment data
    const res = await fetch(`${API_BASE_URL}/escrow/contracts?_t=${Date.now()}`, {
      cache: 'no-store'
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend offline:', err);
    return null;
  }
}

export async function requestEscrowLoan(loanData) {
  try {
    const res = await fetch(`${API_BASE_URL}/escrow/request-loan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loanData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend offline:', err);
    return null;
  }
}

// NEW FUNCTION ADDED
export async function receiveEscrowPayment(paymentData) {
  try {
    const res = await fetch(`${API_BASE_URL}/escrow/receive-payment`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
      body: JSON.stringify(paymentData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Payment failed');
    }
    return await res.json();
  } catch (err) {
    console.warn('Backend offline:', err);
    return null;
  }
}

export async function fetchLenderPools() {
  try {
    const res = await fetch(`${API_BASE_URL}/lender/pools`);
    return await res.json();
  } catch (err) {
    console.warn('Backend offline:', err);
    return null;
  }
}

export async function depositLenderPool(depositData) {
  try {
    const res = await fetch(`${API_BASE_URL}/lender/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(depositData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend offline:', err);
    return null;
  }
}

export async function simulateStep(stepData) {
  try {
    const res = await fetch(`${API_BASE_URL}/simulator/step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stepData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend offline:', err);
    return null;
  }
}