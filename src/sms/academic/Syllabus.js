import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const Syllabus = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { syllabuses, classes, subjects, academicYears, addSyllabus, updateSyllabus, deleteSyllabus } = useSchool();
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    name: '',
    className: '',
    subject: '',
    academicYear: '',
    description: '',
    units: [],
    status: 'Active'
  });
  const [errors, setErrors] = useState({});
  const [unitName, setUnitName] = useState('');
  const [unitDescription, setUnitDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load syllabus data if editing
  useEffect(() => {
    if (isEditMode) {
      const syllabus = syllabuses.find(s => s.id === parseInt(id));
      if (syllabus) {
        setFormData({
          name: syllabus.name || '',
          className: syllabus.className || '',
          subject: syllabus.subject || '',
          academicYear: syllabus.academicYear || '',
          description: syllabus.description || '',
          units: syllabus.units || [],
          status: syllabus.status || 'Active'
        });
      }
    }
  }, [id, isEditMode, syllabuses]);

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

  const handleAddUnit = () => {
    if (unitName.trim()) {
      setFormData(prev => ({
        ...prev,
        units: [...prev.units, {
          id: Date.now(),
          name: unitName.trim(),
          description: unitDescription.trim() || '',
          topics: []
        }]
      }));
      setUnitName('');
      setUnitDescription('');
    }
  };

  const handleRemoveUnit = (unitId) => {
    setFormData(prev => ({
      ...prev,
      units: prev.units.filter(u => u.id !== unitId)
    }));
  };

  const handleAddTopic = (unitId, topicName) => {
    if (topicName.trim()) {
      setFormData(prev => ({
        ...prev,
        units: prev.units.map(unit => 
          unit.id === unitId 
            ? { ...unit, topics: [...unit.topics, { id: Date.now(), name: topicName.trim() }] }
            : unit
        )
      }));
    }
  };

  const handleRemoveTopic = (unitId, topicId) => {
    setFormData(prev => ({
      ...prev,
      units: prev.units.map(unit => 
        unit.id === unitId 
          ? { ...unit, topics: unit.topics.filter(t => t.id !== topicId) }
          : unit
      )
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Syllabus name is required';
    }
    
    if (!formData.className) {
      newErrors.className = 'Class is required';
    }

    if (!formData.subject) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.academicYear) {
      newErrors.academicYear = 'Academic year is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEditMode) {
        updateSyllabus(parseInt(id), formData);
        alert('Syllabus updated successfully!');
      } else {
        addSyllabus(formData);
        alert('Syllabus added successfully!');
      }
      navigate('/academic/syllabus');
    }
  };

  const handleDelete = (syllabusId, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteSyllabus(syllabusId);
    }
  };

  // Filter syllabuses for list view
  const filteredSyllabuses = syllabuses.filter(syllabus =>
    syllabus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    syllabus.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    syllabus.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If not in add/edit mode, show list view, otherwise show form
  if (!showForm) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Syllabus Management</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Syllabus</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Syllabuses</h5>
                      <Link to="/academic/syllabus/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Add New Syllabus
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Search syllabuses..."
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Syllabus Name</th>
                            <th>Class</th>
                            <th>Subject</th>
                            <th>Academic Year</th>
                            <th>Units</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSyllabuses.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center">
                                <p className="text-muted">No syllabuses found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredSyllabuses.map((syllabus) => (
                              <tr key={syllabus.id}>
                                <td>
                                  <strong>{syllabus.name}</strong>
                                  {syllabus.description && (
                                    <>
                                      <br />
                                      <small className="text-muted">{syllabus.description}</small>
                                    </>
                                  )}
                                </td>
                                <td>{syllabus.className || '-'}</td>
                                <td>{syllabus.subject || '-'}</td>
                                <td>{syllabus.academicYear || '-'}</td>
                                <td>{syllabus.units?.length || 0}</td>
                                <td>
                                  {syllabus.status === 'Active' ? (
                                    <span className="badge bg-success">Active</span>
                                  ) : (
                                    <span className="badge bg-secondary">Inactive</span>
                                  )}
                                </td>
                                <td>
                                  <Link 
                                    to={`/academic/syllabus/${syllabus.id}`} 
                                    className="btn btn-sm btn-primary me-1"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <button 
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(syllabus.id, syllabus.name)}
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

  // Form view (for both add and edit)
  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>{isEditMode ? 'Edit Syllabus' : 'Add Syllabus'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/academic/syllabus">Syllabus</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Add'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Syllabus Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Syllabus Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., Mathematics Syllabus 2024"
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Class <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.className ? 'is-invalid' : ''}`}
                          name="className"
                          value={formData.className}
                          onChange={handleChange}
                        >
                          <option value="">Select Class</option>
                          {classes.map(cls => (
                            <option key={cls.id} value={cls.name}>
                              {cls.name}
                            </option>
                          ))}
                        </select>
                        {errors.className && <div className="invalid-feedback">{errors.className}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Subject <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.subject ? 'is-invalid' : ''}`}
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                        >
                          <option value="">Select Subject</option>
                          {subjects.map(subj => (
                            <option key={subj.id} value={subj.name}>
                              {subj.name}
                            </option>
                          ))}
                        </select>
                        {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Academic Year <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.academicYear ? 'is-invalid' : ''}`}
                          name="academicYear"
                          value={formData.academicYear}
                          onChange={handleChange}
                        >
                          <option value="">Select Academic Year</option>
                          {academicYears.map(year => (
                            <option key={year.id} value={year.name}>
                              {year.name}
                            </option>
                          ))}
                        </select>
                        {errors.academicYear && <div className="invalid-feedback">{errors.academicYear}</div>}
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
                          rows="3"
                          placeholder="Optional description"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
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

                    {/* Units Section */}
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <h6 className="mb-3">Units & Topics</h6>
                        <div className="card mb-3">
                          <div className="card-body">
                            <div className="row mb-3">
                              <div className="col-md-5">
                                <label className="form-label">Unit Name</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter unit name"
                                  value={unitName}
                                  onChange={(e) => setUnitName(e.target.value)}
                                />
                              </div>
                              <div className="col-md-5">
                                <label className="form-label">Unit Description</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Optional description"
                                  value={unitDescription}
                                  onChange={(e) => setUnitDescription(e.target.value)}
                                />
                              </div>
                              <div className="col-md-2 d-flex align-items-end">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary w-100"
                                  onClick={handleAddUnit}
                                >
                                  <i className="bi bi-plus-circle"></i> Add
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {formData.units.length > 0 && (
                          <div className="list-group">
                            {formData.units.map((unit) => (
                              <div key={unit.id} className="list-group-item mb-3">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <div className="flex-grow-1">
                                    <h6 className="mb-1">{unit.name}</h6>
                                    {unit.description && (
                                      <small className="text-muted">{unit.description}</small>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleRemoveUnit(unit.id)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                                
                                {/* Topics for this unit */}
                                <div className="mt-2">
                                  <div className="d-flex gap-2 mb-2">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      placeholder="Add topic"
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          handleAddTopic(unit.id, e.target.value);
                                          e.target.value = '';
                                        }
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-secondary"
                                      onClick={(e) => {
                                        const input = e.target.previousElementSibling;
                                        handleAddTopic(unit.id, input.value);
                                        input.value = '';
                                      }}
                                    >
                                      <i className="bi bi-plus"></i>
                                    </button>
                                  </div>
                                  {unit.topics && unit.topics.length > 0 && (
                                    <div className="ms-3">
                                      {unit.topics.map((topic) => (
                                        <span key={topic.id} className="badge bg-info me-1 mb-1">
                                          {topic.name}
                                          <button
                                            type="button"
                                            className="btn-close btn-close-white ms-1"
                                            style={{ fontSize: '0.7rem' }}
                                            onClick={() => handleRemoveTopic(unit.id, topic.id)}
                                          ></button>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-end">
                      <button 
                        type="button" 
                        className="btn btn-secondary me-2" 
                        onClick={() => navigate('/academic/syllabus')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Save'} Syllabus
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

export default Syllabus;

