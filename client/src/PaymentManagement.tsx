import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip } from '@mui/material';

interface Payment {
  id: string;
  userId: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
}

const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      const paymentsCol = collection(db, 'payments');
      const snapshot = await getDocs(paymentsCol);
      const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })) as Payment[];
      setPayments(data);
      setLoading(false);
    };
    fetchPayments();
  }, []);

  const approvePayment = async (id: string) => {
    await updateDoc(doc(db, 'payments', id), { status: 'approved' });
    setPayments(payments => payments.map(p => p.id === id ? { ...p, status: 'approved' } : p));
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Payment Management</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map(payment => (
              <TableRow key={payment.id}>
                <TableCell>{payment.userId}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>
                  <Chip label={payment.status} color={payment.status === 'approved' ? 'success' : payment.status === 'pending' ? 'warning' : 'default'} />
                </TableCell>
                <TableCell>{new Date(payment.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  {payment.status === 'pending' && (
                    <Button size="small" variant="contained" color="primary" onClick={() => approvePayment(payment.id)}>
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {loading && <Typography>Loading payments...</Typography>}
    </Paper>
  );
};

export default PaymentManagement;
