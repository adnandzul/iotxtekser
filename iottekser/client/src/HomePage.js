import React from 'react';
import { FaFileAlt, FaChartLine, FaLayerGroup } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import 'animate.css';

const HomePage = () => {
  return (
    <div className="text-center animate__animated animate__fadeIn" style={{ backgroundColor: '#0c1e33', minHeight: '100vh', color: 'white' }}>
      
      {/* Hero Section */}
      <div
        className="hero-section animate__animated animate__fadeInDown mb-5 mx-4"
        style={{
          backgroundImage: 'url(/assets/1200x750.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '100px 40px',
          borderRadius: '20px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <h1 className="mb-4 fw-bold animate__animated animate__fadeInUp" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
          Welcome to the Monitoring System
        </h1>
        <p className="lead text-light animate__animated animate__fadeInUp animate__delay-1s" style={{ maxWidth: '800px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
          This system helps you monitor environmental metrics such as temperature, humidity, distance, and rainfall in real-time. Get powerful insights with logs and dynamic visualizations.
        </p>
      </div>

      {/* Cards Section */}
      <div className="container py-4 animate__animated animate__fadeInUp animate__delay-2s">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-lg border-0 rounded-4 p-4 text-light text-start" style={{ backgroundColor: '#1d2b38', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
              <FaFileAlt size={40} className="mb-3" />
              <h5 className="card-title">System Logs</h5>
              <p className="card-text flex-grow-1">
                Dive deep into real-time and historical logs. Monitor system behavior, track changes, and get clarity on what’s happening under the hood.
              </p>
              <Link to="/logs" className="btn btn-dark w-100 mt-3">Explore Logs</Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-lg border-0 rounded-4 p-4 text-light text-start" style={{ backgroundColor: '#1d2b38', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
              <FaChartLine size={40} className="mb-3" />
              <h5 className="card-title">Interactive Charts</h5>
              <p className="card-text flex-grow-1">
                Visualize temperature, humidity, and distance with sleek, responsive charts. Track environmental conditions as they evolve in real-time.
              </p>
              <Link to="/charts" className="btn btn-dark w-100 mt-3">View Charts</Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-lg border-0 rounded-4 p-4 text-light text-start" style={{ backgroundColor: '#1d2b38', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
              <FaLayerGroup size={40} className="mb-3" />
              <h5 className="card-title">Multi-Chart Comparison</h5>
              <p className="card-text flex-grow-1">
                Analyze multiple data streams at once. Compare trends and make smarter decisions based on combined chart views.
              </p>
              <Link to="/chartspage" className="btn btn-dark w-100 mt-3">Compare Charts</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-5 mb-3 small animate__animated animate__fadeIn animate__delay-3s text-muted">
        &copy; 2025 Made by Adnan Dzulfiqar
      </footer>

      {/* Custom Styles */}
      <style>
        {`
          .btn-dark {
            background-color: #0c1e33;
            color: white;
            padding: 12px;
            border-radius: 8px;
            transition: background-color 0.3s ease;
          }
          .btn-dark:hover {
            background-color: #0a1624;
          }
          .card:hover {
            transform: translateY(-6px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.3);
          }
        `}
      </style>
    </div>
  );
};

export default HomePage;
