import React, { useState } from 'react';
import './Modal.css';

const AdditionalMaterialModal = ({ content, onComplete, onClose }) => {
  const material = content.content;
  const [showVideo, setShowVideo] = useState(false);

  const handleComplete = () => {
    onComplete(content.id || `material-${Date.now()}`, 5);
  };

  const openExternalLink = () => {
    window.open(material.url, '_blank');
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    let videoId = null;
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtube.com/playlist?list=')) {
      const playlistId = url.split('list=')[1].split('&')[0];
      return `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const isYouTube = material.type === 'YouTube';
  const embedUrl = isYouTube ? getYouTubeEmbedUrl(material.url) : null;

  if (!material) {
    return (
      <div className="modal-content material-modal">
        <div className="modal-header">
          <h2>Error</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>No content available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-content material-modal">
      <div className="modal-header">
        <h2>{material.title}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="modal-body">
        <div className="material-content">
          <div className="material-type">
            <span className="type-badge">{material.type}</span>
          </div>
          
          <div className="material-description">
            <p>{material.description}</p>
          </div>

          {/* YouTube Video Section */}
          {isYouTube && (
            <div className="video-section">
              {!showVideo ? (
                <div className="video-preview">
                  <div className="video-placeholder">
                    <div className="play-icon">▶️</div>
                    <p>Click to load YouTube video</p>
                    <button 
                      className="btn video-btn" 
                      onClick={() => setShowVideo(true)}
                    >
                      Load Video
                    </button>
                  </div>
                </div>
              ) : (
                <div className="video-container">
                  {embedUrl ? (
                    <iframe
                      width="100%"
                      height="315"
                      src={embedUrl}
                      title={material.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="video-error">
                      <p>Unable to embed video. Please use the link below to open it directly.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Wikipedia Abstract Section */}
          {material.type === 'Wikipedia' && (
            <div className="wikipedia-section">
              <div className="wikipedia-abstract">
                <h4>📖 About this topic:</h4>
                <p>
                  This Wikipedia article provides comprehensive information about {material.title.replace(' - Wikipedia', '')}. 
                  It covers the fundamental concepts, applications, and theoretical background that are essential 
                  for understanding this topic in depth.
                </p>
                <div className="wikipedia-features">
                  <div className="feature">
                    <strong>📚 Comprehensive Coverage:</strong> Detailed explanations and examples
                  </div>
                  <div className="feature">
                    <strong>🔗 References:</strong> Links to additional sources and research
                  </div>
                  <div className="feature">
                    <strong>🌐 Community Verified:</strong> Peer-reviewed and regularly updated
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="material-actions">
            <button className="btn link-btn" onClick={openExternalLink}>
              Open {material.type} 🔗
            </button>
          </div>
          
          <div className="material-info">
            <p><strong>Source URL:</strong></p>
            <div className="url-display">{material.url}</div>
          </div>
        </div>
      </div>
      
      <div className="modal-footer">
        <button className="btn complete-btn" onClick={handleComplete}>
          Mark as Viewed ✅
        </button>
      </div>
    </div>
  );
};

export default AdditionalMaterialModal;
