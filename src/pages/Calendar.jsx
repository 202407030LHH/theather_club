import React from 'react';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';

const Calendar = () => {
    // 임시 일정 데이터
    const events = [
        {
            id: 1,
            title: "🎭 2월 정기 공연",
            date: "2026-02-24",
            time: "19:00",
            location: "Main Theater Hall",
            description: "이번 달 정기 공연입니다. 모든 부원은 참석 필수!"
        },
        {
            id: 2,
            title: "📣 신입생 환영회",
            date: "2026-03-02",
            time: "18:00",
            location: "Student Center B1",
            description: "새로 들어온 26학번 신입생들을 위한 환영회입니다."
        },
        {
            id: 3,
            title: "🎬 연기 워크샵",
            date: "2026-03-15",
            time: "14:00",
            location: "Practice Room A",
            description: "외부 강사 초청 연기 특강."
        }
    ];

    return (
        <div className="feed-container">
            <div className="page-header">
                <h2>📅 Calendar</h2>
                <p>Upcoming club events and schedules.</p>
            </div>

            <div className="events-list" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {events.map(event => (
                    <div key={event.id} className="post-card event-item" style={{
                        borderLeft: '4px solid #800020',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                    }}>
                        <div className="event-date-badge" style={{
                            display: 'inline-block',
                            backgroundColor: '#f8f9fa',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            color: '#800020',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem'
                        }}>
                            {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>

                        <h3 className="event-title" style={{ margin: 0, fontSize: '1.2rem' }}>{event.title}</h3>

                        <div className="event-details" style={{ display: 'flex', gap: '1rem', color: '#666', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={16} />
                                <span>{event.time}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={16} />
                                <span>{event.location}</span>
                            </div>
                        </div>

                        <p className="event-desc" style={{ marginTop: '0.5rem', color: '#444' }}>
                            {event.description}
                        </p>
                    </div>
                ))}
            </div>

            {events.length === 0 && (
                <div className="empty-state">
                    No upcoming events.
                </div>
            )}
        </div>
    );
};

export default Calendar;
