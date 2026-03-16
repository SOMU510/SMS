import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';
import './Teachers.css';

const Teachers = () => {
  const { teachers, deleteTeacher } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeachers = teachers.filter(teacher =>
    teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteTeacher(id);
    }
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Teachers</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">Teachers</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">All Teachers</h5>
                    <Link to="/teachers/add" className="btn btn-primary">
                      <i className="bi bi-plus-circle"></i> Add New Teacher
                    </Link>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name, employee ID, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Employee ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Subject</th>
                          <th>Class</th>
                          <th>Qualification</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTeachers.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="text-center">
                              <p className="text-muted">No teachers found</p>
                            </td>
                          </tr>
                        ) : (
                          filteredTeachers.map((teacher) => (
                            <tr key={teacher.id}>
                              <td>{teacher.employeeId}</td>
                              <td>{teacher.firstName} {teacher.lastName}</td>
                              <td>{teacher.email}</td>
                              <td>{teacher.phone}</td>
                              <td>{teacher.subject}</td>
                              <td>{teacher.class}</td>
                              <td>{teacher.qualification}</td>
                              <td>
                                <span className={`badge ${teacher.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                  {teacher.status}
                                </span>
                              </td>
                              <td>
                                <Link
                                  to={`/staff/profiles/${teacher.id}`}
                                  className="btn btn-sm btn-info me-1"
                                  title="View Profile"
                                >
                                  <i className="bi bi-person"></i>
                                </Link>
                                <Link
                                  to={`/teachers/edit/${teacher.id}`}
                                  className="btn btn-sm btn-primary me-1"
                                  title="Edit"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Link>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(teacher.id, `${teacher.firstName} ${teacher.lastName}`)}
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
};

export default Teachers;

