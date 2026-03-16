import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const GradeConfig = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { 
    gradeConfigs,
    addGradeConfig,
    updateGradeConfig,
    deleteGradeConfig
  } = useSchool();
  
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    grades: [
      { grade: 'A+', minPercentage: 90, maxPercentage: 100, points: 10, description: 'Outstanding' },
      { grade: 'A', minPercentage: 80, maxPercentage: 89.99, points: 9, description: 'Excellent' },
      { grade: 'B+', minPercentage: 70, maxPercentage: 79.99, points: 8, description: 'Very Good' },
      { grade: 'B', minPercentage: 60, maxPercentage: 69.99, points: 7, description: 'Good' },
      { grade: 'C+', minPercentage: 50, maxPercentage: 59.99, points: 6, description: 'Average' },
      { grade: 'C', minPercentage: 40, maxPercentage: 49.99, points: 5, description: 'Below Average' },
      { grade: 'F', minPercentage: 0, maxPercentage: 39.99, points: 0, description: 'Fail' }
    ],
    status: 'Active'
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Load grade config data if editing
  useEffect(() => {
    if (isEditMode) {
      const config = gradeConfigs.find(gc => gc.id === parseInt(id));
      if (config) {
        setFormData({
          name: config.name || '',
          description: config.description || '',
          grades: config.grades || formData.grades,
          status: config.status || 'Active'
        });
      }
    }
  }, [id, isEditMode, gradeConfigs]);

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

  const handleGradeChange = (index, field, value) => {
    const updatedGrades = [...formData.grades];
    updatedGrades[index] = {
      ...updatedGrades[index],
      [field]: field === 'minPercentage' || field === 'maxPercentage' || field === 'points' 
        ? parseFloat(value) || 0 
        : value
    };
    setFormData(prev => ({ ...prev, grades: updatedGrades }));
  };

  const addGrade = () => {
    setFormData(prev => ({
      ...prev,
      grades: [
        ...prev.grades,
        { grade: '', minPercentage: 0, maxPercentage: 0, points: 0, description: '' }
      ]
    }));
  };

  const removeGrade = (index) => {
    if (formData.grades.length > 1) {
      const updatedGrades = formData.grades.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, grades: updatedGrades }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Configuration name is required';
    }
    
    // Validate grades
    formData.grades.forEach((grade, index) => {
      if (!grade.grade.trim()) {
        newErrors[`grade_${index}`] = 'Grade is required';
      }
      if (grade.minPercentage < 0 || grade.minPercentage > 100) {
        newErrors[`minPercentage_${index}`] = 'Min percentage must be between 0 and 100';
      }
      if (grade.maxPercentage < 0 || grade.maxPercentage > 100) {
        newErrors[`maxPercentage_${index}`] = 'Max percentage must be between 0 and 100';
      }
      if (grade.minPercentage > grade.maxPercentage) {
        newErrors[`range_${index}`] = 'Min percentage cannot be greater than max percentage';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEditMode) {
        updateGradeConfig(parseInt(id), formData);
        alert('Grade configuration updated successfully!');
      } else {
        const existing = gradeConfigs.find(gc => gc.name.toLowerCase() === formData.name.toLowerCase());
        if (existing) {
          alert('Grade configuration with this name already exists!');
          return;
        }
        addGradeConfig(formData);
        alert('Grade configuration created successfully!');
      }
      navigate('/exams/grade-config');
    }
  };

  const handleDelete = (configId, name) => {
    if (window.confirm(`Are you sure you want to delete grade configuration "${name}"?`)) {
      deleteGradeConfig(configId);
    }
  };

  // Filter grade configs
  const filteredConfigs = gradeConfigs.filter(gc =>
    gc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gc.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    return status === 'Active' ? 'bg-success' : 'bg-secondary';
  };

  // If not in add/edit mode, show list view
  if (!showForm) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Grade Configuration</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/exams">Exams</Link></li>
                <li className="breadcrumb-item active">Grade Configuration</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Grade Configurations</h5>
                      <Link to="/exams/grade-config/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Add Configuration
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by name or description..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Number of Grades</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredConfigs.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center">
                                <p className="text-muted">No grade configurations found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredConfigs.map((config) => (
                              <tr key={config.id}>
                                <td><strong>{config.name}</strong></td>
                                <td>{config.description || '-'}</td>
                                <td>{config.grades?.length || 0}</td>
                                <td>
                                  <span className={`badge ${getStatusBadge(config.status)}`}>
                                    {config.status}
                                  </span>
                                </td>
                                <td>
                                  <Link
                                    to={`/exams/grade-config/${config.id}`}
                                    className="btn btn-sm btn-primary me-1"
                                    title="Edit"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(config.id, config.name)}
                                    title="Delete"
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // Form view
  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>{isEditMode ? 'Edit Grade Configuration' : 'Add Grade Configuration'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/exams/grade-config">Grade Configuration</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Add'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Configuration Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Configuration Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., Standard Grading System"
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
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
                          rows="2"
                          placeholder="Description of the grading system"
                        />
                      </div>
                    </div>

                    <h5 className="card-title mt-4 mb-3">Grade Definitions</h5>
                    <div className="table-responsive mb-3">
                      <table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>Grade</th>
                            <th>Min %</th>
                            <th>Max %</th>
                            <th>Points</th>
                            <th>Description</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.grades.map((grade, index) => (
                            <tr key={index}>
                              <td>
                                <input
                                  type="text"
                                  className={`form-control form-control-sm ${errors[`grade_${index}`] ? 'is-invalid' : ''}`}
                                  value={grade.grade}
                                  onChange={(e) => handleGradeChange(index, 'grade', e.target.value)}
                                  placeholder="A+"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={`form-control form-control-sm ${errors[`minPercentage_${index}`] || errors[`range_${index}`] ? 'is-invalid' : ''}`}
                                  value={grade.minPercentage}
                                  onChange={(e) => handleGradeChange(index, 'minPercentage', e.target.value)}
                                  min="0"
                                  max="100"
                                  step="0.01"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={`form-control form-control-sm ${errors[`maxPercentage_${index}`] || errors[`range_${index}`] ? 'is-invalid' : ''}`}
                                  value={grade.maxPercentage}
                                  onChange={(e) => handleGradeChange(index, 'maxPercentage', e.target.value)}
                                  min="0"
                                  max="100"
                                  step="0.01"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={grade.points}
                                  onChange={(e) => handleGradeChange(index, 'points', e.target.value)}
                                  min="0"
                                  step="0.1"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={grade.description}
                                  onChange={(e) => handleGradeChange(index, 'description', e.target.value)}
                                  placeholder="Description"
                                />
                              </td>
                              <td>
                                {formData.grades.length > 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => removeGrade(index)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary mb-3"
                      onClick={addGrade}
                    >
                      <i className="bi bi-plus"></i> Add Grade
                    </button>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate('/exams/grade-config')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Create'} Configuration
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

export default GradeConfig;

