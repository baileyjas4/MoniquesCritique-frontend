import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to Monique's Critique</h1>
        <p className="hero-subtitle">
          Discover, review, and share your favorite restaurants, coffee shops, and hangout places
        </p>
        <div className="hero-buttons">
          {user ? (
            <>
              <Link to="/search" className="btn btn-primary">
                Start Exploring
              </Link>
              <Link to="/profile" className="btn btn-secondary">
                My Profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/search" className="btn btn-secondary">
                Browse Places
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="features">
        <h2>Why Choose Monique's Critique?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Discover Places</h3>
            <p>Search and filter restaurants, cafes, and hangout spots by location, category, and preferences</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Share Reviews</h3>
            <p>Rate and review your experiences to help others make informed decisions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">❤️</div>
            <h3>Save Favorites</h3>
            <p>Keep track of your favorite places and easily access them anytime</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Recommendations</h3>
            <p>Get personalized suggestions based on your preferences and review history</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
