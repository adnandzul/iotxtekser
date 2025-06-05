import React from 'react';
import { Link } from 'react-router-dom';
import { FaSatelliteDish } from 'react-icons/fa';
import 'animate.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-dark shadow-lg animate__animated animate__fadeInDown" style={{ backgroundColor: '#0c1e33', zIndex: 999, position: 'relative' }}>
      <div className="container">
        {/* Logo + Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <FaSatelliteDish
            className="text-info animate__animated animate__infinite animate__rotateIn"
            style={{ animationDuration: '6s' }}
            size={28}
          />
          <span className="fw-bold text-light">Monitoring System</span>
        </Link>

        {/* Toggler */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Items */}
        <div className="collapse navbar-collapse animate__animated animate__fadeInRight" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            {/* ✅ Login ditambahkan di kiri Dashboard */}
            <li className="nav-item me-3">
              <Link className="nav-link text-white hover-effect animate__animated animate__fadeInLeft" to="/admin">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white hover-effect" to="/">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white hover-effect" to="/contact">Join</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white hover-effect" to="/about">About</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
