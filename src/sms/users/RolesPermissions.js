import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const RolesPermissions = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { 
    roles,
    permissions,
    addRole,
    updateRole,
    deleteRole
  } = useSchool();
  
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    selectedPermissions: [],
    status: 'Active'
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Load role data if editing
  useEffect(() => {
    if (isEditMode) {
      const role = roles.find(r => r.id === parseInt(id));
      if (role) {
        setFormData({
          name: role.name || '',
          code: role.code || '',
          description: role.description || '',
          selectedPermissions: role.permissions || [],
          status: role.status || 'Active'
        });
      }
    }
  }, [id, isEditMode, roles]);

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

  const handlePermissionToggle = (permissionId) => {
    if (formData.selectedPermissions.includes(permissionId)) {
      setFormData(prev => ({
        ...prev,
        selectedPermissions: prev.selectedPermissions.filter(p => p !== permissionId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedPermissions: [...prev.selectedPermissions, permissionId]
      }));
    }
  };

  const handleSelectAllPermissions = (module, checked) => {
    const modulePermissions = permissions.filter(p => p.module === module);
    if (checked) {
      const newPermissions = [...new Set([...formData.selectedPermissions, ...modulePermissions.map(p => p.id)])];
      setFormData(prev => ({
        ...prev,
        selectedPermissions: newPermissions
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedPermissions: prev.selectedPermissions.filter(p => !modulePermissions.find(mp => mp.id === p))
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Role code is required';
    }
    
    if (formData.selectedPermissions.length === 0) {
      newErrors.permissions = 'At least one permission is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const roleData = {
        ...formData,
        permissions: formData.selectedPermissions
      };

      if (isEditMode) {
        updateRole(parseInt(id), roleData);
        alert('Role updated successfully!');
      } else {
        // Check for duplicate code
        const existing = roles.find(r => r.code.toLowerCase() === formData.code.toLowerCase());
        if (existing) {
          alert('Role with this code already exists!');
          return;
        }
        addRole(roleData);
        alert('Role created successfully!');
      }
      navigate('/users/roles');
    }
  };

  const handleDelete = (roleId, name) => {
    if (window.confirm(`Are you sure you want to delete role "${name}"?`)) {
      deleteRole(roleId);
    }
  };

  // Filter roles
  const filteredRoles = roles.filter(role =>
    role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group permissions by module
  const permissionsByModule = {};
  permissions.forEach(permission => {
    if (!permissionsByModule[permission.module]) {
      permissionsByModule[permission.module] = [];
    }
    permissionsByModule[permission.module].push(permission);
  });

  const getStatusBadge = (status) => {
    return status === 'Active' ? 'bg-success' : 'bg-secondary';
  };

  // If not in add/edit mode, show list view
  if (!showForm) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Roles & Permissions</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/users">User Management</Link></li>
                <li className="breadcrumb-item active">Roles & Permissions</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Roles</h5>
                      <Link to="/users/roles/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Add Role
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by name or code..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Role Name</th>
                            <th>Description</th>
                            <th>Permissions</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRoles.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="text-center">
                                <p className="text-muted">No roles found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredRoles.map((role) => (
                              <tr key={role.id}>
                                <td><strong>{role.code}</strong></td>
                                <td>{role.name}</td>
                                <td>{role.description || '-'}</td>
                                <td>
                                  <span className="badge bg-info">
                                    {role.permissions?.length || 0} permissions
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${getStatusBadge(role.status)}`}>
                                    {role.status}
                                  </span>
                                </td>
                                <td>
                                  <Link
                                    to={`/users/roles/${role.id}`}
                                    className="btn btn-sm btn-primary me-1"
                                    title="Edit"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(role.id, role.name)}
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
  }

  // Form view
  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>{isEditMode ? 'Edit Role' : 'Add Role'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/users/roles">Roles</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Add'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Role Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Role Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., Administrator, Teacher"
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Role Code <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                          name="code"
                          value={formData.code}
                          onChange={handleChange}
                          placeholder="e.g., ADMIN, TEACHER"
                        />
                        {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="2"
                          placeholder="Role description"
                        />
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">Permissions</h6>
                    {Object.keys(permissionsByModule).map(module => {
                      const modulePermissions = permissionsByModule[module];
                      const allSelected = modulePermissions.every(p => formData.selectedPermissions.includes(p.id));
                      
                      return (
                        <div key={module} className="card mb-3">
                          <div className="card-header">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={allSelected}
                                onChange={(e) => handleSelectAllPermissions(module, e.target.checked)}
                                id={`module-${module}`}
                              />
                              <label className="form-check-label fw-bold" htmlFor={`module-${module}`}>
                                {module}
                              </label>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              {modulePermissions.map(permission => (
                                <div key={permission.id} className="col-md-4 mb-2">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={formData.selectedPermissions.includes(permission.id)}
                                      onChange={() => handlePermissionToggle(permission.id)}
                                      id={`permission-${permission.id}`}
                                    />
                                    <label className="form-check-label" htmlFor={`permission-${permission.id}`}>
                                      {permission.name}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {errors.permissions && <div className="text-danger">{errors.permissions}</div>}

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="alert alert-info">
                      <strong>Selected Permissions:</strong> {formData.selectedPermissions.length} permission(s)
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate('/users/roles')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Create'} Role
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

export default RolesPermissions;

