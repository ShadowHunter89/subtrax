import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip, TextField, Stack } from '@mui/material';
import { ExportData, exportToExcel } from './lib/exportUtils';

interface User {
  id: string;
  email: string;
  tier: string;
  banned?: boolean;
}

const AdminControls: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCol = collection(db, 'users');
      const snapshot = await getDocs(usersCol);
      const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as User[];
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const banUser = async (id: string) => {
    await updateDoc(doc(db, 'users', id), { banned: true });
    setUsers(users => users.map(u => u.id === id ? { ...u, banned: true } : u));
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
    alert('Password reset email sent to ' + email);
  };

  const filtered = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()));

  // Export helpers
  const exportExcel = async () => {
    const headers = ['id', 'email', 'tier', 'banned'];
    const exportData: ExportData = { headers, rows: users };
    await exportToExcel(exportData, { filename: 'users.xlsx', sanitizeData: true });
  };
  const exportPDF = async () => {
    const jsPDF = (await import('jspdf')).default;
    const doc = new jsPDF();
    const headers = ['id', 'email', 'tier', 'banned'];
    let y = 10;
    doc.text(headers.join(' | '), 10, y);
    y += 10;
    users.forEach(user => {
      doc.text(
        [
          user.id ?? '',
          user.email ?? '',
          user.tier ?? '',
          user.banned ? 'true' : 'false'
        ].join(' | '),
        10,
        y
      );
      y += 8;
    });
    doc.save('users.pdf');
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Admin Controls</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={exportExcel}>Export Users Excel</Button>
        <Button variant="outlined" onClick={exportPDF}>Export Users PDF</Button>
      </Stack>
      <TextField label="Search by email" value={search} onChange={e => setSearch(e.target.value)} size="small" sx={{ mb: 2 }} />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Tier</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.tier}</TableCell>
                <TableCell>
                  {user.banned ? <Chip label="Banned" color="error" /> : <Chip label="Active" color="success" />}
                </TableCell>
                <TableCell>
                  {!user.banned && (
                    <Button size="small" color="error" onClick={() => banUser(user.id)}>Ban</Button>
                  )}
                  <Button size="small" onClick={() => resetPassword(user.email)}>Reset Password</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {loading && <Typography>Loading users...</Typography>}
    </Paper>
  );
};

export default AdminControls;
