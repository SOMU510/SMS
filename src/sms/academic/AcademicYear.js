import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const AcademicYear = () => {
  const { academicYears, deleteAcademicYear } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredYears = academicYears.filter(year =>
    year.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    year.startDate.includes(searchTerm) ||
    year.endDate.includes(searchTerm)
  );

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteAcademicYear(id);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return <span className="badge bg-success">Active</span>;
    } else if (status === 'Upcoming') {
      return <span className="badge bg-info">Upcoming</span>;
    } else {
      return <span className="badge bg-secondary">Completed</span>;
    }
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Academic Year</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Academic Year</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">All Academic Years</h5>
                    <Link to="/academic/year/add" className="btn btn-primary">
                      <i className="bi bi-plus-circle"></i> Add New Academic Year
                    </Link>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search academic years..."
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Academic Year</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Status</th>
                          <th>Is Current</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredYears.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center">
                              <p className="text-muted">No academic years found</p>
                            </td>
                          </tr>
                        ) : (
                          filteredYears.map((year) => (
                            <tr key={year.id}>
                              <td>
                                <strong>{year.name}</strong>
                                {year.description && (
                                  <>
                                    <br />
                                    <small className="text-muted">{year.description}</small>
                                  </>
                                )}
                              </td>
                              <td>{new Date(year.startDate).toLocaleDateString()}</td>
                              <td>{new Date(year.endDate).toLocaleDateString()}</td>
                              <td>{getStatusBadge(year.status)}</td>
                              <td>
                                {year.isCurrent ? (
                                  <span className="badge bg-primary">Current</span>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                              <td>
                                <Link 
                                  to={`/academic/year/edit/${year.id}`} 
                                  className="btn btn-sm btn-primary me-1"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Link>
                                <button 
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(year.id, year.name)}
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

export default AcademicYear;

