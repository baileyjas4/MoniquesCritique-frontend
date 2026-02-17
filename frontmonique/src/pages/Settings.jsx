import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdWarning } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import './Settings.css';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Account settings state
  const [accountData, setAccountData] = useState({
    name: user?.name || ''
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Delete account state
  const [deleteData, setDeleteData] = useState({
    password: '',
    confirmation: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const userId = user._id || user.userId;
      await userService.updateProfile(userId, accountData);
      setMessage({ type: 'success', text: 'Account updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update account' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    // Check for at least one number
    if (!/\d/.test(passwordData.newPassword)) {
      setMessage({ type: 'error', text: 'Password must contain at least one number' });
      return;
    }

    // Check for at least one letter
    if (!/[a-zA-Z]/.test(passwordData.newPassword)) {
      setMessage({ type: 'error', text: 'Password must contain at least one letter' });
      return;
    }

    setLoading(true);
    try {
      const userId = user._id || user.userId;
      await userService.changePassword(userId, passwordData.currentPassword, passwordData.newPassword);
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (deleteData.confirmation !== 'DELETE') {
      setMessage({ type: 'error', text: 'Please type DELETE to confirm' });
      return;
    }

    setLoading(true);
    try {
      const userId = user._id || user.userId;
      await userService.deleteAccount(userId, deleteData.password);
      logout();
      navigate('/');
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete account' });
      setLoading(false);
    }
  };

  return (
    <div className="settings">
      <div className="settings-container">
        <h1>Settings</h1>

        <div className="settings-tabs">
          <button
            className={`tab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            Account
          </button>
          <button
            className={`tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Password
          </button>
          <button
            className={`tab ${activeTab === 'danger' ? 'active' : ''}`}
            onClick={() => setActiveTab('danger')}
          >
            Danger Zone
          </button>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="settings-content">
          {activeTab === 'account' && (
            <form className="settings-form" onSubmit={handleUpdateAccount}>
              <h2>Account Information</h2>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  value={accountData.name}
                  onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form className="settings-form" onSubmit={handleChangePassword}>
              <h2>Change Password</h2>

              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  disabled={loading}
                  required
                  minLength={8}
                />
                <small>Must be at least 8 characters and contain at least one letter and one number</small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  disabled={loading}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}

          {activeTab === 'danger' && (
            <div className="settings-form danger-zone">
              <h2>Danger Zone</h2>
              <p className="danger-warning">
                <MdWarning size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                Once you delete your account, there is no going back. This action cannot be undone.
              </p>

              {!showDeleteConfirm ? (
                <button
                  className="btn btn-danger"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Account
                </button>
              ) : (
                <form onSubmit={handleDeleteAccount}>
                  <div className="form-group">
                    <label htmlFor="deletePassword">Enter your password to confirm</label>
                    <input
                      id="deletePassword"
                      type="password"
                      value={deleteData.password}
                      onChange={(e) => setDeleteData({ ...deleteData, password: e.target.value })}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="deleteConfirmation">Type DELETE to confirm</label>
                    <input
                      id="deleteConfirmation"
                      type="text"
                      value={deleteData.confirmation}
                      onChange={(e) => setDeleteData({ ...deleteData, confirmation: e.target.value })}
                      disabled={loading}
                      required
                      placeholder="DELETE"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteData({ password: '', confirmation: '' });
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-danger" disabled={loading}>
                      {loading ? 'Deleting...' : 'Delete My Account'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
