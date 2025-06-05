// components/DeleteLogsPage.js
import React, { useState } from 'react';

const DeleteLogsPage = () => {
  const [startIndex, setStartIndex] = useState('');
  const [endIndex, setEndIndex] = useState('');
  const [message, setMessage] = useState('');

  const handleDeleteOlderThan7Days = async () => {
    const res = await fetch('http://47.84.53.252:31001/api/admin/logs/delete-older-than-7-days', {
      method: 'DELETE',
    });
    const data = await res.json();
    setMessage(data.success ? `Deleted ${data.deletedCount} old logs` : 'Failed to delete old logs');
  };

  const handleDeleteRange = async () => {
    if (!startIndex || !endIndex) {
      setMessage('Please fill both start and end index');
      return;
    }

    const res = await fetch(`http://47.84.53.252:31001/api/admin/logs/delete-range/${startIndex}/${endIndex}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    setMessage(data.success ? `Deleted ${data.deletedCount} logs in range` : 'Failed to delete logs in range');
  };

  const handleDeleteAll = async () => {
    const res = await fetch('http://47.84.53.252:31001/api/admin/logs/delete-all', {
      method: 'DELETE',
    });
    const data = await res.json();
    setMessage(data.success ? `Deleted all logs (${data.deletedCount})` : 'Failed to delete all logs');
  };

  return (
    <div className="container p-4">
      <h2>Admin Delete Logs</h2>

      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      <div className="mb-3">
        <button className="btn btn-warning" onClick={handleDeleteOlderThan7Days}>
          Delete Logs Older Than 7 Days
        </button>
      </div>

      <div className="mb-3">
        <label>Delete Logs by Range</label>
        <div className="d-flex gap-2">
          <input
            type="number"
            placeholder="Start Index"
            className="form-control"
            value={startIndex}
            onChange={(e) => setStartIndex(e.target.value)}
            min={1}
          />
          <input
            type="number"
            placeholder="End Index"
            className="form-control"
            value={endIndex}
            onChange={(e) => setEndIndex(e.target.value)}
            min={1}
          />
          <button className="btn btn-danger" onClick={handleDeleteRange}>
            Delete Range
          </button>
        </div>
      </div>

      <div>
        <button className="btn btn-danger" onClick={handleDeleteAll}>
          Delete All Logs
        </button>
      </div>
    </div>
  );
};

export default DeleteLogsPage;
