import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const GradeSettings = () => {
  const { settings, updateSettings, gradeConfigs } = useSchool();

  const [formData, setFormData] = useState({
    gradingSystem: 'Percentage',
    gradeScale: '100',
    passPercentage: 40,
    enableGradePoints: false,
    maxGradePoints: 10,
    enableRemarks: true,
    defaultRemarks: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        gradingSystem: settings.gradingSystem || 'Percentage',
        gradeScale: settings.gradeScale || '100',
        passPercentage: settings.passPercentage || 40,
        enableGradePoints: settings.enableGradePoints || false,
        maxGradePoints: settings.maxGradePoints || 10,
        enableRemarks: settings.enableRemarks !== undefined ? settings.enableRemarks : true,
        defaultRemarks: settings.defaultRemarks || ''
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
    
    if (formData.passPercentage < 0 || formData.passPercentage > 100) {
      newErrors.passPercentage = 'Pass percentage must be between 0 and 100';
    }
    
    if (formData.maxGradePoints < 1 || formData.maxGradePoints > 10) {
      newErrors.maxGradePoints = 'Max grade points must be between 1 and 10';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      updateSettings(formData);
      setMessage('Grade settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Grade Settings</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/settings">Settings</Link></li>
              <li className="breadcrumb-item active">Grade Settings</li>
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
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Grade Settings</h5>
                  <form onSubmit={handleSubmit}>
                    <h6 className="card-title mt-4 mb-3">Grading System</h6>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Grading System</label>
                        <select
                          className="form-select"
                          name="gradingSystem"
                          value={formData.gradingSystem}
                          onChange={handleChange}
                        >
                          <option value="Percentage">Percentage</option>
                          <option value="Letter Grade">Letter Grade</option>
                          <option value="GPA">GPA (Grade Point Average)</option>
                          <option value="Both">Both (Percentage & Grade)</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Grade Scale</label>
                        <select
                          className="form-select"
                          name="gradeScale"
                          value={formData.gradeScale}
                          onChange={handleChange}
                        >
                          <option value="100">100 Point Scale</option>
                          <option value="10">10 Point Scale</option>
                          <option value="5">5 Point Scale</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Pass Percentage <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className={`form-control ${errors.passPercentage ? 'is-invalid' : ''}`}
                          name="passPercentage"
                          value={formData.passPercentage}
                          onChange={handleChange}
                          min="0"
                          max="100"
                        />
                        {errors.passPercentage && <div className="invalid-feedback">{errors.passPercentage}</div>}
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">Grade Points</h6>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="enableGradePoints"
                            checked={formData.enableGradePoints}
                            onChange={handleChange}
                            id="enableGradePoints"
                          />
                          <label className="form-check-label" htmlFor="enableGradePoints">
                            Enable Grade Points
                          </label>
                        </div>
                      </div>
                    </div>

                    {formData.enableGradePoints && (
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">
                            Maximum Grade Points <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className={`form-control ${errors.maxGradePoints ? 'is-invalid' : ''}`}
                            name="maxGradePoints"
                            value={formData.maxGradePoints}
                            onChange={handleChange}
                            min="1"
                            max="10"
                          />
                          {errors.maxGradePoints && <div className="invalid-feedback">{errors.maxGradePoints}</div>}
                        </div>
                      </div>
                    )}

                    <h6 className="card-title mt-4 mb-3">Remarks</h6>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="enableRemarks"
                            checked={formData.enableRemarks}
                            onChange={handleChange}
                            id="enableRemarks"
                          />
                          <label className="form-check-label" htmlFor="enableRemarks">
                            Enable Remarks in Report Cards
                          </label>
                        </div>
                      </div>
                    </div>

                    {formData.enableRemarks && (
                      <div className="row mb-3">
                        <div className="col-md-12">
                          <label className="form-label">Default Remarks</label>
                          <textarea
                            className="form-control"
                            name="defaultRemarks"
                            value={formData.defaultRemarks}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Enter default remarks for report cards"
                          />
                        </div>
                      </div>
                    )}

                    <div className="text-end">
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> Save Settings
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Current Grade Configuration</h5>
                  {gradeConfigs.length === 0 ? (
                    <p className="text-muted">No grade configurations found</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Grade</th>
                            <th>Range</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gradeConfigs.map(grade => (
                            <tr key={grade.id}>
                              <td><strong>{grade.grade}</strong></td>
                              <td>{grade.minPercentage}% - {grade.maxPercentage}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <Link to="/exams/grade-config" className="btn btn-sm btn-primary w-100 mt-2">
                    <i className="bi bi-gear"></i> Manage Grade Configuration
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default GradeSettings;

