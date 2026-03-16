import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const AttendanceReports = () => {
  const { 
    students, 
    classes, 
    sections,
    academicYears,
    attendance
  } = useSchool();

  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('daily'); // 'daily', 'monthly', 'student'
  const [selectedStudent, setSelectedStudent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Get current academic year
  const currentAcademicYear = academicYears.find(ay => ay.isCurrent) || academicYears[0];
  const currentYearId = currentAcademicYear?.id;

  // Filter sections based on selected class
  const selectedClassObj = classes.find(c => c.name === selectedClass);
  const availableSections = selectedClass && selectedClassObj
    ? sections.filter(s => s.className === selectedClass)
    : [];

  // Filter students
  let filteredStudents = students.filter(s => {
    const matchesClass = !selectedClass || s.class === selectedClass;
    const matchesSection = !selectedSection || s.section === selectedSection;
    const matchesSearch = !searchTerm || 
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSection && matchesSearch;
  });

  // Set default academic year
  useEffect(() => {
    if (currentYearId && !selectedAcademicYear) {
      setSelectedAcademicYear(currentYearId);
    }
  }, [currentYearId, selectedAcademicYear]);

  // Filter attendance records
  let filteredAttendance = attendance.filter(att => {
    const matchesYear = !selectedAcademicYear || att.academicYearId === parseInt(selectedAcademicYear);
    const matchesClass = !selectedClass || att.className === selectedClass;
    const matchesSection = !selectedSection || att.sectionName === selectedSection;
    const matchesStartDate = !startDate || att.date >= startDate;
    const matchesEndDate = !endDate || att.date <= endDate;
    return matchesYear && matchesClass && matchesSection && matchesStartDate && matchesEndDate;
  });

  // Calculate student attendance statistics
  const getStudentAttendanceStats = (studentId) => {
    const studentAttendances = filteredAttendance.filter(att => {
      return att.students?.some(s => s.studentId === studentId);
    });

    let present = 0;
    let absent = 0;
    let leave = 0;
    let total = studentAttendances.length;

    studentAttendances.forEach(att => {
      const studentData = att.students?.find(s => s.studentId === studentId);
      if (studentData) {
        if (studentData.status === 'Present') present++;
        else if (studentData.status === 'Absent') absent++;
        else if (studentData.status === 'Leave') leave++;
      }
    });

    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    return { present, absent, leave, total, percentage };
  };

  // Get daily attendance summary
  const getDailySummary = () => {
    const summary = {};
    filteredAttendance.forEach(att => {
      if (!summary[att.date]) {
        summary[att.date] = {
          date: att.date,
          total: 0,
          present: 0,
          absent: 0,
          leave: 0
        };
      }
      summary[att.date].total += att.totalStudents || 0;
      summary[att.date].present += att.present || 0;
      summary[att.date].absent += att.absent || 0;
      summary[att.date].leave += att.leave || 0;
    });
    return Object.values(summary).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const dailySummary = getDailySummary();

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Attendance Reports</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/attendance">Attendance</Link></li>
              <li className="breadcrumb-item active">Reports</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Filter Options</h5>
                  <div className="row">
                    <div className="col-md-3">
                      <label className="form-label">Academic Year</label>
                      <select
                        className="form-select"
                        value={selectedAcademicYear}
                        onChange={(e) => {
                          setSelectedAcademicYear(e.target.value);
                          setSelectedClass('');
                          setSelectedSection('');
                        }}
                      >
                        <option value="">All Academic Years</option>
                        {academicYears.map(ay => (
                          <option key={ay.id} value={ay.id}>
                            {ay.name} {ay.isCurrent && '(Current)'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Class</label>
                      <select
                        className="form-select"
                        value={selectedClass}
                        onChange={(e) => {
                          setSelectedClass(e.target.value);
                          setSelectedSection('');
                        }}
                      >
                        <option value="">All Classes</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.name}>{cls.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Section</label>
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
                      <label className="form-label">Report Type</label>
                      <select
                        className="form-select"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                      >
                        <option value="daily">Daily Summary</option>
                        <option value="student">Student-wise</option>
                        <option value="monthly">Monthly Summary</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-3">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Search Student</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name or admission no..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {reportType === 'daily' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Daily Attendance Summary</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Total Students</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Leave</th>
                            <th>Attendance %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dailySummary.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="text-center text-muted">
                                No attendance records found
                              </td>
                            </tr>
                          ) : (
                            dailySummary.map((summary, index) => {
                              const percentage = summary.total > 0 
                                ? ((summary.present / summary.total) * 100).toFixed(1) 
                                : 0;
                              return (
                                <tr key={index}>
                                  <td>{new Date(summary.date).toLocaleDateString()}</td>
                                  <td>{summary.total}</td>
                                  <td className="text-success">{summary.present}</td>
                                  <td className="text-danger">{summary.absent}</td>
                                  <td className="text-warning">{summary.leave}</td>
                                  <td>
                                    <span className={`badge ${percentage >= 75 ? 'bg-success' : percentage >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                      {percentage}%
                                    </span>
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
          )}

          {reportType === 'student' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Student-wise Attendance Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Admission No</th>
                            <th>Student Name</th>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Total Days</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Leave</th>
                            <th>Attendance %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.length === 0 ? (
                            <tr>
                              <td colSpan="9" className="text-center text-muted">
                                No students found
                              </td>
                            </tr>
                          ) : (
                            filteredStudents.map((student) => {
                              const stats = getStudentAttendanceStats(student.id);
                              return (
                                <tr key={student.id}>
                                  <td><strong>{student.admissionNo}</strong></td>
                                  <td>{student.firstName} {student.lastName}</td>
                                  <td>{student.class}</td>
                                  <td>{student.section}</td>
                                  <td>{stats.total}</td>
                                  <td className="text-success">{stats.present}</td>
                                  <td className="text-danger">{stats.absent}</td>
                                  <td className="text-warning">{stats.leave}</td>
                                  <td>
                                    <span className={`badge ${stats.percentage >= 75 ? 'bg-success' : stats.percentage >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                      {stats.percentage}%
                                    </span>
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
          )}

          {reportType === 'monthly' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Monthly Attendance Summary</h5>
                    <div className="alert alert-info">
                      Monthly summary will show aggregated attendance data by month. This feature can be enhanced with charts and graphs.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AttendanceReports;

