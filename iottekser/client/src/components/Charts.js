import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { FaReact } from 'react-icons/fa';
import 'animate.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Charts = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/logs/all`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setLogs(data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleResetFilter = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.timestamp);
    if (isNaN(logDate)) return false;

    const start = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
    const end = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;

    return (!start || logDate >= start) && (!end || logDate <= end);
  });

  if (loading) {
    return <div className="text-center mt-5 text-light animate__animated animate__flash">Loading Charts...</div>;
  }

  if (logs.length === 0) {
    return <div className="text-center mt-5 text-light animate__animated animate__bounceIn">Belum ada data untuk ditampilkan.</div>;
  }

  return (
    <div className="container mt-4" style={{ backgroundColor: "#0c1e33", minHeight: "100vh" }}>
      {/* React Logo Title */}
      <div className="text-center mb-4">
        <FaReact size={60} className="text-primary animate__animated animate__pulse" />
        <h2 className="mt-2 text-light">Overview Charts</h2>
      </div>

      {/* Date Picker Filter */}
      <div className="d-flex flex-wrap justify-content-center align-items-end gap-3 mb-4">
        <div className="text-light">
          <label className="me-2">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            isClearable
            placeholderText="Pilih tanggal mulai"
          />
        </div>
        <div className="text-light">
          <label className="me-2">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            isClearable
            placeholderText="Pilih tanggal akhir"
          />
        </div>
        <button className="btn btn-warning" onClick={handleResetFilter}>
          Reset Filter
        </button>
      </div>

      {/* Charts */}
      <ChartSection title="Temperature (°C)" dataKey="temperature" stroke="#ff6347" logs={filteredLogs} />
      <ChartSection title="Humidity (%)" dataKey="humidity" stroke="#1e90ff" logs={filteredLogs} />
      <ChartSection title="Distance (cm)" dataKey="distance" stroke="#32cd32" logs={filteredLogs} />
      <ChartSection title="Rain (mm)" dataKey="rainValue" stroke="#8a2be2" logs={filteredLogs} />
    </div>
  );
};

// Reusable Chart Section Component
const ChartSection = ({ title, dataKey, stroke, logs }) => (
  <div className="row mb-5 animate__animated animate__fadeInUp">
    <div className="col-md-12">
      <div className="chart-card p-4 rounded-lg shadow-lg" style={{ backgroundColor: "#2c3e50", color: "#ecf0f1" }}>
        <h5 className="text-center">{title}</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={logs}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(tick) =>
                new Date(tick).toISOString().slice(0, 19).replace('T', ' ')
              }
              stroke="#ddd"
            />
            <YAxis stroke="#ddd" />
            <Tooltip
              labelFormatter={(label) =>
                new Date(label).toISOString().slice(0, 19).replace('T', ' ')
              }
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={stroke}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default Charts;
