import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const CustomReports = () => {
  const { 
    students,
    teachers,
    classes,
    fees,
    attendance,
    results,
    bookIssues
  } = useSchool();

  const [formData, setFormData] = useState({
    reportName: '',
    dataSource: 'Students', // Students, Teachers, Fees, Attendance, Results, Books
    fields: [],
    filters: {},
    groupBy: '',
    sortBy: '',
    sortOrder: 'asc'
  });
  const [selectedFields, setSelectedFields] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [savedReports, setSavedReports] = useState([]);

  // Available fields for each data source
  const availableFields = {
    Students: [
      { key: 'admissionNo', label: 'Admission No' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'class', label: 'Class' },
      { key: 'section', label: 'Section' },
      { key: 'gender', label: 'Gender' },
      { key: 'dateOfBirth', label: 'Date of Birth' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status' }
    ],
    Teachers: [
      { key: 'employeeId', label: 'Employee ID' },
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'subject', label: 'Subject' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status' }
    ],
    Fees: [
      { key: 'studentName', label: 'Student Name' },
      { key: 'feeType', label: 'Fee Type' },
      { key: 'amount', label: 'Amount' },
      { key: 'dueDate', label: 'Due Date' },
      { key: 'paidDate', label: 'Paid Date' },
      { key: 'status', label: 'Status' },
      { key: 'paymentMethod', label: 'Payment Method' }
    ],
    Attendance: [
      { key: 'studentName', label: 'Student Name' },
      { key: 'class', label: 'Class' },
      { key: 'date', label: 'Date' },
      { key: 'status', label: 'Status' },
      { key: 'remarks', label: 'Remarks' }
    ],
    Results: [
      { key: 'studentName', label: 'Student Name' },
      { key: 'examName', label: 'Exam Name' },
      { key: 'subjectName', label: 'Subject' },
      { key: 'obtainedMarks', label: 'Obtained Marks' },
      { key: 'maxMarks', label: 'Max Marks' },
      { key: 'percentage', label: 'Percentage' },
      { key: 'grade', label: 'Grade' },
      { key: 'status', label: 'Status' }
    ],
    Books: [
      { key: 'borrowerName', label: 'Borrower Name' },
      { key: 'bookTitle', label: 'Book Title' },
      { key: 'issueDate', label: 'Issue Date' },
      { key: 'dueDate', label: 'Due Date' },
      { key: 'returnDate', label: 'Return Date' },
      { key: 'status', label: 'Status' },
      { key: 'fineAmount', label: 'Fine Amount' }
    ]
  };

  const handleFieldToggle = (field) => {
    if (selectedFields.includes(field.key)) {
      setSelectedFields(selectedFields.filter(f => f !== field.key));
    } else {
      setSelectedFields([...selectedFields, field.key]);
    }
  };

  const generateReport = () => {
    if (selectedFields.length === 0) {
      alert('Please select at least one field');
      return;
    }

    let data = [];
    
    switch(formData.dataSource) {
      case 'Students':
        data = students;
        break;
      case 'Teachers':
        data = teachers;
        break;
      case 'Fees':
        data = fees;
        break;
      case 'Attendance':
        data = attendance;
        break;
      case 'Results':
        data = results;
        break;
      case 'Books':
        data = bookIssues;
        break;
      default:
        data = [];
    }

    // Filter data based on selected fields
    const filteredData = data.map(item => {
      const filtered = {};
      selectedFields.forEach(fieldKey => {
        const field = availableFields[formData.dataSource].find(f => f.key === fieldKey);
        if (field) {
          filtered[field.label] = item[fieldKey] || '-';
        }
      });
      return filtered;
    });

    setReportData(filteredData);
  };

  const saveReport = () => {
    if (!formData.reportName.trim()) {
      alert('Please enter a report name');
      return;
    }

    const report = {
      id: savedReports.length + 1,
      name: formData.reportName,
      dataSource: formData.dataSource,
      fields: selectedFields,
      createdAt: new Date().toISOString()
    };

    setSavedReports([...savedReports, report]);
    alert('Report saved successfully!');
  };

  const loadReport = (report) => {
    setFormData(prev => ({
      ...prev,
      reportName: report.name,
      dataSource: report.dataSource
    }));
    setSelectedFields(report.fields);
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Custom Reports</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/reports">Reports</Link></li>
              <li className="breadcrumb-item active">Custom Reports</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Report Builder</h5>
                  
                  <div className="mb-3">
                    <label className="form-label">Report Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.reportName}
                      onChange={(e) => setFormData(prev => ({ ...prev, reportName: e.target.value }))}
                      placeholder="Enter report name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Data Source</label>
                    <select
                      className="form-select"
                      value={formData.dataSource}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, dataSource: e.target.value }));
                        setSelectedFields([]);
                        setReportData([]);
                      }}
                    >
                      <option value="Students">Students</option>
                      <option value="Teachers">Teachers</option>
                      <option value="Fees">Fees</option>
                      <option value="Attendance">Attendance</option>
                      <option value="Results">Results</option>
                      <option value="Books">Books</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Select Fields</label>
                    <div className="border rounded p-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {availableFields[formData.dataSource]?.map(field => (
                        <div key={field.key} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedFields.includes(field.key)}
                            onChange={() => handleFieldToggle(field)}
                            id={`field-${field.key}`}
                          />
                          <label className="form-check-label" htmlFor={`field-${field.key}`}>
                            {field.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={generateReport}
                    >
                      <i className="bi bi-play-circle"></i> Generate Report
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={saveReport}
                    >
                      <i className="bi bi-save"></i> Save Report
                    </button>
                  </div>
                </div>
              </div>

              {savedReports.length > 0 && (
                <div className="card mt-3">
                  <div className="card-body">
                    <h5 className="card-title">Saved Reports</h5>
                    <div className="list-group">
                      {savedReports.map(report => (
                        <div key={report.id} className="list-group-item">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-0">{report.name}</h6>
                              <small className="text-muted">{report.dataSource}</small>
                            </div>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => loadReport(report)}
                            >
                              <i className="bi bi-arrow-clockwise"></i> Load
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="col-lg-8">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">Report Results</h5>
                    {reportData.length > 0 && (
                      <div>
                        <button className="btn btn-sm btn-success me-2">
                          <i className="bi bi-file-excel"></i> Export Excel
                        </button>
                        <button className="btn btn-sm btn-danger">
                          <i className="bi bi-file-pdf"></i> Export PDF
                        </button>
                      </div>
                    )}
                  </div>

                  {reportData.length === 0 ? (
                    <div className="text-center text-muted p-5">
                      <i className="bi bi-file-earmark-text fs-1"></i>
                      <p className="mt-3">No report data. Select fields and generate report.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover table-bordered">
                        <thead className="table-light">
                          <tr>
                            {selectedFields.map(fieldKey => {
                              const field = availableFields[formData.dataSource].find(f => f.key === fieldKey);
                              return <th key={fieldKey}>{field?.label || fieldKey}</th>;
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.map((row, index) => (
                            <tr key={index}>
                              {selectedFields.map(fieldKey => {
                                const field = availableFields[formData.dataSource].find(f => f.key === fieldKey);
                                const value = row[field?.label || fieldKey];
                                return (
                                  <td key={fieldKey}>
                                    {typeof value === 'number' ? value.toLocaleString() : value}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="mt-3 text-muted">
                        <strong>Total Records:</strong> {reportData.length}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CustomReports;

