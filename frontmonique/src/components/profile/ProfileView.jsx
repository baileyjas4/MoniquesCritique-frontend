import Avatar from '../common/Avatar';
import CategoryIcon from '../common/CategoryIcon';
import './ProfileView.css';

const ProfileView = ({ user, stats, onEditClick, onTabChange }) => {
  return (
    <div className="profile-view">
      <div className="profile-header">
        <Avatar user={user} size="xlarge" />
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>
        </div>
        <button className="edit-profile-btn" onClick={onEditClick}>
          Edit Profile
        </button>
      </div>

      <div className="profile-stats">
        <div className="stat-card clickable" onClick={() => onTabChange('reviews')}>
          <div className="stat-value">{stats.reviewCount || 0}</div>
          <div className="stat-label">Reviews</div>
        </div>
        <div className="stat-card clickable" onClick={() => onTabChange('favorites')}>
          <div className="stat-value">{stats.favoriteCount || 0}</div>
          <div className="stat-label">Favorites</div>
        </div>
        <div className="stat-card clickable" onClick={() => onTabChange('blogposts')}>
          <div className="stat-value">{stats.blogPostCount || 0}</div>
          <div className="stat-label">Blog Posts</div>
        </div>
      </div>

      {user.preferences && (
        <div className="profile-preferences">
          <h3>Preferences</h3>
          <div className="preferences-grid">
            {user.preferences.favoriteCategories && user.preferences.favoriteCategories.length > 0 && (
              <div className="preference-item">
                <label>Favorite Categories</label>
                <div className="category-tags">
                  {user.preferences.favoriteCategories.map((cat) => (
                    <span key={cat} className="category-tag">
                      <CategoryIcon category={cat} size={16} />
                      <span>{cat.replace('_', ' ')}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {user.preferences.priceRange && (
              <div className="preference-item">
                <label>Price Range</label>
                <div className="price-value">{user.preferences.priceRange}</div>
              </div>
            )}
            {user.preferences.dietaryRestrictions && user.preferences.dietaryRestrictions.length > 0 && (
              <div className="preference-item">
                <label>Dietary Restrictions</label>
                <div className="dietary-tags">
                  {user.preferences.dietaryRestrictions.map((restriction) => (
                    <span key={restriction} className="dietary-tag">
                      {restriction}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
