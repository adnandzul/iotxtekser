// File: /Tekser/iottekser/server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@iotlogs.qb8xkox.mongodb.net/projectLogs?retryWrites=true&w=majority&appName=iotLogs';

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi ke MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Schema dan Model
const logSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  distance: Number,
  rainValue: Number,
  kondisi: String,
  timestamp: { type: Date, default: Date.now }
});

const Log = mongoose.model('Log', logSchema, 'logsdatas');

// =======================
// API ROUTES
// =======================

// Paginated logs
app.get('/api/logs', async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  try {
    const totalLogs = await Log.countDocuments();

    const logs = await Log.find()
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    res.json({
      data: logs,
      totalLogs,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error('❌ Error fetching logs:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// NEW: Get one log per 120 seconds interval
app.get('/api/logs/all', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: 1 }).lean(); // Urut dari paling lama

    const filteredLogs = [];
    let lastTimestamp = null;

    logs.forEach(log => {
      if (!lastTimestamp || (log.timestamp - lastTimestamp >= 720 * 1000)) {
        filteredLogs.push(log);
        lastTimestamp = log.timestamp;
      }
    });

    res.json({ data: filteredLogs });
  } catch (error) {
    console.error('❌ Error fetching interval logs:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Health Check
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
