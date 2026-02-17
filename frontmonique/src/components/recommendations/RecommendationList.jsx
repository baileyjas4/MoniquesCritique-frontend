import { MdSearch, MdAutoAwesome } from 'react-icons/md';
import RecommendationCard from './RecommendationCard';
import LoadingSpinner from '../common/LoadingSpinner';
import './RecommendationList.css';

const RecommendationList = ({ recommendations, loading, error }) => {
  if (loading) {
    return (
      <div className="recommendation-list-loading">
        <LoadingSpinner />
        <p>Finding perfect places for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendation-list-error">
        <p>Failed to load recommendations: {error}</p>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="recommendation-list-empty">
        <div className="empty-icon"><MdSearch size={64} /></div>
        <h3>No recommendations yet</h3>
        <p>Start reviewing places and updating your preferences to get personalized recommendations!</p>
      </div>
    );
  }

  return (
    <div className="recommendation-list">
      <div className="recommendation-list-header">
        <h2><MdAutoAwesome size={28} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Recommended for You</h2>
        <p>Based on your preferences and review history</p>
      </div>
      <div className="recommendation-grid">
        {recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.place._id}
            recommendation={recommendation}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationList;
