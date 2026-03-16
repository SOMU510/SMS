import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';
import './Students.css';

const Students = () => {
  const { students, deleteStudent } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = filterClass === '' || student.class === filterClass;
    
    return matchesSearch && matchesClass;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteStudent(id);
    }
  };

  const uniqueClasses = [...new Set(students.map(s => s.class))].sort();

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Students</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active">Students</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">All Students</h5>
                    <Link to="/students/add" className="btn btn-primary">
                      <i className="bi bi-plus-circle"></i> Add New Student
                    </Link>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name, admission no, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <select
                        className="form-select"
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                      >
                        <option value="">All Classes</option>
                        {uniqueClasses.map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Admission No</th>
                          <th>Name</th>
                          <th>Class</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Parent Name</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              <p className="text-muted">No students found</p>
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((student) => (
                            <tr key={student.id}>
                              <td>{student.admissionNo}</td>
                              <td>{student.firstName} {student.lastName}</td>
                              <td>{student.class}</td>
                              <td>{student.email}</td>
                              <td>{student.phone}</td>
                              <td>{student.parentName}</td>
                              <td>
                                <span className={`badge ${student.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                  {student.status}
                                </span>
                              </td>
                              <td>
                                <Link
                                  to={`/students/edit/${student.id}`}
                                  className="btn btn-sm btn-primary me-1"
                                  title="Edit"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Link>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
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

export default Students;

