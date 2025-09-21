import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Paper, Typography, Box } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AnalyticsCharts: React.FC = () => {
  const [userCount, setUserCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [tierData, setTierData] = useState<{ [tier: string]: number }>({});
  const [monthlyRevenue, setMonthlyRevenue] = useState<{ [month: string]: number }>({});
  const [monthlyUsers, setMonthlyUsers] = useState<{ [month: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      // Users
      const usersSnap = await getDocs(collection(db, 'users'));
      setUserCount(usersSnap.size);
      // Monthly new users
      const usersByMonth: { [month: string]: number } = {};
      usersSnap.forEach(doc => {
        const d = doc.data();
        const date = d.createdAt ? new Date(d.createdAt) : null;
        const month = date ? `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}` : 'Unknown';
        usersByMonth[month] = (usersByMonth[month] || 0) + 1;
      });
      setMonthlyUsers(usersByMonth);
      // Payments
      const paymentsSnap = await getDocs(collection(db, 'payments'));
      let total = 0;
      const revenueByMonth: { [month: string]: number } = {};
      paymentsSnap.forEach(doc => {
        const d = doc.data();
        if (d.status === 'approved') {
          total += d.amount || 0;
          const date = d.createdAt ? new Date(d.createdAt) : null;
          const month = date ? `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}` : 'Unknown';
          revenueByMonth[month] = (revenueByMonth[month] || 0) + (d.amount || 0);
        }
      });
      setRevenue(total);
      setMonthlyRevenue(revenueByMonth);
      // Tiers
      const tiers: { [tier: string]: number } = {};
      usersSnap.forEach(doc => {
        const d = doc.data();
        const tier = d.tier || 'Free';
        tiers[tier] = (tiers[tier] || 0) + 1;
      });
      setTierData(tiers);
    };
    fetchData();
  }, []);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Analytics</Typography>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="subtitle1">Total Users</Typography>
          <Typography variant="h4">{userCount}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1">Total Revenue</Typography>
          <Typography variant="h4">${revenue.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ width: 300 }}>
          <Typography variant="subtitle1">Tier Distribution</Typography>
          <Pie
            data={{
              labels: Object.keys(tierData),
              datasets: [{
                data: Object.values(tierData),
                backgroundColor: ['#1976d2', '#43a047', '#fbc02d', '#e53935'],
              }],
            }}
          />
        </Box>
        <Box sx={{ width: 400 }}>
          <Typography variant="subtitle1">Monthly Revenue</Typography>
          <Bar
            data={{
              labels: Object.keys(monthlyRevenue),
              datasets: [{
                label: 'Revenue',
                data: Object.values(monthlyRevenue),
                backgroundColor: '#1976d2',
              }],
            }}
            options={{
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </Box>
        <Box sx={{ width: 400 }}>
          <Typography variant="subtitle1">New Users Per Month</Typography>
          <Bar
            data={{
              labels: Object.keys(monthlyUsers),
              datasets: [{
                label: 'New Users',
                data: Object.values(monthlyUsers),
                backgroundColor: '#43a047',
              }],
            }}
            options={{
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default AnalyticsCharts;
