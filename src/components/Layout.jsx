import React from 'react';
import { Calendar, Users, Image, MessageSquare, Mic2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Header from './Header';
import { useAppContext } from '../context/AppContext';
import '../styles/layout.css';

const Layout = ({ children }) => {
    const { users } = useAppContext();

    // Get latest 5 members (DB에서는 joined_at 사용)
    const latestMembers = [...users]
        .sort((a, b) => new Date(b.joined_at || b.joinedAt) - new Date(a.joined_at || a.joinedAt))
        .slice(0, 5);

    return (
        <div className="app-layout">
            <Header />
            <div className="main-container container">
                <aside className="sidebar-left">
                    <nav className="nav-menu">
                        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <MessageSquare size={20} />
                            <span>All Posts</span>
                        </NavLink>
                        <NavLink to="/notices" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Mic2 size={20} />
                            <span>Notices</span>
                        </NavLink>
                        <NavLink to="/calendar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Calendar size={20} />
                            <span>Calendar</span>
                        </NavLink>
                        <NavLink to="/photos" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Image size={20} />
                            <span>Photos</span>
                        </NavLink>
                        <NavLink to="/members" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Users size={20} />
                            <span>Members</span>
                        </NavLink>
                    </nav>
                </aside>

                <main className="main-content">
                    {children}
                </main>

                <aside className="sidebar-right">
                    <div className="widget-card">
                        <div className="widget-header">
                            <h3>Upcoming Events</h3>
                            <button className="text-btn">View All</button>
                        </div>
                        {/* Hardcoded events for now */}
                        <div className="event-list">
                            <div className="event-item">
                                <div className="event-date">
                                    <span className="month">FEB</span>
                                    <span className="day">10</span>
                                </div>
                                <div className="event-info">
                                    <h4>Regular Practice</h4>
                                    <p>7:00 PM • Main Hall</p>
                                </div>
                            </div>
                            <div className="event-item">
                                <div className="event-date">
                                    <span className="month">FEB</span>
                                    <span className="day">14</span>
                                </div>
                                <div className="event-info">
                                    <h4>Valentine's Show</h4>
                                    <p>6:00 PM • Theater A</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="widget-card">
                        <div className="widget-header">
                            <h3>New Members</h3>
                        </div>
                        <ul className="member-list">
                            {latestMembers.length === 0 ? (
                                <li className="text-secondary" style={{ fontSize: '0.9rem' }}>No members yet</li>
                            ) : (
                                latestMembers.map((user) => (
                                    <li key={user.id} className="member-item">
                                        {/* Random color based on name length for demo */}
                                        <div className="member-avatar" style={{ backgroundColor: `hsl(${user.name.length * 40}, 60%, 50%)` }}></div>
                                        <span>{user.name}</span>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};
export default Layout;
