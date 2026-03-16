import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const FeeCategories = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { 
    feeCategories,
    addFeeCategory,
    updateFeeCategory,
    deleteFeeCategory
  } = useSchool();
  
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    isRecurring: false,
    frequency: 'Monthly', // Monthly, Quarterly, Yearly, One-time
    status: 'Active'
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Load category data if editing
  useEffect(() => {
    if (isEditMode) {
      const category = feeCategories.find(fc => fc.id === parseInt(id));
      if (category) {
        setFormData({
          name: category.name || '',
          code: category.code || '',
          description: category.description || '',
          isRecurring: category.isRecurring || false,
          frequency: category.frequency || 'Monthly',
          status: category.status || 'Active'
        });
      }
    }
  }, [id, isEditMode, feeCategories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Category code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEditMode) {
        updateFeeCategory(parseInt(id), formData);
        alert('Fee category updated successfully!');
      } else {
        // Check for duplicate code
        const existing = feeCategories.find(fc => fc.code.toLowerCase() === formData.code.toLowerCase());
        if (existing) {
          alert('Fee category with this code already exists!');
          return;
        }
        addFeeCategory(formData);
        alert('Fee category created successfully!');
      }
      navigate('/fees/categories');
    }
  };

  const handleDelete = (categoryId, name) => {
    if (window.confirm(`Are you sure you want to delete fee category "${name}"?`)) {
      deleteFeeCategory(categoryId);
    }
  };

  // Filter categories
  const filteredCategories = feeCategories.filter(fc =>
    fc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fc.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    return status === 'Active' ? 'bg-success' : 'bg-secondary';
  };

  // If not in add/edit mode, show list view
  if (!showForm) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Fee Categories</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/fees">Fees</Link></li>
                <li className="breadcrumb-item active">Fee Categories</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Fee Categories</h5>
                      <Link to="/fees/categories/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Add Category
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
                            <th>Name</th>
                            <th>Description</th>
                            <th>Recurring</th>
                            <th>Frequency</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCategories.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center">
                                <p className="text-muted">No fee categories found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredCategories.map((category) => (
                              <tr key={category.id}>
                                <td><strong>{category.code}</strong></td>
                                <td>{category.name}</td>
                                <td>{category.description || '-'}</td>
                                <td>
                                  {category.isRecurring ? (
                                    <span className="badge bg-info">Yes</span>
                                  ) : (
                                    <span className="badge bg-secondary">No</span>
                                  )}
                                </td>
                                <td>{category.frequency || '-'}</td>
                                <td>
                                  <span className={`badge ${getStatusBadge(category.status)}`}>
                                    {category.status}
                                  </span>
                                </td>
                                <td>
                                  <Link
                                    to={`/fees/categories/${category.id}`}
                                    className="btn btn-sm btn-primary me-1"
                                    title="Edit"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(category.id, category.name)}
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
          <h1>{isEditMode ? 'Edit Fee Category' : 'Add Fee Category'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/fees/categories">Fee Categories</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Add'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Category Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Category Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., Tuition Fee"
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Code <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                          name="code"
                          value={formData.code}
                          onChange={handleChange}
                          placeholder="e.g., TUIT"
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
                          rows="3"
                          placeholder="Description of the fee category"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <div className="form-check mt-4">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="isRecurring"
                            checked={formData.isRecurring}
                            onChange={handleChange}
                            id="isRecurring"
                          />
                          <label className="form-check-label" htmlFor="isRecurring">
                            Recurring Fee
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Frequency</label>
                        <select
                          className="form-select"
                          name="frequency"
                          value={formData.frequency}
                          onChange={handleChange}
                          disabled={!formData.isRecurring}
                        >
                          <option value="Monthly">Monthly</option>
                          <option value="Quarterly">Quarterly</option>
                          <option value="Yearly">Yearly</option>
                          <option value="One-time">One-time</option>
                        </select>
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
                        </select>
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate('/fees/categories')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Create'} Category
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

export default FeeCategories;

