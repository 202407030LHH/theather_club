import React from 'react';
import { Search, Bell, User, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import '../styles/header.css';

const Header = () => {
  const { currentUser, logout } = useAppContext();

  return (
    <header className="header">
      <div className="header-container container">
        <Link to="/" className="logo">
          <h1>Theater Club</h1>
        </Link>
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search posts, events..." />
        </div>
        <div className="header-actions">
          {currentUser ? (
            <>
              <button className="icon-btn" aria-label="Notifications">
                <Bell size={22} />
                <span className="badge">2</span>
              </button>
              <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{currentUser.name}</span>
                <button
                  className="profile-btn"
                  onClick={logout}
                  title="Logout"
                >
                  <div className="avatar-placeholder">
                    {currentUser.name[0]}
                  </div>
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="login-btn">
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
