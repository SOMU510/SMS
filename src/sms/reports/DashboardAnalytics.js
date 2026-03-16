import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const DashboardAnalytics = () => {
  const { 
    students,
    teachers,
    classes,
    subjects,
    fees,
    attendance,
    bookIssues,
    vehicles,
    routes
  } = useSchool();

  const [selectedPeriod, setSelectedPeriod] = useState('This Month'); // This Month, This Year, All Time
  const [selectedClass, setSelectedClass] = useState('All');

  // Calculate statistics
  const getStatistics = () => {
    const totalStudents = students.length;
    const totalTeachers = teachers.length;
    const totalClasses = classes.length;
    const totalSubjects = subjects.length;
    
    // Fee statistics
    const totalFees = fees.length;
    const paidFees = fees.filter(f => f.status === 'Paid').length;
    const pendingFees = fees.filter(f => f.status === 'Pending').length;
    const totalFeeAmount = fees.reduce((sum, f) => sum + (f.amount || 0), 0);
    const paidFeeAmount = fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + (f.amount || 0), 0);
    const pendingFeeAmount = fees.filter(f => f.status === 'Pending').reduce((sum, f) => sum + (f.amount || 0), 0);
    const feeCollectionRate = totalFeeAmount > 0 ? ((paidFeeAmount / totalFeeAmount) * 100).toFixed(1) : 0;

    // Attendance statistics
    const totalAttendanceRecords = attendance.length;
    const presentRecords = attendance.filter(a => a.status === 'Present').length;
    const absentRecords = attendance.filter(a => a.status === 'Absent').length;
    const attendanceRate = totalAttendanceRecords > 0 ? ((presentRecords / totalAttendanceRecords) * 100).toFixed(1) : 0;

    // Library statistics
    const totalBooks = bookIssues.length;
    const activeIssues = bookIssues.filter(i => i.status === 'Issued' || i.status === 'Overdue').length;
    const returnedBooks = bookIssues.filter(i => i.status === 'Returned').length;

    // Transport statistics
    const activeVehicles = vehicles.filter(v => v.status === 'Active').length;
    const activeRoutes = routes.filter(r => r.status === 'Active').length;

    return {
      totalStudents,
      totalTeachers,
      totalClasses,
      totalSubjects,
      totalFees,
      paidFees,
      pendingFees,
      totalFeeAmount,
      paidFeeAmount,
      pendingFeeAmount,
      feeCollectionRate,
      totalAttendanceRecords,
      presentRecords,
      absentRecords,
      attendanceRate,
      totalBooks,
      activeIssues,
      returnedBooks,
      activeVehicles,
      activeRoutes
    };
  };

  // Class-wise student distribution
  const getClassDistribution = () => {
    const classStats = {};
    students.forEach(student => {
      if (!classStats[student.class]) {
        classStats[student.class] = 0;
      }
      classStats[student.class]++;
    });
    return Object.keys(classStats).map(className => ({
      className,
      count: classStats[className]
    })).sort((a, b) => a.className.localeCompare(b.className));
  };

  // Recent activities
  const getRecentActivities = () => {
    const activities = [];
    
    // Recent fee payments
    fees.filter(f => f.status === 'Paid')
      .slice(-5)
      .forEach(fee => {
        activities.push({
          type: 'Fee Payment',
          description: `${fee.studentName} paid ₹${fee.amount}`,
          date: fee.paidDate || new Date().toISOString().split('T')[0],
          icon: 'bi-cash-coin',
          color: 'success'
        });
      });

    // Recent book issues
    bookIssues.slice(-5).forEach(issue => {
      activities.push({
        type: 'Book Issue',
        description: `${issue.borrowerName} issued "${issue.bookTitle}"`,
        date: issue.issueDate || new Date().toISOString().split('T')[0],
        icon: 'bi-book',
        color: 'info'
      });
    });

    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  };

  const stats = getStatistics();
  const classDistribution = getClassDistribution();
  const recentActivities = getRecentActivities();

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Dashboard Analytics</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/reports">Reports</Link></li>
              <li className="breadcrumb-item active">Dashboard Analytics</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3">
                      <label className="form-label">Time Period</label>
                      <select
                        className="form-select"
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                      >
                        <option value="This Month">This Month</option>
                        <option value="This Year">This Year</option>
                        <option value="All Time">All Time</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Filter by Class</label>
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
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center bg-primary text-white me-3" style={{ width: '50px', height: '50px' }}>
                      <i className="bi bi-people fs-4"></i>
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Total Students</h6>
                      <h4 className="mb-0">{stats.totalStudents}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center bg-info text-white me-3" style={{ width: '50px', height: '50px' }}>
                      <i className="bi bi-person-badge fs-4"></i>
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Total Teachers</h6>
                      <h4 className="mb-0">{stats.totalTeachers}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center bg-success text-white me-3" style={{ width: '50px', height: '50px' }}>
                      <i className="bi bi-cash-coin fs-4"></i>
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Fee Collection</h6>
                      <h4 className="mb-0">{stats.feeCollectionRate}%</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center bg-warning text-white me-3" style={{ width: '50px', height: '50px' }}>
                      <i className="bi bi-clipboard-check fs-4"></i>
                    </div>
                    <div>
                      <h6 className="text-muted mb-1">Attendance Rate</h6>
                      <h4 className="mb-0">{stats.attendanceRate}%</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Financial Overview */}
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Financial Overview</h5>
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
                          <td>Total Fees</td>
                          <td>{stats.totalFees}</td>
                        </tr>
                        <tr className="table-success">
                          <td>Paid Fees</td>
                          <td>{stats.paidFees} (₹{stats.paidFeeAmount.toLocaleString()})</td>
                        </tr>
                        <tr className="table-warning">
                          <td>Pending Fees</td>
                          <td>{stats.pendingFees} (₹{stats.pendingFeeAmount.toLocaleString()})</td>
                        </tr>
                        <tr>
                          <td>Total Amount</td>
                          <td>₹{stats.totalFeeAmount.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td>Collection Rate</td>
                          <td>
                            <span className={`badge ${parseFloat(stats.feeCollectionRate) >= 75 ? 'bg-success' : parseFloat(stats.feeCollectionRate) >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                              {stats.feeCollectionRate}%
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Overview */}
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Attendance Overview</h5>
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
                          <td>Total Records</td>
                          <td>{stats.totalAttendanceRecords}</td>
                        </tr>
                        <tr className="table-success">
                          <td>Present</td>
                          <td>{stats.presentRecords}</td>
                        </tr>
                        <tr className="table-danger">
                          <td>Absent</td>
                          <td>{stats.absentRecords}</td>
                        </tr>
                        <tr>
                          <td>Attendance Rate</td>
                          <td>
                            <span className={`badge ${parseFloat(stats.attendanceRate) >= 90 ? 'bg-success' : parseFloat(stats.attendanceRate) >= 75 ? 'bg-warning' : 'bg-danger'}`}>
                              {stats.attendanceRate}%
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-3">
            {/* Class Distribution */}
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Student Distribution by Class</h5>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Class</th>
                          <th>Number of Students</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classDistribution.map((classData, index) => {
                          const percentage = stats.totalStudents > 0 
                            ? ((classData.count / stats.totalStudents) * 100).toFixed(1) 
                            : 0;
                          return (
                            <tr key={index}>
                              <td><strong>{classData.className}</strong></td>
                              <td>{classData.count}</td>
                              <td>
                                <div className="progress" style={{ height: '20px' }}>
                                  <div 
                                    className="progress-bar" 
                                    role="progressbar" 
                                    style={{ width: `${percentage}%` }}
                                  >
                                    {percentage}%
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* System Overview */}
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">System Overview</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>Component</th>
                          <th>Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Total Classes</td>
                          <td>{stats.totalClasses}</td>
                        </tr>
                        <tr>
                          <td>Total Subjects</td>
                          <td>{stats.totalSubjects}</td>
                        </tr>
                        <tr>
                          <td>Active Vehicles</td>
                          <td>{stats.activeVehicles}</td>
                        </tr>
                        <tr>
                          <td>Active Routes</td>
                          <td>{stats.activeRoutes}</td>
                        </tr>
                        <tr>
                          <td>Library Issues</td>
                          <td>{stats.activeIssues} active, {stats.returnedBooks} returned</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="row mt-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Recent Activities</h5>
                  <div className="list-group">
                    {recentActivities.length === 0 ? (
                      <div className="text-center text-muted p-3">No recent activities</div>
                    ) : (
                      recentActivities.map((activity, index) => (
                        <div key={index} className="list-group-item">
                          <div className="d-flex align-items-center">
                            <div className={`bg-${activity.color} text-white rounded-circle d-flex align-items-center justify-content-center me-3`} style={{ width: '40px', height: '40px' }}>
                              <i className={`bi ${activity.icon}`}></i>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1">{activity.type}</h6>
                              <p className="mb-0 text-muted">{activity.description}</p>
                            </div>
                            <div className="text-muted">
                              {new Date(activity.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default DashboardAnalytics;

