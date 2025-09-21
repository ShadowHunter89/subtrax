import React, { useEffect, useState } from 'react';

type Rec = { primary: string; secondary: string; currency: string; price: number; formattedPrice?: string };

export default function CheckoutButtons({ amount, currency = 'USD' }: { amount: number; currency?: string }) {
  const [rec, setRec] = useState<Rec | null>(null);
  useEffect(() => {
    fetch(`/api/payments/recommend?amount=${amount}&currency=${currency}`)
      .then(r => r.json())
      .then(setRec)
      .catch(() => setRec(null));
  }, [amount, currency]);

  if (!rec) return <div>Loading payment options...</div>;

  const createAndRedirect = async (provider: string) => {
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, amount: rec.price, returnUrl: window.location.href })
      });
      const data = await res.json();
      if (data.checkout_url) window.location.href = data.checkout_url;
      else if (data.url) window.location.href = data.url; // fallback
      else alert('Unable to create checkout session');
    } catch (e) {
      alert('Payment failed to start');
    }
  };

  return (
    <div>
      <button onClick={() => createAndRedirect(rec.primary)}>Pay {rec.formattedPrice || ''} with {rec.primary}</button>
      <button onClick={() => createAndRedirect(rec.secondary)} style={{ marginLeft: 8 }}>Pay {rec.formattedPrice || ''} with {rec.secondary}</button>
    </div>
  );
}
