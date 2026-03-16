import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const Drivers = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { 
    drivers,
    addDriver,
    updateDriver,
    deleteDriver
  } = useSchool();
  
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    licenseType: 'Commercial',
    licenseExpiry: '',
    dateOfBirth: '',
    dateOfJoining: '',
    experience: '',
    status: 'Active',
    emergencyContact: '',
    emergencyPhone: '',
    salary: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Load driver data if editing
  useEffect(() => {
    if (isEditMode) {
      const driver = drivers.find(d => d.id === parseInt(id));
      if (driver) {
        setFormData({
          firstName: driver.firstName || '',
          lastName: driver.lastName || '',
          email: driver.email || '',
          phone: driver.phone || '',
          address: driver.address || '',
          licenseNumber: driver.licenseNumber || '',
          licenseType: driver.licenseType || 'Commercial',
          licenseExpiry: driver.licenseExpiry || '',
          dateOfBirth: driver.dateOfBirth || '',
          dateOfJoining: driver.dateOfJoining || '',
          experience: driver.experience || '',
          status: driver.status || 'Active',
          emergencyContact: driver.emergencyContact || '',
          emergencyPhone: driver.emergencyPhone || '',
          salary: driver.salary || '',
          notes: driver.notes || ''
        });
      }
    }
  }, [id, isEditMode, drivers]);

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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const driverData = {
        ...formData,
        experience: formData.experience ? parseInt(formData.experience) : null,
        salary: formData.salary ? parseFloat(formData.salary) : null
      };

      if (isEditMode) {
        updateDriver(parseInt(id), driverData);
        alert('Driver updated successfully!');
      } else {
        // Check for duplicate license number
        const existing = drivers.find(d => d.licenseNumber.toLowerCase() === formData.licenseNumber.toLowerCase());
        if (existing) {
          alert('Driver with this license number already exists!');
          return;
        }
        addDriver(driverData);
        alert('Driver added successfully!');
      }
      navigate('/transport/drivers');
    }
  };

  const handleDelete = (driverId, driverName) => {
    if (window.confirm(`Are you sure you want to delete driver ${driverName}?`)) {
      deleteDriver(driverId);
    }
  };

  // Filter drivers
  let filteredDrivers = drivers.filter(driver =>
    driver.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone?.includes(searchTerm) ||
    driver.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterStatus !== 'All') {
    filteredDrivers = filteredDrivers.filter(d => d.status === filterStatus);
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
            <h1>Drivers</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/transport">Transport</Link></li>
                <li className="breadcrumb-item active">Drivers</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Drivers</h5>
                      <Link to="/transport/drivers/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Add Driver
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by name, phone, license..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
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
                        </select>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>License Number</th>
                            <th>License Type</th>
                            <th>License Expiry</th>
                            <th>Experience</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDrivers.length === 0 ? (
                            <tr>
                              <td colSpan="9" className="text-center">
                                <p className="text-muted">No drivers found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredDrivers.map((driver) => (
                              <tr key={driver.id}>
                                <td><strong>{driver.firstName} {driver.lastName}</strong></td>
                                <td>{driver.phone}</td>
                                <td>{driver.email || '-'}</td>
                                <td>{driver.licenseNumber}</td>
                                <td>{driver.licenseType}</td>
                                <td>
                                  {driver.licenseExpiry ? (
                                    new Date(driver.licenseExpiry) < new Date() ? (
                                      <span className="text-danger">
                                        {new Date(driver.licenseExpiry).toLocaleDateString()} (Expired)
                                      </span>
                                    ) : (
                                      new Date(driver.licenseExpiry).toLocaleDateString()
                                    )
                                  ) : '-'}
                                </td>
                                <td>{driver.experience ? `${driver.experience} years` : '-'}</td>
                                <td>
                                  <span className={`badge ${getStatusBadge(driver.status)}`}>
                                    {driver.status}
                                  </span>
                                </td>
                                <td>
                                  <Link
                                    to={`/transport/drivers/${driver.id}`}
                                    className="btn btn-sm btn-primary me-1"
                                    title="Edit"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(driver.id, `${driver.firstName} ${driver.lastName}`)}
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
          <h1>{isEditMode ? 'Edit Driver' : 'Add Driver'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/transport/drivers">Drivers</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Add'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Driver Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          First Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Last Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Phone <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Date of Birth</label>
                        <input
                          type="date"
                          className="form-control"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Address</label>
                        <textarea
                          className="form-control"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows="2"
                        />
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">License Information</h6>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          License Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.licenseNumber ? 'is-invalid' : ''}`}
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleChange}
                        />
                        {errors.licenseNumber && <div className="invalid-feedback">{errors.licenseNumber}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">License Type</label>
                        <select
                          className="form-select"
                          name="licenseType"
                          value={formData.licenseType}
                          onChange={handleChange}
                        >
                          <option value="Commercial">Commercial</option>
                          <option value="Private">Private</option>
                          <option value="Heavy Vehicle">Heavy Vehicle</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">License Expiry</label>
                        <input
                          type="date"
                          className="form-control"
                          name="licenseExpiry"
                          value={formData.licenseExpiry}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">Employment Information</h6>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Date of Joining</label>
                        <input
                          type="date"
                          className="form-control"
                          name="dateOfJoining"
                          value={formData.dateOfJoining}
                          onChange={handleChange}
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Experience (Years)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          min="0"
                        />
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

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Salary (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="salary"
                          value={formData.salary}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">Emergency Contact</h6>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Emergency Contact Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Emergency Contact Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="emergencyPhone"
                          value={formData.emergencyPhone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Notes</label>
                        <textarea
                          className="form-control"
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Additional notes"
                        />
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate('/transport/drivers')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Add'} Driver
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

export default Drivers;

