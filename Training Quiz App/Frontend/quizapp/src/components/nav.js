import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbarStyles.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">QuizApp</Link>
      </div>
    </nav>
  );
};

export default Navbar;
