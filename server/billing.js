// billing.js
// Minimal billing ledger service. Uses Firestore if initialized, otherwise falls back to an in-memory store.
const { admin } = require('./firebaseAdmin');

let useFirestore = false;
let db = null;
try {
  if (admin && admin.apps && admin.apps.length > 0) {
    db = admin.firestore();
    useFirestore = true;
  }
} catch (e) {
  useFirestore = false;
}

const inMemory = [];

async function createEntry(entry) {
  const normalized = {
    provider: entry.provider || 'unknown',
    provider_tx_id: entry.provider_tx_id || null,
    type: entry.type || 'charge',
    amount: entry.amount || 0,
    currency: entry.currency || 'USD',
    status: entry.status || 'pending',
    timestamp: entry.timestamp || new Date().toISOString(),
    allocated_to: entry.allocated_to || null,
    metadata: entry.metadata || {}
  };
  if (useFirestore && db) {
    const ref = await db.collection('billing_entries').add(normalized);
    return { id: ref.id, ...normalized };
  }
  // fallback
  const id = `local-${Date.now()}-${Math.floor(Math.random()*1000)}`;
  const item = { id, ...normalized };
  inMemory.push(item);
  return item;
}

async function listEntries(limit = 100) {
  if (useFirestore && db) {
    const snap = await db.collection('billing_entries').orderBy('timestamp', 'desc').limit(limit).get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
  return inMemory.slice(-limit).reverse();
}

async function reconcileByProviderTx(provider, providerTxId) {
  // find and mark reconciled
  if (useFirestore && db) {
    const q = await db.collection('billing_entries').where('provider', '==', provider).where('provider_tx_id', '==', providerTxId).get();
    const results = [];
    for (const doc of q.docs) {
      await doc.ref.update({ status: 'reconciled' });
      const fresh = await doc.ref.get();
      results.push({ id: fresh.id, ...fresh.data() });
    }
    return results;
  }
  const updated = [];
  for (const e of inMemory) {
    if (e.provider === provider && e.provider_tx_id === providerTxId) {
      e.status = 'reconciled';
      updated.push(e);
    }
  }
  return updated;
}

async function updateEntry(id, updates) {
  if (useFirestore && db) {
    const ref = db.collection('billing_entries').doc(id);
    const snap = await ref.get();
    if (!snap.exists) throw new Error('not found');
    await ref.update(updates);
    const fresh = await ref.get();
    return { id: fresh.id, ...fresh.data() };
  }
  const idx = inMemory.findIndex(e => e.id === id);
  if (idx === -1) throw new Error('not found');
  const item = inMemory[idx];
  const merged = { ...item, ...updates };
  inMemory[idx] = merged;
  return merged;
}

module.exports = { createEntry, listEntries, reconcileByProviderTx, updateEntry };
 
