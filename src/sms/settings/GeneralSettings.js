import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const GeneralSettings = () => {
  const { settings, updateSettings } = useSchool();

  const [formData, setFormData] = useState({
    schoolName: '',
    schoolCode: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    logo: '',
    favicon: '',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'INR',
    currencySymbol: '₹',
    language: 'en',
    sessionTimeout: 30,
    recordsPerPage: 25
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        schoolName: settings.schoolName || '',
        schoolCode: settings.schoolCode || '',
        address: settings.address || '',
        city: settings.city || '',
        state: settings.state || '',
        country: settings.country || 'India',
        zipCode: settings.zipCode || '',
        phone: settings.phone || '',
        email: settings.email || '',
        website: settings.website || '',
        logo: settings.logo || '',
        favicon: settings.favicon || '',
        timezone: settings.timezone || 'Asia/Kolkata',
        dateFormat: settings.dateFormat || 'DD/MM/YYYY',
        timeFormat: settings.timeFormat || '24h',
        currency: settings.currency || 'INR',
        currencySymbol: settings.currencySymbol || '₹',
        language: settings.language || 'en',
        sessionTimeout: settings.sessionTimeout || 30,
        recordsPerPage: settings.recordsPerPage || 25
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'logo' && !file.type.startsWith('image/')) {
        alert('Please select an image file for logo');
        return;
      }
      if (type === 'favicon' && !file.type.startsWith('image/')) {
        alert('Please select an image file for favicon');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [type]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.schoolName.trim()) {
      newErrors.schoolName = 'School name is required';
    }
    
    if (!formData.schoolCode.trim()) {
      newErrors.schoolCode = 'School code is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      updateSettings(formData);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      setFormData({
        schoolName: '',
        schoolCode: '',
        address: '',
        city: '',
        state: '',
        country: 'India',
        zipCode: '',
        phone: '',
        email: '',
        website: '',
        logo: '',
        favicon: '',
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        currency: 'INR',
        currencySymbol: '₹',
        language: 'en',
        sessionTimeout: 30,
        recordsPerPage: 25
      });
    }
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>General Settings</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/settings">Settings</Link></li>
              <li className="breadcrumb-item active">General Settings</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          {message && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {message}
              <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
            </div>
          )}

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">General Settings</h5>
                  <form onSubmit={handleSubmit}>
                    <h6 className="card-title mt-4 mb-3">School Information</h6>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          School Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.schoolName ? 'is-invalid' : ''}`}
                          name="schoolName"
                          value={formData.schoolName}
                          onChange={handleChange}
                          placeholder="Enter school name"
                        />
                        {errors.schoolName && <div className="invalid-feedback">{errors.schoolName}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          School Code <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.schoolCode ? 'is-invalid' : ''}`}
                          name="schoolCode"
                          value={formData.schoolCode}
                          onChange={handleChange}
                          placeholder="Enter school code"
                        />
                        {errors.schoolCode && <div className="invalid-feedback">{errors.schoolCode}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Address</label>
                        <textarea
                          className="form-control"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows="2"
                          placeholder="Enter address"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Enter city"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          className="form-control"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Enter state"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Country</label>
                        <input
                          type="text"
                          className="form-control"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          placeholder="Enter country"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Zip Code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          placeholder="Enter zip code"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email"
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Website</label>
                        <input
                          type="url"
                          className="form-control"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="https://www.example.com"
                        />
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">Branding</h6>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">School Logo</label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'logo')}
                        />
                        {formData.logo && (
                          <div className="mt-2">
                            <img src={formData.logo} alt="Logo" style={{ maxHeight: '100px' }} />
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Favicon</label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'favicon')}
                        />
                        {formData.favicon && (
                          <div className="mt-2">
                            <img src={formData.favicon} alt="Favicon" style={{ maxHeight: '50px' }} />
                          </div>
                        )}
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">Localization</h6>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Timezone</label>
                        <select
                          className="form-select"
                          name="timezone"
                          value={formData.timezone}
                          onChange={handleChange}
                        >
                          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">America/New_York (EST)</option>
                          <option value="Europe/London">Europe/London (GMT)</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Date Format</label>
                        <select
                          className="form-select"
                          name="dateFormat"
                          value={formData.dateFormat}
                          onChange={handleChange}
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Time Format</label>
                        <select
                          className="form-select"
                          name="timeFormat"
                          value={formData.timeFormat}
                          onChange={handleChange}
                        >
                          <option value="24h">24 Hour</option>
                          <option value="12h">12 Hour (AM/PM)</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Currency</label>
                        <select
                          className="form-select"
                          name="currency"
                          value={formData.currency}
                          onChange={handleChange}
                        >
                          <option value="INR">Indian Rupee (INR)</option>
                          <option value="USD">US Dollar (USD)</option>
                          <option value="EUR">Euro (EUR)</option>
                          <option value="GBP">British Pound (GBP)</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Currency Symbol</label>
                        <input
                          type="text"
                          className="form-control"
                          name="currencySymbol"
                          value={formData.currencySymbol}
                          onChange={handleChange}
                          placeholder="₹"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Language</label>
                        <select
                          className="form-select"
                          name="language"
                          value={formData.language}
                          onChange={handleChange}
                        >
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </select>
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">System Preferences</h6>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="sessionTimeout"
                          value={formData.sessionTimeout}
                          onChange={handleChange}
                          min="5"
                          max="120"
                        />
                        <small className="text-muted">User session will expire after this time of inactivity</small>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Records Per Page</label>
                        <input
                          type="number"
                          className="form-control"
                          name="recordsPerPage"
                          value={formData.recordsPerPage}
                          onChange={handleChange}
                          min="10"
                          max="100"
                        />
                        <small className="text-muted">Default number of records to display per page</small>
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={handleReset}
                      >
                        <i className="bi bi-arrow-counterclockwise"></i> Reset to Default
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> Save Settings
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default GeneralSettings;

