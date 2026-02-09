import React from 'react';
import { Image, Camera } from 'lucide-react';
import '../styles/feed.css'; // 포스트 카드 스타일 재사용

const Photos = () => {
    // 임시 사진 데이터 (Unsplash 이미지)
    const photos = [
        {
            id: 1,
            title: "2024 겨울 공연",
            url: "https://images.unsplash.com/photo-1503095392237-7362137d7a6e?auto=format&fit=crop&q=80&w=1000",
            author: "Admin"
        },
        {
            id: 2,
            title: "연기 연습 현장",
            url: "https://plus.unsplash.com/premium_photo-1661777196224-bfda51e6118e?q=80&w=2670&auto=format&fit=crop",
            author: "Member A"
        },
        {
            id: 3,
            title: "무대 디자인 회의",
            url: "https://images.unsplash.com/photo-1510590337019-5ef2d39ecc3f?q=80&w=2670&auto=format&fit=crop",
            author: "Designer"
        },
        {
            id: 4,
            title: "조명 테스트",
            url: "https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=2595&auto=format&fit=crop",
            author: "Tech Team"
        },
        {
            id: 5,
            title: "뒤풀이 사진",
            url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2670&auto=format&fit=crop",
            author: "Social"
        },
        {
            id: 6,
            title: "소극장 입구",
            url: "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?q=80&w=2670&auto=format&fit=crop",
            author: "Manager"
        }
    ];

    return (
        <div className="feed-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>📷 Photos</h2>
                    <p>Gallery of our memories and events.</p>
                </div>
                <button className="primary-btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    <Camera size={18} style={{ marginRight: '8px' }} />
                    Add Photo
                </button>
            </div>

            <div className="photo-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem',
                marginTop: '1.5rem'
            }}>
                {photos.map(photo => (
                    <div key={photo.id} className="photo-item" style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        aspectRatio: '1/1',
                        position: 'relative',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <img
                            src={photo.url}
                            alt={photo.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        />
                        <div className="photo-info-overlay" style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                            color: 'white',
                            padding: '1rem',
                            pointerEvents: 'none'
                        }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{photo.title}</span>
                            <br />
                            <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>by {photo.author}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Photos;
