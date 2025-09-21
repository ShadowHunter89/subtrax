import React, { useState } from "react";

import { Box, Typography, Paper, Button, Stack } from "@mui/material";
import AdminAuth from "./AdminAuth";
import AdminUsers from "./AdminUsers";
import PaymentManagement from "./PaymentManagement";
import AnalyticsCharts from "./AnalyticsCharts";
import AdminControls from "./AdminControls";
import AISuggestions from "./AISuggestions";
import DevAccessManager from "./DevAccessManager";

const AdminDashboard: React.FC = () => {
  const [authed, setAuthed] = useState(false);

  if (!authed) return <AdminAuth onAuth={() => setAuthed(true)} />;


  // Export helpers
  const exportCSV = (filename: string, rows: any[], headers: string[]) => {
    const csv = [headers.join(",")].concat(
      rows.map(row => headers.map(h => JSON.stringify(row[h] ?? "")).join(","))
    ).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportExcel = async (filename: string, rows: any[], headers: string[]) => {
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename);
  };

  const exportPDF = async (filename: string, rows: any[], headers: string[]) => {
    const jsPDF = (await import('jspdf')).default;
    const doc = new jsPDF();
    let y = 10;
    doc.text(headers.join(' | '), 10, y);
    y += 10;
    rows.forEach(row => {
      doc.text(headers.map(h => String(row[h] ?? '')).join(' | '), 10, y);
      y += 8;
    });
    doc.save(filename);
  };

  // Get users/payments from Firestore
  const fetchUsers = async () => {
    const { getDocs, collection } = await import('firebase/firestore');
    const { db } = await import('./firebase');
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };
  const fetchPayments = async () => {
    const { getDocs, collection } = await import('firebase/firestore');
    const { db } = await import('./firebase');
    const snap = await getDocs(collection(db, 'payments'));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const handleExportUsers = async (type: 'csv' | 'xlsx' | 'pdf') => {
    const users = await fetchUsers();
    const headers = ['id', 'email', 'tier', 'banned'];
    if (type === 'csv') exportCSV('users.csv', users, headers);
    if (type === 'xlsx') exportExcel('users.xlsx', users, headers);
    if (type === 'pdf') exportPDF('users.pdf', users, headers);
  };
  const handleExportPayments = async (type: 'csv' | 'xlsx' | 'pdf') => {
    const payments = await fetchPayments();
    const headers = ['id', 'userId', 'amount', 'method', 'status', 'createdAt'];
    if (type === 'csv') exportCSV('payments.csv', payments, headers);
    if (type === 'xlsx') exportExcel('payments.xlsx', payments, headers);
    if (type === 'pdf') exportPDF('payments.pdf', payments, headers);
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>Admin Dashboard</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={() => handleExportUsers('csv')}>Export Users CSV</Button>
        <Button variant="outlined" onClick={() => handleExportUsers('xlsx')}>Export Users Excel</Button>
        <Button variant="outlined" onClick={() => handleExportUsers('pdf')}>Export Users PDF</Button>
        <Button variant="outlined" onClick={() => handleExportPayments('csv')}>Export Payments CSV</Button>
        <Button variant="outlined" onClick={() => handleExportPayments('xlsx')}>Export Payments Excel</Button>
        <Button variant="outlined" onClick={() => handleExportPayments('pdf')}>Export Payments PDF</Button>
      </Stack>
      <AdminUsers />
      <PaymentManagement />
      <AnalyticsCharts />
  <DevAccessManager />
  <AISuggestions />
  <AdminControls />
    </Box>
  );
};

export default AdminDashboard;
