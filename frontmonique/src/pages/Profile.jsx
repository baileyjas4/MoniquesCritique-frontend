import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>
      <div className="profile-content">
        <div className="profile-info">
          <h2>Account Information</h2>
          <div className="info-item">
            <label>Name:</label>
            <span>{user?.name}</span>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <span>{user?.email}</span>
          </div>
        </div>
        <div className="profile-section">
          <h2>My Reviews</h2>
          <p>Your reviews will appear here</p>
        </div>
        <div className="profile-section">
          <h2>My Favorites</h2>
          <p>Your favorite places will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
