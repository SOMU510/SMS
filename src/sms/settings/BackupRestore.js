import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const BackupRestore = () => {
  const { 
    students,
    teachers,
    classes,
    subjects,
    fees,
    attendance,
    results,
    timetables,
    academicYears
  } = useSchool();

  const [backupType, setBackupType] = useState('Full');
  const [autoBackup, setAutoBackup] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState('Daily');
  const [backupTime, setBackupTime] = useState('02:00');
  const [message, setMessage] = useState('');

  const handleBackup = () => {
    const data = {
      type: backupType,
      timestamp: new Date().toISOString(),
      students: backupType === 'Full' || backupType === 'Students' ? students : null,
      teachers: backupType === 'Full' || backupType === 'Teachers' ? teachers : null,
      classes: backupType === 'Full' || backupType === 'Academic' ? classes : null,
      subjects: backupType === 'Full' || backupType === 'Academic' ? subjects : null,
      fees: backupType === 'Full' || backupType === 'Financial' ? fees : null,
      attendance: backupType === 'Full' || backupType === 'Attendance' ? attendance : null,
      results: backupType === 'Full' || backupType === 'Results' ? results : null,
      timetables: backupType === 'Full' || backupType === 'Academic' ? timetables : null,
      academicYears: backupType === 'Full' || backupType === 'Academic' ? academicYears : null
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_${backupType.toLowerCase()}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMessage('Backup created successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleRestore = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      alert('Please select a valid JSON backup file');
      return;
    }

    if (!window.confirm('Are you sure you want to restore from backup? This will replace all current data.')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // In a real application, you would update the context/state with restored data
        // For now, we'll just show a success message
        setMessage('Backup restored successfully! (Note: In production, this would restore all data)');
        setTimeout(() => setMessage(''), 5000);
      } catch (error) {
        alert('Error reading backup file: ' + error.message);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
  };

  const handleExportCSV = (dataType) => {
    let data = [];
    let filename = '';
    
    switch(dataType) {
      case 'Students':
        data = students;
        filename = 'students_export.csv';
        break;
      case 'Teachers':
        data = teachers;
        filename = 'teachers_export.csv';
        break;
      case 'Fees':
        data = fees;
        filename = 'fees_export.csv';
        break;
      default:
        return;
    }

    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    // Convert to CSV
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header] || '';
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Backup & Restore</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/settings">Settings</Link></li>
              <li className="breadcrumb-item active">Backup & Restore</li>
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
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Create Backup</h5>
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Backup Type</label>
                      <select
                        className="form-select"
                        value={backupType}
                        onChange={(e) => setBackupType(e.target.value)}
                      >
                        <option value="Full">Full Backup</option>
                        <option value="Students">Students Only</option>
                        <option value="Teachers">Teachers Only</option>
                        <option value="Academic">Academic Data</option>
                        <option value="Financial">Financial Data</option>
                        <option value="Attendance">Attendance Data</option>
                        <option value="Results">Results Data</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <button
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={handleBackup}
                      >
                        <i className="bi bi-download"></i> Create Backup
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="card mt-3">
                <div className="card-body">
                  <h5 className="card-title">Auto Backup Settings</h5>
                  <form>
                    <div className="mb-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={autoBackup}
                          onChange={(e) => setAutoBackup(e.target.checked)}
                          id="autoBackup"
                        />
                        <label className="form-check-label" htmlFor="autoBackup">
                          Enable Auto Backup
                        </label>
                      </div>
                    </div>
                    {autoBackup && (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Backup Frequency</label>
                          <select
                            className="form-select"
                            value={backupFrequency}
                            onChange={(e) => setBackupFrequency(e.target.value)}
                          >
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Backup Time</label>
                          <input
                            type="time"
                            className="form-control"
                            value={backupTime}
                            onChange={(e) => setBackupTime(e.target.value)}
                          />
                        </div>
                        <div className="mb-3">
                          <button type="button" className="btn btn-success w-100">
                            <i className="bi bi-save"></i> Save Auto Backup Settings
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Restore from Backup</h5>
                  <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle"></i> <strong>Warning:</strong> Restoring from backup will replace all current data. Please ensure you have a current backup before proceeding.
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Select Backup File</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".json"
                      onChange={handleRestore}
                    />
                    <small className="text-muted">Select a JSON backup file to restore</small>
                  </div>
                </div>
              </div>

              <div className="card mt-3">
                <div className="card-body">
                  <h5 className="card-title">Export Data</h5>
                  <p className="text-muted">Export specific data types to CSV format</p>
                  <div className="d-grid gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => handleExportCSV('Students')}
                    >
                      <i className="bi bi-file-earmark-spreadsheet"></i> Export Students
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => handleExportCSV('Teachers')}
                    >
                      <i className="bi bi-file-earmark-spreadsheet"></i> Export Teachers
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => handleExportCSV('Fees')}
                    >
                      <i className="bi bi-file-earmark-spreadsheet"></i> Export Fees
                    </button>
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

export default BackupRestore;

