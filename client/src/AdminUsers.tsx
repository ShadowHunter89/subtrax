import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText, Button } from "@mui/material";
import { db } from "./firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, use a secure backend API
    const fetchUsers = async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleUpgrade = async (id: string, tier: string) => {
    await updateDoc(doc(db, "users", id), { tier });
    setUsers(users.map(u => u.id === id ? { ...u, tier } : u));
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1">User Management</Typography>
      {loading ? <Typography>Loading...</Typography> : (
        <List>
          {users.map(user => (
            <ListItem key={user.id}>
              <ListItemText primary={user.email} secondary={`Tier: ${user.tier || 'free'}`} />
              <Button onClick={() => handleUpgrade(user.id, "pro")} sx={{ mr: 1 }}>Set Pro</Button>
              <Button onClick={() => handleUpgrade(user.id, "enterprise")} sx={{ mr: 1 }}>Set Enterprise</Button>
              <Button onClick={() => handleUpgrade(user.id, "free")}>Set Free</Button>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default AdminUsers;
