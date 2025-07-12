import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>🏝️ Archipelago</h2>
      </div>
      <div className="nav-links">
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
        >
          Create Room
        </Link>
        {location.pathname.includes('/game/') && (
          <Link 
            to={`/scoreboard/${location.pathname.split('/')[2]}`}
            className="nav-link"
          >
            Scoreboard
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
