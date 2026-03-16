import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const TeacherProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { teachers, classes, subjects, updateTeacher } = useSchool();
  const teacher = teachers.find(t => t.id === parseInt(id));

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: '',
    aadharNumber: '',
    nationality: 'Indian',
    religion: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Professional Information
    employeeId: '',
    qualification: '',
    experience: '',
    specialization: '',
    subject: '',
    class: '',
    designation: '',
    department: '',
    
    // Employment Information
    joiningDate: '',
    contractType: 'Permanent',
    salary: '',
    
    // Bank Information
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    
    // Additional Information
    bio: '',
    achievements: '',
    certifications: '',
    
    status: 'Active'
  });

  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (teacher) {
      setFormData({
        firstName: teacher.firstName || '',
        lastName: teacher.lastName || '',
        middleName: teacher.middleName || '',
        email: teacher.email || '',
        phone: teacher.phone || '',
        alternatePhone: teacher.alternatePhone || '',
        dateOfBirth: teacher.dateOfBirth || '',
        gender: teacher.gender || 'Male',
        bloodGroup: teacher.bloodGroup || '',
        aadharNumber: teacher.aadharNumber || '',
        nationality: teacher.nationality || 'Indian',
        religion: teacher.religion || '',
        address: teacher.address || '',
        city: teacher.city || '',
        state: teacher.state || '',
        pincode: teacher.pincode || '',
        employeeId: teacher.employeeId || '',
        qualification: teacher.qualification || '',
        experience: teacher.experience || '',
        specialization: teacher.specialization || '',
        subject: teacher.subject || '',
        class: teacher.class || '',
        designation: teacher.designation || '',
        department: teacher.department || '',
        joiningDate: teacher.joiningDate || '',
        contractType: teacher.contractType || 'Permanent',
        salary: teacher.salary || '',
        bankName: teacher.bankName || '',
        accountNumber: teacher.accountNumber || '',
        ifscCode: teacher.ifscCode || '',
        emergencyContactName: teacher.emergencyContactName || '',
        emergencyContactPhone: teacher.emergencyContactPhone || '',
        emergencyContactRelation: teacher.emergencyContactRelation || '',
        bio: teacher.bio || '',
        achievements: teacher.achievements || '',
        certifications: teacher.certifications || '',
        status: teacher.status || 'Active'
      });
    }
  }, [teacher]);

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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      updateTeacher(parseInt(id), formData);
      alert('Teacher profile updated successfully!');
      setIsEditMode(false);
    }
  };

  if (!teacher) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Teacher Not Found</h1>
          </div>
        </div>
      </main>
    );
  }

  const uniqueClasses = [...new Set(classes.map(c => c.name))].sort();

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Teacher Profile</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/teachers">Teachers</Link></li>
              <li className="breadcrumb-item active">Profile</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">
                      {formData.firstName} {formData.lastName}'s Profile
                    </h5>
                    {!isEditMode && (
                      <button
                        className="btn btn-primary"
                        onClick={() => setIsEditMode(true)}
                      >
                        <i className="bi bi-pencil"></i> Edit Profile
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <h6 className="mb-3 mt-4">Personal Information</h6>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          First Name <span className="text-danger">*</span>
                        </label>
                        {isEditMode ? (
                          <>
                            <input
                              type="text"
                              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                            />
                            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                          </>
                        ) : (
                          <p className="form-control-plaintext">{formData.firstName}</p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Middle Name</label>
                        {isEditMode ? (
                          <input
                            type="text"
                            className="form-control"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="form-control-plaintext">{formData.middleName || '-'}</p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Last Name <span className="text-danger">*</span>
                        </label>
                        {isEditMode ? (
                          <>
                            <input
                              type="text"
                              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                            />
                            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                          </>
                        ) : (
                          <p className="form-control-plaintext">{formData.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        {isEditMode ? (
                          <>
                            <input
                              type="email"
                              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                          </>
                        ) : (
                          <p className="form-control-plaintext">{formData.email}</p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Phone <span className="text-danger">*</span>
                        </label>
                        {isEditMode ? (
                          <>
                            <input
                              type="tel"
                              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                          </>
                        ) : (
                          <p className="form-control-plaintext">{formData.phone}</p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Alternate Phone</label>
                        {isEditMode ? (
                          <input
                            type="tel"
                            className="form-control"
                            name="alternatePhone"
                            value={formData.alternatePhone}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="form-control-plaintext">{formData.alternatePhone || '-'}</p>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Date of Birth</label>
                        {isEditMode ? (
                          <input
                            type="date"
                            className="form-control"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="form-control-plaintext">
                            {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : '-'}
                          </p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Gender</label>
                        {isEditMode ? (
                          <select
                            className="form-select"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <p className="form-control-plaintext">{formData.gender}</p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Blood Group</label>
                        {isEditMode ? (
                          <select
                            className="form-select"
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleChange}
                          >
                            <option value="">Select</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        ) : (
                          <p className="form-control-plaintext">{formData.bloodGroup || '-'}</p>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Address</label>
                        {isEditMode ? (
                          <textarea
                            className="form-control"
                            rows="3"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="form-control-plaintext">{formData.address || '-'}</p>
                        )}
                      </div>
                    </div>

                    {/* Professional Information */}
                    <h6 className="mb-3 mt-4">Professional Information</h6>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Employee ID</label>
                        <p className="form-control-plaintext">
                          <strong>{formData.employeeId || '-'}</strong>
                        </p>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Designation</label>
                        {isEditMode ? (
                          <input
                            type="text"
                            className="form-control"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="form-control-plaintext">{formData.designation || '-'}</p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Department</label>
                        {isEditMode ? (
                          <input
                            type="text"
                            className="form-control"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="form-control-plaintext">{formData.department || '-'}</p>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Qualification</label>
                        {isEditMode ? (
                          <input
                            type="text"
                            className="form-control"
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="form-control-plaintext">{formData.qualification || '-'}</p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Experience</label>
                        {isEditMode ? (
                          <input
                            type="text"
                            className="form-control"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="form-control-plaintext">{formData.experience || '-'}</p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Specialization</label>
                        {isEditMode ? (
                          <input
                            type="text"
                            className="form-control"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="form-control-plaintext">{formData.specialization || '-'}</p>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Subject</label>
                        {isEditMode ? (
                          <select
                            className="form-select"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                          >
                            <option value="">Select Subject</option>
                            {subjects.map(sub => (
                              <option key={sub.id} value={sub.name}>{sub.name}</option>
                            ))}
                          </select>
                        ) : (
                          <p className="form-control-plaintext">{formData.subject || '-'}</p>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Class</label>
                        {isEditMode ? (
                          <select
                            className="form-select"
                            name="class"
                            value={formData.class}
                            onChange={handleChange}
                          >
                            <option value="">Select Class</option>
                            {uniqueClasses.map(cls => (
                              <option key={cls} value={cls}>{cls}</option>
                            ))}
                          </select>
                        ) : (
                          <p className="form-control-plaintext">{formData.class || '-'}</p>
                        )}
                      </div>
                    </div>

                    {/* Employment Information */}
                    <h6 className="mb-3 mt-4">Employment Information</h6>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Joining Date</label>
                        {isEditMode ? (
                          <input
                            type="date"
                            className="form-control"
                            name="joiningDate"
                            value={formData.joiningDate}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="form-control-plaintext">
                            {formData.joiningDate ? new Date(formData.joiningDate).toLocaleDateString() : '-'}
                          </p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Contract Type</label>
                        {isEditMode ? (
                          <select
                            className="form-select"
                            name="contractType"
                            value={formData.contractType}
                            onChange={handleChange}
                          >
                            <option value="Permanent">Permanent</option>
                            <option value="Contract">Contract</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Temporary">Temporary</option>
                          </select>
                        ) : (
                          <p className="form-control-plaintext">{formData.contractType || '-'}</p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Salary</label>
                        {isEditMode ? (
                          <input
                            type="number"
                            className="form-control"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="form-control-plaintext">
                            {formData.salary ? `₹${formData.salary}` : '-'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bank Information */}
                    <h6 className="mb-3 mt-4">Bank Information</h6>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Bank Name</label>
                        {isEditMode ? (
                          <input
                            type="text"
                            className="form-control"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="form-control-plaintext">{formData.bankName || '-'}</p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Account Number</label>
                        {isEditMode ? (
                          <input
                            type="text"
                            className="form-control"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="form-control-plaintext">{formData.accountNumber || '-'}</p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">IFSC Code</label>
                        {isEditMode ? (
                          <input
                            type="text"
                            className="form-control"
                            name="ifscCode"
                            value={formData.ifscCode}
                            onChange={handleChange}
                            maxLength="11"
                          />
                        ) : (
                          <p className="form-control-plaintext">{formData.ifscCode || '-'}</p>
                        )}
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <h6 className="mb-3 mt-4">Emergency Contact</h6>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Contact Name</label>
                        {isEditMode ? (
                          <input
                            type="text"
                            className="form-control"
                            name="emergencyContactName"
                            value={formData.emergencyContactName}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="form-control-plaintext">{formData.emergencyContactName || '-'}</p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Contact Phone</label>
                        {isEditMode ? (
                          <input
                            type="tel"
                            className="form-control"
                            name="emergencyContactPhone"
                            value={formData.emergencyContactPhone}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="form-control-plaintext">{formData.emergencyContactPhone || '-'}</p>
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Relation</label>
                        {isEditMode ? (
                          <input
                            type="text"
                            className="form-control"
                            name="emergencyContactRelation"
                            value={formData.emergencyContactRelation}
                            onChange={handleChange}
                          />
                        ) : (
                          <p className="form-control-plaintext">{formData.emergencyContactRelation || '-'}</p>
                        )}
                      </div>
                    </div>

                    {/* Additional Information */}
                    <h6 className="mb-3 mt-4">Additional Information</h6>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Bio</label>
                        {isEditMode ? (
                          <textarea
                            className="form-control"
                            rows="3"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Brief biography"
                          />
                        ) : (
                          <p className="form-control-plaintext">{formData.bio || '-'}</p>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Achievements</label>
                        {isEditMode ? (
                          <textarea
                            className="form-control"
                            rows="3"
                            name="achievements"
                            value={formData.achievements}
                            onChange={handleChange}
                            placeholder="List achievements and awards"
                          />
                        ) : (
                          <p className="form-control-plaintext">{formData.achievements || '-'}</p>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Certifications</label>
                        {isEditMode ? (
                          <textarea
                            className="form-control"
                            rows="3"
                            name="certifications"
                            value={formData.certifications}
                            onChange={handleChange}
                            placeholder="List professional certifications"
                          />
                        ) : (
                          <p className="form-control-plaintext">{formData.certifications || '-'}</p>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Status</label>
                        {isEditMode ? (
                          <select
                            className="form-select"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="On Leave">On Leave</option>
                          </select>
                        ) : (
                          <p className="form-control-plaintext">
                            <span className={`badge ${formData.status === 'Active' ? 'bg-success' : formData.status === 'Inactive' ? 'bg-secondary' : 'bg-warning'}`}>
                              {formData.status}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {isEditMode && (
                      <div className="text-end">
                        <button
                          type="button"
                          className="btn btn-secondary me-2"
                          onClick={() => {
                            setIsEditMode(false);
                            // Reload original data
                            if (teacher) {
                              setFormData({
                                firstName: teacher.firstName || '',
                                lastName: teacher.lastName || '',
                                middleName: teacher.middleName || '',
                                email: teacher.email || '',
                                phone: teacher.phone || '',
                                alternatePhone: teacher.alternatePhone || '',
                                dateOfBirth: teacher.dateOfBirth || '',
                                gender: teacher.gender || 'Male',
                                bloodGroup: teacher.bloodGroup || '',
                                aadharNumber: teacher.aadharNumber || '',
                                nationality: teacher.nationality || 'Indian',
                                religion: teacher.religion || '',
                                address: teacher.address || '',
                                city: teacher.city || '',
                                state: teacher.state || '',
                                pincode: teacher.pincode || '',
                                employeeId: teacher.employeeId || '',
                                qualification: teacher.qualification || '',
                                experience: teacher.experience || '',
                                specialization: teacher.specialization || '',
                                subject: teacher.subject || '',
                                class: teacher.class || '',
                                designation: teacher.designation || '',
                                department: teacher.department || '',
                                joiningDate: teacher.joiningDate || '',
                                contractType: teacher.contractType || 'Permanent',
                                salary: teacher.salary || '',
                                bankName: teacher.bankName || '',
                                accountNumber: teacher.accountNumber || '',
                                ifscCode: teacher.ifscCode || '',
                                emergencyContactName: teacher.emergencyContactName || '',
                                emergencyContactPhone: teacher.emergencyContactPhone || '',
                                emergencyContactRelation: teacher.emergencyContactRelation || '',
                                bio: teacher.bio || '',
                                achievements: teacher.achievements || '',
                                certifications: teacher.certifications || '',
                                status: teacher.status || 'Active'
                              });
                            }
                          }}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          <i className="bi bi-save"></i> Save Changes
                        </button>
                      </div>
                    )}
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

export default TeacherProfile;

