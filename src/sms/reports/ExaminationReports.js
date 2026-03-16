import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const ExaminationReports = () => {
  const { 
    students,
    classes,
    sections,
    examTypes,
    examSchedules,
    results,
    gradeConfigs
  } = useSchool();

  const [reportType, setReportType] = useState('summary');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedExamType, setSelectedExamType] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Summary Report
  const getSummaryReport = () => {
    const totalExams = examSchedules.length;
    const completedExams = examSchedules.filter(e => e.status === 'Completed').length;
    const scheduledExams = examSchedules.filter(e => e.status === 'Scheduled').length;
    const totalResults = results.length;
    const passed = results.filter(r => r.status === 'Pass').length;
    const failed = results.filter(r => r.status === 'Fail').length;
    const averagePercentage = results.length > 0
      ? (results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length).toFixed(1)
      : 0;

    return {
      totalExams,
      completedExams,
      scheduledExams,
      totalResults,
      passed,
      failed,
      averagePercentage
    };
  };

  // Class Performance Report
  const getClassPerformanceReport = () => {
    const classStats = {};
    
    results.forEach(result => {
      const student = students.find(s => s.id === result.studentId);
      if (!student) return;
      
      const className = student.class;
      if (!classStats[className]) {
        classStats[className] = {
          className,
          totalStudents: new Set(),
          totalResults: 0,
          totalMarks: 0,
          maxMarks: 0,
          passed: 0,
          failed: 0
        };
      }
      
      classStats[className].totalStudents.add(result.studentId);
      classStats[className].totalResults++;
      classStats[className].totalMarks += result.obtainedMarks || 0;
      classStats[className].maxMarks += result.maxMarks || 0;
      if (result.status === 'Pass') classStats[className].passed++;
      if (result.status === 'Fail') classStats[className].failed++;
    });

    return Object.values(classStats).map(stat => ({
      ...stat,
      totalStudents: stat.totalStudents.size,
      averagePercentage: stat.maxMarks > 0 ? ((stat.totalMarks / stat.maxMarks) * 100).toFixed(1) : 0,
      passRate: stat.totalResults > 0 ? ((stat.passed / stat.totalResults) * 100).toFixed(1) : 0
    })).sort((a, b) => a.className.localeCompare(b.className));
  };

  // Subject Performance Report
  const getSubjectPerformanceReport = () => {
    const subjectStats = {};
    
    results.forEach(result => {
      const subjectName = result.subjectName || 'Unknown';
      if (!subjectStats[subjectName]) {
        subjectStats[subjectName] = {
          subjectName,
          totalResults: 0,
          totalMarks: 0,
          maxMarks: 0,
          passed: 0,
          failed: 0,
          students: new Set()
        };
      }
      
      subjectStats[subjectName].totalResults++;
      subjectStats[subjectName].totalMarks += result.obtainedMarks || 0;
      subjectStats[subjectName].maxMarks += result.maxMarks || 0;
      subjectStats[subjectName].students.add(result.studentId);
      if (result.status === 'Pass') subjectStats[subjectName].passed++;
      if (result.status === 'Fail') subjectStats[subjectName].failed++;
    });

    return Object.values(subjectStats).map(stat => ({
      ...stat,
      totalStudents: stat.students.size,
      averagePercentage: stat.maxMarks > 0 ? ((stat.totalMarks / stat.maxMarks) * 100).toFixed(1) : 0,
      passRate: stat.totalResults > 0 ? ((stat.passed / stat.totalResults) * 100).toFixed(1) : 0
    })).sort((a, b) => parseFloat(b.averagePercentage) - parseFloat(a.averagePercentage));
  };

  // Top Performers Report
  const getTopPerformersReport = () => {
    const studentStats = {};
    
    results.forEach(result => {
      if (!studentStats[result.studentId]) {
        const student = students.find(s => s.id === result.studentId);
        studentStats[result.studentId] = {
          studentId: result.studentId,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
          admissionNo: student?.admissionNo || '',
          class: student?.class || '',
          totalMarks: 0,
          maxMarks: 0,
          examCount: 0
        };
      }
      
      studentStats[result.studentId].totalMarks += result.obtainedMarks || 0;
      studentStats[result.studentId].maxMarks += result.maxMarks || 0;
      studentStats[result.studentId].examCount++;
    });

    return Object.values(studentStats)
      .map(stat => ({
        ...stat,
        averagePercentage: stat.maxMarks > 0 ? ((stat.totalMarks / stat.maxMarks) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => parseFloat(b.averagePercentage) - parseFloat(a.averagePercentage))
      .slice(0, 10);
  };

  // Exam Schedule Report
  const getExamScheduleReport = () => {
    return examSchedules.map(schedule => {
      const scheduleResults = results.filter(r => r.examId === schedule.id);
      const totalStudents = scheduleResults.length;
      const appeared = scheduleResults.length;
      const passed = scheduleResults.filter(r => r.status === 'Pass').length;
      const failed = scheduleResults.filter(r => r.status === 'Fail').length;
      const averagePercentage = scheduleResults.length > 0
        ? (scheduleResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / scheduleResults.length).toFixed(1)
        : 0;

      return {
        ...schedule,
        totalStudents,
        appeared,
        passed,
        failed,
        averagePercentage: parseFloat(averagePercentage)
      };
    }).sort((a, b) => new Date(b.examDate) - new Date(a.examDate));
  };

  const summary = getSummaryReport();
  const classPerformance = getClassPerformanceReport();
  const subjectPerformance = getSubjectPerformanceReport();
  const topPerformers = getTopPerformersReport();
  const examSchedule = getExamScheduleReport();

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Examination Reports</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/reports">Reports</Link></li>
              <li className="breadcrumb-item active">Examination Reports</li>
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
                        <option value="class">Class Performance</option>
                        <option value="subject">Subject Performance</option>
                        <option value="top">Top Performers</option>
                        <option value="schedule">Exam Schedule</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Class</label>
                      <select
                        className="form-select"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        <option value="All">All Classes</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.name}>{cls.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Exam Type</label>
                      <select
                        className="form-select"
                        value={selectedExamType}
                        onChange={(e) => setSelectedExamType(e.target.value)}
                      >
                        <option value="All">All Types</option>
                        {examTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
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
                      <h6 className="text-muted mb-1">Total Exams</h6>
                      <h4 className="mb-0">{summary.totalExams}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6 className="text-muted mb-1">Completed</h6>
                      <h4 className="mb-0 text-success">{summary.completedExams}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6 className="text-muted mb-1">Scheduled</h6>
                      <h4 className="mb-0 text-warning">{summary.scheduledExams}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6 className="text-muted mb-1">Average %</h6>
                      <h4 className="mb-0 text-primary">{summary.averagePercentage}%</h4>
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
                              <td><strong>Total Exams</strong></td>
                              <td>{summary.totalExams}</td>
                            </tr>
                            <tr>
                              <td><strong>Completed Exams</strong></td>
                              <td className="text-success">{summary.completedExams}</td>
                            </tr>
                            <tr>
                              <td><strong>Scheduled Exams</strong></td>
                              <td className="text-warning">{summary.scheduledExams}</td>
                            </tr>
                            <tr>
                              <td><strong>Total Results</strong></td>
                              <td>{summary.totalResults}</td>
                            </tr>
                            <tr>
                              <td><strong>Passed</strong></td>
                              <td className="text-success">{summary.passed}</td>
                            </tr>
                            <tr>
                              <td><strong>Failed</strong></td>
                              <td className="text-danger">{summary.failed}</td>
                            </tr>
                            <tr>
                              <td><strong>Average Percentage</strong></td>
                              <td>{summary.averagePercentage}%</td>
                            </tr>
                            <tr>
                              <td><strong>Pass Rate</strong></td>
                              <td>
                                {summary.totalResults > 0 
                                  ? ((summary.passed / summary.totalResults) * 100).toFixed(1) 
                                  : 0}%
                              </td>
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

          {reportType === 'class' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Class Performance Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Class</th>
                            <th>Students</th>
                            <th>Total Results</th>
                            <th>Average %</th>
                            <th>Passed</th>
                            <th>Failed</th>
                            <th>Pass Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {classPerformance.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center text-muted">
                                No data available
                              </td>
                            </tr>
                          ) : (
                            classPerformance.map((classData, index) => (
                              <tr key={index}>
                                <td><strong>{classData.className}</strong></td>
                                <td>{classData.totalStudents}</td>
                                <td>{classData.totalResults}</td>
                                <td>{classData.averagePercentage}%</td>
                                <td className="text-success">{classData.passed}</td>
                                <td className="text-danger">{classData.failed}</td>
                                <td>
                                  <span className={`badge ${parseFloat(classData.passRate) >= 75 ? 'bg-success' : parseFloat(classData.passRate) >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                    {classData.passRate}%
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

          {reportType === 'subject' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Subject Performance Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Subject</th>
                            <th>Students</th>
                            <th>Total Results</th>
                            <th>Average %</th>
                            <th>Passed</th>
                            <th>Failed</th>
                            <th>Pass Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjectPerformance.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center text-muted">
                                No data available
                              </td>
                            </tr>
                          ) : (
                            subjectPerformance.map((subject, index) => (
                              <tr key={index}>
                                <td><strong>{subject.subjectName}</strong></td>
                                <td>{subject.totalStudents}</td>
                                <td>{subject.totalResults}</td>
                                <td>{subject.averagePercentage}%</td>
                                <td className="text-success">{subject.passed}</td>
                                <td className="text-danger">{subject.failed}</td>
                                <td>
                                  <span className={`badge ${parseFloat(subject.passRate) >= 75 ? 'bg-success' : parseFloat(subject.passRate) >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                    {subject.passRate}%
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

          {reportType === 'top' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Top 10 Performers</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Rank</th>
                            <th>Admission No</th>
                            <th>Student Name</th>
                            <th>Class</th>
                            <th>Exams</th>
                            <th>Average %</th>
                            <th>Performance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topPerformers.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center text-muted">
                                No data available
                              </td>
                            </tr>
                          ) : (
                            topPerformers.map((student, index) => (
                              <tr key={student.studentId}>
                                <td><strong>#{index + 1}</strong></td>
                                <td><strong>{student.admissionNo}</strong></td>
                                <td>{student.studentName}</td>
                                <td>{student.class}</td>
                                <td>{student.examCount}</td>
                                <td>{student.averagePercentage}%</td>
                                <td>
                                  <span className={`badge ${
                                    parseFloat(student.averagePercentage) >= 90 ? 'bg-success' :
                                    parseFloat(student.averagePercentage) >= 75 ? 'bg-info' :
                                    parseFloat(student.averagePercentage) >= 60 ? 'bg-warning' :
                                    'bg-danger'
                                  }`}>
                                    {parseFloat(student.averagePercentage) >= 90 ? 'Excellent' :
                                     parseFloat(student.averagePercentage) >= 75 ? 'Good' :
                                     parseFloat(student.averagePercentage) >= 60 ? 'Average' : 'Poor'}
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

          {reportType === 'schedule' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Exam Schedule Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Exam Name</th>
                            <th>Subject</th>
                            <th>Class</th>
                            <th>Date</th>
                            <th>Students</th>
                            <th>Appeared</th>
                            <th>Passed</th>
                            <th>Failed</th>
                            <th>Average %</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {examSchedule.length === 0 ? (
                            <tr>
                              <td colSpan="10" className="text-center text-muted">
                                No exam schedule data available
                              </td>
                            </tr>
                          ) : (
                            examSchedule.map((exam) => (
                              <tr key={exam.id}>
                                <td><strong>{exam.examName || exam.examTypeName}</strong></td>
                                <td>{exam.subjectName}</td>
                                <td>{exam.className}</td>
                                <td>{exam.examDate ? new Date(exam.examDate).toLocaleDateString() : '-'}</td>
                                <td>{exam.totalStudents}</td>
                                <td>{exam.appeared}</td>
                                <td className="text-success">{exam.passed}</td>
                                <td className="text-danger">{exam.failed}</td>
                                <td>{exam.averagePercentage}%</td>
                                <td>
                                  <span className={`badge ${
                                    exam.status === 'Completed' ? 'bg-success' :
                                    exam.status === 'Scheduled' ? 'bg-warning' :
                                    'bg-secondary'
                                  }`}>
                                    {exam.status}
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

export default ExaminationReports;

