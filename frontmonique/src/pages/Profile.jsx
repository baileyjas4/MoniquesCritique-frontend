import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import ProfileView from '../components/profile/ProfileView';
import ProfileEdit from '../components/profile/ProfileEdit';
import UserReviews from '../components/profile/UserReviews';
import UserFavorites from '../components/profile/UserFavorites';
import RecommendationList from '../components/recommendations/RecommendationList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { userService } from '../services/userService';
import { reviewsService } from '../services/reviewsService';
import { favoritesService } from '../services/favoritesService';
import { recommendationsService } from '../services/recommendationsService';
import './Profile.css';

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats] = useState({ reviewCount: 0, favoriteCount: 0, blogPostCount: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [loading, setLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authUser) {
      fetchProfileData();
      fetchRecommendations();
    }
  }, [authUser]);

  // Restore active tab from navigation state when returning from place details
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  useEffect(() => {
    if (authUser) {
      fetchProfileData();
      fetchRecommendations();
    }
  }, [authUser]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const userId = authUser._id || authUser.userId;
      const [userData, reviewsData, favoritesData] = await Promise.all([
        userService.getUserById(userId),
        reviewsService.getReviewsByUser(userId),
        favoritesService.getUserFavorites()
      ]);

      setUser(userData);
      setReviews(reviewsData);
      setFavorites(favoritesData);

      const blogPostCount = reviewsData.filter(r => r.isBlogPost).length;
      setStats({
        reviewCount: reviewsData.length,
        favoriteCount: favoritesData.length,
        blogPostCount
      });

      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setRecommendationsLoading(true);
      const data = await recommendationsService.getRecommendations();
      setRecommendations(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const handleSaveProfile = async (formData) => {
    try {
      const userId = authUser._id || authUser.userId;
      const updatedUser = await userService.updateProfile(userId, formData);
      setUser(updatedUser);
      updateUser(updatedUser);
      setIsEditing(false);
      
      // Refresh reviews to get updated user data (including profile picture)
      const reviewsData = await reviewsService.getReviewsByUser(userId);
      setReviews(reviewsData);
      
      // Refresh recommendations after profile update
      fetchRecommendations();
    } catch (err) {
      throw new Error(err.message || 'Failed to update profile');
    }
  };

  const handleRemoveFavorite = async (placeId) => {
    try {
      await favoritesService.removeFavorite(placeId);
      setFavorites(favorites.filter(f => f._id !== placeId));
      setStats({ ...stats, favoriteCount: stats.favoriteCount - 1 });
    } catch (err) {
      alert('Failed to remove favorite');
    }
  };

  if (loading) {
    return (
      <div className="profile">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile-container">
        {isEditing ? (
          <ProfileEdit
            user={user}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProfileView
            user={user}
            stats={stats}
            onEditClick={() => setIsEditing(true)}
            onTabChange={setActiveTab}
          />
        )}

        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations
          </button>
          <button
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            My Reviews
          </button>
          <button
            className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            My Favorites
          </button>
        </div>

        <div className="profile-sections">
          {activeTab === 'recommendations' && (
            <RecommendationList
              recommendations={recommendations}
              loading={recommendationsLoading}
              error=""
            />
          )}
          {activeTab === 'reviews' && (
            <UserReviews reviews={reviews} loading={false} error="" />
          )}
          {activeTab === 'favorites' && (
            <UserFavorites
              favorites={favorites}
              loading={false}
              error=""
              onRemoveFavorite={handleRemoveFavorite}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
