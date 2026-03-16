import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const StudentAttendance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    students, 
    classes, 
    sections,
    subjects,
    academicYears,
    attendance,
    addAttendance,
    updateAttendance,
    deleteAttendance
  } = useSchool();

  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [remarks, setRemarks] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('mark'); // 'mark' or 'view'
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  // Get current academic year
  const currentAcademicYear = academicYears.find(ay => ay.isCurrent) || academicYears[0];
  const currentYearId = currentAcademicYear?.id;

  // Filter sections based on selected class
  const selectedClassObj = classes.find(c => c.name === selectedClass);
  const availableSections = selectedClass && selectedClassObj
    ? sections.filter(s => s.className === selectedClass)
    : [];

  // Filter students based on class and section
  let filteredStudents = students.filter(s => {
    const matchesClass = !selectedClass || s.class === selectedClass;
    const matchesSection = !selectedSection || s.section === selectedSection;
    const matchesSearch = !searchTerm || 
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSection && matchesSearch;
  });

  // Load existing attendance for selected date
  useEffect(() => {
    if (selectedDate && selectedClass) {
      const existingAttendance = attendance.find(
        att => att.date === selectedDate && 
               att.className === selectedClass &&
               (!selectedSection || att.sectionName === selectedSection)
      );
      
      if (existingAttendance) {
        const initialData = {};
        const initialRemarks = {};
        existingAttendance.students?.forEach(student => {
          initialData[student.studentId] = student.status;
          if (student.remarks) {
            initialRemarks[student.studentId] = student.remarks;
          }
        });
        setAttendanceData(initialData);
        setRemarks(initialRemarks);
      } else {
        setAttendanceData({});
        setRemarks({});
      }
    }
  }, [selectedDate, selectedClass, selectedSection, attendance]);

  // Set default academic year
  useEffect(() => {
    if (currentYearId && !selectedAcademicYear) {
      setSelectedAcademicYear(currentYearId);
    }
  }, [currentYearId, selectedAcademicYear]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleRemarksChange = (studentId, value) => {
    setRemarks(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const handleBulkAction = (status) => {
    const newData = {};
    filteredStudents.forEach(student => {
      newData[student.id] = status;
    });
    setAttendanceData(prev => ({ ...prev, ...newData }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedClass || !selectedDate) {
      alert('Please select class and date');
      return;
    }

    const selectedSectionObj = sections.find(s => s.id === parseInt(selectedSection));
    const selectedAcademicYearObj = academicYears.find(ay => ay.id === parseInt(selectedAcademicYear));

    // Check if attendance already exists
    const existingAttendance = attendance.find(
      att => att.date === selectedDate && 
             att.className === selectedClass &&
             (!selectedSection || att.sectionName === (selectedSectionObj?.name || ''))
    );

    const attendanceRecord = {
      academicYearId: selectedAcademicYear,
      academicYearName: selectedAcademicYearObj?.name || '',
      className: selectedClass,
      sectionId: selectedSection || null,
      sectionName: selectedSectionObj?.name || '',
      date: selectedDate,
      students: filteredStudents.map(student => ({
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        admissionNo: student.admissionNo,
        status: attendanceData[student.id] || 'Absent',
        remarks: remarks[student.id] || ''
      })),
      totalStudents: filteredStudents.length,
      present: filteredStudents.filter(s => attendanceData[s.id] === 'Present').length,
      absent: filteredStudents.filter(s => attendanceData[s.id] === 'Absent').length,
      leave: filteredStudents.filter(s => attendanceData[s.id] === 'Leave').length,
      status: 'Active'
    };

    if (existingAttendance) {
      if (window.confirm('Attendance for this date already exists. Do you want to update it?')) {
        updateAttendance(existingAttendance.id, attendanceRecord);
        alert('Attendance updated successfully!');
      }
    } else {
      addAttendance(attendanceRecord);
      alert('Attendance marked successfully!');
    }
  };

  // Get attendance statistics
  const getAttendanceStats = () => {
    const present = filteredStudents.filter(s => attendanceData[s.id] === 'Present').length;
    const absent = filteredStudents.filter(s => attendanceData[s.id] === 'Absent').length;
    const leave = filteredStudents.filter(s => attendanceData[s.id] === 'Leave').length;
    const total = filteredStudents.length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    return { present, absent, leave, total, percentage };
  };

  const stats = getAttendanceStats();

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Student Attendance</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/attendance">Attendance</Link></li>
              <li className="breadcrumb-item active">Student Attendance</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Total Students</h6>
                  <h4 className="mb-0">{stats.total}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Present</h6>
                  <h4 className="mb-0 text-success">{stats.present}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Absent</h6>
                  <h4 className="mb-0 text-danger">{stats.absent}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Attendance %</h6>
                  <h4 className="mb-0 text-primary">{stats.percentage}%</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Mark Student Attendance</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-3">
                        <label className="form-label">
                          Academic Year <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={selectedAcademicYear}
                          onChange={(e) => {
                            setSelectedAcademicYear(e.target.value);
                            setSelectedClass('');
                            setSelectedSection('');
                          }}
                        >
                          <option value="">Select Academic Year</option>
                          {academicYears.map(ay => (
                            <option key={ay.id} value={ay.id}>
                              {ay.name} {ay.isCurrent && '(Current)'}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">
                          Class <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={selectedClass}
                          onChange={(e) => {
                            setSelectedClass(e.target.value);
                            setSelectedSection('');
                          }}
                          disabled={!selectedAcademicYear}
                        >
                          <option value="">Select Class</option>
                          {classes.map(cls => (
                            <option key={cls.id} value={cls.name}>{cls.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Section (Optional)</label>
                        <select
                          className="form-select"
                          value={selectedSection}
                          onChange={(e) => setSelectedSection(e.target.value)}
                          disabled={!selectedClass}
                        >
                          <option value="">All Sections</option>
                          {availableSections.map(section => (
                            <option key={section.id} value={section.id}>{section.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">
                          Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    {selectedClass && (
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name or admission number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <div className="btn-group" role="group">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleBulkAction('Present')}
                            >
                              Mark All Present
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleBulkAction('Absent')}
                            >
                              Mark All Absent
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => handleBulkAction('Leave')}
                            >
                              Mark All Leave
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {filteredStudents.length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-hover table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th style={{ width: '50px' }}>#</th>
                              <th>Admission No</th>
                              <th>Student Name</th>
                              <th style={{ width: '100px' }}>Present</th>
                              <th style={{ width: '100px' }}>Absent</th>
                              <th style={{ width: '100px' }}>Leave</th>
                              <th>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredStudents.map((student, index) => (
                              <tr key={student.id}>
                                <td>{index + 1}</td>
                                <td><strong>{student.admissionNo}</strong></td>
                                <td>{student.firstName} {student.lastName}</td>
                                <td className="text-center">
                                  <input
                                    type="radio"
                                    name={`attendance_${student.id}`}
                                    value="Present"
                                    checked={attendanceData[student.id] === 'Present'}
                                    onChange={() => handleAttendanceChange(student.id, 'Present')}
                                    className="form-check-input"
                                  />
                                </td>
                                <td className="text-center">
                                  <input
                                    type="radio"
                                    name={`attendance_${student.id}`}
                                    value="Absent"
                                    checked={attendanceData[student.id] === 'Absent'}
                                    onChange={() => handleAttendanceChange(student.id, 'Absent')}
                                    className="form-check-input"
                                  />
                                </td>
                                <td className="text-center">
                                  <input
                                    type="radio"
                                    name={`attendance_${student.id}`}
                                    value="Leave"
                                    checked={attendanceData[student.id] === 'Leave'}
                                    onChange={() => handleAttendanceChange(student.id, 'Leave')}
                                    className="form-check-input"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Remarks (optional)"
                                    value={remarks[student.id] || ''}
                                    onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="text-end mt-3">
                          <button type="submit" className="btn btn-primary btn-lg">
                            <i className="bi bi-save"></i> Save Attendance
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedClass && filteredStudents.length === 0 && (
                      <div className="alert alert-info">
                        No students found for the selected class and section.
                      </div>
                    )}
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

export default StudentAttendance;

