import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const RoleAssignment = () => {
  const { 
    users,
    roles,
    updateUser
  } = useSchool();

  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  const handleAssignRole = () => {
    if (!selectedUser) {
      alert('Please select a user');
      return;
    }

    if (!selectedRole) {
      alert('Please select a role');
      return;
    }

    const user = users.find(u => u.id === parseInt(selectedUser));
    if (!user) {
      alert('User not found');
      return;
    }

    const role = roles.find(r => r.id === parseInt(selectedRole));
    if (!role) {
      alert('Role not found');
      return;
    }

    if (window.confirm(`Assign role "${role.name}" to user "${user.username}"?`)) {
      updateUser(parseInt(selectedUser), {
        ...user,
        roleId: parseInt(selectedRole)
      });
      alert('Role assigned successfully!');
      setSelectedUser('');
      setSelectedRole('');
    }
  };

  const handleBulkAssign = () => {
    if (!selectedRole) {
      alert('Please select a role');
      return;
    }

    const selectedUsers = filteredUsers.filter(u => 
      document.getElementById(`user-${u.id}`)?.checked
    ).map(u => u.id);

    if (selectedUsers.length === 0) {
      alert('Please select at least one user');
      return;
    }

    const role = roles.find(r => r.id === parseInt(selectedRole));
    if (window.confirm(`Assign role "${role.name}" to ${selectedUsers.length} user(s)?`)) {
      selectedUsers.forEach(userId => {
        const user = users.find(u => u.id === userId);
        if (user) {
          updateUser(userId, {
            ...user,
            roleId: parseInt(selectedRole)
          });
        }
      });
      alert(`Role assigned to ${selectedUsers.length} user(s) successfully!`);
    }
  };

  // Filter users
  let filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterRole !== 'All') {
    filteredUsers = filteredUsers.filter(u => u.roleId === parseInt(filterRole));
  }

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Role Assignment</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/users">User Management</Link></li>
              <li className="breadcrumb-item active">Role Assignment</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Assign Role to User</h5>
                  <div className="row">
                    <div className="col-md-5">
                      <label className="form-label">
                        Select User <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                      >
                        <option value="">Select User</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.username} - {user.firstName} {user.lastName} ({user.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-5">
                      <label className="form-label">
                        Select Role <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      >
                        <option value="">Select Role</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name} ({role.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">&nbsp;</label>
                      <button
                        className="btn btn-primary w-100"
                        onClick={handleAssignRole}
                        disabled={!selectedUser || !selectedRole}
                      >
                        <i className="bi bi-check-circle"></i> Assign
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">Bulk Role Assignment</h5>
                    <div className="d-flex gap-2">
                      <select
                        className="form-select"
                        style={{ width: '200px' }}
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      >
                        <option value="">Select Role</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn btn-success"
                        onClick={handleBulkAssign}
                        disabled={!selectedRole}
                      >
                        <i className="bi bi-check-all"></i> Assign to Selected
                      </button>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-select"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                      >
                        <option value="All">All Roles</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th style={{ width: '50px' }}>Select</th>
                          <th>Username</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Current Role</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center text-muted">
                              No users found
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((user) => {
                            const role = roles.find(r => r.id === user.roleId);
                            return (
                              <tr key={user.id}>
                                <td>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`user-${user.id}`}
                                  />
                                </td>
                                <td><strong>{user.username}</strong></td>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>
                                  {role ? (
                                    <span className="badge bg-info">{role.name}</span>
                                  ) : (
                                    <span className="text-muted">No Role</span>
                                  )}
                                </td>
                                <td>
                                  <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                    {user.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
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

export default RoleAssignment;

