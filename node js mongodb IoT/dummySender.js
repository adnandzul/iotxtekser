const axios = require('axios');

// Fungsi untuk generate data dummy (tanpa koma)
function generateDummyData() {
  return {
    temperature: Math.floor(Math.random() * 36) + 20,     // 20 - 55 °C
    humidity: Math.floor(Math.random() * 61) + 20,        // 20 - 80 %
    distance: Math.floor(Math.random() * 101),            // 0 - 100 cm
    rainValue: Math.floor(Math.random() * 1024),          // 0 - 1023 (ADC)
    kondisi: Math.random() > 0.5 ? 'Hujan' : 'Cerah'
  };
}

// Kirim data setiap 5 detik ke VPS
setInterval(() => {
  const dummyData = generateDummyData();

  axios.post('http://8.222.224.3:2002/weather', dummyData)
    .then(response => {
      console.log('✅ [BERHASIL] Data dikirim ke VPS:', dummyData);
    })
    .catch(error => {
      console.error('❌ [GAGAL] Kirim data:', error.message);
    });

}, 5000); // 5 detik
