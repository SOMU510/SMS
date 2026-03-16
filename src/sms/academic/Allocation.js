import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const ClassAllocation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { 
    classAllocations, 
    classes, 
    sections, 
    teachers, 
    staff,
    subjects,
    academicYears,
    addClassAllocation, 
    updateClassAllocation, 
    deleteClassAllocation 
  } = useSchool();
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    academicYearId: '',
    classId: '',
    sectionId: '',
    teacherId: '',
    subjectId: '',
    allocationType: 'Class Teacher',
    startDate: '',
    endDate: '',
    status: 'Active',
    remarks: ''
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterTeacher, setFilterTeacher] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterAcademicYear, setFilterAcademicYear] = useState('All');

  // Get current academic year
  const currentAcademicYear = academicYears.find(ay => ay.isCurrent) || academicYears[0];
  const currentYearId = currentAcademicYear?.id;

  // Load allocation data if editing
  useEffect(() => {
    if (isEditMode) {
      const allocation = classAllocations.find(a => a.id === parseInt(id));
      if (allocation) {
        setFormData({
          academicYearId: allocation.academicYearId || currentYearId || '',
          classId: allocation.classId || '',
          sectionId: allocation.sectionId || '',
          teacherId: allocation.teacherId || '',
          subjectId: allocation.subjectId || '',
          allocationType: allocation.allocationType || 'Class Teacher',
          startDate: allocation.startDate || '',
          endDate: allocation.endDate || '',
          status: allocation.status || 'Active',
          remarks: allocation.remarks || ''
        });
      }
    } else if (isAddMode) {
      // Set default academic year for new allocations
      setFormData(prev => ({
        ...prev,
        academicYearId: currentYearId || ''
      }));
    }
  }, [id, isEditMode, isAddMode, classAllocations, currentYearId]);

  // Filter sections based on selected class
  const selectedClass = classes.find(c => c.id === parseInt(formData.classId));
  const availableSections = formData.classId && selectedClass
    ? sections.filter(s => s.className === selectedClass.name)
    : [];

  // Combine teachers and staff for teacher selection
  const allTeachers = [...teachers, ...staff.filter(s => s.staffType === 'Teacher')];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Clear section when class changes
      ...(name === 'classId' && { sectionId: '' })
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
    
    if (!formData.classId) {
      newErrors.classId = 'Class is required';
    }

    if (!formData.teacherId) {
      newErrors.teacherId = 'Teacher is required';
    }

    if (formData.allocationType === 'Subject Teacher' && !formData.subjectId) {
      newErrors.subjectId = 'Subject is required for subject teacher allocation';
    }

    if (formData.allocationType === 'Class Teacher' && !formData.sectionId) {
      newErrors.sectionId = 'Section is required for class teacher allocation';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const selectedClass = classes.find(c => c.id === parseInt(formData.classId));
      const selectedSection = sections.find(s => s.id === parseInt(formData.sectionId));
      const selectedTeacher = allTeachers.find(t => t.id === parseInt(formData.teacherId));
      const selectedSubject = subjects.find(s => s.id === parseInt(formData.subjectId));
      const selectedAcademicYear = academicYears.find(ay => ay.id === parseInt(formData.academicYearId));

      const allocationData = {
        ...formData,
        className: selectedClass?.name || '',
        sectionName: selectedSection?.name || '',
        teacherName: selectedTeacher ? `${selectedTeacher.firstName} ${selectedTeacher.lastName}` : '',
        subjectName: selectedSubject?.name || '',
        academicYearName: selectedAcademicYear?.name || ''
      };

      if (isEditMode) {
        updateClassAllocation(parseInt(id), allocationData);
        alert('Class allocation updated successfully!');
      } else {
        // Check for duplicate allocation
        const existing = classAllocations.find(
          a => a.academicYearId === parseInt(formData.academicYearId) &&
               a.classId === parseInt(formData.classId) &&
               a.sectionId === parseInt(formData.sectionId) &&
               a.teacherId === parseInt(formData.teacherId) &&
               a.allocationType === formData.allocationType &&
               (formData.allocationType === 'Subject Teacher' 
                 ? a.subjectId === parseInt(formData.subjectId)
                 : true)
        );
        
        if (existing) {
          alert('This allocation already exists!');
          return;
        }
        
        addClassAllocation(allocationData);
        alert('Class allocation created successfully!');
      }
      navigate('/academic/class-allocation');
    }
  };

  const handleDelete = (allocationId, teacherName, className) => {
    if (window.confirm(`Are you sure you want to delete allocation for ${teacherName} - ${className}?`)) {
      deleteClassAllocation(allocationId);
    }
  };

  // Filter allocations
  let filteredAllocations = classAllocations.filter(allocation =>
    allocation.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allocation.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allocation.sectionName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allocation.subjectName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterClass !== 'All') {
    filteredAllocations = filteredAllocations.filter(a => a.classId === parseInt(filterClass));
  }

  if (filterTeacher !== 'All') {
    filteredAllocations = filteredAllocations.filter(a => a.teacherId === parseInt(filterTeacher));
  }

  if (filterType !== 'All') {
    filteredAllocations = filteredAllocations.filter(a => a.allocationType === filterType);
  }

  if (filterAcademicYear !== 'All') {
    filteredAllocations = filteredAllocations.filter(a => a.academicYearId === parseInt(filterAcademicYear));
  }

  const getStatusBadge = (status) => {
    const badges = {
      'Active': 'bg-success',
      'Inactive': 'bg-secondary',
      'Completed': 'bg-info'
    };
    return badges[status] || 'bg-secondary';
  };

  const getTypeBadge = (type) => {
    const badges = {
      'Class Teacher': 'bg-primary',
      'Subject Teacher': 'bg-info',
      'Co-Teacher': 'bg-warning'
    };
    return badges[type] || 'bg-secondary';
  };

  // If not in add/edit mode, show list view, otherwise show form
  if (!showForm) {
    // Get statistics
    const stats = {
      total: classAllocations.length,
      classTeachers: classAllocations.filter(a => a.allocationType === 'Class Teacher').length,
      subjectTeachers: classAllocations.filter(a => a.allocationType === 'Subject Teacher').length,
      active: classAllocations.filter(a => a.status === 'Active').length
    };

    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Class & Teacher Allocation</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Class Allocation</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            {/* Statistics Cards */}
            <div className="row mb-4">
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-1">Total Allocations</h6>
                    <h4 className="mb-0">{stats.total}</h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-1">Class Teachers</h6>
                    <h4 className="mb-0 text-primary">{stats.classTeachers}</h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-1">Subject Teachers</h6>
                    <h4 className="mb-0 text-info">{stats.subjectTeachers}</h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-1">Active</h6>
                    <h4 className="mb-0 text-success">{stats.active}</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Class Allocations</h5>
                      <Link to="/academic/class-allocation/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Create Allocation
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by teacher, class, section, subject..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-select"
                          value={filterClass}
                          onChange={(e) => setFilterClass(e.target.value)}
                        >
                          <option value="All">All Classes</option>
                          {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-select"
                          value={filterTeacher}
                          onChange={(e) => setFilterTeacher(e.target.value)}
                        >
                          <option value="All">All Teachers</option>
                          {allTeachers.map(teacher => (
                            <option key={teacher.id} value={teacher.id}>
                              {teacher.firstName} {teacher.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-select"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                        >
                          <option value="All">All Types</option>
                          <option value="Class Teacher">Class Teacher</option>
                          <option value="Subject Teacher">Subject Teacher</option>
                          <option value="Co-Teacher">Co-Teacher</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-select"
                          value={filterAcademicYear}
                          onChange={(e) => setFilterAcademicYear(e.target.value)}
                        >
                          <option value="All">All Academic Years</option>
                          {academicYears.map(ay => (
                            <option key={ay.id} value={ay.id}>{ay.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Academic Year</th>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Teacher</th>
                            <th>Subject</th>
                            <th>Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAllocations.length === 0 ? (
                            <tr>
                              <td colSpan="10" className="text-center">
                                <p className="text-muted">No class allocations found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredAllocations.map((allocation) => (
                              <tr key={allocation.id}>
                                <td>{allocation.academicYearName || '-'}</td>
                                <td>
                                  <strong>{allocation.className || '-'}</strong>
                                </td>
                                <td>{allocation.sectionName || '-'}</td>
                                <td>{allocation.teacherName || '-'}</td>
                                <td>{allocation.subjectName || '-'}</td>
                                <td>
                                  <span className={`badge ${getTypeBadge(allocation.allocationType)}`}>
                                    {allocation.allocationType}
                                  </span>
                                </td>
                                <td>{allocation.startDate ? new Date(allocation.startDate).toLocaleDateString() : '-'}</td>
                                <td>{allocation.endDate ? new Date(allocation.endDate).toLocaleDateString() : '-'}</td>
                                <td>
                                  <span className={`badge ${getStatusBadge(allocation.status)}`}>
                                    {allocation.status}
                                  </span>
                                </td>
                                <td>
                                  <Link
                                    to={`/academic/class-allocation/${allocation.id}`}
                                    className="btn btn-sm btn-primary me-1"
                                    title="View/Edit"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(allocation.id, allocation.teacherName, allocation.className)}
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
          <h1>{isEditMode ? 'Edit Class Allocation' : 'Create Class Allocation'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/academic/class-allocation">Class Allocation</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Create'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Allocation Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
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
                      <div className="col-md-6">
                        <label className="form-label">
                          Allocation Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="allocationType"
                          value={formData.allocationType}
                          onChange={handleChange}
                        >
                          <option value="Class Teacher">Class Teacher</option>
                          <option value="Subject Teacher">Subject Teacher</option>
                          <option value="Co-Teacher">Co-Teacher</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Class <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.classId ? 'is-invalid' : ''}`}
                          name="classId"
                          value={formData.classId}
                          onChange={handleChange}
                        >
                          <option value="">Select Class</option>
                          {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>{cls.name}</option>
                          ))}
                        </select>
                        {errors.classId && <div className="invalid-feedback">{errors.classId}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          {formData.allocationType === 'Class Teacher' ? 'Section' : 'Section (Optional)'} 
                          {formData.allocationType === 'Class Teacher' && <span className="text-danger">*</span>}
                        </label>
                        <select
                          className={`form-select ${errors.sectionId ? 'is-invalid' : ''}`}
                          name="sectionId"
                          value={formData.sectionId}
                          onChange={handleChange}
                          disabled={!formData.classId}
                        >
                          <option value="">Select Section</option>
                          {availableSections.map(section => (
                            <option key={section.id} value={section.id}>{section.name}</option>
                          ))}
                        </select>
                        {errors.sectionId && <div className="invalid-feedback">{errors.sectionId}</div>}
                        {!formData.classId && (
                          <small className="form-text text-muted">Please select a class first</small>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Teacher <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.teacherId ? 'is-invalid' : ''}`}
                          name="teacherId"
                          value={formData.teacherId}
                          onChange={handleChange}
                        >
                          <option value="">Select Teacher</option>
                          {allTeachers.map(teacher => (
                            <option key={teacher.id} value={teacher.id}>
                              {teacher.employeeId || 'N/A'} - {teacher.firstName} {teacher.lastName}
                            </option>
                          ))}
                        </select>
                        {errors.teacherId && <div className="invalid-feedback">{errors.teacherId}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          {formData.allocationType === 'Subject Teacher' ? 'Subject' : 'Subject (Optional)'}
                          {formData.allocationType === 'Subject Teacher' && <span className="text-danger">*</span>}
                        </label>
                        <select
                          className={`form-select ${errors.subjectId ? 'is-invalid' : ''}`}
                          name="subjectId"
                          value={formData.subjectId}
                          onChange={handleChange}
                          disabled={formData.allocationType !== 'Subject Teacher'}
                        >
                          <option value="">Select Subject</option>
                          {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>{subject.name}</option>
                          ))}
                        </select>
                        {errors.subjectId && <div className="invalid-feedback">{errors.subjectId}</div>}
                        {formData.allocationType !== 'Subject Teacher' && (
                          <small className="form-text text-muted">Only required for Subject Teacher allocation</small>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Start Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">End Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Completed">Completed</option>
                        </select>
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
                        onClick={() => navigate('/academic/class-allocation')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Create'} Allocation
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

export default ClassAllocation;

