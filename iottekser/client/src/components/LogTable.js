import React, { useEffect, useState } from 'react';
import 'animate.css';

const LogTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  const [filterDate, setFilterDate] = useState('');
  const [filterStartHour, setFilterStartHour] = useState('');
  const [filterEndHour, setFilterEndHour] = useState('');

  const [tempFilterDate, setTempFilterDate] = useState('');
  const [tempFilterStartHour, setTempFilterStartHour] = useState('');
  const [tempFilterEndHour, setTempFilterEndHour] = useState('');

  useEffect(() => {
    setLoading(true);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    fetch(`${API_BASE_URL}/api/logs?page=${currentPage}&limit=20`)
      .then((res) => res.json())
      .then((data) => {
        let filtered = data.data;

        if (filterDate) {
          filtered = filtered.filter(log => {
            const logDate = new Date(log.timestamp).toISOString().split('T')[0];
            return logDate === filterDate;
          });
        }

        if (filterStartHour !== '' && filterEndHour !== '') {
          const start = parseInt(filterStartHour);
          const end = parseInt(filterEndHour);

          filtered = filtered.filter(log => {
            const hour = new Date(log.timestamp).getUTCHours();
            if (start <= end) {
              return hour >= start && hour <= end;
            } else {
              return hour >= start || hour <= end;
            }
          });
        }

        setLogs(filtered);
        setTotalLogs(data.totalLogs);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [currentPage, filterDate, filterStartHour, filterEndHour]);

  const handleSearch = () => {
    setFilterDate(tempFilterDate);
    setFilterStartHour(tempFilterStartHour);
    setFilterEndHour(tempFilterEndHour);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setTempFilterDate('');
    setTempFilterStartHour('');
    setTempFilterEndHour('');
    setFilterDate('');
    setFilterStartHour('');
    setFilterEndHour('');
    setCurrentPage(1);
  };

  const getBadgeClass = (kondisi) => {
    switch (kondisi.toLowerCase()) {
      case 'aman': return 'badge bg-success';
      case 'waspada': return 'badge bg-warning text-dark';
      case 'bahaya': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  };

  return (
    <div className="container py-5 animate__animated animate__fadeIn">
      {/* Card Utama Tabel */}
      <div
        className="p-4 shadow mb-5"
        style={{
          backgroundColor: '#1d2b38',
          color: '#ffffff',
          borderRadius: '10px',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <h2 className="mb-4 text-center">Log Data ({totalLogs} entries)</h2>

        {/* Filter */}
        <div className="row mb-4">
          <div className="col-md-3">
            <label className="form-label text-light">Filter by Date</label>
            <input
              type="date"
              className="form-control"
              value={tempFilterDate}
              onChange={e => setTempFilterDate(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label text-light">Start Hour (0-23)</label>
            <input
              type="number"
              min="0"
              max="23"
              className="form-control"
              placeholder="0"
              value={tempFilterStartHour}
              onChange={e => setTempFilterStartHour(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label text-light">End Hour (0-23)</label>
            <input
              type="number"
              min="0"
              max="23"
              className="form-control"
              placeholder="23"
              value={tempFilterEndHour}
              onChange={e => setTempFilterEndHour(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button className="btn btn-warning w-100" onClick={handleSearch}>Search</button>
          </div>
          <div className="col-md-3 d-flex align-items-end mt-3">
            <button className="btn btn-secondary w-100" onClick={handleReset}>Reset Filter</button>
          </div>
        </div>

        {/* Tabel */}
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="table-responsive animate__animated animate__fadeInUp">
              <table className="table table-bordered" style={{ backgroundColor: '#1b2b3a', color: 'white' }}>
                <thead className="table-dark">
                  <tr>
                    <th>Temperature (°C)</th>
                    <th>Humidity (%)</th>
                    <th>Distance (cm)</th>
                    <th>Rain Value</th>
                    <th>Kondisi</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log._id}>
                      <td>{log.temperature}</td>
                      <td>{log.humidity}</td>
                      <td>{log.distance}</td>
                      <td>{log.rainValue}</td>
                      <td><span className={getBadgeClass(log.kondisi)}>{log.kondisi}</span></td>
                      <td>{new Date(log.timestamp).toISOString().replace('T', ' ').slice(0, 19)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button
                className="btn btn-outline-light px-4"
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span className="text-light">
                Page <strong>{currentPage}</strong> of {totalPages}
              </span>

              <button
                className="btn btn-outline-light px-4"
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* 3 Card Penjelasan */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-4 mb-3">
          <div className="card h-100 text-white shadow" style={{ backgroundColor: '#1d2b38' }}>
            <div className="card-body">
              <h5 className="card-title">Rain Value</h5>
              <p className="card-text">
                Rain Value diperoleh dari sensor hujan yang mendeteksi keberadaan tetesan air. Nilai ini mencerminkan seberapa basah lingkungan sekitar.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card h-100 text-white shadow" style={{ backgroundColor: '#1d2b38' }}>
            <div className="card-body">
              <h5 className="card-title">Distance</h5>
              <p className="card-text">
                Distance diukur menggunakan sensor jarak (seperti ultrasonic) untuk mengetahui kedekatan objek atau penghalang di sekitar alat.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card h-100 text-white shadow" style={{ backgroundColor: '#1d2b38' }}>
            <div className="card-body">
              <h5 className="card-title">Cuaca</h5>
              <p className="card-text">
                Informasi cuaca seperti suhu dan kelembaban diambil dari sensor DHT22, lalu dikombinasikan untuk menentukan kondisi seperti Aman, Waspada, atau Bahaya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogTable;
