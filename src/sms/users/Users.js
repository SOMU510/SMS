import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const Users = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { 
    users,
    roles,
    addUser,
    updateUser,
    deleteUser
  } = useSchool();
  
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    roleId: '',
    status: 'Active',
    lastLogin: null,
    createdAt: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Load user data if editing
  useEffect(() => {
    if (isEditMode) {
      const user = users.find(u => u.id === parseInt(id));
      if (user) {
        setFormData({
          username: user.username || '',
          email: user.email || '',
          password: '',
          confirmPassword: '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
          roleId: user.roleId || '',
          status: user.status || 'Active',
          lastLogin: user.lastLogin || null,
          createdAt: user.createdAt || new Date().toISOString().split('T')[0]
        });
      }
    }
  }, [id, isEditMode, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!isEditMode && !formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.roleId) {
      newErrors.roleId = 'Role is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const userData = {
        ...formData,
        password: isEditMode && !formData.password ? undefined : formData.password,
        confirmPassword: undefined // Don't save confirm password
      };

      if (isEditMode) {
        updateUser(parseInt(id), userData);
        alert('User updated successfully!');
      } else {
        // Check for duplicate username
        const existing = users.find(u => u.username.toLowerCase() === formData.username.toLowerCase());
        if (existing) {
          alert('Username already exists!');
          return;
        }
        
        // Check for duplicate email
        const existingEmail = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
        if (existingEmail) {
          alert('Email already exists!');
          return;
        }
        
        addUser(userData);
        alert('User created successfully!');
      }
      navigate('/users');
    }
  };

  const handleDelete = (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      deleteUser(userId);
    }
  };

  const handleResetPassword = (userId, username) => {
    if (window.confirm(`Reset password for user "${username}"?`)) {
      // In real app, this would send a password reset email
      alert('Password reset link sent to user email');
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

  if (filterStatus !== 'All') {
    filteredUsers = filteredUsers.filter(u => u.status === filterStatus);
  }

  const getStatusBadge = (status) => {
    return status === 'Active' ? 'bg-success' : 'bg-secondary';
  };

  // If not in add/edit mode, show list view
  if (!showForm) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Users</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/users">User Management</Link></li>
                <li className="breadcrumb-item active">Users</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Users</h5>
                      <Link to="/users/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Add User
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by username, email, name..."
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
                      <div className="col-md-3">
                        <select
                          className="form-select"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                        >
                          <option value="All">All Status</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Phone</th>
                            <th>Last Login</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="text-center">
                                <p className="text-muted">No users found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredUsers.map((user) => {
                              const role = roles.find(r => r.id === user.roleId);
                              return (
                                <tr key={user.id}>
                                  <td><strong>{user.username}</strong></td>
                                  <td>{user.firstName} {user.lastName}</td>
                                  <td>{user.email}</td>
                                  <td>
                                    <span className="badge bg-info">{role?.name || 'No Role'}</span>
                                  </td>
                                  <td>{user.phone || '-'}</td>
                                  <td>
                                    {user.lastLogin 
                                      ? new Date(user.lastLogin).toLocaleString() 
                                      : 'Never'}
                                  </td>
                                  <td>
                                    <span className={`badge ${getStatusBadge(user.status)}`}>
                                      {user.status}
                                    </span>
                                  </td>
                                  <td>
                                    <Link
                                      to={`/users/${user.id}`}
                                      className="btn btn-sm btn-primary me-1"
                                      title="Edit"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </Link>
                                    <button
                                      className="btn btn-sm btn-warning me-1"
                                      onClick={() => handleResetPassword(user.id, user.username)}
                                      title="Reset Password"
                                    >
                                      <i className="bi bi-key"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleDelete(user.id, user.username)}
                                      title="Delete"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
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
  }

  // Form view
  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>{isEditMode ? 'Edit User' : 'Add User'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/users">Users</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Add'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">User Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Username <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Enter username"
                          disabled={isEditMode}
                        />
                        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email"
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          First Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter first name"
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Role <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.roleId ? 'is-invalid' : ''}`}
                          name="roleId"
                          value={formData.roleId}
                          onChange={handleChange}
                        >
                          <option value="">Select Role</option>
                          {roles.map(role => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                          ))}
                        </select>
                        {errors.roleId && <div className="invalid-feedback">{errors.roleId}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>
                    </div>

                    {!isEditMode && (
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">
                            Password <span className="text-danger">*</span>
                          </label>
                          <input
                            type="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password (min 6 characters)"
                          />
                          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            Confirm Password <span className="text-danger">*</span>
                          </label>
                          <input
                            type="password"
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                          />
                          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                        </div>
                      </div>
                    )}

                    {isEditMode && (
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle"></i> Leave password fields empty to keep current password. Use "Reset Password" button to send password reset link.
                      </div>
                    )}

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate('/users')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Create'} User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Users;

