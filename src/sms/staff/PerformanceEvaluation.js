import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const PerformanceEvaluation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { 
    performanceEvaluations, 
    teachers, 
    staff,
    addPerformanceEvaluation, 
    updatePerformanceEvaluation, 
    deletePerformanceEvaluation 
  } = useSchool();
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    staffId: '',
    evaluationPeriod: '',
    evaluationDate: new Date().toISOString().split('T')[0],
    evaluatorName: '',
    // Teaching/Work Performance
    teachingQuality: 0,
    subjectKnowledge: 0,
    classroomManagement: 0,
    studentEngagement: 0,
    lessonPlanning: 0,
    // Professional Skills
    communication: 0,
    teamwork: 0,
    punctuality: 0,
    professionalism: 0,
    problemSolving: 0,
    // Additional Metrics
    studentSatisfaction: 0,
    parentFeedback: 0,
    attendance: 0,
    initiative: 0,
    // Overall
    overallRating: 0,
    strengths: '',
    areasForImprovement: '',
    recommendations: '',
    status: 'Draft',
    remarks: ''
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStaff, setFilterStaff] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPeriod, setFilterPeriod] = useState('All');

  // Combine teachers and staff
  const allStaff = [...staff, ...teachers.map(t => ({ ...t, staffType: 'Teacher' }))];

  // Load evaluation data if editing
  useEffect(() => {
    if (isEditMode) {
      const evaluation = performanceEvaluations.find(e => e.id === parseInt(id));
      if (evaluation) {
        setFormData({
          staffId: evaluation.staffId || '',
          evaluationPeriod: evaluation.evaluationPeriod || '',
          evaluationDate: evaluation.evaluationDate || '',
          evaluatorName: evaluation.evaluatorName || '',
          teachingQuality: evaluation.teachingQuality || 0,
          subjectKnowledge: evaluation.subjectKnowledge || 0,
          classroomManagement: evaluation.classroomManagement || 0,
          studentEngagement: evaluation.studentEngagement || 0,
          lessonPlanning: evaluation.lessonPlanning || 0,
          communication: evaluation.communication || 0,
          teamwork: evaluation.teamwork || 0,
          punctuality: evaluation.punctuality || 0,
          professionalism: evaluation.professionalism || 0,
          problemSolving: evaluation.problemSolving || 0,
          studentSatisfaction: evaluation.studentSatisfaction || 0,
          parentFeedback: evaluation.parentFeedback || 0,
          attendance: evaluation.attendance || 0,
          initiative: evaluation.initiative || 0,
          overallRating: evaluation.overallRating || 0,
          strengths: evaluation.strengths || '',
          areasForImprovement: evaluation.areasForImprovement || '',
          recommendations: evaluation.recommendations || '',
          status: evaluation.status || 'Draft',
          remarks: evaluation.remarks || ''
        });
      }
    }
  }, [id, isEditMode, performanceEvaluations]);

  // Calculate overall rating when individual ratings change
  useEffect(() => {
    const ratings = [
      formData.teachingQuality,
      formData.subjectKnowledge,
      formData.classroomManagement,
      formData.studentEngagement,
      formData.lessonPlanning,
      formData.communication,
      formData.teamwork,
      formData.punctuality,
      formData.professionalism,
      formData.problemSolving,
      formData.studentSatisfaction,
      formData.parentFeedback,
      formData.attendance,
      formData.initiative
    ].filter(r => r > 0);

    if (ratings.length > 0) {
      const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
      setFormData(prev => ({
        ...prev,
        overallRating: parseFloat(average.toFixed(2))
      }));
    }
  }, [
    formData.teachingQuality,
    formData.subjectKnowledge,
    formData.classroomManagement,
    formData.studentEngagement,
    formData.lessonPlanning,
    formData.communication,
    formData.teamwork,
    formData.punctuality,
    formData.professionalism,
    formData.problemSolving,
    formData.studentSatisfaction,
    formData.parentFeedback,
    formData.attendance,
    formData.initiative
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Rating') || name === 'teachingQuality' || name === 'subjectKnowledge' || 
              name === 'classroomManagement' || name === 'studentEngagement' || name === 'lessonPlanning' ||
              name === 'communication' || name === 'teamwork' || name === 'punctuality' ||
              name === 'professionalism' || name === 'problemSolving' || name === 'studentSatisfaction' ||
              name === 'parentFeedback' || name === 'attendance' || name === 'initiative'
        ? (parseFloat(value) || 0) 
        : value
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
    
    if (!formData.staffId) {
      newErrors.staffId = 'Staff member is required';
    }
    
    if (!formData.evaluationPeriod) {
      newErrors.evaluationPeriod = 'Evaluation period is required';
    }

    if (!formData.evaluationDate) {
      newErrors.evaluationDate = 'Evaluation date is required';
    }

    if (!formData.evaluatorName.trim()) {
      newErrors.evaluatorName = 'Evaluator name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const selectedStaff = allStaff.find(s => s.id === parseInt(formData.staffId));
      const evaluationData = {
        ...formData,
        staffName: selectedStaff ? `${selectedStaff.firstName} ${selectedStaff.lastName}` : '',
        employeeId: selectedStaff?.employeeId || '',
        staffType: selectedStaff?.staffType || ''
      };

      if (isEditMode) {
        updatePerformanceEvaluation(parseInt(id), evaluationData);
        alert('Performance evaluation updated successfully!');
      } else {
        addPerformanceEvaluation(evaluationData);
        alert('Performance evaluation created successfully!');
      }
      navigate('/staff/performance-evaluation');
    }
  };

  const handleDelete = (evaluationId, staffName) => {
    if (window.confirm(`Are you sure you want to delete performance evaluation for ${staffName}?`)) {
      deletePerformanceEvaluation(evaluationId);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-success';
    if (rating >= 3.5) return 'text-info';
    if (rating >= 2.5) return 'text-warning';
    return 'text-danger';
  };

  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Good';
    if (rating >= 2.5) return 'Satisfactory';
    if (rating >= 1.5) return 'Needs Improvement';
    return 'Poor';
  };

  // Filter evaluations
  let filteredEvaluations = performanceEvaluations.filter(evaluation =>
    evaluation.staffName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evaluation.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evaluation.evaluatorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterStaff !== 'All') {
    filteredEvaluations = filteredEvaluations.filter(e => e.staffId === parseInt(filterStaff));
  }

  if (filterStatus !== 'All') {
    filteredEvaluations = filteredEvaluations.filter(e => e.status === filterStatus);
  }

  if (filterPeriod !== 'All') {
    filteredEvaluations = filteredEvaluations.filter(e => e.evaluationPeriod === filterPeriod);
  }

  const getStatusBadge = (status) => {
    const badges = {
      'Draft': 'bg-secondary',
      'Completed': 'bg-success',
      'Under Review': 'bg-warning',
      'Approved': 'bg-info'
    };
    return badges[status] || 'bg-secondary';
  };

  // If not in add/edit mode, show list view, otherwise show form
  if (!showForm) {
    // Get statistics
    const stats = {
      total: performanceEvaluations.length,
      completed: performanceEvaluations.filter(e => e.status === 'Completed').length,
      averageRating: performanceEvaluations.length > 0
        ? (performanceEvaluations.reduce((sum, e) => sum + (e.overallRating || 0), 0) / performanceEvaluations.length).toFixed(2)
        : '0.00'
    };

    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Performance Evaluation</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Performance Evaluation</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            {/* Statistics Cards */}
            <div className="row mb-4">
              <div className="col-lg-4 col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-1">Total Evaluations</h6>
                    <h4 className="mb-0">{stats.total}</h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-1">Completed</h6>
                    <h4 className="mb-0 text-success">{stats.completed}</h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-1">Average Rating</h6>
                    <h4 className={`mb-0 ${getRatingColor(parseFloat(stats.averageRating))}`}>
                      {stats.averageRating} / 5.0
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Performance Evaluations</h5>
                      <Link to="/staff/performance-evaluation/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> New Evaluation
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by name, employee ID, evaluator..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-select"
                          value={filterStaff}
                          onChange={(e) => setFilterStaff(e.target.value)}
                        >
                          <option value="All">All Staff</option>
                          {allStaff.map(member => (
                            <option key={member.id} value={member.id}>
                              {member.firstName} {member.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-select"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                        >
                          <option value="All">All Status</option>
                          <option value="Draft">Draft</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Completed">Completed</option>
                          <option value="Approved">Approved</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-select"
                          value={filterPeriod}
                          onChange={(e) => setFilterPeriod(e.target.value)}
                        >
                          <option value="All">All Periods</option>
                          <option value="Q1">Q1 (Quarter 1)</option>
                          <option value="Q2">Q2 (Quarter 2)</option>
                          <option value="Q3">Q3 (Quarter 3)</option>
                          <option value="Q4">Q4 (Quarter 4)</option>
                          <option value="Annual">Annual</option>
                          <option value="Mid-Year">Mid-Year</option>
                        </select>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Employee ID</th>
                            <th>Staff Name</th>
                            <th>Evaluation Period</th>
                            <th>Evaluation Date</th>
                            <th>Evaluator</th>
                            <th>Overall Rating</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredEvaluations.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="text-center">
                                <p className="text-muted">No performance evaluations found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredEvaluations.map((evaluation) => (
                              <tr key={evaluation.id}>
                                <td>{evaluation.employeeId || '-'}</td>
                                <td>
                                  <strong>{evaluation.staffName || '-'}</strong>
                                </td>
                                <td>{evaluation.evaluationPeriod || '-'}</td>
                                <td>{evaluation.evaluationDate ? new Date(evaluation.evaluationDate).toLocaleDateString() : '-'}</td>
                                <td>{evaluation.evaluatorName || '-'}</td>
                                <td>
                                  <span className={`fw-bold ${getRatingColor(evaluation.overallRating || 0)}`}>
                                    {evaluation.overallRating?.toFixed(2) || '0.00'} / 5.0
                                    <br />
                                    <small className="text-muted">{getRatingLabel(evaluation.overallRating || 0)}</small>
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${getStatusBadge(evaluation.status)}`}>
                                    {evaluation.status}
                                  </span>
                                </td>
                                <td>
                                  <Link
                                    to={`/staff/performance-evaluation/${evaluation.id}`}
                                    className="btn btn-sm btn-primary me-1"
                                    title="View/Edit"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(evaluation.id, evaluation.staffName)}
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

  // Form view (for both add and edit)
  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>{isEditMode ? 'Edit Performance Evaluation' : 'New Performance Evaluation'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/staff/performance-evaluation">Performance Evaluation</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'New'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Evaluation Information</h5>
                  <form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Staff Member <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.staffId ? 'is-invalid' : ''}`}
                          name="staffId"
                          value={formData.staffId}
                          onChange={handleChange}
                          disabled={isEditMode}
                        >
                          <option value="">Select Staff Member</option>
                          {allStaff.map(member => (
                            <option key={member.id} value={member.id}>
                              {member.employeeId || 'N/A'} - {member.firstName} {member.lastName}
                            </option>
                          ))}
                        </select>
                        {errors.staffId && <div className="invalid-feedback">{errors.staffId}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Evaluation Period <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.evaluationPeriod ? 'is-invalid' : ''}`}
                          name="evaluationPeriod"
                          value={formData.evaluationPeriod}
                          onChange={handleChange}
                        >
                          <option value="">Select Period</option>
                          <option value="Q1">Q1 (Quarter 1)</option>
                          <option value="Q2">Q2 (Quarter 2)</option>
                          <option value="Q3">Q3 (Quarter 3)</option>
                          <option value="Q4">Q4 (Quarter 4)</option>
                          <option value="Mid-Year">Mid-Year</option>
                          <option value="Annual">Annual</option>
                        </select>
                        {errors.evaluationPeriod && <div className="invalid-feedback">{errors.evaluationPeriod}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Evaluation Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={`form-control ${errors.evaluationDate ? 'is-invalid' : ''}`}
                          name="evaluationDate"
                          value={formData.evaluationDate}
                          onChange={handleChange}
                        />
                        {errors.evaluationDate && <div className="invalid-feedback">{errors.evaluationDate}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Evaluator Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.evaluatorName ? 'is-invalid' : ''}`}
                          name="evaluatorName"
                          value={formData.evaluatorName}
                          onChange={handleChange}
                          placeholder="Name of the evaluator"
                        />
                        {errors.evaluatorName && <div className="invalid-feedback">{errors.evaluatorName}</div>}
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="Draft">Draft</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Completed">Completed</option>
                          <option value="Approved">Approved</option>
                        </select>
                      </div>
                    </div>

                    {/* Teaching/Work Performance */}
                    <div className="card mb-3">
                      <div className="card-header">
                        <h6 className="mb-0">Teaching/Work Performance (Rate 1-5)</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Teaching Quality</label>
                            <input
                              type="number"
                              className="form-control"
                              name="teachingQuality"
                              value={formData.teachingQuality}
                              onChange={handleChange}
                              min="0"
                              max="5"
                              step="0.1"
                            />
                            <small className="form-text text-muted">Rate from 0 to 5</small>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Subject Knowledge</label>
                            <input
                              type="number"
                              className="form-control"
                              name="subjectKnowledge"
                              value={formData.subjectKnowledge}
                              onChange={handleChange}
                              min="0"
                              max="5"
                              step="0.1"
                            />
                            <small className="form-text text-muted">Rate from 0 to 5</small>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Classroom Management</label>
                            <input
                              type="number"
                              className="form-control"
                              name="classroomManagement"
                              value={formData.classroomManagement}
                              onChange={handleChange}
                              min="0"
                              max="5"
                              step="0.1"
                            />
                            <small className="form-text text-muted">Rate from 0 to 5</small>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Student Engagement</label>
                            <input
                              type="number"
                              className="form-control"
                              name="studentEngagement"
                              value={formData.studentEngagement}
                              onChange={handleChange}
                              min="0"
                              max="5"
                              step="0.1"
                            />
                            <small className="form-text text-muted">Rate from 0 to 5</small>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Lesson Planning</label>
                            <input
                              type="number"
                              className="form-control"
                              name="lessonPlanning"
                              value={formData.lessonPlanning}
                              onChange={handleChange}
                              min="0"
                              max="5"
                              step="0.1"
                            />
                            <small className="form-text text-muted">Rate from 0 to 5</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Skills */}
                    <div className="card mb-3">
                      <div className="card-header">
                        <h6 className="mb-0">Professional Skills (Rate 1-5)</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Communication</label>
                            <input
                              type="number"
                              className="form-control"
                              name="communication"
                              value={formData.communication}
                              onChange={handleChange}
                              min="0"
                              max="5"
                              step="0.1"
                            />
                            <small className="form-text text-muted">Rate from 0 to 5</small>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Teamwork</label>
                            <input
                              type="number"
                              className="form-control"
                              name="teamwork"
                              value={formData.teamwork}
                              onChange={handleChange}
                              min="0"
                              max="5"
                              step="0.1"
                            />
                            <small className="form-text text-muted">Rate from 0 to 5</small>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Punctuality</label>
                            <input
                              type="number"
                              className="form-control"
                              name="punctuality"
                              value={formData.punctuality}
                              onChange={handleChange}
                              min="0"
                              max="5"
                              step="0.1"
                            />
                            <small className="form-text text-muted">Rate from 0 to 5</small>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Professionalism</label>
                            <input
                              type="number"
                              className="form-control"
                              name="professionalism"
                              value={formData.professionalism}
                              onChange={handleChange}
                              min="0"
                              max="5"
                              step="0.1"
                            />
                            <small className="form-text text-muted">Rate from 0 to 5</small>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Problem Solving</label>
                            <input
                              type="number"
                              className="form-control"
                              name="problemSolving"
                              value={formData.problemSolving}
                              onChange={handleChange}
                              min="0"
                              max="5"
                              step="0.1"
                            />
                            <small className="form-text text-muted">Rate from 0 to 5</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Metrics */}
                    <div className="card mb-3">
                      <div className="card-header">
                        <h6 className="mb-0">Additional Metrics (Rate 1-5)</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Student Satisfaction</label>
                            <input
                              type="number"
                              className="form-control"
                              name="studentSatisfaction"
                              value={formData.studentSatisfaction}
                              onChange={handleChange}
                              min="0"
                              max="5"
                              step="0.1"
                            />
                            <small className="form-text text-muted">Rate from 0 to 5</small>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Parent Feedback</label>
                            <input
                              type="number"
                              className="form-control"
                              name="parentFeedback"
                              value={formData.parentFeedback}
                              onChange={handleChange}
                              min="0"
                              max="5"
                              step="0.1"
                            />
                            <small className="form-text text-muted">Rate from 0 to 5</small>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Attendance</label>
                            <input
                              type="number"
                              className="form-control"
                              name="attendance"
                              value={formData.attendance}
                              onChange={handleChange}
                              min="0"
                              max="5"
                              step="0.1"
                            />
                            <small className="form-text text-muted">Rate from 0 to 5</small>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Initiative</label>
                            <input
                              type="number"
                              className="form-control"
                              name="initiative"
                              value={formData.initiative}
                              onChange={handleChange}
                              min="0"
                              max="5"
                              step="0.1"
                            />
                            <small className="form-text text-muted">Rate from 0 to 5</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Overall Rating */}
                    <div className="card mb-3 bg-light">
                      <div className="card-header">
                        <h6 className="mb-0">Overall Rating</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <label className="form-label">Overall Rating (Auto-calculated)</label>
                            <input
                              type="text"
                              className={`form-control ${getRatingColor(formData.overallRating)}`}
                              value={`${formData.overallRating.toFixed(2)} / 5.0 - ${getRatingLabel(formData.overallRating)}`}
                              readOnly
                              style={{ fontWeight: 'bold', fontSize: '1.1em' }}
                            />
                            <small className="form-text text-muted">Average of all ratings</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Feedback Sections */}
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Strengths</label>
                        <textarea
                          className="form-control"
                          name="strengths"
                          value={formData.strengths}
                          onChange={handleChange}
                          rows="3"
                          placeholder="List the key strengths and positive aspects"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Areas for Improvement</label>
                        <textarea
                          className="form-control"
                          name="areasForImprovement"
                          value={formData.areasForImprovement}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Identify areas that need improvement"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Recommendations</label>
                        <textarea
                          className="form-control"
                          name="recommendations"
                          value={formData.recommendations}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Provide recommendations for professional development"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Remarks</label>
                        <textarea
                          className="form-control"
                          name="remarks"
                          value={formData.remarks}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Additional remarks or notes"
                        />
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate('/staff/performance-evaluation')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Save'} Evaluation
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

export default PerformanceEvaluation;

