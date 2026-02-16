import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Monique's Critique. All rights reserved.</p>
        <p className="footer-tagline">Discover, Review, and Share Your Favorite Places</p>
      </div>
    </footer>
  );
};

export default Footer;
