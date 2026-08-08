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
        try { resolve(JSON.parse(data)); } catch(e) { resolve(data); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  const BASE = 'https://credagent-2mg7.onrender.com/api';

  // 1. GET current state
  console.log('\n=== STEP 1: GET /escrow/contracts ===');
  const getData = await httpsRequest(`${BASE}/escrow/contracts`);
  const escrow = getData.data?.[0];
  console.log('Escrow ID:', escrow?.id, '| Status:', escrow?.status);
  const lastTx = escrow?.transactions?.[escrow.transactions.length - 1];
  console.log('Last TX type:', lastTx?.type);
  console.log('Last TX buyerPayment:', lastTx?.buyerPayment, '(undefined = field missing from DB)');

  // 2. POST payment
  console.log('\n=== STEP 2: POST /escrow/receive-payment ===');
  const payload = JSON.stringify({ escrowId: escrow?.id, amount: 777 });
  const postData = await httpsRequest(`${BASE}/escrow/receive-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
  }, payload);
  
  console.log('Response status:', postData.status);
  const savedTx = postData.data?.transactions?.[postData.data.transactions.length - 1];
  console.log('\n--- Response transaction ---');
  console.log(JSON.stringify(savedTx, null, 2));

  // 3. Re-fetch to confirm MongoDB persistence
  await new Promise(r => setTimeout(r, 1000));
  console.log('\n=== STEP 3: RE-FETCH to confirm MongoDB saved it ===');
  const refetch = await httpsRequest(`${BASE}/escrow/contracts`);
  const updated = refetch.data?.[0];
  const dbTx = updated?.transactions?.[updated.transactions.length - 1];
  console.log('\n--- Transaction in MongoDB after save ---');
  console.log(JSON.stringify(dbTx, null, 2));
  
  if (dbTx?.buyerPayment !== undefined) {
    console.log('\n✅ SUCCESS: Waterfall fields ARE persisted in MongoDB!');
  } else {
    console.log('\n❌ FAIL: buyerPayment is missing from MongoDB - Mongoose is still stripping fields!');
  }
}

main().catch(console.error);
