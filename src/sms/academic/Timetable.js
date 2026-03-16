import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Timetable = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { 
    timetables, 
    classes, 
    sections, 
    subjects, 
    teachers,
    staff,
    academicYears,
    addTimetable, 
    updateTimetable, 
    deleteTimetable 
  } = useSchool();
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add') || location.pathname.includes('/create');
  const isPrintMode = location.pathname.includes('/print');
  const isViewMode = location.pathname.includes('/view') && id;
  const showForm = isAddMode || (isEditMode && !isPrintMode && !isViewMode);
  
  const [formData, setFormData] = useState({
    academicYearId: '',
    className: '',
    sectionId: '',
    periodSlots: [
      { period: 1, startTime: '08:00', endTime: '08:45', subjectId: '', teacherId: '', room: '' },
      { period: 2, startTime: '08:45', endTime: '09:30', subjectId: '', teacherId: '', room: '' },
      { period: 3, startTime: '09:30', endTime: '10:15', subjectId: '', teacherId: '', room: '' },
      { period: 4, startTime: '10:15', endTime: '11:00', subjectId: '', teacherId: '', room: '' },
      { period: 5, startTime: '11:00', endTime: '11:15', subjectId: '', teacherId: '', room: '' }, // Break
      { period: 6, startTime: '11:15', endTime: '12:00', subjectId: '', teacherId: '', room: '' },
      { period: 7, startTime: '12:00', endTime: '12:45', subjectId: '', teacherId: '', room: '' },
      { period: 8, startTime: '12:45', endTime: '13:30', subjectId: '', teacherId: '', room: '' }
    ],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    status: 'Active',
    remarks: ''
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterSection, setFilterSection] = useState('All');
  const [filterAcademicYear, setFilterAcademicYear] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'table', 'calendar'

  // Get current academic year
  const currentAcademicYear = academicYears.find(ay => ay.isCurrent) || academicYears[0];
  const currentYearId = currentAcademicYear?.id;

  // Combine teachers and staff for teacher selection
  const allTeachers = [...teachers, ...staff.filter(s => s.staffType === 'Teacher')];

  // Days of week arrays
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysOfWeekLower = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  // Print and Export functions
  const handlePrint = () => {
    window.print();
  };

  const generatePDF = (timetable) => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    
    // Add title
    doc.setFontSize(18);
    doc.text('School Timetable', 105, 15, { align: 'center' });
    
    // Add class and section info
    doc.setFontSize(14);
    const classInfo = `${timetable.className}${timetable.sectionName ? ` - ${timetable.sectionName}` : ''}`;
    doc.text(classInfo, 105, 22, { align: 'center' });
    
    // Add academic year
    doc.setFontSize(10);
    doc.text(`Academic Year: ${timetable.academicYearName || 'N/A'}`, 105, 28, { align: 'center' });
    
    // Prepare table data
    const tableData = [];
    timetable.periodSlots.forEach((slot, periodIndex) => {
      const row = [
        `P${slot.period}\n${slot.startTime} - ${slot.endTime}`
      ];
      
      daysOfWeek.forEach(day => {
        const dayKey = day.toLowerCase();
        const periodData = timetable[dayKey]?.[periodIndex] || {};
        const subject = subjects.find(s => s.id === parseInt(periodData.subjectId));
        const teacher = allTeachers.find(t => t.id === parseInt(periodData.teacherId));
        
        if (periodData.subjectId && subject) {
          let cellContent = subject.name;
          if (teacher) {
            cellContent += `\n${teacher.firstName} ${teacher.lastName}`;
          }
          if (periodData.room) {
            cellContent += `\nRoom: ${periodData.room}`;
          }
          row.push(cellContent);
        } else {
          row.push('-');
        }
      });
      
      tableData.push(row);
    });
    
    // Create table
    autoTable(doc, {
      startY: 35,
      head: [['Period', ...daysOfWeek]],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 30, halign: 'center' },
      },
      margin: { top: 35, left: 10, right: 10 },
    });
    
    // Add remarks if available
    if (timetable.remarks) {
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text(`Remarks: ${timetable.remarks}`, 10, finalY);
    }
    
    // Add generation date
    const finalY = doc.lastAutoTable.finalY + (timetable.remarks ? 15 : 10);
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, finalY);
    
    // Save the PDF
    const fileName = `Timetable_${timetable.className}_${timetable.sectionName || 'All'}_${timetable.academicYearName || 'NA'}.pdf`;
    doc.save(fileName);
  };

  const handleExportPDF = (timetableId) => {
    const timetable = timetables.find(t => t.id === parseInt(timetableId));
    if (timetable) {
      generatePDF(timetable);
    } else {
      alert('Timetable not found');
    }
  };

  const handleExportExcel = () => {
    // This would typically use a library like xlsx
    alert('Excel export functionality will be implemented with an Excel library');
  };

  // Filter sections based on selected class
  const selectedClass = classes.find(c => c.name === formData.className);
  const availableSections = formData.className && selectedClass
    ? sections.filter(s => s.className === formData.className)
    : [];

  // Load timetable data if editing
  useEffect(() => {
    if (isEditMode) {
      const timetable = timetables.find(t => t.id === parseInt(id));
      if (timetable) {
        setFormData({
          academicYearId: timetable.academicYearId || currentYearId || '',
          className: timetable.className || '',
          sectionId: timetable.sectionId || '',
          periodSlots: timetable.periodSlots || formData.periodSlots,
          monday: timetable.monday || [],
          tuesday: timetable.tuesday || [],
          wednesday: timetable.wednesday || [],
          thursday: timetable.thursday || [],
          friday: timetable.friday || [],
          saturday: timetable.saturday || [],
          status: timetable.status || 'Active',
          remarks: timetable.remarks || ''
        });
      }
    } else if (isAddMode) {
      // Set default academic year for new timetables
      setFormData(prev => ({
        ...prev,
        academicYearId: currentYearId || ''
      }));
    }
  }, [id, isEditMode, isAddMode, timetables, currentYearId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Clear section when class changes
      ...(name === 'className' && { sectionId: '' })
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePeriodSlotChange = (index, field, value) => {
    const updatedSlots = [...formData.periodSlots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setFormData(prev => ({ ...prev, periodSlots: updatedSlots }));
  };

  const handleDayPeriodChange = (day, periodIndex, field, value) => {
    const dayKey = day.toLowerCase();
    const updatedDay = [...formData[dayKey]];
    if (!updatedDay[periodIndex]) {
      updatedDay[periodIndex] = {};
    }
    updatedDay[periodIndex] = { ...updatedDay[periodIndex], [field]: value };
    setFormData(prev => ({ ...prev, [dayKey]: updatedDay }));
  };

  const addPeriodSlot = () => {
    const newPeriod = formData.periodSlots.length + 1;
    setFormData(prev => ({
      ...prev,
      periodSlots: [
        ...prev.periodSlots,
        { period: newPeriod, startTime: '', endTime: '', subjectId: '', teacherId: '', room: '' }
      ]
    }));
  };

  const removePeriodSlot = (index) => {
    if (formData.periodSlots.length > 1) {
      const updatedSlots = formData.periodSlots.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, periodSlots: updatedSlots }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.academicYearId) {
      newErrors.academicYearId = 'Academic year is required';
    }
    
    if (!formData.className) {
      newErrors.className = 'Class is required';
    }

    // Validate at least one day has periods assigned
    const hasPeriods = formData.monday.length > 0 || 
                      formData.tuesday.length > 0 || 
                      formData.wednesday.length > 0 || 
                      formData.thursday.length > 0 || 
                      formData.friday.length > 0 || 
                      formData.saturday.length > 0;
    
    if (!hasPeriods) {
      newErrors.periods = 'At least one day must have periods assigned';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const selectedSection = sections.find(s => s.id === parseInt(formData.sectionId));
      const selectedAcademicYear = academicYears.find(ay => ay.id === parseInt(formData.academicYearId));

      // Populate subject and teacher names for each day
      const processedData = { ...formData };
      
      daysOfWeekLower.forEach(day => {
        processedData[day] = processedData[day].map(periodData => {
          if (periodData.subjectId) {
            const subject = subjects.find(s => s.id === parseInt(periodData.subjectId));
            periodData.subjectName = subject?.name || '';
          }
          if (periodData.teacherId) {
            const teacher = allTeachers.find(t => t.id === parseInt(periodData.teacherId));
            periodData.teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : '';
          }
          return periodData;
        });
      });

      const timetableData = {
        ...processedData,
        sectionName: selectedSection?.name || '',
        academicYearName: selectedAcademicYear?.name || ''
      };

      if (isEditMode) {
        updateTimetable(parseInt(id), timetableData);
        alert('Timetable updated successfully!');
      } else {
        // Check for duplicate timetable
        const existing = timetables.find(
          t => t.academicYearId === parseInt(formData.academicYearId) &&
               t.className === formData.className &&
               t.sectionId === parseInt(formData.sectionId)
        );
        
        if (existing) {
          alert('A timetable already exists for this class and section!');
          return;
        }
        
        addTimetable(timetableData);
        alert('Timetable created successfully!');
      }
      navigate('/timetable/view');
    }
  };

  const handleDelete = (timetableId, className, sectionName) => {
    if (window.confirm(`Are you sure you want to delete timetable for ${className} ${sectionName ? `- ${sectionName}` : ''}?`)) {
      deleteTimetable(timetableId);
    }
  };

  // Filter timetables
  let filteredTimetables = timetables.filter(timetable =>
    timetable.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    timetable.sectionName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    timetable.academicYearName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterClass !== 'All') {
    filteredTimetables = filteredTimetables.filter(t => t.className === filterClass);
  }

  if (filterSection !== 'All') {
    filteredTimetables = filteredTimetables.filter(t => t.sectionId === parseInt(filterSection));
  }

  if (filterAcademicYear !== 'All') {
    filteredTimetables = filteredTimetables.filter(t => t.academicYearId === parseInt(filterAcademicYear));
  }

  const getStatusBadge = (status) => {
    const badges = {
      'Active': 'bg-success',
      'Inactive': 'bg-secondary',
      'Draft': 'bg-warning'
    };
    return badges[status] || 'bg-secondary';
  };

  // If not in add/edit mode, show list view
  if (!showForm) {
    const stats = {
      total: timetables.length,
      active: timetables.filter(t => t.status === 'Active').length,
      uniqueClasses: new Set(timetables.map(t => t.className)).size
    };

    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Timetable Management</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Timetable Management</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            {/* Statistics Cards */}
            <div className="row mb-4">
              <div className="col-lg-4 col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-1">Total Timetables</h6>
                    <h4 className="mb-0">{stats.total}</h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-1">Active</h6>
                    <h4 className="mb-0 text-success">{stats.active}</h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-1">Classes</h6>
                    <h4 className="mb-0 text-primary">{stats.uniqueClasses}</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Timetables</h5>
                      <Link to="/timetable/create" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Create Timetable
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by class, section..."
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
                        <select
                          className="form-select"
                          value={filterSection}
                          onChange={(e) => setFilterSection(e.target.value)}
                        >
                          <option value="All">All Sections</option>
                          {sections.map(section => (
                            <option key={section.id} value={section.id}>{section.name}</option>
                          ))}
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
                            <th>Periods/Day</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTimetables.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="text-center">
                                <p className="text-muted">No timetables found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredTimetables.map((timetable) => {
                              const totalPeriods = timetable.monday?.length || 0;
                              return (
                                <tr key={timetable.id}>
                                  <td>{timetable.academicYearName || '-'}</td>
                                  <td><strong>{timetable.className || '-'}</strong></td>
                                  <td>{timetable.sectionName || '-'}</td>
                                  <td>{totalPeriods}</td>
                                  <td>
                                    <span className={`badge ${getStatusBadge(timetable.status)}`}>
                                      {timetable.status}
                                    </span>
                                  </td>
                                  <td>
                                    <Link
                                      to={`/timetable/${timetable.id}`}
                                      className="btn btn-sm btn-primary me-1"
                                      title="View/Edit"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </Link>
                                    <Link
                                      to={`/timetable/view/${timetable.id}`}
                                      className="btn btn-sm btn-info me-1"
                                      title="View"
                                    >
                                      <i className="bi bi-eye"></i>
                                    </Link>
                                    <button
                                      className="btn btn-sm btn-success me-1"
                                      title="Download PDF"
                                      onClick={() => handleExportPDF(timetable.id)}
                                    >
                                      <i className="bi bi-file-pdf"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleDelete(timetable.id, timetable.className, timetable.sectionName)}
                                      title="Delete"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
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

  // Print selection page (when /timetable/print without ID)
  if (isPrintMode && !id) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Print / Export Timetable</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/timetable/view">Timetable</Link></li>
                <li className="breadcrumb-item active">Print / Export</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Select Timetable to Print / Export</h5>
                    
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by class, section..."
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
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTimetables.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center">
                                <p className="text-muted">No timetables found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredTimetables.map((timetable) => (
                              <tr key={timetable.id}>
                                <td>{timetable.academicYearName || '-'}</td>
                                <td><strong>{timetable.className || '-'}</strong></td>
                                <td>{timetable.sectionName || '-'}</td>
                                <td>
                                  <span className={`badge ${getStatusBadge(timetable.status)}`}>
                                    {timetable.status}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-success me-1"
                                    onClick={() => handleExportPDF(timetable.id)}
                                    title="Download PDF"
                                  >
                                    <i className="bi bi-file-pdf"></i> PDF
                                  </button>
                                  <Link
                                    to={`/timetable/view/${timetable.id}`}
                                    className="btn btn-sm btn-info"
                                  >
                                    <i className="bi bi-eye"></i> View
                                  </Link>
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

  // Print/View mode - show timetable in printable format
  if ((isPrintMode && id) || isViewMode) {
    const timetable = timetables.find(t => t.id === parseInt(id));
    if (!timetable) {
      return (
        <main id="main" className="main">
          <div className="container-fluid">
            <div className="alert alert-warning">Timetable not found</div>
            <Link to="/timetable/view" className="btn btn-primary">Back to Timetables</Link>
          </div>
        </main>
      );
    }

    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Timetable - {timetable.className} {timetable.sectionName ? `- ${timetable.sectionName}` : ''}</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/timetable/view">Timetable</Link></li>
                <li className="breadcrumb-item active">View</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row mb-3">
              <div className="col-12 text-end">
                {!isPrintMode && (
                  <>
                    <button
                      className="btn btn-primary me-2"
                      onClick={handlePrint}
                    >
                      <i className="bi bi-printer"></i> Print
                    </button>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => handleExportPDF(timetable.id)}
                    >
                      <i className="bi bi-file-pdf"></i> Download PDF
                    </button>
                    <button
                      className="btn btn-success me-2"
                      onClick={handleExportExcel}
                    >
                      <i className="bi bi-file-excel"></i> Export Excel
                    </button>
                    <Link
                      to={`/timetable/${timetable.id}`}
                      className="btn btn-secondary"
                    >
                      <i className="bi bi-pencil"></i> Edit
                    </Link>
                  </>
                )}
                {isPrintMode && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => window.close()}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>

            <div className="card print-timetable">
              <div className="card-body">
                <div className="text-center mb-4">
                  <h3>School Timetable</h3>
                  <h5>{timetable.className} {timetable.sectionName ? `- ${timetable.sectionName}` : ''}</h5>
                  <p className="text-muted">Academic Year: {timetable.academicYearName || 'N/A'}</p>
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered table-sm">
                    <thead>
                      <tr>
                        <th style={{ width: '100px' }}>Period</th>
                        {daysOfWeek.map(day => (
                          <th key={day} style={{ minWidth: '150px' }}>{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.periodSlots.map((slot, periodIndex) => (
                        <tr key={periodIndex}>
                          <td className="text-center">
                            <strong>P{slot.period}</strong>
                            <br />
                            <small>{slot.startTime} - {slot.endTime}</small>
                          </td>
                          {daysOfWeek.map(day => {
                            const dayKey = day.toLowerCase();
                            const periodData = timetable[dayKey]?.[periodIndex] || {};
                            const subject = subjects.find(s => s.id === parseInt(periodData.subjectId));
                            const teacher = allTeachers.find(t => t.id === parseInt(periodData.teacherId));
                            
                            return (
                              <td key={day} className="text-center">
                                {periodData.subjectId ? (
                                  <>
                                    <div><strong>{subject?.name || 'N/A'}</strong></div>
                                    {teacher && (
                                      <div className="text-muted small">{teacher.firstName} {teacher.lastName}</div>
                                    )}
                                    {periodData.room && (
                                      <div className="text-muted small">Room: {periodData.room}</div>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {timetable.remarks && (
                  <div className="mt-3">
                    <strong>Remarks:</strong> {timetable.remarks}
                  </div>
                )}

                <div className="mt-4 text-center text-muted small">
                  <p>Generated on: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </section>

          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              .print-timetable, .print-timetable * {
                visibility: visible;
              }
              .print-timetable {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
              .pagetitle, .breadcrumb, .btn {
                display: none !important;
              }
            }
          `}</style>
        </div>
      </main>
    );
  }

  // Form view (for both add and edit)
  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>{isEditMode ? 'Edit Timetable' : 'Create Timetable'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/timetable/view">Timetable</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Create'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Timetable Information</h5>
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
                          <option value="">Select Section (Optional)</option>
                          {availableSections.map(section => (
                            <option key={section.id} value={section.id}>{section.name}</option>
                          ))}
                        </select>
                        {!formData.className && (
                          <small className="form-text text-muted">Please select a class first</small>
                        )}
                      </div>
                    </div>

                    <h5 className="card-title mt-4 mb-3">Period Slots</h5>
                    <div className="table-responsive mb-3">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Period</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.periodSlots.map((slot, index) => (
                            <tr key={index}>
                              <td>{slot.period}</td>
                              <td>
                                <input
                                  type="time"
                                  className="form-control form-control-sm"
                                  value={slot.startTime}
                                  onChange={(e) => handlePeriodSlotChange(index, 'startTime', e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="time"
                                  className="form-control form-control-sm"
                                  value={slot.endTime}
                                  onChange={(e) => handlePeriodSlotChange(index, 'endTime', e.target.value)}
                                />
                              </td>
                              <td>
                                {formData.periodSlots.length > 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => removePeriodSlot(index)}
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
                      onClick={addPeriodSlot}
                    >
                      <i className="bi bi-plus"></i> Add Period Slot
                    </button>

                    <h5 className="card-title mt-4 mb-3">Weekly Schedule</h5>
                    {errors.periods && (
                      <div className="alert alert-danger">{errors.periods}</div>
                    )}
                    
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Period</th>
                            {daysOfWeek.map(day => (
                              <th key={day}>{day}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {formData.periodSlots.map((slot, periodIndex) => (
                            <tr key={periodIndex}>
                              <td>
                                <strong>P{slot.period}</strong>
                                <br />
                                <small>{slot.startTime} - {slot.endTime}</small>
                              </td>
                              {daysOfWeek.map(day => {
                                const dayKey = day.toLowerCase();
                                const periodData = formData[dayKey][periodIndex] || {};
                                return (
                                  <td key={day}>
                                    <select
                                      className="form-select form-select-sm mb-1"
                                      value={periodData.subjectId || ''}
                                      onChange={(e) => handleDayPeriodChange(day, periodIndex, 'subjectId', e.target.value)}
                                    >
                                      <option value="">Select Subject</option>
                                      {subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                                      ))}
                                    </select>
                                    <select
                                      className="form-select form-select-sm mb-1"
                                      value={periodData.teacherId || ''}
                                      onChange={(e) => handleDayPeriodChange(day, periodIndex, 'teacherId', e.target.value)}
                                      disabled={!periodData.subjectId}
                                    >
                                      <option value="">Select Teacher</option>
                                      {allTeachers.map(teacher => (
                                        <option key={teacher.id} value={teacher.id}>
                                          {teacher.employeeId || 'N/A'} - {teacher.firstName} {teacher.lastName}
                                        </option>
                                      ))}
                                    </select>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      placeholder="Room"
                                      value={periodData.room || ''}
                                      onChange={(e) => handleDayPeriodChange(day, periodIndex, 'room', e.target.value)}
                                    />
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="row mb-3 mt-4">
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
                          <option value="Draft">Draft</option>
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
                        onClick={() => navigate('/timetable/view')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Create'} Timetable
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

export default Timetable;

