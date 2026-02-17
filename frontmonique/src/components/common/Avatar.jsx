import './Avatar.css';

const Avatar = ({ user, size = 'medium' }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getColorFromName = (name) => {
    if (!name) return '#6366f1';
    
    const colors = [
      '#6366f1', // indigo
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#f59e0b', // amber
      '#10b981', // emerald
      '#3b82f6', // blue
      '#ef4444', // red
      '#14b8a6', // teal
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const userName = user?.name || 'Unknown';
  const profilePicture = user?.profilePicture;

  return (
    <div className={`avatar avatar-${size}`}>
      {profilePicture ? (
        <img 
          src={profilePicture} 
          alt={userName}
          className="avatar-image"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div 
        className="avatar-initials"
        style={{ 
          backgroundColor: getColorFromName(userName),
          display: profilePicture ? 'none' : 'flex'
        }}
      >
        {getInitials(userName)}
      </div>
    </div>
  );
};

export default Avatar;
