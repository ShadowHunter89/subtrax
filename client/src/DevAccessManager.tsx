import React, { useEffect, useState } from 'react';
import { Paper, Typography, Button, Stack, Box, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { db, auth } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const OWNER_EMAIL = 'your-owner-email@example.com'; // TODO: Replace with your real email

const DevAccessManager: React.FC = () => {
  const [devs, setDevs] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      setUserEmail(user?.email || '');
    });
    const fetchDevs = async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, 'aiAdmins'));
      setDevs(snap.docs.map(doc => doc.data().email));
      setLoading(false);
    };
    fetchDevs();
  }, []);

  const addDev = async () => {
    if (!newEmail) return;
    await addDoc(collection(db, 'aiAdmins'), { email: newEmail });
    setDevs([...devs, newEmail]);
    setNewEmail('');
  };

  const removeDev = async (email: string) => {
    const snap = await getDocs(collection(db, 'aiAdmins'));
    const toDelete = snap.docs.find(docSnap => docSnap.data().email === email);
    if (toDelete) await deleteDoc(doc(db, 'aiAdmins', toDelete.id));
    setDevs(devs.filter(e => e !== email));
  };

  if (userEmail !== OWNER_EMAIL) return null;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6">AI Developer Access</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField label="Add developer email" value={newEmail} onChange={e => setNewEmail(e.target.value)} size="small" />
        <Button variant="contained" onClick={addDev}>Add</Button>
      </Stack>
      <Typography variant="subtitle2">Allowed Developers:</Typography>
      {loading ? <Typography>Loading...</Typography> : (
        <List>
          {devs.map(email => (
            <ListItem key={email} secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => removeDev(email)}>
                <DeleteIcon />
              </IconButton>
            }>
              <ListItemText primary={email} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default DevAccessManager;
