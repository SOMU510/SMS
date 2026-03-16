import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const StudentReports = () => {
  const { 
    students,
    classes,
    sections,
    attendance,
    fees,
    results
  } = useSchool();

  const [reportType, setReportType] = useState('summary');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter students
  let filteredStudents = students;
  if (selectedClass !== 'All') {
    filteredStudents = filteredStudents.filter(s => s.class === selectedClass);
  }
  if (selectedSection !== 'All') {
    filteredStudents = filteredStudents.filter(s => s.section === selectedSection);
  }

  // Summary Report
  const getSummaryReport = () => {
    const total = filteredStudents.length;
    const male = filteredStudents.filter(s => s.gender === 'Male').length;
    const female = filteredStudents.filter(s => s.gender === 'Female').length;
    const active = filteredStudents.filter(s => s.status === 'Active').length;
    const inactive = filteredStudents.filter(s => s.status === 'Inactive').length;

    return { total, male, female, active, inactive };
  };

  // Class-wise Report
  const getClassWiseReport = () => {
    const classStats = {};
    students.forEach(student => {
      if (!classStats[student.class]) {
        classStats[student.class] = {
          className: student.class,
          total: 0,
          male: 0,
          female: 0,
          active: 0,
          inactive: 0
        };
      }
      classStats[student.class].total++;
      if (student.gender === 'Male') classStats[student.class].male++;
      if (student.gender === 'Female') classStats[student.class].female++;
      if (student.status === 'Active') classStats[student.class].active++;
      if (student.status === 'Inactive') classStats[student.class].inactive++;
    });
    return Object.values(classStats).sort((a, b) => a.className.localeCompare(b.className));
  };

  // Student Performance Report
  const getPerformanceReport = () => {
    return filteredStudents.map(student => {
      const studentResults = results.filter(r => r.studentId === student.id);
      const totalMarks = studentResults.reduce((sum, r) => sum + (r.obtainedMarks || 0), 0);
      const maxMarks = studentResults.reduce((sum, r) => sum + (r.maxMarks || 0), 0);
      const averagePercentage = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(1) : 0;
      const passed = studentResults.filter(r => r.status === 'Pass').length;
      const failed = studentResults.filter(r => r.status === 'Fail').length;

      return {
        ...student,
        totalExams: studentResults.length,
        averagePercentage: parseFloat(averagePercentage),
        passed,
        failed
      };
    }).sort((a, b) => b.averagePercentage - a.averagePercentage);
  };

  // Fee Status Report
  const getFeeStatusReport = () => {
    return filteredStudents.map(student => {
      const studentFees = fees.filter(f => f.studentId === student.id);
      const totalFees = studentFees.length;
      const paidFees = studentFees.filter(f => f.status === 'Paid').length;
      const pendingFees = studentFees.filter(f => f.status === 'Pending').length;
      const totalAmount = studentFees.reduce((sum, f) => sum + (f.amount || 0), 0);
      const paidAmount = studentFees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + (f.amount || 0), 0);
      const pendingAmount = studentFees.filter(f => f.status === 'Pending').reduce((sum, f) => sum + (f.amount || 0), 0);

      return {
        ...student,
        totalFees,
        paidFees,
        pendingFees,
        totalAmount,
        paidAmount,
        pendingAmount,
        collectionRate: totalAmount > 0 ? ((paidAmount / totalAmount) * 100).toFixed(1) : 0
      };
    });
  };

  // Attendance Report
  const getAttendanceReport = () => {
    return filteredStudents.map(student => {
      const studentAttendance = attendance.filter(a => a.studentId === student.id);
      const totalDays = studentAttendance.length;
      const presentDays = studentAttendance.filter(a => a.status === 'Present').length;
      const absentDays = studentAttendance.filter(a => a.status === 'Absent').length;
      const leaveDays = studentAttendance.filter(a => a.status === 'Leave').length;
      const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

      return {
        ...student,
        totalDays,
        presentDays,
        absentDays,
        leaveDays,
        attendancePercentage: parseFloat(attendancePercentage)
      };
    }).sort((a, b) => b.attendancePercentage - a.attendancePercentage);
  };

  const summary = getSummaryReport();
  const classWise = getClassWiseReport();
  const performance = getPerformanceReport();
  const feeStatus = getFeeStatusReport();
  const attendanceReport = getAttendanceReport();

  // Filter sections based on selected class
  const selectedClassObj = classes.find(c => c.name === selectedClass);
  const availableSections = selectedClass && selectedClassObj
    ? sections.filter(s => s.className === selectedClass)
    : [];

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Student Reports</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/reports">Reports</Link></li>
              <li className="breadcrumb-item active">Student Reports</li>
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
                      <label className="form-label">Report Type</label>
                      <select
                        className="form-select"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                      >
                        <option value="summary">Summary</option>
                        <option value="classwise">Class-wise</option>
                        <option value="performance">Performance</option>
                        <option value="fee">Fee Status</option>
                        <option value="attendance">Attendance</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Class</label>
                      <select
                        className="form-select"
                        value={selectedClass}
                        onChange={(e) => {
                          setSelectedClass(e.target.value);
                          setSelectedSection('All');
                        }}
                      >
                        <option value="All">All Classes</option>
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
                        disabled={selectedClass === 'All'}
                      >
                        <option value="All">All Sections</option>
                        {availableSections.map(section => (
                          <option key={section.id} value={section.name}>{section.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {reportType === 'summary' && (
            <>
              <div className="row mb-4">
                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6 className="text-muted mb-1">Total Students</h6>
                      <h4 className="mb-0">{summary.total}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6 className="text-muted mb-1">Male</h6>
                      <h4 className="mb-0 text-primary">{summary.male}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6 className="text-muted mb-1">Female</h6>
                      <h4 className="mb-0 text-info">{summary.female}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6 className="text-muted mb-1">Active</h6>
                      <h4 className="mb-0 text-success">{summary.active}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Summary Report</h5>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th>Metric</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><strong>Total Students</strong></td>
                              <td>{summary.total}</td>
                            </tr>
                            <tr>
                              <td><strong>Male Students</strong></td>
                              <td>{summary.male}</td>
                            </tr>
                            <tr>
                              <td><strong>Female Students</strong></td>
                              <td>{summary.female}</td>
                            </tr>
                            <tr>
                              <td><strong>Active Students</strong></td>
                              <td className="text-success">{summary.active}</td>
                            </tr>
                            <tr>
                              <td><strong>Inactive Students</strong></td>
                              <td className="text-secondary">{summary.inactive}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {reportType === 'classwise' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Class-wise Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Class</th>
                            <th>Total</th>
                            <th>Male</th>
                            <th>Female</th>
                            <th>Active</th>
                            <th>Inactive</th>
                          </tr>
                        </thead>
                        <tbody>
                          {classWise.map((classData, index) => (
                            <tr key={index}>
                              <td><strong>{classData.className}</strong></td>
                              <td>{classData.total}</td>
                              <td>{classData.male}</td>
                              <td>{classData.female}</td>
                              <td className="text-success">{classData.active}</td>
                              <td className="text-secondary">{classData.inactive}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'performance' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Student Performance Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Admission No</th>
                            <th>Student Name</th>
                            <th>Class</th>
                            <th>Total Exams</th>
                            <th>Average %</th>
                            <th>Passed</th>
                            <th>Failed</th>
                            <th>Performance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {performance.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="text-center text-muted">
                                No performance data available
                              </td>
                            </tr>
                          ) : (
                            performance.map((student) => (
                              <tr key={student.id}>
                                <td><strong>{student.admissionNo}</strong></td>
                                <td>{student.firstName} {student.lastName}</td>
                                <td>{student.class}</td>
                                <td>{student.totalExams || 0}</td>
                                <td>{student.averagePercentage || 0}%</td>
                                <td className="text-success">{student.passed || 0}</td>
                                <td className="text-danger">{student.failed || 0}</td>
                                <td>
                                  <span className={`badge ${
                                    student.averagePercentage >= 90 ? 'bg-success' :
                                    student.averagePercentage >= 75 ? 'bg-info' :
                                    student.averagePercentage >= 60 ? 'bg-warning' :
                                    'bg-danger'
                                  }`}>
                                    {student.averagePercentage >= 90 ? 'Excellent' :
                                     student.averagePercentage >= 75 ? 'Good' :
                                     student.averagePercentage >= 60 ? 'Average' : 'Poor'}
                                  </span>
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
          )}

          {reportType === 'fee' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Fee Status Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Admission No</th>
                            <th>Student Name</th>
                            <th>Class</th>
                            <th>Total Fees</th>
                            <th>Paid</th>
                            <th>Pending</th>
                            <th>Total Amount</th>
                            <th>Paid Amount</th>
                            <th>Pending Amount</th>
                            <th>Collection %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feeStatus.length === 0 ? (
                            <tr>
                              <td colSpan="10" className="text-center text-muted">
                                No fee data available
                              </td>
                            </tr>
                          ) : (
                            feeStatus.map((student) => (
                              <tr key={student.id}>
                                <td><strong>{student.admissionNo}</strong></td>
                                <td>{student.firstName} {student.lastName}</td>
                                <td>{student.class}</td>
                                <td>{student.totalFees || 0}</td>
                                <td className="text-success">{student.paidFees || 0}</td>
                                <td className="text-warning">{student.pendingFees || 0}</td>
                                <td>₹{student.totalAmount?.toLocaleString() || '0'}</td>
                                <td className="text-success">₹{student.paidAmount?.toLocaleString() || '0'}</td>
                                <td className="text-warning">₹{student.pendingAmount?.toLocaleString() || '0'}</td>
                                <td>
                                  <span className={`badge ${parseFloat(student.collectionRate) >= 75 ? 'bg-success' : parseFloat(student.collectionRate) >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                    {student.collectionRate}%
                                  </span>
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
          )}

          {reportType === 'attendance' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Attendance Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Admission No</th>
                            <th>Student Name</th>
                            <th>Class</th>
                            <th>Total Days</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Leave</th>
                            <th>Attendance %</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceReport.length === 0 ? (
                            <tr>
                              <td colSpan="9" className="text-center text-muted">
                                No attendance data available
                              </td>
                            </tr>
                          ) : (
                            attendanceReport.map((student) => (
                              <tr key={student.id}>
                                <td><strong>{student.admissionNo}</strong></td>
                                <td>{student.firstName} {student.lastName}</td>
                                <td>{student.class}</td>
                                <td>{student.totalDays || 0}</td>
                                <td className="text-success">{student.presentDays || 0}</td>
                                <td className="text-danger">{student.absentDays || 0}</td>
                                <td className="text-warning">{student.leaveDays || 0}</td>
                                <td>{student.attendancePercentage || 0}%</td>
                                <td>
                                  <span className={`badge ${
                                    student.attendancePercentage >= 90 ? 'bg-success' :
                                    student.attendancePercentage >= 75 ? 'bg-warning' :
                                    'bg-danger'
                                  }`}>
                                    {student.attendancePercentage >= 90 ? 'Good' :
                                     student.attendancePercentage >= 75 ? 'Average' : 'Poor'}
                                  </span>
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
          )}
        </section>
      </div>
    </main>
  );
};

export default StudentReports;

