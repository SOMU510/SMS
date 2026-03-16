import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const SchoolProfile = () => {
  const { settings, updateSettings } = useSchool();

  const [formData, setFormData] = useState({
    schoolName: '',
    schoolCode: '',
    registrationNumber: '',
    establishmentYear: '',
    affiliation: '',
    board: '',
    principalName: '',
    principalEmail: '',
    principalPhone: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    logo: '',
    motto: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        schoolName: settings.schoolName || '',
        schoolCode: settings.schoolCode || '',
        registrationNumber: settings.registrationNumber || '',
        establishmentYear: settings.establishmentYear || '',
        affiliation: settings.affiliation || '',
        board: settings.board || '',
        principalName: settings.principalName || '',
        principalEmail: settings.principalEmail || '',
        principalPhone: settings.principalPhone || '',
        address: settings.address || '',
        city: settings.city || '',
        state: settings.state || '',
        country: settings.country || 'India',
        zipCode: settings.zipCode || '',
        phone: settings.phone || '',
        email: settings.email || '',
        website: settings.website || '',
        logo: settings.logo || '',
        motto: settings.motto || '',
        description: settings.description || ''
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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          logo: reader.result
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
    
    if (formData.principalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.principalEmail)) {
      newErrors.principalEmail = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      updateSettings(formData);
      setMessage('School profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>School Profile</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/settings">Settings</Link></li>
              <li className="breadcrumb-item active">School Profile</li>
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
                  <h5 className="card-title">School Profile Information</h5>
                  <form onSubmit={handleSubmit}>
                    <h6 className="card-title mt-4 mb-3">Basic Information</h6>
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
                      <div className="col-md-4">
                        <label className="form-label">Registration Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="registrationNumber"
                          value={formData.registrationNumber}
                          onChange={handleChange}
                          placeholder="Enter registration number"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Establishment Year</label>
                        <input
                          type="number"
                          className="form-control"
                          name="establishmentYear"
                          value={formData.establishmentYear}
                          onChange={handleChange}
                          placeholder="e.g., 1990"
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Affiliation</label>
                        <input
                          type="text"
                          className="form-control"
                          name="affiliation"
                          value={formData.affiliation}
                          onChange={handleChange}
                          placeholder="e.g., CBSE, ICSE"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Board</label>
                        <select
                          className="form-select"
                          name="board"
                          value={formData.board}
                          onChange={handleChange}
                        >
                          <option value="">Select Board</option>
                          <option value="CBSE">CBSE</option>
                          <option value="ICSE">ICSE</option>
                          <option value="State Board">State Board</option>
                          <option value="IGCSE">IGCSE</option>
                          <option value="IB">IB</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">Principal Information</h6>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Principal Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="principalName"
                          value={formData.principalName}
                          onChange={handleChange}
                          placeholder="Enter principal name"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Principal Email</label>
                        <input
                          type="email"
                          className={`form-control ${errors.principalEmail ? 'is-invalid' : ''}`}
                          name="principalEmail"
                          value={formData.principalEmail}
                          onChange={handleChange}
                          placeholder="Enter principal email"
                        />
                        {errors.principalEmail && <div className="invalid-feedback">{errors.principalEmail}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Principal Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="principalPhone"
                          value={formData.principalPhone}
                          onChange={handleChange}
                          placeholder="Enter principal phone"
                        />
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">Contact Information</h6>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Address</label>
                        <textarea
                          className="form-control"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows="2"
                          placeholder="Enter complete address"
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
                          onChange={handleLogoChange}
                        />
                        {formData.logo && (
                          <div className="mt-2">
                            <img src={formData.logo} alt="School Logo" style={{ maxHeight: '150px' }} />
                          </div>
                        )}
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">Additional Information</h6>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">School Motto</label>
                        <input
                          type="text"
                          className="form-control"
                          name="motto"
                          value={formData.motto}
                          onChange={handleChange}
                          placeholder="Enter school motto"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="4"
                          placeholder="Enter school description"
                        />
                      </div>
                    </div>

                    <div className="text-end">
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> Update Profile
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

export default SchoolProfile;

