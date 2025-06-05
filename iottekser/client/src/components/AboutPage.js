import React from 'react';
import { FaChartLine } from 'react-icons/fa'; // icon monitoring
import 'animate.css';

const AboutPage = () => {
  const handleLearnMoreClick = (e) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="about-container"
      style={{ backgroundColor: '#0c1e33', minHeight: '100vh', color: 'white' }}
    >
      {/* Hero Section */}
      <div className="hero-section py-5" style={{ backgroundColor: '#1a2a3c' }}>
        <div className="container text-center">
          <div className="animate__animated animate__fadeInDown">
            <FaChartLine
              size={80}
              color="#61DBFB" // biru kayak sebelumnya
              className="mb-3 animate__animated animate__pulse"
            />
            <h1 className="display-4 fw-bold">About This Project</h1>
          </div>
          <p className="lead text-light animate__animated animate__fadeInUp">
            Welcome to the <strong>Monitoring System</strong> Project! This platform tracks environmental parameters such as{' '}
            <strong>temperature, humidity, distance, and rainfall</strong> in real-time, providing valuable insights for modern applications.
          </p>
          <button
            onClick={handleLearnMoreClick}
            className="btn btn-warning btn-lg mt-3 animate__animated animate__fadeInUp"
            style={{ cursor: 'pointer' }}
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-section py-5" id="features">
        <div className="container">
          <h2 className="text-center mb-5 animate__animated animate__fadeInUp">Key Features</h2>
          <div className="row">
            {/* Feature Cards */}
            <div className="col-md-4 mb-4">
              <div
                className="card border-0 shadow-lg animate__animated animate__fadeInUp animate__delay-1s"
                style={{ backgroundColor: '#1b2c43', color: 'white' }}
              >
                <div className="card-body text-center">
                  <h5 className="card-title">⚡ Real-time Monitoring</h5>
                  <p className="card-text text-light">
                    Our system provides live tracking of environmental factors such as temperature and humidity with no delays.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div
                className="card border-0 shadow-lg animate__animated animate__fadeInUp animate__delay-2s"
                style={{ backgroundColor: '#1b2c43', color: 'white' }}
              >
                <div className="card-body text-center">
                  <h5 className="card-title">📊 Interactive Data</h5>
                  <p className="card-text text-light">
                    View interactive charts and graphs that provide insights from the collected data, helping with analysis and decision-making.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div
                className="card border-0 shadow-lg animate__animated animate__fadeInUp animate__delay-3s"
                style={{ backgroundColor: '#1b2c43', color: 'white' }}
              >
                <div className="card-body text-center">
                  <h5 className="card-title">📱 Fully Responsive</h5>
                  <p className="card-text text-light">
                    Built with React and Bootstrap, our system adapts to any screen size. We also use Express.js to handle the backend database.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="lead text-center text-light mt-5 animate__animated animate__fadeInUp">
            Designed for smart farming, industrial applications, and educational purposes, this platform makes environmental data accessible and easy to interpret.
          </p>

          {/* New detailed explanation content */}
          <div
            className="detailed-explanation mt-5 px-4 py-4"
            style={{
              backgroundColor: '#163055',
              borderRadius: '10px',
              color: '#F6AD55',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              maxWidth: '900px',
              margin: '0 auto',
              boxShadow: '0 0 10px rgba(246, 173, 85, 0.5)',
            }}
          >
            <h3 className="mb-3 text-center">Why Monitoring Matters</h3>
            <p>
              Continuous environmental monitoring enables timely detection of changes in critical parameters like temperature, humidity, and water levels. This empowers users to take proactive measures to protect crops, machinery, and infrastructure. Leveraging real-time data, stakeholders can optimize resources, improve operational efficiency, and mitigate risks caused by unexpected environmental conditions.
            </p>
            <p>
              Our system integrates advanced sensor technology with intuitive visualizations, delivering actionable insights through interactive dashboards. Whether for smart agriculture, industrial automation, or research, the platform offers a robust solution for environmental awareness and decision support.
            </p>
          </div>

          <footer className="text-center mt-5 text-light">
            <p>Made by Adnan Dzulfiqar</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
