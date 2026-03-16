import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const FeeSettings = () => {
  const { settings, updateSettings } = useSchool();

  const [formData, setFormData] = useState({
    feeDueDateReminder: 7,
    lateFeePercentage: 5,
    lateFeeAmount: 0,
    enableOnlinePayment: true,
    enableOfflinePayment: true,
    paymentGateway: 'Razorpay',
    enablePartialPayment: false,
    enableFeeDiscount: true,
    enableFeeWaiver: false,
    autoGenerateReceipt: true,
    receiptPrefix: 'FEE',
    receiptNumberFormat: 'YYYY-XXXX',
    enableSMSNotification: true,
    enableEmailNotification: true
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        feeDueDateReminder: settings.feeDueDateReminder || 7,
        lateFeePercentage: settings.lateFeePercentage || 5,
        lateFeeAmount: settings.lateFeeAmount || 0,
        enableOnlinePayment: settings.enableOnlinePayment !== undefined ? settings.enableOnlinePayment : true,
        enableOfflinePayment: settings.enableOfflinePayment !== undefined ? settings.enableOfflinePayment : true,
        paymentGateway: settings.paymentGateway || 'Razorpay',
        enablePartialPayment: settings.enablePartialPayment || false,
        enableFeeDiscount: settings.enableFeeDiscount !== undefined ? settings.enableFeeDiscount : true,
        enableFeeWaiver: settings.enableFeeWaiver || false,
        autoGenerateReceipt: settings.autoGenerateReceipt !== undefined ? settings.autoGenerateReceipt : true,
        receiptPrefix: settings.receiptPrefix || 'FEE',
        receiptNumberFormat: settings.receiptNumberFormat || 'YYYY-XXXX',
        enableSMSNotification: settings.enableSMSNotification !== undefined ? settings.enableSMSNotification : true,
        enableEmailNotification: settings.enableEmailNotification !== undefined ? settings.enableEmailNotification : true
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

  const validate = () => {
    const newErrors = {};
    
    if (formData.lateFeePercentage < 0 || formData.lateFeePercentage > 100) {
      newErrors.lateFeePercentage = 'Late fee percentage must be between 0 and 100';
    }
    
    if (formData.lateFeeAmount < 0) {
      newErrors.lateFeeAmount = 'Late fee amount cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      updateSettings(formData);
      setMessage('Fee settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Fee Settings</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/settings">Settings</Link></li>
              <li className="breadcrumb-item active">Fee Settings</li>
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
                  <h5 className="card-title">Fee Settings</h5>
                  <form onSubmit={handleSubmit}>
                    <h6 className="card-title mt-4 mb-3">Fee Reminders</h6>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Due Date Reminder (days before)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="feeDueDateReminder"
                          value={formData.feeDueDateReminder}
                          onChange={handleChange}
                          min="1"
                          max="30"
                        />
                        <small className="text-muted">Send reminder notification X days before fee due date</small>
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">Late Fee</h6>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Late Fee Percentage (%)
                        </label>
                        <input
                          type="number"
                          className={`form-control ${errors.lateFeePercentage ? 'is-invalid' : ''}`}
                          name="lateFeePercentage"
                          value={formData.lateFeePercentage}
                          onChange={handleChange}
                          min="0"
                          max="100"
                          step="0.1"
                        />
                        {errors.lateFeePercentage && <div className="invalid-feedback">{errors.lateFeePercentage}</div>}
                        <small className="text-muted">Percentage of fee amount to charge as late fee</small>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Late Fee Fixed Amount (₹)
                        </label>
                        <input
                          type="number"
                          className={`form-control ${errors.lateFeeAmount ? 'is-invalid' : ''}`}
                          name="lateFeeAmount"
                          value={formData.lateFeeAmount}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                        />
                        {errors.lateFeeAmount && <div className="invalid-feedback">{errors.lateFeeAmount}</div>}
                        <small className="text-muted">Fixed amount to charge as late fee (if not using percentage)</small>
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">Payment Options</h6>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="enableOnlinePayment"
                            checked={formData.enableOnlinePayment}
                            onChange={handleChange}
                            id="enableOnlinePayment"
                          />
                          <label className="form-check-label" htmlFor="enableOnlinePayment">
                            Enable Online Payment
                          </label>
                        </div>
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="enableOfflinePayment"
                            checked={formData.enableOfflinePayment}
                            onChange={handleChange}
                            id="enableOfflinePayment"
                          />
                          <label className="form-check-label" htmlFor="enableOfflinePayment">
                            Enable Offline Payment
                          </label>
                        </div>
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="enablePartialPayment"
                            checked={formData.enablePartialPayment}
                            onChange={handleChange}
                            id="enablePartialPayment"
                          />
                          <label className="form-check-label" htmlFor="enablePartialPayment">
                            Allow Partial Payment
                          </label>
                        </div>
                      </div>
                    </div>

                    {formData.enableOnlinePayment && (
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Payment Gateway</label>
                          <select
                            className="form-select"
                            name="paymentGateway"
                            value={formData.paymentGateway}
                            onChange={handleChange}
                          >
                            <option value="Razorpay">Razorpay</option>
                            <option value="PayU">PayU</option>
                            <option value="Paytm">Paytm</option>
                            <option value="Stripe">Stripe</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <h6 className="card-title mt-4 mb-3">Fee Discount & Waiver</h6>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="enableFeeDiscount"
                            checked={formData.enableFeeDiscount}
                            onChange={handleChange}
                            id="enableFeeDiscount"
                          />
                          <label className="form-check-label" htmlFor="enableFeeDiscount">
                            Enable Fee Discount
                          </label>
                        </div>
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="enableFeeWaiver"
                            checked={formData.enableFeeWaiver}
                            onChange={handleChange}
                            id="enableFeeWaiver"
                          />
                          <label className="form-check-label" htmlFor="enableFeeWaiver">
                            Enable Fee Waiver
                          </label>
                        </div>
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">Receipt Settings</h6>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="autoGenerateReceipt"
                            checked={formData.autoGenerateReceipt}
                            onChange={handleChange}
                            id="autoGenerateReceipt"
                          />
                          <label className="form-check-label" htmlFor="autoGenerateReceipt">
                            Auto-generate Receipt on Payment
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Receipt Prefix</label>
                        <input
                          type="text"
                          className="form-control"
                          name="receiptPrefix"
                          value={formData.receiptPrefix}
                          onChange={handleChange}
                          placeholder="FEE"
                          maxLength="10"
                        />
                        <small className="text-muted">Prefix for receipt numbers (e.g., FEE, REC)</small>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Receipt Number Format</label>
                        <select
                          className="form-select"
                          name="receiptNumberFormat"
                          value={formData.receiptNumberFormat}
                          onChange={handleChange}
                        >
                          <option value="YYYY-XXXX">YYYY-XXXX (2024-0001)</option>
                          <option value="YYYYMM-XXXX">YYYYMM-XXXX (202401-0001)</option>
                          <option value="XXXX">XXXX (0001)</option>
                          <option value="PREFIX-YYYY-XXXX">PREFIX-YYYY-XXXX (FEE-2024-0001)</option>
                        </select>
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">Notifications</h6>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="enableSMSNotification"
                            checked={formData.enableSMSNotification}
                            onChange={handleChange}
                            id="enableSMSNotification"
                          />
                          <label className="form-check-label" htmlFor="enableSMSNotification">
                            Enable SMS Notifications for Fee Payments
                          </label>
                        </div>
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="enableEmailNotification"
                            checked={formData.enableEmailNotification}
                            onChange={handleChange}
                            id="enableEmailNotification"
                          />
                          <label className="form-check-label" htmlFor="enableEmailNotification">
                            Enable Email Notifications for Fee Payments
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

export default FeeSettings;

