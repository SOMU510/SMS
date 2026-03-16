import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const ExamSchedule = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { 
    examSchedules,
    exams,
    classes,
    sections,
    subjects,
    academicYears,
    examTypes,
    addExamSchedule,
    updateExamSchedule,
    deleteExamSchedule
  } = useSchool();
  
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    academicYearId: '',
    examTypeId: '',
    examId: '',
    className: '',
    sectionId: '',
    subjectId: '',
    examDate: '',
    startTime: '',
    endTime: '',
    duration: '',
    room: '',
    invigilator: '',
    instructions: '',
    status: 'Scheduled'
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  // Get current academic year
  const currentAcademicYear = academicYears.find(ay => ay.isCurrent) || academicYears[0];
  const currentYearId = currentAcademicYear?.id;

  // Filter sections based on selected class
  const selectedClassObj = classes.find(c => c.name === formData.className);
  const availableSections = formData.className && selectedClassObj
    ? sections.filter(s => s.className === formData.className)
    : [];

  // Load schedule data if editing
  useEffect(() => {
    if (isEditMode) {
      const schedule = examSchedules.find(es => es.id === parseInt(id));
      if (schedule) {
        setFormData({
          academicYearId: schedule.academicYearId || currentYearId || '',
          examTypeId: schedule.examTypeId || '',
          examId: schedule.examId || '',
          className: schedule.className || '',
          sectionId: schedule.sectionId || '',
          subjectId: schedule.subjectId || '',
          examDate: schedule.examDate || '',
          startTime: schedule.startTime || '',
          endTime: schedule.endTime || '',
          duration: schedule.duration || '',
          room: schedule.room || '',
          invigilator: schedule.invigilator || '',
          instructions: schedule.instructions || '',
          status: schedule.status || 'Scheduled'
        });
      }
    } else if (isAddMode) {
      setFormData(prev => ({
        ...prev,
        academicYearId: currentYearId || ''
      }));
    }
  }, [id, isEditMode, isAddMode, examSchedules, currentYearId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'className' && { sectionId: '' })
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
    
    if (!formData.academicYearId) {
      newErrors.academicYearId = 'Academic year is required';
    }
    
    if (!formData.examId) {
      newErrors.examId = 'Exam is required';
    }
    
    if (!formData.className) {
      newErrors.className = 'Class is required';
    }
    
    if (!formData.examDate) {
      newErrors.examDate = 'Exam date is required';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const selectedSection = sections.find(s => s.id === parseInt(formData.sectionId));
      const selectedSubject = subjects.find(s => s.id === parseInt(formData.subjectId));
      const selectedExam = exams.find(e => e.id === parseInt(formData.examId));
      const selectedExamType = examTypes.find(et => et.id === parseInt(formData.examTypeId));
      const selectedAcademicYear = academicYears.find(ay => ay.id === parseInt(formData.academicYearId));

      const scheduleData = {
        ...formData,
        sectionName: selectedSection?.name || '',
        subjectName: selectedSubject?.name || '',
        examName: selectedExam?.name || '',
        examTypeName: selectedExamType?.name || '',
        academicYearName: selectedAcademicYear?.name || ''
      };

      if (isEditMode) {
        updateExamSchedule(parseInt(id), scheduleData);
        alert('Exam schedule updated successfully!');
      } else {
        addExamSchedule(scheduleData);
        alert('Exam schedule created successfully!');
      }
      navigate('/exams/schedule');
    }
  };

  const handleDelete = (scheduleId, examName, className) => {
    if (window.confirm(`Are you sure you want to delete schedule for ${examName} - ${className}?`)) {
      deleteExamSchedule(scheduleId);
    }
  };

  // Filter schedules
  let filteredSchedules = examSchedules.filter(schedule =>
    schedule.examName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.subjectName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterClass !== 'All') {
    filteredSchedules = filteredSchedules.filter(s => s.className === filterClass);
  }

  if (filterDate) {
    filteredSchedules = filteredSchedules.filter(s => s.examDate === filterDate);
  }

  const getStatusBadge = (status) => {
    const badges = {
      'Scheduled': 'bg-info',
      'Completed': 'bg-success',
      'Cancelled': 'bg-danger',
      'Postponed': 'bg-warning'
    };
    return badges[status] || 'bg-secondary';
  };

  // If not in add/edit mode, show list view
  if (!showForm) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Exam Schedule</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/exams">Exams</Link></li>
                <li className="breadcrumb-item active">Schedule</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Exam Schedules</h5>
                      <Link to="/exams/schedule/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Add Schedule
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by exam, class, subject..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-select"
                          value={filterClass}
                          onChange={(e) => setFilterClass(e.target.value)}
                        >
                          <option value="All">All Classes</option>
                          {classes.map(cls => (
                            <option key={cls.id} value={cls.name}>{cls.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <input
                          type="date"
                          className="form-control"
                          value={filterDate}
                          onChange={(e) => setFilterDate(e.target.value)}
                          placeholder="Filter by date"
                        />
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Exam</th>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Room</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSchedules.length === 0 ? (
                            <tr>
                              <td colSpan="9" className="text-center">
                                <p className="text-muted">No schedules found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredSchedules.map((schedule) => (
                              <tr key={schedule.id}>
                                <td><strong>{schedule.examName || '-'}</strong></td>
                                <td>{schedule.className || '-'}</td>
                                <td>{schedule.sectionName || '-'}</td>
                                <td>{schedule.subjectName || '-'}</td>
                                <td>{schedule.examDate ? new Date(schedule.examDate).toLocaleDateString() : '-'}</td>
                                <td>{schedule.startTime} - {schedule.endTime}</td>
                                <td>{schedule.room || '-'}</td>
                                <td>
                                  <span className={`badge ${getStatusBadge(schedule.status)}`}>
                                    {schedule.status}
                                  </span>
                                </td>
                                <td>
                                  <Link
                                    to={`/exams/schedule/${schedule.id}`}
                                    className="btn btn-sm btn-primary me-1"
                                    title="Edit"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(schedule.id, schedule.examName, schedule.className)}
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
          <h1>{isEditMode ? 'Edit Exam Schedule' : 'Add Exam Schedule'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/exams/schedule">Exam Schedule</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Add'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Schedule Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Academic Year <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.academicYearId ? 'is-invalid' : ''}`}
                          name="academicYearId"
                          value={formData.academicYearId}
                          onChange={handleChange}
                        >
                          <option value="">Select Academic Year</option>
                          {academicYears.map(ay => (
                            <option key={ay.id} value={ay.id}>
                              {ay.name} {ay.isCurrent && '(Current)'}
                            </option>
                          ))}
                        </select>
                        {errors.academicYearId && <div className="invalid-feedback">{errors.academicYearId}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Exam <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.examId ? 'is-invalid' : ''}`}
                          name="examId"
                          value={formData.examId}
                          onChange={handleChange}
                        >
                          <option value="">Select Exam</option>
                          {exams.map(exam => (
                            <option key={exam.id} value={exam.id}>
                              {exam.name} - {exam.class} - {exam.subject}
                            </option>
                          ))}
                        </select>
                        {errors.examId && <div className="invalid-feedback">{errors.examId}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Exam Type</label>
                        <select
                          className="form-select"
                          name="examTypeId"
                          value={formData.examTypeId}
                          onChange={handleChange}
                        >
                          <option value="">Select Exam Type</option>
                          {examTypes.map(et => (
                            <option key={et.id} value={et.id}>{et.name}</option>
                          ))}
                        </select>
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
                            <option key={cls.id} value={cls.name}>{cls.name}</option>
                          ))}
                        </select>
                        {errors.className && <div className="invalid-feedback">{errors.className}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Section (Optional)</label>
                        <select
                          className="form-select"
                          name="sectionId"
                          value={formData.sectionId}
                          onChange={handleChange}
                          disabled={!formData.className}
                        >
                          <option value="">All Sections</option>
                          {availableSections.map(section => (
                            <option key={section.id} value={section.id}>{section.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Subject</label>
                        <select
                          className="form-select"
                          name="subjectId"
                          value={formData.subjectId}
                          onChange={handleChange}
                        >
                          <option value="">Select Subject</option>
                          {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>{subject.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Exam Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={`form-control ${errors.examDate ? 'is-invalid' : ''}`}
                          name="examDate"
                          value={formData.examDate}
                          onChange={handleChange}
                        />
                        {errors.examDate && <div className="invalid-feedback">{errors.examDate}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Start Time <span className="text-danger">*</span>
                        </label>
                        <input
                          type="time"
                          className={`form-control ${errors.startTime ? 'is-invalid' : ''}`}
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                        />
                        {errors.startTime && <div className="invalid-feedback">{errors.startTime}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          End Time <span className="text-danger">*</span>
                        </label>
                        <input
                          type="time"
                          className={`form-control ${errors.endTime ? 'is-invalid' : ''}`}
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleChange}
                        />
                        {errors.endTime && <div className="invalid-feedback">{errors.endTime}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Duration (minutes)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          placeholder="e.g., 90"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Room/Venue</label>
                        <input
                          type="text"
                          className="form-control"
                          name="room"
                          value={formData.room}
                          onChange={handleChange}
                          placeholder="e.g., Room 101"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Invigilator</label>
                        <input
                          type="text"
                          className="form-control"
                          name="invigilator"
                          value={formData.invigilator}
                          onChange={handleChange}
                          placeholder="Teacher name"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Instructions</label>
                        <textarea
                          className="form-control"
                          name="instructions"
                          value={formData.instructions}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Special instructions for students"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Postponed">Postponed</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate('/exams/schedule')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Create'} Schedule
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

export default ExamSchedule;

