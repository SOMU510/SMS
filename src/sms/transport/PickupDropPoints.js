import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const PickupDropPoints = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { 
    pickupDropPoints,
    routes,
    addPickupDropPoint,
    updatePickupDropPoint,
    deletePickupDropPoint
  } = useSchool();
  
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    pointName: '',
    pointType: 'Pickup', // Pickup or Drop
    routeId: '',
    address: '',
    landmark: '',
    latitude: '',
    longitude: '',
    sequence: 1,
    pickupTime: '',
    dropTime: '',
    contactPerson: '',
    contactPhone: '',
    status: 'Active',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterRoute, setFilterRoute] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Load point data if editing
  useEffect(() => {
    if (isEditMode) {
      const point = pickupDropPoints.find(p => p.id === parseInt(id));
      if (point) {
        setFormData({
          pointName: point.pointName || '',
          pointType: point.pointType || 'Pickup',
          routeId: point.routeId || '',
          address: point.address || '',
          landmark: point.landmark || '',
          latitude: point.latitude || '',
          longitude: point.longitude || '',
          sequence: point.sequence || 1,
          pickupTime: point.pickupTime || '',
          dropTime: point.dropTime || '',
          contactPerson: point.contactPerson || '',
          contactPhone: point.contactPhone || '',
          status: point.status || 'Active',
          notes: point.notes || ''
        });
      }
    }
  }, [id, isEditMode, pickupDropPoints]);

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
    
    if (!formData.pointName.trim()) {
      newErrors.pointName = 'Point name is required';
    }
    
    if (!formData.routeId) {
      newErrors.routeId = 'Route is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.sequence || parseInt(formData.sequence) <= 0) {
      newErrors.sequence = 'Valid sequence is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const pointData = {
        ...formData,
        sequence: parseInt(formData.sequence),
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      };

      if (isEditMode) {
        updatePickupDropPoint(parseInt(id), pointData);
        alert('Point updated successfully!');
      } else {
        addPickupDropPoint(pointData);
        alert('Point added successfully!');
      }
      navigate('/transport/points');
    }
  };

  const handleDelete = (pointId, pointName) => {
    if (window.confirm(`Are you sure you want to delete point ${pointName}?`)) {
      deletePickupDropPoint(pointId);
    }
  };

  // Filter points
  let filteredPoints = pickupDropPoints.filter(point =>
    point.pointName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    point.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    point.landmark?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterType !== 'All') {
    filteredPoints = filteredPoints.filter(p => p.pointType === filterType);
  }

  if (filterRoute !== 'All') {
    filteredPoints = filteredPoints.filter(p => p.routeId === parseInt(filterRoute));
  }

  if (filterStatus !== 'All') {
    filteredPoints = filteredPoints.filter(p => p.status === filterStatus);
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
            <h1>Pickup & Drop Points</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/transport">Transport</Link></li>
                <li className="breadcrumb-item active">Pickup & Drop Points</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Points</h5>
                      <Link to="/transport/points/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Add Point
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by name, address..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-select"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                        >
                          <option value="All">All Types</option>
                          <option value="Pickup">Pickup</option>
                          <option value="Drop">Drop</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-select"
                          value={filterRoute}
                          onChange={(e) => setFilterRoute(e.target.value)}
                        >
                          <option value="All">All Routes</option>
                          {routes.map(route => (
                            <option key={route.id} value={route.id}>{route.routeName}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-2">
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
                            <th>Point Name</th>
                            <th>Type</th>
                            <th>Route</th>
                            <th>Address</th>
                            <th>Landmark</th>
                            <th>Sequence</th>
                            <th>Pickup Time</th>
                            <th>Drop Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPoints.length === 0 ? (
                            <tr>
                              <td colSpan="10" className="text-center">
                                <p className="text-muted">No points found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredPoints.map((point) => {
                              const route = routes.find(r => r.id === point.routeId);
                              return (
                                <tr key={point.id}>
                                  <td><strong>{point.pointName}</strong></td>
                                  <td>
                                    <span className={`badge ${point.pointType === 'Pickup' ? 'bg-info' : 'bg-primary'}`}>
                                      {point.pointType}
                                    </span>
                                  </td>
                                  <td>{route ? route.routeName : '-'}</td>
                                  <td>{point.address}</td>
                                  <td>{point.landmark || '-'}</td>
                                  <td>{point.sequence}</td>
                                  <td>{point.pickupTime || '-'}</td>
                                  <td>{point.dropTime || '-'}</td>
                                  <td>
                                    <span className={`badge ${getStatusBadge(point.status)}`}>
                                      {point.status}
                                    </span>
                                  </td>
                                  <td>
                                    <Link
                                      to={`/transport/points/${point.id}`}
                                      className="btn btn-sm btn-primary me-1"
                                      title="Edit"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </Link>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleDelete(point.id, point.pointName)}
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
          <h1>{isEditMode ? 'Edit Point' : 'Add Pickup/Drop Point'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/transport/points">Points</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Add'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Point Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Point Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.pointName ? 'is-invalid' : ''}`}
                          name="pointName"
                          value={formData.pointName}
                          onChange={handleChange}
                          placeholder="e.g., Main Street Stop"
                        />
                        {errors.pointName && <div className="invalid-feedback">{errors.pointName}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Point Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="pointType"
                          value={formData.pointType}
                          onChange={handleChange}
                        >
                          <option value="Pickup">Pickup</option>
                          <option value="Drop">Drop</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Route <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.routeId ? 'is-invalid' : ''}`}
                          name="routeId"
                          value={formData.routeId}
                          onChange={handleChange}
                        >
                          <option value="">Select Route</option>
                          {routes.filter(r => r.status === 'Active').map(route => (
                            <option key={route.id} value={route.id}>
                              {route.routeName} ({route.routeNumber})
                            </option>
                          ))}
                        </select>
                        {errors.routeId && <div className="invalid-feedback">{errors.routeId}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Address <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows="2"
                          placeholder="Full address"
                        />
                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Landmark</label>
                        <input
                          type="text"
                          className="form-control"
                          name="landmark"
                          value={formData.landmark}
                          onChange={handleChange}
                          placeholder="e.g., Near City Mall"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-3">
                        <label className="form-label">
                          Sequence <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className={`form-control ${errors.sequence ? 'is-invalid' : ''}`}
                          name="sequence"
                          value={formData.sequence}
                          onChange={handleChange}
                          min="1"
                        />
                        {errors.sequence && <div className="invalid-feedback">{errors.sequence}</div>}
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Pickup Time</label>
                        <input
                          type="time"
                          className="form-control"
                          name="pickupTime"
                          value={formData.pickupTime}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Drop Time</label>
                        <input
                          type="time"
                          className="form-control"
                          name="dropTime"
                          value={formData.dropTime}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-3">
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
                        <label className="form-label">Latitude</label>
                        <input
                          type="number"
                          className="form-control"
                          name="latitude"
                          value={formData.latitude}
                          onChange={handleChange}
                          step="0.000001"
                          placeholder="e.g., 19.0760"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Longitude</label>
                        <input
                          type="number"
                          className="form-control"
                          name="longitude"
                          value={formData.longitude}
                          onChange={handleChange}
                          step="0.000001"
                          placeholder="e.g., 72.8777"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Contact Person</label>
                        <input
                          type="text"
                          className="form-control"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Contact Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="contactPhone"
                          value={formData.contactPhone}
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
                        onClick={() => navigate('/transport/points')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Add'} Point
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

export default PickupDropPoints;

