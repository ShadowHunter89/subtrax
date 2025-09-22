const express = require('express');
const { createEntry, listEntries, reconcileByProviderTx } = require('./billing');
const { updateEntry } = require('./billing');
const redisClient = require('./lib/redisClient');

const router = express.Router();
const adminAuth = require('./middleware/adminAuth');

// Ingest billing entry (used by webhooks)
router.post('/ingest', async (req, res) => {
  try {
    const entry = await createEntry(req.body);
    res.json({ ok: true, entry });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// List entries (admin)
router.get('/entries', adminAuth, async (req, res) => {
  try {
    const entries = await listEntries(100);
    res.json({ ok: true, entries });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Reconcile by provider tx id
router.post('/reconcile', adminAuth, async (req, res) => {
  const { provider, provider_tx_id, provider_tx_ids } = req.body;
  if (!provider) return res.status(400).json({ ok: false, error: 'provider required' });
  if (!provider_tx_id && (!provider_tx_ids || !Array.isArray(provider_tx_ids) || provider_tx_ids.length === 0)) {
    return res.status(400).json({ ok: false, error: 'provider_tx_id or provider_tx_ids required' });
  }
  try {
    const ids = provider_tx_ids && Array.isArray(provider_tx_ids) ? provider_tx_ids : [provider_tx_id];
    const aggregated = [];
    for (const tx of ids) {
      const updated = await reconcileByProviderTx(provider, tx);
      if (Array.isArray(updated) && updated.length) aggregated.push(...updated);
    }
    res.json({ ok: true, updated: aggregated });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Admin: update a billing entry by id
router.patch('/entry/:id', adminAuth, async (req, res) => {
  const id = req.params.id;
  const updates = req.body || {};
  try {
    const updated = await updateEntry(id, updates);
    res.json({ ok: true, updated });
  } catch (err) {
    if (err.message === 'not found') return res.status(404).json({ ok: false, error: 'not found' });
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Admin: update a billing entry by id (PUT method for frontend compatibility)
router.put('/entry/:id', adminAuth, async (req, res) => {
  const id = req.params.id;
  const updates = req.body || {};
  try {
    const updated = await updateEntry(id, updates);
    res.json({ ok: true, updated });
  } catch (err) {
    if (err.message === 'not found') return res.status(404).json({ ok: false, error: 'not found' });
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;

