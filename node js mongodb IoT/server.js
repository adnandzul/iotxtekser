const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');  // Tambahkan ini
const app = express();
const port = 2002;

// Gunakan cors sebagai middleware
app.use(cors());  // Mengaktifkan CORS untuk semua permintaan

// Ganti dengan string koneksi MongoDB Atlas yang didapat, database diubah jadi 'projectLogs'
const mongoURI = "mongodb+srv://admin:admin@iotlogs.qb8xkox.mongodb.net/projectLogs?retryWrites=true&w=majority&appName=iotLogs";

// Sambungkan ke MongoDB Atlas
mongoose.connect(mongoURI)
  .then(() => console.log('Terhubung ke MongoDB Atlas!'))
  .catch(err => console.log('Gagal terhubung ke MongoDB Atlas:', err));

// Definisikan Schema dan Model untuk Data Cuaca dengan nama koleksi 'logsData'
const weatherSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  distance: Number,
  rainValue: Number,
  kondisi: String,
  timestamp: { type: Date, default: Date.now }
});

// Nama model diubah menjadi 'logsData', yang akan digunakan untuk koleksi 'logsData'
const WeatherData = mongoose.model('logsData', weatherSchema);

// Middleware untuk parsing JSON dan URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint untuk menerima data dari ESP32
app.post('/weather', (req, res) => {
  const { temperature, humidity, distance, rainValue, kondisi } = req.body;

  // Ambil timestamp saat ini dan konversi ke WIB (UTC+7)
  const timestamp = new Date();
  timestamp.setHours(timestamp.getHours() + 7); // Tambahkan 7 jam untuk WIB

  // Simpan data ke MongoDB
  const newWeatherData = new WeatherData({
    temperature,
    humidity,
    distance,
    rainValue,
    kondisi,
    timestamp // Gunakan timestamp yang sudah dikonversi
  });

  newWeatherData.save()
    .then(() => {
      console.log('Data disimpan ke MongoDB Atlas');
      res.send('Data diterima dan disimpan!');
    })
    .catch((err) => {
      console.log('Gagal menyimpan data:', err);
      res.status(500).send('Gagal menyimpan data');
    });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://0.0.0.0:${port}`);
});
