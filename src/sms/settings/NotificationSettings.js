import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const NotificationSettings = () => {
  const { settings, updateSettings } = useSchool();

  const [formData, setFormData] = useState({
    enableSMS: true,
    smsProvider: 'Twilio',
    smsApiKey: '',
    smsApiSecret: '',
    smsSenderId: '',
    enableEmail: true,
    emailProvider: 'SMTP',
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpEncryption: 'TLS',
    emailFromAddress: '',
    emailFromName: '',
    enablePushNotifications: true,
    pushNotificationKey: '',
    enableAttendanceNotifications: true,
    enableFeeNotifications: true,
    enableExamNotifications: true,
    enableHomeworkNotifications: true,
    enableAnnouncementNotifications: true
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showSMSSecret, setShowSMSSecret] = useState(false);
  const [showSMTPPassword, setShowSMTPPassword] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        enableSMS: settings.enableSMS !== undefined ? settings.enableSMS : true,
        smsProvider: settings.smsProvider || 'Twilio',
        smsApiKey: settings.smsApiKey || '',
        smsApiSecret: settings.smsApiSecret || '',
        smsSenderId: settings.smsSenderId || '',
        enableEmail: settings.enableEmail !== undefined ? settings.enableEmail : true,
        emailProvider: settings.emailProvider || 'SMTP',
        smtpHost: settings.smtpHost || '',
        smtpPort: settings.smtpPort || 587,
        smtpUsername: settings.smtpUsername || '',
        smtpPassword: settings.smtpPassword || '',
        smtpEncryption: settings.smtpEncryption || 'TLS',
        emailFromAddress: settings.emailFromAddress || '',
        emailFromName: settings.emailFromName || '',
        enablePushNotifications: settings.enablePushNotifications !== undefined ? settings.enablePushNotifications : true,
        pushNotificationKey: settings.pushNotificationKey || '',
        enableAttendanceNotifications: settings.enableAttendanceNotifications !== undefined ? settings.enableAttendanceNotifications : true,
        enableFeeNotifications: settings.enableFeeNotifications !== undefined ? settings.enableFeeNotifications : true,
        enableExamNotifications: settings.enableExamNotifications !== undefined ? settings.enableExamNotifications : true,
        enableHomeworkNotifications: settings.enableHomeworkNotifications !== undefined ? settings.enableHomeworkNotifications : true,
        enableAnnouncementNotifications: settings.enableAnnouncementNotifications !== undefined ? settings.enableAnnouncementNotifications : true
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTestSMS = () => {
    alert('SMS test functionality would be implemented here');
  };

  const handleTestEmail = () => {
    alert('Email test functionality would be implemented here');
  };

  const validate = () => {
    const newErrors = {};
    
    if (formData.enableSMS) {
      if (!formData.smsApiKey.trim()) {
        newErrors.smsApiKey = 'SMS API Key is required';
      }
      if (!formData.smsApiSecret.trim()) {
        newErrors.smsApiSecret = 'SMS API Secret is required';
      }
    }
    
    if (formData.enableEmail) {
      if (!formData.smtpHost.trim()) {
        newErrors.smtpHost = 'SMTP Host is required';
      }
      if (!formData.smtpUsername.trim()) {
        newErrors.smtpUsername = 'SMTP Username is required';
      }
      if (!formData.emailFromAddress.trim()) {
        newErrors.emailFromAddress = 'From Email Address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailFromAddress)) {
        newErrors.emailFromAddress = 'Invalid email format';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      updateSettings(formData);
      setMessage('Notification settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Notification Settings</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/settings">Settings</Link></li>
              <li className="breadcrumb-item active">Notification Settings</li>
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
                  <h5 className="card-title">Notification Settings</h5>
                  <form onSubmit={handleSubmit}>
                    <h6 className="card-title mt-4 mb-3">SMS Settings</h6>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="enableSMS"
                            checked={formData.enableSMS}
                            onChange={handleChange}
                            id="enableSMS"
                          />
                          <label className="form-check-label" htmlFor="enableSMS">
                            Enable SMS Notifications
                          </label>
                        </div>
                      </div>
                    </div>

                    {formData.enableSMS && (
                      <>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">SMS Provider</label>
                            <select
                              className="form-select"
                              name="smsProvider"
                              value={formData.smsProvider}
                              onChange={handleChange}
                            >
                              <option value="Twilio">Twilio</option>
                              <option value="Nexmo">Nexmo</option>
                              <option value="TextLocal">TextLocal</option>
                              <option value="MSG91">MSG91</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Sender ID</label>
                            <input
                              type="text"
                              className="form-control"
                              name="smsSenderId"
                              value={formData.smsSenderId}
                              onChange={handleChange}
                              placeholder="Enter sender ID"
                            />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">
                              API Key <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.smsApiKey ? 'is-invalid' : ''}`}
                              name="smsApiKey"
                              value={formData.smsApiKey}
                              onChange={handleChange}
                              placeholder="Enter SMS API Key"
                            />
                            {errors.smsApiKey && <div className="invalid-feedback">{errors.smsApiKey}</div>}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">
                              API Secret <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <input
                                type={showSMSSecret ? "text" : "password"}
                                className={`form-control ${errors.smsApiSecret ? 'is-invalid' : ''}`}
                                name="smsApiSecret"
                                value={formData.smsApiSecret}
                                onChange={handleChange}
                                placeholder="Enter SMS API Secret"
                              />
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowSMSSecret(!showSMSSecret)}
                              >
                                <i className={`bi ${showSMSSecret ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                              </button>
                            </div>
                            {errors.smsApiSecret && <div className="invalid-feedback">{errors.smsApiSecret}</div>}
                          </div>
                        </div>
                        <div className="mb-3">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={handleTestSMS}
                          >
                            <i className="bi bi-send"></i> Test SMS
                          </button>
                        </div>
                      </>
                    )}

                    <h6 className="card-title mt-4 mb-3">Email Settings</h6>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="enableEmail"
                            checked={formData.enableEmail}
                            onChange={handleChange}
                            id="enableEmail"
                          />
                          <label className="form-check-label" htmlFor="enableEmail">
                            Enable Email Notifications
                          </label>
                        </div>
                      </div>
                    </div>

                    {formData.enableEmail && (
                      <>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Email Provider</label>
                            <select
                              className="form-select"
                              name="emailProvider"
                              value={formData.emailProvider}
                              onChange={handleChange}
                            >
                              <option value="SMTP">SMTP</option>
                              <option value="SendGrid">SendGrid</option>
                              <option value="Mailgun">Mailgun</option>
                              <option value="Amazon SES">Amazon SES</option>
                            </select>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">
                              SMTP Host <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.smtpHost ? 'is-invalid' : ''}`}
                              name="smtpHost"
                              value={formData.smtpHost}
                              onChange={handleChange}
                              placeholder="smtp.gmail.com"
                            />
                            {errors.smtpHost && <div className="invalid-feedback">{errors.smtpHost}</div>}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">SMTP Port</label>
                            <input
                              type="number"
                              className="form-control"
                              name="smtpPort"
                              value={formData.smtpPort}
                              onChange={handleChange}
                              min="1"
                              max="65535"
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Encryption</label>
                            <select
                              className="form-select"
                              name="smtpEncryption"
                              value={formData.smtpEncryption}
                              onChange={handleChange}
                            >
                              <option value="TLS">TLS</option>
                              <option value="SSL">SSL</option>
                              <option value="None">None</option>
                            </select>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">
                              SMTP Username <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.smtpUsername ? 'is-invalid' : ''}`}
                              name="smtpUsername"
                              value={formData.smtpUsername}
                              onChange={handleChange}
                              placeholder="Enter SMTP username"
                            />
                            {errors.smtpUsername && <div className="invalid-feedback">{errors.smtpUsername}</div>}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">SMTP Password</label>
                            <div className="input-group">
                              <input
                                type={showSMTPPassword ? "text" : "password"}
                                className="form-control"
                                name="smtpPassword"
                                value={formData.smtpPassword}
                                onChange={handleChange}
                                placeholder="Enter SMTP password"
                              />
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowSMTPPassword(!showSMTPPassword)}
                              >
                                <i className={`bi ${showSMTPPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">
                              From Email Address <span className="text-danger">*</span>
                            </label>
                            <input
                              type="email"
                              className={`form-control ${errors.emailFromAddress ? 'is-invalid' : ''}`}
                              name="emailFromAddress"
                              value={formData.emailFromAddress}
                              onChange={handleChange}
                              placeholder="noreply@school.com"
                            />
                            {errors.emailFromAddress && <div className="invalid-feedback">{errors.emailFromAddress}</div>}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">From Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="emailFromName"
                              value={formData.emailFromName}
                              onChange={handleChange}
                              placeholder="School Name"
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={handleTestEmail}
                          >
                            <i className="bi bi-envelope"></i> Test Email
                          </button>
                        </div>
                      </>
                    )}

                    <h6 className="card-title mt-4 mb-3">Push Notification Settings</h6>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="enablePushNotifications"
                            checked={formData.enablePushNotifications}
                            onChange={handleChange}
                            id="enablePushNotifications"
                          />
                          <label className="form-check-label" htmlFor="enablePushNotifications">
                            Enable Push Notifications
                          </label>
                        </div>
                      </div>
                    </div>

                    {formData.enablePushNotifications && (
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Push Notification Key</label>
                          <input
                            type="text"
                            className="form-control"
                            name="pushNotificationKey"
                            value={formData.pushNotificationKey}
                            onChange={handleChange}
                            placeholder="Enter push notification key"
                          />
                        </div>
                      </div>
                    )}

                    <h6 className="card-title mt-4 mb-3">Notification Preferences</h6>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="enableAttendanceNotifications"
                            checked={formData.enableAttendanceNotifications}
                            onChange={handleChange}
                            id="enableAttendanceNotifications"
                          />
                          <label className="form-check-label" htmlFor="enableAttendanceNotifications">
                            Attendance Notifications
                          </label>
                        </div>
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="enableFeeNotifications"
                            checked={formData.enableFeeNotifications}
                            onChange={handleChange}
                            id="enableFeeNotifications"
                          />
                          <label className="form-check-label" htmlFor="enableFeeNotifications">
                            Fee Notifications
                          </label>
                        </div>
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="enableExamNotifications"
                            checked={formData.enableExamNotifications}
                            onChange={handleChange}
                            id="enableExamNotifications"
                          />
                          <label className="form-check-label" htmlFor="enableExamNotifications">
                            Exam Notifications
                          </label>
                        </div>
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="enableHomeworkNotifications"
                            checked={formData.enableHomeworkNotifications}
                            onChange={handleChange}
                            id="enableHomeworkNotifications"
                          />
                          <label className="form-check-label" htmlFor="enableHomeworkNotifications">
                            Homework Notifications
                          </label>
                        </div>
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="enableAnnouncementNotifications"
                            checked={formData.enableAnnouncementNotifications}
                            onChange={handleChange}
                            id="enableAnnouncementNotifications"
                          />
                          <label className="form-check-label" htmlFor="enableAnnouncementNotifications">
                            Announcement Notifications
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="text-end">
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

export default NotificationSettings;

