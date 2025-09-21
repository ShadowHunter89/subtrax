import React, { useEffect, useState } from 'react';
import './styles.css';

interface BillingEntry {
  id: string;
  provider: string;
  provider_tx_id?: string;
  amount: number;
  currency: string;
  status: string;
  timestamp: string;
  metadata?: {
    raw?: {
      order_id?: string;
      tx?: string;
      transaction_id?: string;
      alert_id?: string;
    };
  };
}

export default function BillingDashboard() {
  const [entries, setEntries] = useState<BillingEntry[]>([]);
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

  const getTransactionId = (entry: BillingEntry): string => {
    return entry.provider_tx_id || 
           (entry.metadata?.raw?.order_id) ||
           (entry.metadata?.raw?.tx) ||
           (entry.metadata?.raw?.transaction_id) ||
           (entry.metadata?.raw?.alert_id) ||
           '';
  };

  const exportCsv = (useSelected = false) => {
    const filteredEntries = useSelected ? entries.filter(e => selected[e.id]) : entries;
    const rows = filteredEntries.map(e => ({ 
      id: e.id, 
      provider: e.provider, 
      provider_tx_id: getTransactionId(e), 
      amount: e.amount, 
      currency: e.currency, 
      status: e.status, 
      timestamp: e.timestamp 
    }));
    
    if (rows.length === 0) return alert('No rows to export');
    
    const csv = [Object.keys(rows[0]).join(',')]
      .concat(rows.map(r => Object.values(r).map(v => '"' + String(v || '') + '"').join(',')))
      .join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; 
    a.download = `billing-${Date.now()}.csv`; 
    document.body.appendChild(a); 
    a.click(); 
    a.remove();
    URL.revokeObjectURL(url);
  };

  const bulkReconcile = async () => {
    const sel = entries.filter(e => selected[e.id]);
    if (sel.length === 0) return alert('No entries selected');
    
    // group by provider
    const byProv: Record<string, string[]> = {};
    for (const e of sel) {
      const txId = getTransactionId(e);
      if (!txId) continue;
      byProv[e.provider] = byProv[e.provider] || [];
      byProv[e.provider].push(txId);
    }
    
    let total = 0;
    for (const prov of Object.keys(byProv)) {
      const res = await fetch('/api/billing/reconcile', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ provider: prov, provider_tx_ids: byProv[prov] }) 
      });
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
    const payload: Partial<Pick<BillingEntry, 'amount' | 'status'>> = {};
    
    if (amount !== null && amount !== '') payload.amount = Number(amount);
    if (status !== null && status !== '') payload.status = status;
    if (Object.keys(payload).length === 0) return;
    
    const res = await fetch(`/api/billing/entry/${id}`, { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(payload) 
    });
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
    if (!txId) return alert('No transaction ID available');
    
    const res = await fetch('/api/billing/reconcile', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ provider, provider_tx_id: txId }) 
    });
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
    <div className="billing-dashboard">
      <div className="billing-header">
        <h3>Billing Ledger</h3>
      </div>
      <div className="billing-controls">
        <button className="billing-btn" onClick={() => exportCsv(false)}>
          Export all CSV
        </button>
        <button className="billing-btn" onClick={() => exportCsv(true)}>
          Export selected CSV
        </button>
        <button className="billing-btn" onClick={bulkReconcile}>
          Bulk Reconcile
        </button>
      </div>
      <table className="billing-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Provider</th>
            <th>Transaction ID</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Status</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {entries.map(e => {
          const txId = getTransactionId(e);
          return (
            <tr key={e.id}>
              <td>
                <label className="billing-checkbox-label" htmlFor={`checkbox-${e.id}`}>
                  <input 
                    id={`checkbox-${e.id}`}
                    type="checkbox" 
                    className="billing-checkbox"
                    checked={!!selected[e.id]} 
                    onChange={() => toggleSelect(e.id)}
                    aria-label={`Select billing entry ${e.id}`}
                  />
                </label>
              </td>
              <td>{e.id}</td>
              <td>{e.provider}</td>
              <td>{txId}</td>
              <td>{e.amount}</td>
              <td>{e.currency}</td>
              <td>{e.status}</td>
              <td>{new Date(e.timestamp).toLocaleString()}</td>
              <td>
                <div className="billing-actions">
                  <button 
                    className="billing-btn" 
                    onClick={() => reconcile(e.provider, txId)}
                    disabled={!txId}
                  >
                    Reconcile
                  </button>
                  <button className="billing-btn" onClick={() => editEntry(e.id)}>
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
}
