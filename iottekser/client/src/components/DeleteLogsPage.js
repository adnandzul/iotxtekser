// components/DeleteLogsPage.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import { FaTrashAlt } from 'react-icons/fa';

const DeleteLogsPage = () => {
  const [startIndex, setStartIndex] = useState('');
  const [endIndex, setEndIndex] = useState('');
  const [message, setMessage] = useState('');
  const [modalType, setModalType] = useState(null);

  const handleDelete = async () => {
    let res, data;

    if (modalType === 'older') {
      res = await fetch('https://projectlab.my.id/api/admin/logs/delete-older-than-7-days', { method: 'DELETE' });
      data = await res.json();
      setMessage(data.success ? `✅ Deleted ${data.deletedCount} old logs` : '❌ Failed to delete old logs');
    } else if (modalType === 'range') {
      if (!startIndex || !endIndex) {
        setMessage('⚠️ Please fill both start and end index.');
        setModalType(null);
        return;
      }
      res = await fetch(`https://projectlab.my.id/api/admin/logs/delete-range/${startIndex}/${endIndex}`, { method: 'DELETE' });
      data = await res.json();
      setMessage(data.success ? `✅ Deleted ${data.deletedCount} logs in range` : '❌ Failed to delete logs in range');
    } else if (modalType === 'all') {
      res = await fetch('https://projectlab.my.id/api/admin/logs/delete-all', { method: 'DELETE' });
      data = await res.json();
      setMessage(data.success ? `✅ Deleted all logs (${data.deletedCount})` : '❌ Failed to delete all logs');
    }

    setModalType(null);
  };

  return (
    <div style={{ backgroundColor: '#0c1e33', minHeight: '100vh' }} className="d-flex align-items-center justify-content-center text-white">
      <div className="container row justify-content-center align-items-center p-4">
        {/* LEFT SIDE - Log Buttons */}
        <div className="col-md-6 animate__animated animate__fadeInLeft">
          <h2 className="mb-4 fw-bold">🧹 Admin Log Manager</h2>

          {message && (
            <div className="alert alert-info p-2 rounded shadow-sm">{message}</div>
          )}

          <div className="mb-4">
            <p>Hapus semua log yang berumur lebih dari 7 hari.</p>
            <button className="btn btn-warning w-100" onClick={() => setModalType('older')}>
              🔥 Delete Logs Older Than 7 Days
            </button>
          </div>

          <div className="mb-4">
            <p>Hapus log berdasarkan rentang index tertentu.</p>
            <div className="d-flex gap-2 mb-2">
              <input type="number" min="1" className="form-control" placeholder="Start Index" value={startIndex} onChange={(e) => setStartIndex(e.target.value)} />
              <input type="number" min="1" className="form-control" placeholder="End Index" value={endIndex} onChange={(e) => setEndIndex(e.target.value)} />
            </div>
            <button className="btn btn-danger w-100" onClick={() => setModalType('range')}>
              🎯 Delete Range
            </button>
          </div>

          <div className="mb-4">
            <p>Hapus semua log secara permanen (tidak bisa dibatalkan).</p>
            <button className="btn btn-outline-danger w-100" onClick={() => setModalType('all')}>
              💀 Delete All Logs
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - Explanation Card */}
        <div className="col-md-6 animate__animated animate__fadeInRight d-none d-md-block">
          <div className="card shadow-sm p-4" style={{ backgroundColor: '#0e223a', border: 'none', color: '#fff' }}>
            <div className="text-center mb-3">
              <FaTrashAlt size={48} className="text-danger" />
              <h4 className="mt-2 fw-bold">Tentang Halaman Ini</h4>
            </div>
            <p className="mb-0" style={{ lineHeight: '1.6' }}>
              Halaman ini dibuat untuk mengelola dan menghapus log aktivitas sistem backend.
              Terdapat tiga opsi penghapusan: log yang lebih dari 7 hari, log dalam rentang index tertentu,
              dan semua log sekaligus. Kamu dapat mengatur parameter seperti index awal dan akhir sebelum menghapus.
              Setiap aksi membutuhkan konfirmasi agar tidak terjadi kesalahan penghapusan.
              Pastikan kamu memahami konsekuensinya karena data yang terhapus tidak bisa dikembalikan.
              Cocok digunakan oleh admin atau developer saat maintenance server.
              Gunakan dengan hati-hati agar sistem tetap stabil dan bersih dari sampah log.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi */}
      {modalType && (
        <div className="modal show fade d-block animate__animated animate__zoomIn" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header border-0">
                <h5 className="modal-title">⚠️ Konfirmasi Penghapusan</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalType(null)}></button>
              </div>
              <div className="modal-body">
                Apakah kamu yakin ingin{' '}
                {modalType === 'older' && 'menghapus log lebih dari 7 hari?'}
                {modalType === 'range' && `menghapus log dari index ${startIndex} sampai ${endIndex}?`}
                {modalType === 'all' && 'menghapus semua log?'}
                <br />
                <strong>Tindakan ini tidak dapat dibatalkan.</strong>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={() => setModalType(null)}>Batal</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Ya, Hapus</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteLogsPage;
