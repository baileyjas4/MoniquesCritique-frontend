import { useState } from 'react';
import Avatar from '../common/Avatar';
import CategoryIcon from '../common/CategoryIcon';
import './ProfileEdit.css';

const ProfileEdit = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    profilePicture: user.profilePicture || '',
    preferences: {
      favoriteCategories: user.preferences?.favoriteCategories || [],
      priceRange: user.preferences?.priceRange || '',
      dietaryRestrictions: user.preferences?.dietaryRestrictions || []
    }
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'cafe', label: 'Cafe' },
    { value: 'coffee_shop', label: 'Coffee Shop' },
    { value: 'bar', label: 'Bar' },
    { value: 'other', label: 'Other' }
  ];

  const priceRanges = [
    { value: '$', label: 'Budget', icon: '$' },
    { value: '$$', label: 'Moderate', icon: '$$' },
    { value: '$$$', label: 'Upscale', icon: '$$$' },
    { value: '$$$$', label: 'Luxury', icon: '$$$$' }
  ];

  const dietaryOptions = [
    { value: 'Vegetarian' },
    { value: 'Vegan' },
    { value: 'Gluten-Free' },
    { value: 'Dairy-Free' },
    { value: 'Halal' },
    { value: 'Kosher' }
  ];

  const handleCategoryToggle = (category) => {
    const current = formData.preferences.favoriteCategories;
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    
    setFormData({
      ...formData,
      preferences: { ...formData.preferences, favoriteCategories: updated }
    });
  };

  const handleDietaryToggle = (dietary) => {
    const current = formData.preferences.dietaryRestrictions;
    const updated = current.includes(dietary)
      ? current.filter(d => d !== dietary)
      : [...current, dietary];
    
    setFormData({
      ...formData,
      preferences: { ...formData.preferences, dietaryRestrictions: updated }
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const uploadFormData = new FormData();
      uploadFormData.append('profilePicture', selectedFile);
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${API_URL}/upload/profile-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Upload failed');
      }
      
      const data = await response.json();
      const baseURL = API_URL.replace('/api', '');
      setFormData({ ...formData, profilePicture: `${baseURL}${data.url}` });
      setSelectedFile(null);
    } catch (err) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      setIsSubmitting(false);
    }
  };

  return (
    <form className="profile-edit" onSubmit={handleSubmit}>
      <h3>Edit Profile</h3>

      <div className="form-group profile-picture-section">
        <label>Profile Picture</label>
        <div className="profile-picture-upload">
          <Avatar user={{ ...user, profilePicture: formData.profilePicture }} size="xlarge" />
          <div className="upload-controls">
            <input
              id="profilePictureFile"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isSubmitting || uploading}
              style={{ display: 'none' }}
            />
            <label htmlFor="profilePictureFile" className="file-upload-button">
              {selectedFile ? selectedFile.name : 'Choose Image'}
            </label>
            {selectedFile && (
              <button 
                type="button" 
                onClick={handleUpload} 
                disabled={uploading}
                className="upload-button"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            )}
            <p className="help-text">Upload an image file (max 5MB). Supports JPG, PNG, GIF.</p>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label>Favorite Categories</label>
        <div className="selection-grid">
          {categories.map((category) => (
            <label 
              key={category.value} 
              className={`selection-item ${formData.preferences.favoriteCategories.includes(category.value) ? 'selected' : ''}`}
            >
              <input
                type="checkbox"
                checked={formData.preferences.favoriteCategories.includes(category.value)}
                onChange={() => handleCategoryToggle(category.value)}
                disabled={isSubmitting}
              />
              <span className="selection-icon">
                <CategoryIcon category={category.value} size={32} />
              </span>
              <span className="selection-label">{category.label}</span>
              <span className="checkmark">✓</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Preferred Price Range</label>
        <div className="selection-grid price-grid">
          {priceRanges.map((price) => (
            <label 
              key={price.value} 
              className={`selection-item ${formData.preferences.priceRange === price.value ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="priceRange"
                value={price.value}
                checked={formData.preferences.priceRange === price.value}
                onChange={(e) => setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, priceRange: e.target.value }
                })}
                disabled={isSubmitting}
              />
              <span className="selection-icon price-icon">{price.icon}</span>
              <span className="selection-label">{price.label}</span>
              <span className="checkmark">✓</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Dietary Restrictions</label>
        <div className="selection-grid">
          {dietaryOptions.map((dietary) => (
            <label 
              key={dietary.value} 
              className={`selection-item ${formData.preferences.dietaryRestrictions.includes(dietary.value) ? 'selected' : ''}`}
            >
              <input
                type="checkbox"
                checked={formData.preferences.dietaryRestrictions.includes(dietary.value)}
                onChange={() => handleDietaryToggle(dietary.value)}
                disabled={isSubmitting}
              />
              <span className="selection-label">{dietary.value}</span>
              <span className="checkmark">✓</span>
            </label>
          ))}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default ProfileEdit;