import React, { useState, useEffect } from 'react'; 
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ChartsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/logs`)
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res.data)) setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  const chartData = {
    labels: data.map((item) =>
      new Date(item.timestamp).toLocaleString('id-ID', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'short',
      })
    ),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: data.map((d) => d.temperature),
        borderColor: '#4FD1C5',
        backgroundColor: 'rgba(79, 209, 197, 0.3)',
        tension: 0.4,
      },
      {
        label: 'Humidity (%)',
        data: data.map((d) => d.humidity),
        borderColor: '#9F7AEA',
        backgroundColor: 'rgba(159, 122, 234, 0.3)',
        tension: 0.4,
      },
      {
        label: 'Distance (cm)',
        data: data.map((d) => d.distance),
        borderColor: '#F6AD55',
        backgroundColor: 'rgba(246, 173, 85, 0.3)',
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100vh', backgroundColor: '#1d2b38' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          style={{
            width: 56,
            height: 56,
            border: '4px solid #4fd1c5',
            borderTopColor: 'transparent',
            borderRadius: '50%',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="container py-4 d-flex flex-column align-items-center gap-4"
      style={{ minHeight: '90vh', backgroundColor: '#1d2b38' }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-white"
      >
        <h1
          className="fw-bold display-5"
          style={{ fontSize: '200%' }} // 2x lipat
        >
          Real-Time Environmental Dashboard
        </h1>
      </motion.div>

      {/* Chart Card */}
      {data.length === 0 ? (
        <p className="text-white text-center">Data tidak tersedia</p>
      ) : (
        <motion.div
          className="card shadow-lg rounded-4 p-4"
          style={{
            backgroundColor: 'transparent',
            maxWidth: '1000px',
            width: '100%',
            height: '560px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ height: '100%', width: '100%' }}>
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { labels: { color: '#E0E7FF' } },
                  title: {
                    display: true,
                    text: 'Sensor Data Visualization',
                    color: '#E0E7FF',
                    font: { size: 18 },
                  },
                  tooltip: {
                    enabled: true,
                    backgroundColor: '#334155',
                    titleColor: '#F8FAFC',
                    bodyColor: '#F8FAFC',
                  },
                },
                scales: {
                  x: {
                    ticks: { color: '#CBD5E1' },
                    grid: { color: 'rgba(203, 213, 225, 0.1)' },
                  },
                  y: {
                    ticks: { color: '#CBD5E1' },
                    grid: { color: 'rgba(203, 213, 225, 0.1)' },
                  },
                },
              }}
            />
          </div>
        </motion.div>
      )}

      {/* About Card */}
      <motion.div
        className="card shadow rounded-3 p-4 text-white"
        style={{
          backgroundColor: 'transparent',
          maxWidth: '1000px',
          width: '100%',
          height: '195px', // dikurangi 35%
          border: '1px solid rgba(255,255,255,0.1)',
          // Removed overflowY so no scroll
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-center mb-4">About the Data</h2>
        <p className="fs-6" style={{ color: '#CBD5E1' }}>
          This dashboard provides real-time monitoring of three essential environmental parameters:{' '}
          <strong style={{ color: '#F6AD55' }}>Temperature</strong>, which reflects the ambient heat level in Celsius;{' '}
          <strong style={{ color: '#F6AD55' }}>Humidity</strong>, indicating the moisture level in the air as a percentage; and{' '}
          <strong style={{ color: '#F6AD55' }}>Water Level</strong>, measured as the distance from the ultrasonic sensor to the water surface in centimeters. These metrics are collected via sensors and updated live to help observe trends and ensure environmental conditions are within desired thresholds.
        </p>
      </motion.div>
    </div>
  );
};

export default ChartsPage;
