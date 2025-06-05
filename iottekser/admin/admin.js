// admin.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 4001;

// =======================
// Database Connections
// =======================

// PostgreSQL
const POSTGRES_URI = process.env.POSTGRES_URI || 'postgresql://postgres:mysecretpassword@localhost:5432/postgres';
const pool = new Pool({ connectionString: POSTGRES_URI });

// MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@iotlogs.qb8xkox.mongodb.net/projectLogs?retryWrites=true&w=majority&appName=iotLogs';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB Atlas in admin.js');
}).catch(err => {
  console.error('❌ MongoDB connection error in admin.js:', err);
  process.exit(1); // Exit the app if MongoDB fails to connect
});

// MongoDB Schema
const logSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  distance: Number,
  rainValue: Number,
  kondisi: String,
  timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model('Log', logSchema, 'logsdatas');

// =======================
// Middleware
// =======================
app.use(cors({
  origin: 'http://47.84.53.252:30080',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// =======================
// Admin Routes
// =======================
const adminRouter = express.Router();

adminRouter.get('/', (req, res) => {
  res.send('✅ Admin service is up');
});

adminRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password diperlukan' });
  }

  try {
    const result = await pool.query('SELECT * FROM admins WHERE username=$1 AND password=$2', [username, password]);
    if (result.rows.length > 0) {
      return res.json({ success: true, message: 'Login berhasil' });
    } else {
      return res.status(401).json({ success: false, message: 'Login gagal: username atau password salah' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

adminRouter.delete('/logs/delete-older-than-7-days', async (req, res) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  try {
    const result = await Log.deleteMany({ timestamp: { $lt: sevenDaysAgo } });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal menghapus data lama' });
  }
});

adminRouter.delete('/logs/delete-range/:start/:end', async (req, res) => {
  const start = parseInt(req.params.start);
  const end = parseInt(req.params.end);

  if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
    return res.status(400).json({ success: false, message: 'Range tidak valid' });
  }

  try {
    const logsToDelete = await Log.find()
      .sort({ timestamp: 1 })
      .skip(start - 1)
      .limit(end - start + 1)
      .select('_id');

    const ids = logsToDelete.map(log => log._id);
    const result = await Log.deleteMany({ _id: { $in: ids } });

    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal menghapus data berdasarkan range' });
  }
});

adminRouter.delete('/logs/delete-all', async (req, res) => {
  try {
    const result = await Log.deleteMany({});
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal menghapus semua data' });
  }
});

// Mount route
app.use('/api/admin', adminRouter);

// =======================
// Error Handler
// =======================
app.use((err, req, res, next) => {
  console.error('❗ Unhandled Error:', err.stack || err);
  res.status(500).json({ success: false, message: 'Something went wrong' });
});

// =======================
// WebSocket Setup
// =======================
wss.on('connection', (ws) => {
  console.log('🌐 WebSocket connected');

  ws.on('message', (message) => {
    console.log('📨 Received:', message);
  });

  ws.on('close', () => {
    console.log('❌ WebSocket disconnected');
  });

  ws.send('📡 Welcome to WebSocket server');
});

// =======================
// Start Server
// =======================
server.listen(PORT, () => {
  console.log(`🚀 Admin server running on port ${PORT}`);
});
