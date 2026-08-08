const https = require('https');

function httpsRequest(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };
    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); } catch(e) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  const BASE = 'https://credagent-2mg7.onrender.com/api';

  // Show all escrows in DB
  console.log('\n=== ALL ESCROWS IN MONGODB ===');
  const { body: getData } = await httpsRequest(`${BASE}/escrow/contracts?_t=${Date.now()}`);
  getData.data?.forEach((e, i) => {
    const lastTx = e.transactions?.[e.transactions.length - 1];
    console.log(`\n[${i}] id: ${e.id}`);
    console.log(`    status: ${e.status}`);
    console.log(`    loanAmount: ${e.loanAmount} | interestAmount: ${e.interestAmount} | totalDebt: ${e.totalDebt}`);
    console.log(`    buyerDeposit: ${e.buyerDeposit}`);
    console.log(`    transactions count: ${e.transactions?.length}`);
    console.log(`    last tx type: ${lastTx?.type} | buyerPayment: ${lastTx?.buyerPayment}`);
  });

  // Create a fresh ACTIVE escrow for demo
  console.log('\n=== CREATING FRESH DEMO ESCROW ===');
  const newEscrow = JSON.stringify({
    agentDID: 'did:cred:agent:nexus7',
    loanAmount: 1500,
    interestRatePercent: 4.5,
    targetVendor: 'modal.com'
  });
  const { status, body: createRes } = await httpsRequest(`${BASE}/escrow/request-loan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(newEscrow) }
  }, newEscrow);
  
  console.log('Create status:', status);
  console.log('New escrow id:', createRes.data?.id);
  console.log('New escrow status:', createRes.data?.status);

  // Disburse some funds to move it to ACTIVE
  const disburse = JSON.stringify({
    escrowId: createRes.data?.id,
    vendorDomain: 'modal.com',
    amount: 600,
    description: 'H100 GPU Cluster Compute'
  });
  const { body: disburseRes } = await httpsRequest(`${BASE}/escrow/disburse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(disburse) }
  }, disburse);
  
  console.log('\nAfter disburse - status:', disburseRes.data?.status, '| spentCapital:', disburseRes.data?.spentCapital);
  console.log('\n✅ Fresh ACTIVE escrow ready for demo!');
  console.log('ID:', disburseRes.data?.id);
  console.log('Loan:', disburseRes.data?.loanAmount, '| Debt:', disburseRes.data?.totalDebt);
}

main().catch(console.error);
