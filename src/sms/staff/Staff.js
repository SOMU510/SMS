import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const Staff = () => {
  const { staff, deleteStaff } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Filter staff based on search term and type
  let filteredStaff = staff.filter(member =>
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply type filter
  if (filterType !== 'All') {
    filteredStaff = filteredStaff.filter(member => member.staffType === filterType);
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteStaff(id);
    }
  };

  const getStaffTypeBadge = (staffType) => {
    const badges = {
      'Teacher': 'bg-primary',
      'Principal': 'bg-danger',
      'Vice Principal': 'bg-warning',
      'Administrator': 'bg-info',
      'Accountant': 'bg-success',
      'Librarian': 'bg-secondary',
      'Lab Assistant': 'bg-dark',
      'Security': 'bg-secondary',
      'Maintenance': 'bg-secondary',
      'Other': 'bg-secondary'
    };
    return badges[staffType] || 'bg-secondary';
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return <span className="badge bg-success">Active</span>;
    } else if (status === 'Inactive') {
      return <span className="badge bg-secondary">Inactive</span>;
    } else {
      return <span className="badge bg-warning">On Leave</span>;
    }
  };

  // Get unique staff types for filter
  const uniqueStaffTypes = [...new Set(staff.map(s => s.staffType))].sort();

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Staff List</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Staff</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">All Staff Members</h5>
                    <Link to="/staff/add" className="btn btn-primary">
                      <i className="bi bi-plus-circle"></i> Add New Staff
                    </Link>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search staff by name, email, employee ID, designation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-select"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                        <option value="All">All Staff Types</option>
                        {uniqueStaffTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <div className="text-muted">
                        Total: <strong>{filteredStaff.length}</strong> staff member(s)
                      </div>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Employee ID</th>
                          <th>Name</th>
                          <th>Staff Type</th>
                          <th>Designation</th>
                          <th>Department</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Joining Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStaff.length === 0 ? (
                          <tr>
                            <td colSpan="10" className="text-center">
                              <p className="text-muted">No staff members found</p>
                            </td>
                          </tr>
                        ) : (
                          filteredStaff.map((member) => (
                            <tr key={member.id}>
                              <td>
                                <strong>{member.employeeId || '-'}</strong>
                              </td>
                              <td>
                                <strong>
                                  {member.firstName} {member.middleName} {member.lastName}
                                </strong>
                                {member.subject && (
                                  <>
                                    <br />
                                    <small className="text-muted">Subject: {member.subject}</small>
                                  </>
                                )}
                              </td>
                              <td>
                                <span className={`badge ${getStaffTypeBadge(member.staffType)}`}>
                                  {member.staffType || '-'}
                                </span>
                              </td>
                              <td>{member.designation || '-'}</td>
                              <td>{member.department || '-'}</td>
                              <td>{member.email || '-'}</td>
                              <td>{member.phone || '-'}</td>
                              <td>
                                {member.joiningDate
                                  ? new Date(member.joiningDate).toLocaleDateString()
                                  : '-'}
                              </td>
                              <td>{getStatusBadge(member.status)}</td>
                              <td>
                                <Link
                                  to={`/staff/edit/${member.id}`}
                                  className="btn btn-sm btn-primary me-1"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Link>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() =>
                                    handleDelete(
                                      member.id,
                                      `${member.firstName} ${member.lastName}`
                                    )
                                  }
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

export default Staff;

