import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const AcademicSettings = () => {
  const { settings, updateSettings, academicYears } = useSchool();

  const [formData, setFormData] = useState({
    currentAcademicYear: '',
    admissionStartDate: '',
    admissionEndDate: '',
    academicYearStartMonth: 'April',
    academicYearEndMonth: 'March',
    classStartTime: '08:00',
    classEndTime: '15:00',
    periodDuration: 45,
    breakDuration: 15,
    lunchBreakDuration: 30,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    attendanceMarkingTime: '09:00',
    lateMarkingTime: '09:15',
    minimumAttendance: 75,
    examPassPercentage: 40,
    gradingSystem: 'Percentage',
    resultPublishDate: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const workingDaysOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (settings) {
      setFormData({
        currentAcademicYear: settings.currentAcademicYear || '',
        admissionStartDate: settings.admissionStartDate || '',
        admissionEndDate: settings.admissionEndDate || '',
        academicYearStartMonth: settings.academicYearStartMonth || 'April',
        academicYearEndMonth: settings.academicYearEndMonth || 'March',
        classStartTime: settings.classStartTime || '08:00',
        classEndTime: settings.classEndTime || '15:00',
        periodDuration: settings.periodDuration || 45,
        breakDuration: settings.breakDuration || 15,
        lunchBreakDuration: settings.lunchBreakDuration || 30,
        workingDays: settings.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        attendanceMarkingTime: settings.attendanceMarkingTime || '09:00',
        lateMarkingTime: settings.lateMarkingTime || '09:15',
        minimumAttendance: settings.minimumAttendance || 75,
        examPassPercentage: settings.examPassPercentage || 40,
        gradingSystem: settings.gradingSystem || 'Percentage',
        resultPublishDate: settings.resultPublishDate || ''
      });
    }
  }, [settings]);

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

  const handleWorkingDayToggle = (day) => {
    setFormData(prev => {
      const workingDays = prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day];
      return { ...prev, workingDays };
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.currentAcademicYear) {
      newErrors.currentAcademicYear = 'Current academic year is required';
    }
    
    if (formData.minimumAttendance < 0 || formData.minimumAttendance > 100) {
      newErrors.minimumAttendance = 'Minimum attendance must be between 0 and 100';
    }
    
    if (formData.examPassPercentage < 0 || formData.examPassPercentage > 100) {
      newErrors.examPassPercentage = 'Pass percentage must be between 0 and 100';
    }
    
    if (formData.workingDays.length === 0) {
      newErrors.workingDays = 'At least one working day must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      updateSettings(formData);
      setMessage('Academic settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Academic Settings</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/settings">Settings</Link></li>
              <li className="breadcrumb-item active">Academic Settings</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          {message && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {message}
              <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
            </div>
          )}

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Academic Settings</h5>
                  <form onSubmit={handleSubmit}>
                    <h6 className="card-title mt-4 mb-3">Academic Year</h6>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Current Academic Year <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.currentAcademicYear ? 'is-invalid' : ''}`}
                          name="currentAcademicYear"
                          value={formData.currentAcademicYear}
                          onChange={handleChange}
                        >
                          <option value="">Select Academic Year</option>
                          {academicYears.map(ay => (
                            <option key={ay.id} value={ay.id}>{ay.name}</option>
                          ))}
                        </select>
                        {errors.currentAcademicYear && <div className="invalid-feedback">{errors.currentAcademicYear}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Academic Year Start Month</label>
                        <select
                          className="form-select"
                          name="academicYearStartMonth"
                          value={formData.academicYearStartMonth}
                          onChange={handleChange}
                        >
                          <option value="January">January</option>
                          <option value="February">February</option>
                          <option value="March">March</option>
                          <option value="April">April</option>
                          <option value="May">May</option>
                          <option value="June">June</option>
                          <option value="July">July</option>
                          <option value="August">August</option>
                          <option value="September">September</option>
                          <option value="October">October</option>
                          <option value="November">November</option>
                          <option value="December">December</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Academic Year End Month</label>
                        <select
                          className="form-select"
                          name="academicYearEndMonth"
                          value={formData.academicYearEndMonth}
                          onChange={handleChange}
                        >
                          <option value="January">January</option>
                          <option value="February">February</option>
                          <option value="March">March</option>
                          <option value="April">April</option>
                          <option value="May">May</option>
                          <option value="June">June</option>
                          <option value="July">July</option>
                          <option value="August">August</option>
                          <option value="September">September</option>
                          <option value="October">October</option>
                          <option value="November">November</option>
                          <option value="December">December</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Admission Start Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="admissionStartDate"
                          value={formData.admissionStartDate}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Admission End Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="admissionEndDate"
                          value={formData.admissionEndDate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">Class Timings</h6>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Class Start Time</label>
                        <input
                          type="time"
                          className="form-control"
                          name="classStartTime"
                          value={formData.classStartTime}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Class End Time</label>
                        <input
                          type="time"
                          className="form-control"
                          name="classEndTime"
                          value={formData.classEndTime}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Period Duration (minutes)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="periodDuration"
                          value={formData.periodDuration}
                          onChange={handleChange}
                          min="30"
                          max="60"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Break Duration (minutes)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="breakDuration"
                          value={formData.breakDuration}
                          onChange={handleChange}
                          min="5"
                          max="30"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Lunch Break Duration (minutes)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="lunchBreakDuration"
                          value={formData.lunchBreakDuration}
                          onChange={handleChange}
                          min="15"
                          max="60"
                        />
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">Working Days</h6>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <div className={`border rounded p-3 ${errors.workingDays ? 'border-danger' : ''}`}>
                          {workingDaysOptions.map(day => (
                            <div key={day} className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={formData.workingDays.includes(day)}
                                onChange={() => handleWorkingDayToggle(day)}
                                id={`day-${day}`}
                              />
                              <label className="form-check-label" htmlFor={`day-${day}`}>
                                {day}
                              </label>
                            </div>
                          ))}
                        </div>
                        {errors.workingDays && <div className="text-danger mt-1">{errors.workingDays}</div>}
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">Attendance Settings</h6>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Attendance Marking Time</label>
                        <input
                          type="time"
                          className="form-control"
                          name="attendanceMarkingTime"
                          value={formData.attendanceMarkingTime}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Late Marking Time</label>
                        <input
                          type="time"
                          className="form-control"
                          name="lateMarkingTime"
                          value={formData.lateMarkingTime}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Minimum Attendance (%) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className={`form-control ${errors.minimumAttendance ? 'is-invalid' : ''}`}
                          name="minimumAttendance"
                          value={formData.minimumAttendance}
                          onChange={handleChange}
                          min="0"
                          max="100"
                        />
                        {errors.minimumAttendance && <div className="invalid-feedback">{errors.minimumAttendance}</div>}
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">Examination Settings</h6>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Exam Pass Percentage <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className={`form-control ${errors.examPassPercentage ? 'is-invalid' : ''}`}
                          name="examPassPercentage"
                          value={formData.examPassPercentage}
                          onChange={handleChange}
                          min="0"
                          max="100"
                        />
                        {errors.examPassPercentage && <div className="invalid-feedback">{errors.examPassPercentage}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Grading System</label>
                        <select
                          className="form-select"
                          name="gradingSystem"
                          value={formData.gradingSystem}
                          onChange={handleChange}
                        >
                          <option value="Percentage">Percentage</option>
                          <option value="Letter Grade">Letter Grade</option>
                          <option value="GPA">GPA</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Result Publish Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="resultPublishDate"
                          value={formData.resultPublishDate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="text-end">
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> Save Settings
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

export default AcademicSettings;

