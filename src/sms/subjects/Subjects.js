import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const Subjects = () => {
  const { subjects, deleteSubject } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteSubject(id);
    }
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Subjects</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Subjects</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">All Subjects</h5>
                    <Link to="/subjects/add" className="btn btn-primary">
                      <i className="bi bi-plus-circle"></i> Add New Subject
                    </Link>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input type="text" className="form-control" placeholder="Search subjects..."
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Subject Code</th>
                          <th>Subject Name</th>
                          <th>Class</th>
                          <th>Teacher</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubjects.length === 0 ? (
                          <tr><td colSpan="5" className="text-center"><p className="text-muted">No subjects found</p></td></tr>
                        ) : (
                          filteredSubjects.map((subject) => (
                            <tr key={subject.id}>
                              <td>{subject.code}</td>
                              <td>{subject.name}</td>
                              <td>{subject.class}</td>
                              <td>{subject.teacher}</td>
                              <td>
                                <Link to={`/subjects/edit/${subject.id}`} className="btn btn-sm btn-primary me-1">
                                  <i className="bi bi-pencil"></i>
                                </Link>
                                <button className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(subject.id, subject.name)}>
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

export default Subjects;

