import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const Sections = () => {
  const { sections, classes, deleteSection } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSections = sections.filter(section =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.className?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete section ${name}?`)) {
      deleteSection(id);
    }
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Sections</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Sections</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">All Sections</h5>
                    <Link to="/academic/sections/add" className="btn btn-primary">
                      <i className="bi bi-plus-circle"></i> Add New Section
                    </Link>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search sections..."
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Section Name</th>
                          <th>Class</th>
                          <th>Capacity</th>
                          <th>Current Students</th>
                          <th>Class Teacher</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSections.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center">
                              <p className="text-muted">No sections found</p>
                            </td>
                          </tr>
                        ) : (
                          filteredSections.map((section) => (
                            <tr key={section.id}>
                              <td>
                                <strong>{section.name}</strong>
                                {section.description && (
                                  <>
                                    <br />
                                    <small className="text-muted">{section.description}</small>
                                  </>
                                )}
                              </td>
                              <td>{section.className || '-'}</td>
                              <td>{section.capacity || '-'}</td>
                              <td>{section.currentStudents || 0}</td>
                              <td>{section.classTeacher || '-'}</td>
                              <td>
                                {section.status === 'Active' ? (
                                  <span className="badge bg-success">Active</span>
                                ) : (
                                  <span className="badge bg-secondary">Inactive</span>
                                )}
                              </td>
                              <td>
                                <Link 
                                  to={`/academic/sections/edit/${section.id}`} 
                                  className="btn btn-sm btn-primary me-1"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Link>
                                <button 
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(section.id, section.name)}
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

export default Sections;

