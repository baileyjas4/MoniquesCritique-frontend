import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdFavorite, MdSmartToy, MdStar, MdSearch, MdRestaurant, MdLocalCafe } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import RecommendationList from '../components/recommendations/RecommendationList';
import { recommendationsService } from '../services/recommendationsService';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await recommendationsService.getRecommendations();
      setRecommendations(data);
      setError('');
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <MdRestaurant size={24} />
            <span>Trusted Food Reviews</span>
          </div>
          <h1 className="hero-title">
            Discover Your Next
            <span className="hero-highlight"> Favorite Spot</span>
          </h1>
          <p className="hero-subtitle">
            Join our community of food lovers. Explore authentic reviews, share your experiences, 
            and find the perfect place for every craving.
          </p>
          <div className="hero-buttons">
            {user ? (
              <>
                <Link to="/search" className="btn btn-hero-primary">
                  <MdSearch size={20} />
                  Start Exploring
                </Link>
                <Link to="/profile" className="btn btn-hero-secondary">
                  My Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-hero-primary">
                  Get Started Free
                </Link>
                <Link to="/search" className="btn btn-hero-secondary">
                  <MdSearch size={20} />
                  Browse Places
                </Link>
              </>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Places</div>
            </div>
            <div className="stat">
              <div className="stat-number">500+</div>
              <div className="stat-label">Reviews</div>
            </div>
            <div className="stat">
              <div className="stat-number">100+</div>
              <div className="stat-label">Food Lovers</div>
            </div>
          </div>
        </div>
      </section>

      {user && recommendations.length > 0 && (
        <section className="recommendations-section">
          <RecommendationList
            recommendations={recommendations}
            loading={loading}
            error={error}
          />
        </section>
      )}

      <section className="features">
        <div className="features-header">
          <h2>Everything You Need to Find Great Food</h2>
          <p>Discover, review, and share amazing dining experiences</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <MdSearch size={48} />
            </div>
            <h3>Discover Places</h3>
            <p>Search thousands of restaurants, cafes, and bars. Filter by cuisine, price, location, and more.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <MdStar size={48} />
            </div>
            <h3>Honest Reviews</h3>
            <p>Read authentic reviews from real food lovers. Share your own experiences and help others decide.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <MdFavorite size={48} />
            </div>
            <h3>Save Favorites</h3>
            <p>Create your personal collection of must-visit spots. Never forget a great meal again.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <MdSmartToy size={48} />
            </div>
            <h3>Smart Recommendations</h3>
            <p>Get personalized suggestions powered by AI based on your taste and dining history.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <MdLocalCafe size={48} className="cta-icon" />
          <h2>Ready to Explore?</h2>
          <p>Join thousands of food enthusiasts discovering their next favorite spot</p>
          {!user && (
            <Link to="/register" className="btn btn-cta">
              Sign Up Now - It's Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;