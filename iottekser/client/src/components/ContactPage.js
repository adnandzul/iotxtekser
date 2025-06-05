import React from 'react';
import { FaTelegramPlane } from 'react-icons/fa';
import 'animate.css';

const ContactPage = () => {
  return (
    <div className="contact-container">

      {/* Hero Section in a Card */}
      <div className="container py-5 animate__animated animate__fadeIn">
        <div
          className="card text-light text-center p-5 mb-5"
          style={{
            backgroundColor: '#1d2b38',
            borderRadius: '15px',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
          }}
        >
          <h1 className="display-4 fw-bold animate__animated animate__zoomIn">
            Join Our Telegram Group
          </h1>
          <p className="lead animate__animated animate__fadeInUp mt-3">
            Stay updated on flood, temperature, humidity, and weather status by joining our Telegram group!
            In this group, you will receive real-time updates on the current flood levels, temperature trends,
            humidity readings, and other crucial weather information that could affect your daily activities.
          </p>
        </div>
      </div>

      {/* Cards Section */}
      <div className="container pb-5">
        <div className="row justify-content-center">
          {[
            {
              title: 'Weather Updates',
              desc: 'Get live weather updates, including flood levels, humidity, and temperature to keep you informed.'
            },
            {
              title: 'Community Insights',
              desc: 'Join a community of informed individuals and discuss local environmental conditions and weather.'
            },
            {
              title: 'Real-Time Alerts',
              desc: 'Receive instant alerts on important weather and environmental changes, including flooding warnings.'
            }
          ].map((item, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div
                className="card animate__animated animate__fadeInUp"
                style={{
                  backgroundColor: '#1d2b38',
                  color: '#ffffff',
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                }}
              >
                <div className="card-body text-center">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.desc}</p>
                  <a
                    href="https://t.me/+8mhKPjfI5jk5NGJl"
                    className="btn btn-outline-light btn-lg animate__animated animate__pulse animate__infinite"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Telegram Icon (Shaking) */}
      <div className="text-center pb-5">
        <FaTelegramPlane
          className="animate__animated animate__shakeX animate__infinite"
          style={{
            color: '#0088cc',
            fontSize: '100px',
            animationDuration: '2s',
            animationTimingFunction: 'ease-in-out',
          }}
        />
      </div>

      {/* Footer */}
      <div className="footer-contact text-light py-3 text-center" style={{ backgroundColor: '#0c1e33' }}>
        <p className="mb-0">© 2025 Adnan Dzulfiqar. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default ContactPage;
