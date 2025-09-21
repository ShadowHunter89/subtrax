import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Stack, Box } from '@mui/material';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  diff: string;
  applied: boolean;
}

// This function would call a backend/AI service in production
async function fetchSuggestions(): Promise<Suggestion[]> {
  // TODO: Replace with real code analysis/AI call
  // For now, do a simple static suggestion for demonstration
  return [
    {
      id: '1',
      title: 'Refactor AdminUsers: Use memoization for user list',
      description: 'Improve performance by memoizing the user list rendering in AdminUsers.tsx.',
      diff: 'Use React.useMemo for users.map in AdminUsers.tsx',
      applied: false,
    },
    {
      id: '2',
      title: 'Add Error Boundary',
      description: 'Add an ErrorBoundary component to catch UI errors and show a fallback.',
      diff: 'Create ErrorBoundary.tsx and wrap App.tsx',
      applied: false,
    },
  ];
}


const AISuggestions: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, async user => {
      const email = user?.email || '';
      setUserEmail(email);
      // Check if email is in aiAdmins
      const snap = await getDocs(collection(db, 'aiAdmins'));
      const allowedEmails = snap.docs.map(doc => doc.data().email);
      setAllowed(allowedEmails.includes(email));
    });
  }, []);

  const loadSuggestions = async () => {
    setLoading(true);
    const data = await fetchSuggestions();
    setSuggestions(data);
    setLoading(false);
  };

  const handleApprove = (id: string) => {
    setSuggestions(suggestions => suggestions.map(s => s.id === id ? { ...s, applied: true } : s));
    alert('Suggestion approved and will be applied!');
  };

  const handleReject = (id: string) => {
    setSuggestions(suggestions => suggestions.filter(s => s.id !== id));
  };

  if (!allowed) return null;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">AI Suggestions</Typography>
        <Button variant="contained" onClick={loadSuggestions} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Codebase'}
        </Button>
      </Box>
      <Stack spacing={2} mt={2}>
        {suggestions.length === 0 && !loading && <Typography>No suggestions yet. Click Analyze to start.</Typography>}
        {suggestions.map(s => (
          <Paper key={s.id} sx={{ p: 2, border: s.applied ? '2px solid #43a047' : undefined }}>
            <Typography variant="subtitle1">{s.title}</Typography>
            <Typography variant="body2" color="text.secondary">{s.description}</Typography>
            <Box mt={1} mb={1}>
              <Typography variant="caption" color="text.secondary">Preview:</Typography>
              <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4 }}>{s.diff}</pre>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="success" disabled={s.applied} onClick={() => handleApprove(s.id)}>
                Approve
              </Button>
              <Button variant="outlined" color="error" disabled={s.applied} onClick={() => handleReject(s.id)}>
                Reject
              </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
};

export default AISuggestions;
