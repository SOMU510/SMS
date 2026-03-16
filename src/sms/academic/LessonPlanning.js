import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const LessonPlanning = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { lessonPlans, classes, subjects, teachers, addLessonPlan, updateLessonPlan, deleteLessonPlan } = useSchool();
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    title: '',
    className: '',
    subject: '',
    teacher: '',
    date: '',
    duration: '',
    topic: '',
    objectives: [],
    materials: [],
    activities: [],
    homework: '',
    notes: '',
    status: 'Draft'
  });
  const [errors, setErrors] = useState({});
  const [objectiveText, setObjectiveText] = useState('');
  const [materialText, setMaterialText] = useState('');
  const [activityText, setActivityText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load lesson plan data if editing
  useEffect(() => {
    if (isEditMode) {
      const lessonPlan = lessonPlans.find(lp => lp.id === parseInt(id));
      if (lessonPlan) {
        setFormData({
          title: lessonPlan.title || '',
          className: lessonPlan.className || '',
          subject: lessonPlan.subject || '',
          teacher: lessonPlan.teacher || '',
          date: lessonPlan.date || '',
          duration: lessonPlan.duration || '',
          topic: lessonPlan.topic || '',
          objectives: lessonPlan.objectives || [],
          materials: lessonPlan.materials || [],
          activities: lessonPlan.activities || [],
          homework: lessonPlan.homework || '',
          notes: lessonPlan.notes || '',
          status: lessonPlan.status || 'Draft'
        });
      }
    } else {
      // Set default date to today
      setFormData(prev => ({
        ...prev,
        date: new Date().toISOString().split('T')[0]
      }));
    }
  }, [id, isEditMode, lessonPlans]);

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

  const handleAddObjective = () => {
    if (objectiveText.trim()) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, { id: Date.now(), text: objectiveText.trim() }]
      }));
      setObjectiveText('');
    }
  };

  const handleRemoveObjective = (objectiveId) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj.id !== objectiveId)
    }));
  };

  const handleAddMaterial = () => {
    if (materialText.trim()) {
      setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, { id: Date.now(), text: materialText.trim() }]
      }));
      setMaterialText('');
    }
  };

  const handleRemoveMaterial = (materialId) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter(mat => mat.id !== materialId)
    }));
  };

  const handleAddActivity = () => {
    if (activityText.trim()) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, { id: Date.now(), text: activityText.trim() }]
      }));
      setActivityText('');
    }
  };

  const handleRemoveActivity = (activityId) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter(act => act.id !== activityId)
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Lesson title is required';
    }
    
    if (!formData.className) {
      newErrors.className = 'Class is required';
    }

    if (!formData.subject) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    }

    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEditMode) {
        updateLessonPlan(parseInt(id), formData);
        alert('Lesson plan updated successfully!');
      } else {
        addLessonPlan(formData);
        alert('Lesson plan added successfully!');
      }
      navigate('/academic/lesson-planning');
    }
  };

  const handleDelete = (lessonPlanId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteLessonPlan(lessonPlanId);
    }
  };

  // Filter lesson plans for list view
  const filteredLessonPlans = lessonPlans.filter(plan =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.topic?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If not in add/edit mode, show list view, otherwise show form
  if (!showForm) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Lesson Planning</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Lesson Planning</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Lesson Plans</h5>
                      <Link to="/academic/lesson-planning/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Create New Lesson Plan
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Search lesson plans..."
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Class</th>
                            <th>Subject</th>
                            <th>Topic</th>
                            <th>Teacher</th>
                            <th>Date</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLessonPlans.length === 0 ? (
                            <tr>
                              <td colSpan="9" className="text-center">
                                <p className="text-muted">No lesson plans found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredLessonPlans.map((plan) => (
                              <tr key={plan.id}>
                                <td>
                                  <strong>{plan.title}</strong>
                                </td>
                                <td>{plan.className || '-'}</td>
                                <td>{plan.subject || '-'}</td>
                                <td>{plan.topic || '-'}</td>
                                <td>{plan.teacher || '-'}</td>
                                <td>{plan.date ? new Date(plan.date).toLocaleDateString() : '-'}</td>
                                <td>{plan.duration || '-'}</td>
                                <td>
                                  {plan.status === 'Published' ? (
                                    <span className="badge bg-success">Published</span>
                                  ) : plan.status === 'Draft' ? (
                                    <span className="badge bg-warning">Draft</span>
                                  ) : (
                                    <span className="badge bg-secondary">Archived</span>
                                  )}
                                </td>
                                <td>
                                  <Link 
                                    to={`/academic/lesson-planning/${plan.id}`} 
                                    className="btn btn-sm btn-primary me-1"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <button 
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(plan.id, plan.title)}
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
          <h1>{isEditMode ? 'Edit Lesson Plan' : 'Create Lesson Plan'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/academic/lesson-planning">Lesson Planning</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Create'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Lesson Plan Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">
                          Lesson Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g., Introduction to Algebra"
                        />
                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
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
                      <div className="col-md-4">
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
                      <div className="col-md-4">
                        <label className="form-label">Teacher</label>
                        <select
                          className="form-select"
                          name="teacher"
                          value={formData.teacher}
                          onChange={handleChange}
                        >
                          <option value="">Select Teacher</option>
                          {teachers.map(teacher => (
                            <option key={teacher.id} value={`${teacher.firstName} ${teacher.lastName}`}>
                              {teacher.firstName} {teacher.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                        />
                        {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Duration <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          placeholder="e.g., 45 minutes, 1 hour"
                        />
                        {errors.duration && <div className="invalid-feedback">{errors.duration}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="Draft">Draft</option>
                          <option value="Published">Published</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">
                          Topic <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.topic ? 'is-invalid' : ''}`}
                          name="topic"
                          value={formData.topic}
                          onChange={handleChange}
                          placeholder="e.g., Linear Equations"
                        />
                        {errors.topic && <div className="invalid-feedback">{errors.topic}</div>}
                      </div>
                    </div>

                    {/* Learning Objectives */}
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <h6 className="mb-3">Learning Objectives</h6>
                        <div className="d-flex gap-2 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter learning objective"
                            value={objectiveText}
                            onChange={(e) => setObjectiveText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddObjective();
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={handleAddObjective}
                          >
                            <i className="bi bi-plus-circle"></i> Add
                          </button>
                        </div>
                        {formData.objectives.length > 0 && (
                          <ul className="list-group">
                            {formData.objectives.map((objective) => (
                              <li key={objective.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{objective.text}</span>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleRemoveObjective(objective.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Materials Required */}
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <h6 className="mb-3">Materials Required</h6>
                        <div className="d-flex gap-2 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter material/equipment"
                            value={materialText}
                            onChange={(e) => setMaterialText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddMaterial();
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={handleAddMaterial}
                          >
                            <i className="bi bi-plus-circle"></i> Add
                          </button>
                        </div>
                        {formData.materials.length > 0 && (
                          <ul className="list-group">
                            {formData.materials.map((material) => (
                              <li key={material.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{material.text}</span>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleRemoveMaterial(material.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Activities */}
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <h6 className="mb-3">Activities</h6>
                        <div className="d-flex gap-2 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter activity description"
                            value={activityText}
                            onChange={(e) => setActivityText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddActivity();
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={handleAddActivity}
                          >
                            <i className="bi bi-plus-circle"></i> Add
                          </button>
                        </div>
                        {formData.activities.length > 0 && (
                          <ul className="list-group">
                            {formData.activities.map((activity) => (
                              <li key={activity.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{activity.text}</span>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleRemoveActivity(activity.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Homework */}
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Homework/Assignment</label>
                        <textarea
                          className="form-control"
                          name="homework"
                          value={formData.homework}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Enter homework or assignment details"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Additional Notes</label>
                        <textarea
                          className="form-control"
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          rows="4"
                          placeholder="Enter any additional notes or remarks"
                        />
                      </div>
                    </div>

                    <div className="text-end">
                      <button 
                        type="button" 
                        className="btn btn-secondary me-2" 
                        onClick={() => navigate('/academic/lesson-planning')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Save'} Lesson Plan
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

export default LessonPlanning;

