import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const Vehicles = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { 
    vehicles,
    drivers,
    addVehicle,
    updateVehicle,
    deleteVehicle
  } = useSchool();
  
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'Bus',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    capacity: '',
    registrationNumber: '',
    registrationExpiry: '',
    insuranceNumber: '',
    insuranceExpiry: '',
    permitNumber: '',
    permitExpiry: '',
    driverId: '',
    status: 'Active',
    purchaseDate: '',
    purchasePrice: '',
    currentMileage: '',
    lastServiceDate: '',
    nextServiceDate: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Load vehicle data if editing
  useEffect(() => {
    if (isEditMode) {
      const vehicle = vehicles.find(v => v.id === parseInt(id));
      if (vehicle) {
        setFormData({
          vehicleNumber: vehicle.vehicleNumber || '',
          vehicleType: vehicle.vehicleType || 'Bus',
          make: vehicle.make || '',
          model: vehicle.model || '',
          year: vehicle.year || new Date().getFullYear(),
          color: vehicle.color || '',
          capacity: vehicle.capacity || '',
          registrationNumber: vehicle.registrationNumber || '',
          registrationExpiry: vehicle.registrationExpiry || '',
          insuranceNumber: vehicle.insuranceNumber || '',
          insuranceExpiry: vehicle.insuranceExpiry || '',
          permitNumber: vehicle.permitNumber || '',
          permitExpiry: vehicle.permitExpiry || '',
          driverId: vehicle.driverId || '',
          status: vehicle.status || 'Active',
          purchaseDate: vehicle.purchaseDate || '',
          purchasePrice: vehicle.purchasePrice || '',
          currentMileage: vehicle.currentMileage || '',
          lastServiceDate: vehicle.lastServiceDate || '',
          nextServiceDate: vehicle.nextServiceDate || '',
          notes: vehicle.notes || ''
        });
      }
    }
  }, [id, isEditMode, vehicles]);

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
    
    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    }
    
    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Vehicle type is required';
    }
    
    if (!formData.make.trim()) {
      newErrors.make = 'Make is required';
    }
    
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }
    
    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'Valid capacity is required';
    }
    
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const vehicleData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        year: parseInt(formData.year),
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : null,
        currentMileage: formData.currentMileage ? parseFloat(formData.currentMileage) : null
      };

      if (isEditMode) {
        updateVehicle(parseInt(id), vehicleData);
        alert('Vehicle updated successfully!');
      } else {
        // Check for duplicate vehicle number
        const existing = vehicles.find(v => v.vehicleNumber.toLowerCase() === formData.vehicleNumber.toLowerCase());
        if (existing) {
          alert('Vehicle with this number already exists!');
          return;
        }
        addVehicle(vehicleData);
        alert('Vehicle added successfully!');
      }
      navigate('/transport/vehicles');
    }
  };

  const handleDelete = (vehicleId, vehicleNumber) => {
    if (window.confirm(`Are you sure you want to delete vehicle ${vehicleNumber}?`)) {
      deleteVehicle(vehicleId);
    }
  };

  // Filter vehicles
  let filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterType !== 'All') {
    filteredVehicles = filteredVehicles.filter(v => v.vehicleType === filterType);
  }

  if (filterStatus !== 'All') {
    filteredVehicles = filteredVehicles.filter(v => v.status === filterStatus);
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active': return 'bg-success';
      case 'Inactive': return 'bg-secondary';
      case 'Under Maintenance': return 'bg-warning';
      case 'Retired': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  // If not in add/edit mode, show list view
  if (!showForm) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Vehicles</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/transport">Transport</Link></li>
                <li className="breadcrumb-item active">Vehicles</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row mb-3">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Vehicles</h5>
                      <Link to="/transport/vehicles/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Add Vehicle
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by number, make, model..."
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
                          <option value="All">All Types</option>
                          <option value="Bus">Bus</option>
                          <option value="Van">Van</option>
                          <option value="Car">Car</option>
                          <option value="Mini Bus">Mini Bus</option>
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
                          <option value="Under Maintenance">Under Maintenance</option>
                          <option value="Retired">Retired</option>
                        </select>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Vehicle Number</th>
                            <th>Type</th>
                            <th>Make & Model</th>
                            <th>Year</th>
                            <th>Capacity</th>
                            <th>Registration</th>
                            <th>Driver</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredVehicles.length === 0 ? (
                            <tr>
                              <td colSpan="9" className="text-center">
                                <p className="text-muted">No vehicles found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredVehicles.map((vehicle) => {
                              const assignedDriver = drivers.find(d => d.id === vehicle.driverId);
                              return (
                                <tr key={vehicle.id}>
                                  <td><strong>{vehicle.vehicleNumber}</strong></td>
                                  <td>{vehicle.vehicleType}</td>
                                  <td>{vehicle.make} {vehicle.model}</td>
                                  <td>{vehicle.year}</td>
                                  <td>{vehicle.capacity} seats</td>
                                  <td>{vehicle.registrationNumber}</td>
                                  <td>
                                    {assignedDriver ? (
                                      `${assignedDriver.firstName} ${assignedDriver.lastName}`
                                    ) : (
                                      <span className="text-muted">Not Assigned</span>
                                    )}
                                  </td>
                                  <td>
                                    <span className={`badge ${getStatusBadge(vehicle.status)}`}>
                                      {vehicle.status}
                                    </span>
                                  </td>
                                  <td>
                                    <Link
                                      to={`/transport/vehicles/${vehicle.id}`}
                                      className="btn btn-sm btn-primary me-1"
                                      title="Edit"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </Link>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleDelete(vehicle.id, vehicle.vehicleNumber)}
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
          <h1>{isEditMode ? 'Edit Vehicle' : 'Add Vehicle'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/transport/vehicles">Vehicles</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Add'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Vehicle Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Vehicle Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.vehicleNumber ? 'is-invalid' : ''}`}
                          name="vehicleNumber"
                          value={formData.vehicleNumber}
                          onChange={handleChange}
                          placeholder="e.g., BUS-001"
                        />
                        {errors.vehicleNumber && <div className="invalid-feedback">{errors.vehicleNumber}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Vehicle Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.vehicleType ? 'is-invalid' : ''}`}
                          name="vehicleType"
                          value={formData.vehicleType}
                          onChange={handleChange}
                        >
                          <option value="Bus">Bus</option>
                          <option value="Van">Van</option>
                          <option value="Car">Car</option>
                          <option value="Mini Bus">Mini Bus</option>
                        </select>
                        {errors.vehicleType && <div className="invalid-feedback">{errors.vehicleType}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Capacity (Seats) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className={`form-control ${errors.capacity ? 'is-invalid' : ''}`}
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleChange}
                          min="1"
                        />
                        {errors.capacity && <div className="invalid-feedback">{errors.capacity}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Make <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.make ? 'is-invalid' : ''}`}
                          name="make"
                          value={formData.make}
                          onChange={handleChange}
                          placeholder="e.g., Tata"
                        />
                        {errors.make && <div className="invalid-feedback">{errors.make}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Model <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.model ? 'is-invalid' : ''}`}
                          name="model"
                          value={formData.model}
                          onChange={handleChange}
                          placeholder="e.g., Starbus"
                        />
                        {errors.model && <div className="invalid-feedback">{errors.model}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Year</label>
                        <input
                          type="number"
                          className="form-control"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          min="2000"
                          max={new Date().getFullYear() + 1}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Color</label>
                        <input
                          type="text"
                          className="form-control"
                          name="color"
                          value={formData.color}
                          onChange={handleChange}
                          placeholder="e.g., Yellow"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Registration Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.registrationNumber ? 'is-invalid' : ''}`}
                          name="registrationNumber"
                          value={formData.registrationNumber}
                          onChange={handleChange}
                          placeholder="e.g., MH-01-AB-1234"
                        />
                        {errors.registrationNumber && <div className="invalid-feedback">{errors.registrationNumber}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Registration Expiry</label>
                        <input
                          type="date"
                          className="form-control"
                          name="registrationExpiry"
                          value={formData.registrationExpiry}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Insurance Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="insuranceNumber"
                          value={formData.insuranceNumber}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Insurance Expiry</label>
                        <input
                          type="date"
                          className="form-control"
                          name="insuranceExpiry"
                          value={formData.insuranceExpiry}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Permit Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="permitNumber"
                          value={formData.permitNumber}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Permit Expiry</label>
                        <input
                          type="date"
                          className="form-control"
                          name="permitExpiry"
                          value={formData.permitExpiry}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Assigned Driver</label>
                        <select
                          className="form-select"
                          name="driverId"
                          value={formData.driverId}
                          onChange={handleChange}
                        >
                          <option value="">Select Driver</option>
                          {drivers.map(driver => (
                            <option key={driver.id} value={driver.id}>
                              {driver.firstName} {driver.lastName} - {driver.licenseNumber || 'No License'}
                            </option>
                          ))}
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
                          <option value="Under Maintenance">Under Maintenance</option>
                          <option value="Retired">Retired</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Purchase Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="purchaseDate"
                          value={formData.purchaseDate}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Purchase Price (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="purchasePrice"
                          value={formData.purchasePrice}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Current Mileage (km)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="currentMileage"
                          value={formData.currentMileage}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Last Service Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="lastServiceDate"
                          value={formData.lastServiceDate}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Next Service Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="nextServiceDate"
                          value={formData.nextServiceDate}
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
                          placeholder="Additional notes about the vehicle"
                        />
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate('/transport/vehicles')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Add'} Vehicle
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

export default Vehicles;

