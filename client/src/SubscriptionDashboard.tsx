import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Box, Typography, Button, TextField, List, ListItem, ListItemText, IconButton, Snackbar, Alert, CircularProgress, Divider, Select, MenuItem, FormControl, InputLabel, Chip } from "@mui/material";
import PreferencesForm from "./PreferencesForm";
import CheckoutButtons from "./CheckoutButtons";
import { TIERS, Tier } from "./tiers";
import FeedbackForm from "./FeedbackForm";
import ManualPayment from "./ManualPayment";
import DeleteIcon from "@mui/icons-material/Delete";

interface Subscription {
  id?: string;
  name: string;
  amount: number;
}

const SubscriptionDashboard: React.FC = () => {
  // Payment handlers
  const handleStripePayment = async () => {
    // In production, get user email from auth
    const email = "test@example.com";
    const res = await fetch("http://localhost:5000/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: tier.price, tier: tier.name, email })
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [suggestion, setSuggestion] = useState<string>("");
  const [preferences, setPreferences] = useState<any>({ preferredCategories: [], budget: 0, frequency: "" });
  const [tier, setTier] = useState<Tier>(TIERS[0]);
  const handleTierChange = (e: any) => {
    const selected = TIERS.find(t => t.id === e.target.value);
    if (selected) setTier(selected);
  };
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [fetching, setFetching] = useState(true);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  const handleOptimize = async () => {
    setLoading(true);
    setSuggestion("");
    setError("");
    setRecommendations([]);
    setSummary(null);
    try {
      const res = await fetch("http://localhost:5000/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptions: subs, preferences })
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setSuggestion("Optimization complete.");
      setRecommendations(data.recommendations || []);
      setSummary(data.summary || null);
    } catch (e) {
      setError("Error contacting optimizer");
    }
    setLoading(false);
  };
  const handlePreferences = (prefs: any) => {
    setPreferences(prefs);
  };


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!userId) {
      setSubs([]);
      setFetching(false);
      return;
    }
    setFetching(true);
    const q = query(collection(db, "subscriptions"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSubs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Subscription)));
      setFetching(false);
    }, (err) => {
      setError("Failed to fetch subscriptions");
      setFetching(false);
    });
    return unsubscribe;
  }, [userId]);

  const handleAdd = async () => {
    if (!name || !amount || !userId) {
      setError("Please enter a name and amount.");
      return;
    }
    try {
      await addDoc(collection(db, "subscriptions"), { name, amount, userId });
      setName("");
      setAmount(0);
      setSuccess("Subscription added!");
    } catch (e) {
      setError("Failed to add subscription.");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, "subscriptions", id));
      setSuccess("Subscription deleted!");
    } catch (e) {
      setError("Failed to delete subscription.");
    }
  };

  if (!userId) {
    return <Typography>Please sign in to manage subscriptions.</Typography>;
  }

  return (
    <Box mt={4}>
      <Typography variant="h6">Your Subscriptions</Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="tier-label">Subscription Tier</InputLabel>
        <Select
          labelId="tier-label"
          value={tier.id}
          label="Subscription Tier"
          onChange={handleTierChange}
        >
          {TIERS.map(t => (
            <MenuItem key={t.id} value={t.id}>{t.name} (${t.price})</MenuItem>
          ))}
        </Select>
        <Box mt={1}>
          {tier.features.map(f => <Chip key={f} label={f} sx={{ mr: 1, mb: 1 }} />)}
        </Box>
      </FormControl>
      <PreferencesForm onSubmit={handlePreferences} />
      {/* Payment options */}
      {tier.id !== "free" && (
        <Box mt={2}>
          <Typography variant="subtitle2">Upgrade to {tier.name}</Typography>
          <CheckoutButtons amount={tier.price} currency="USD" />
          <Box mt={1}><ManualPayment /></Box>
        </Box>
      )}
  <FeedbackForm />
  <Divider sx={{ mb: 2 }} />
  <Box display="flex" gap={2} mt={2}>
        <TextField label="Name" value={name} onChange={e => setName(e.target.value)} />
        <TextField label="Amount" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
        <Button variant="contained" onClick={handleAdd}>Add</Button>
      </Box>
      {fetching ? (
        <Box display="flex" justifyContent="center" mt={2}><CircularProgress /></Box>
      ) : (
        <List>
          {subs.map(sub => (
            <ListItem key={sub.id} secondaryAction={
              <IconButton edge="end" onClick={() => handleDelete(sub.id)}><DeleteIcon /></IconButton>
            }>
              <ListItemText primary={sub.name} secondary={`$${sub.amount}`} />
            </ListItem>
          ))}
        </List>
      )}
      <Button variant="outlined" onClick={handleOptimize} disabled={loading || subs.length === 0} sx={{ mt: 2 }}>
        {loading ? <CircularProgress size={20} /> : "Optimize Subscriptions"}
      </Button>
      {suggestion && (
        <Typography color="primary" sx={{ mt: 2 }}>{suggestion}</Typography>
      )}
      {summary && (
        <Box mt={2}>
          <Typography variant="subtitle2">Spending Summary</Typography>
          <Typography>Total: ${summary.total} | Active: {summary.active} | Inactive: {summary.inactive}</Typography>
        </Box>
      )}
      {recommendations.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle2">Recommendations</Typography>
          <List>
            {recommendations.map((rec, idx) => (
              <ListItem key={idx}>
                <ListItemText primary={rec.name} secondary={`$${rec.cost}`} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")}>
        <Alert severity="error" onClose={() => setError("")}>{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess("")}>
        <Alert severity="success" onClose={() => setSuccess("")}>{success}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SubscriptionDashboard;
