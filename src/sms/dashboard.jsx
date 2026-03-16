import React from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../context/SchoolContext';
import './dashboard.css';

const Dashboard = () => {
  const { students, teachers, classes, fees, exams } = useSchool();

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter(t => t.status === 'Active').length;
  const totalClasses = classes.length;
  const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
  const paidFees = fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
  const pendingFees = fees.filter(f => f.status === 'Pending').reduce((sum, f) => sum + f.amount, 0);
  const totalExams = exams.length;

  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      change: `${activeStudents} Active`,
      icon: 'bi-people',
      color: 'primary',
      link: '/students'
    },
    {
      title: 'Total Teachers',
      value: totalTeachers,
      change: `${activeTeachers} Active`,
      icon: 'bi-person-badge',
      color: 'success',
      link: '/teachers'
    },
    {
      title: 'Classes',
      value: totalClasses,
      change: 'All Sections',
      icon: 'bi-building',
      color: 'info',
      link: '/classes'
    },
    {
      title: 'Fee Collection',
      value: `₹${paidFees.toLocaleString()}`,
      change: `₹${pendingFees.toLocaleString()} Pending`,
      icon: 'bi-cash-coin',
      color: 'warning',
      link: '/fees'
    },
  ];

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Dashboard</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item active">Dashboard</li>
            </ol>
          </nav>
        </div>

        <section className="section dashboard">
        <div className="row">
          {stats.map((stat, index) => (
            <div key={index} className="col-lg-3 col-md-6 mb-4">
              <Link to={stat.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={`card info-card ${stat.title.toLowerCase().replace(/\s+/g, '-')}-card`}>
                  <div className="card-body">
                    <h5 className="card-title">
                      {stat.title}
                    </h5>
                    <div className="d-flex align-items-center">
                      <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                        <i className={`bi ${stat.icon}`}></i>
                      </div>
                      <div className="ps-3">
                        <h6 className="mb-0">{stat.value}</h6>
                        <span className="text-muted small pt-1">
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">
                      Recent Students
                    </h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Admission No</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.slice(0, 5).map((student) => (
                            <tr key={student.id}>
                              <td>{student.admissionNo}</td>
                              <td>{student.firstName} {student.lastName}</td>
                              <td>{student.class}</td>
                              <td>
                                <span className={`badge ${student.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                  {student.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {students.length > 5 && (
                        <div className="text-end">
                          <Link to="/students" className="btn btn-sm btn-primary">View All</Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

       
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Recent Fee Records</h5>
                <div className="table-responsive">
                  <table className="table table-borderless datatable">
                    <thead>
                      <tr>
                        <th scope="col">Student Name</th>
                        <th scope="col">Class</th>
                        <th scope="col">Fee Type</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Due Date</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.slice(0, 5).length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center">
                            <p className="text-muted">No fee records found</p>
                          </td>
                        </tr>
                      ) : (
                        fees.slice(0, 5).map((fee) => (
                          <tr key={fee.id}>
                            <td>{fee.studentName}</td>
                            <td>{fee.class}</td>
                            <td>{fee.feeType}</td>
                            <td>₹{fee.amount.toLocaleString()}</td>
                            <td>{fee.dueDate}</td>
                            <td>
                              <span className={`badge ${fee.status === 'Paid' ? 'bg-success' : 'bg-warning'}`}>
                                {fee.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {fees.length > 5 && (
                    <div className="text-end">
                      <Link to="/fees" className="btn btn-sm btn-primary">View All</Link>
                    </div>
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

export default Dashboard;

