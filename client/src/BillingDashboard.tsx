import React, { useEffect, useState } from 'react';

export default function BillingDashboard() {
  const [entries, setEntries] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  useEffect(() => {
    fetch('/api/billing/entries')
      .then(r => r.json())
      .then(j => setEntries(j.entries || []))
      .catch(() => setEntries([]));
  }, []);

  const toggleSelect = (id: string) => {
    setSelected(s => ({ ...s, [id]: !s[id] }));
  };

  const exportCsv = (useSelected = false) => {
    const rows = (useSelected ? entries.filter(e => selected[e.id]) : entries).map(e => ({ id: e.id, provider: e.provider, provider_tx_id: e.provider_tx_id, amount: e.amount, currency: e.currency, status: e.status, timestamp: e.timestamp }));
    if (rows.length === 0) return alert('No rows to export');
    const csv = [Object.keys(rows[0]).join(',')].concat(rows.map(r => Object.values(r).map(v => '"' + String(v || '') + '"').join(','))).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `billing-${Date.now()}.csv`; document.body.appendChild(a); a.click(); a.remove();
  };

  const bulkReconcile = async () => {
    const sel = entries.filter(e => selected[e.id]);
    if (sel.length === 0) return alert('No entries selected');
    // group by provider
    const byProv = {} as Record<string, string[]>;
    for (const e of sel) {
      if (!e.provider_tx_id) continue;
      byProv[e.provider] = byProv[e.provider] || [];
      byProv[e.provider].push(e.provider_tx_id);
    }
    let total = 0;
    for (const prov of Object.keys(byProv)) {
      const res = await fetch('/api/billing/reconcile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider: prov, provider_tx_ids: byProv[prov] }) });
      const j = await res.json();
      if (j && j.updated) total += j.updated.length;
    }
    alert(`Reconciled ${total} entries`);
    const fresh = await fetch('/api/billing/entries').then(r => r.json());
    setEntries(fresh.entries || []);
    setSelected({});
  };

  const editEntry = async (id: string) => {
    const amount = prompt('New amount (leave blank to keep)');
    const status = prompt('New status (leave blank to keep)');
    const payload: any = {};
    if (amount !== null && amount !== '') payload.amount = Number(amount);
    if (status !== null && status !== '') payload.status = status;
    if (Object.keys(payload).length === 0) return;
    const res = await fetch(`/api/billing/entry/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const j = await res.json();
    if (j.ok) {
      alert('Updated');
      const fresh = await fetch('/api/billing/entries').then(r => r.json());
      setEntries(fresh.entries || []);
    } else {
      alert('Update failed: ' + (j.error || 'unknown'));
    }
  };

  const reconcile = async (provider: string, txId: string) => {
    if (!txId) return alert('No tx id');
    const res = await fetch('/api/billing/reconcile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider, provider_tx_id: txId }) });
    const j = await res.json();
    if (j.ok) {
      alert('Reconciled ' + (j.updated || []).length + ' entries');
      // refresh
      const fresh = await fetch('/api/billing/entries').then(r => r.json());
      setEntries(fresh.entries || []);
    } else {
      alert('Reconcile failed');
    }
  };

  return (
    <div>
      <h3>Billing Ledger</h3>
      <div style={{ marginBottom: 8 }}>
        <button onClick={() => exportCsv(false)}>Export all CSV</button>
        <button onClick={() => exportCsv(true)} style={{ marginLeft: 8 }}>Export selected CSV</button>
        <button onClick={bulkReconcile} style={{ marginLeft: 8 }}>Bulk Reconcile</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Provider</th>
            <th>TX</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Status</th>
            <th>When</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {entries.map(e => (
          <tr key={e.id}>
            <td><input type="checkbox" checked={!!selected[e.id]} onChange={() => toggleSelect(e.id)} /></td>
            <td>{e.id}</td>
            <td>{e.provider}</td>
            <td>{e.provider_tx_id || (e.metadata && e.metadata.raw && (e.metadata.raw.order_id || e.metadata.raw.tx || e.metadata.raw.transaction_id || e.metadata.raw.alert_id)) || ''}</td>
            <td>{e.amount}</td>
            <td>{e.currency}</td>
            <td>{e.status}</td>
            <td>{new Date(e.timestamp).toLocaleString()}</td>
            <td>
              <button onClick={() => reconcile(e.provider, e.provider_tx_id || (e.metadata && e.metadata.raw && (e.metadata.raw.order_id || e.metadata.raw.tx || e.metadata.raw.transaction_id || e.metadata.raw.alert_id)))}>Reconcile</button>
              <button onClick={() => editEntry(e.id)} style={{ marginLeft: 8 }}>Edit</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
