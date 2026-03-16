import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const Classes = () => {
  const { classes, deleteClass } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteClass(id);
    }
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Classes & Sections</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Classes</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">All Classes</h5>
                    <Link to="/classes/add" className="btn btn-primary">
                      <i className="bi bi-plus-circle"></i> Add New Class
                    </Link>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input type="text" className="form-control" placeholder="Search classes..."
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Class Name</th>
                          <th>Sections</th>
                          <th>Capacity</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClasses.length === 0 ? (
                          <tr><td colSpan="4" className="text-center"><p className="text-muted">No classes found</p></td></tr>
                        ) : (
                          filteredClasses.map((cls) => (
                            <tr key={cls.id}>
                              <td>{cls.name}</td>
                              <td>{cls.sections.join(', ')}</td>
                              <td>{cls.capacity}</td>
                              <td>
                                <Link to={`/classes/edit/${cls.id}`} className="btn btn-sm btn-primary me-1">
                                  <i className="bi bi-pencil"></i>
                                </Link>
                                <button className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(cls.id, cls.name)}>
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

export default Classes;

