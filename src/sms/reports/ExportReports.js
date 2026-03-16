import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ExportReports = () => {
  const { 
    students,
    teachers,
    fees,
    attendance,
    results,
    bookIssues
  } = useSchool();

  const [exportType, setExportType] = useState('PDF');
  const [dataSource, setDataSource] = useState('Students');
  const [selectedClass, setSelectedClass] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Get data based on source
  const getData = () => {
    let data = [];
    
    switch(dataSource) {
      case 'Students':
        data = students;
        if (selectedClass !== 'All') {
          data = data.filter(s => s.class === selectedClass);
        }
        break;
      case 'Teachers':
        data = teachers;
        break;
      case 'Fees':
        data = fees;
        if (selectedClass !== 'All') {
          data = data.filter(f => f.class === selectedClass);
        }
        if (startDate) {
          data = data.filter(f => f.dueDate && f.dueDate >= startDate);
        }
        if (endDate) {
          data = data.filter(f => f.dueDate && f.dueDate <= endDate);
        }
        break;
      case 'Attendance':
        data = attendance;
        if (startDate) {
          data = data.filter(a => a.date && a.date >= startDate);
        }
        if (endDate) {
          data = data.filter(a => a.date && a.date <= endDate);
        }
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
    
    return data;
  };

  const exportToPDF = () => {
    const data = getData();
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text(`${dataSource} Report`, 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
    
    // Prepare table data
    const tableData = [];
    const headers = [];
    
    if (dataSource === 'Students') {
      headers.push(['Admission No', 'Name', 'Class', 'Section', 'Gender', 'Status']);
      data.forEach(item => {
        tableData.push([
          item.admissionNo || '-',
          `${item.firstName || ''} ${item.lastName || ''}`,
          item.class || '-',
          item.section || '-',
          item.gender || '-',
          item.status || '-'
        ]);
      });
    } else if (dataSource === 'Teachers') {
      headers.push(['Employee ID', 'Name', 'Subject', 'Phone', 'Email', 'Status']);
      data.forEach(item => {
        tableData.push([
          item.employeeId || '-',
          `${item.firstName || ''} ${item.lastName || ''}`,
          item.subject || '-',
          item.phone || '-',
          item.email || '-',
          item.status || '-'
        ]);
      });
    } else if (dataSource === 'Fees') {
      headers.push(['Student', 'Fee Type', 'Amount', 'Due Date', 'Paid Date', 'Status']);
      data.forEach(item => {
        tableData.push([
          item.studentName || '-',
          item.feeType || '-',
          `₹${(item.amount || 0).toLocaleString()}`,
          item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-',
          item.paidDate ? new Date(item.paidDate).toLocaleDateString() : '-',
          item.status || '-'
        ]);
      });
    } else if (dataSource === 'Attendance') {
      headers.push(['Student', 'Class', 'Date', 'Status', 'Remarks']);
      data.forEach(item => {
        tableData.push([
          item.studentName || '-',
          item.class || '-',
          item.date ? new Date(item.date).toLocaleDateString() : '-',
          item.status || '-',
          item.remarks || '-'
        ]);
      });
    } else if (dataSource === 'Results') {
      headers.push(['Student', 'Exam', 'Subject', 'Marks', 'Percentage', 'Grade', 'Status']);
      data.forEach(item => {
        tableData.push([
          item.studentName || '-',
          item.examName || '-',
          item.subjectName || '-',
          `${item.obtainedMarks || 0}/${item.maxMarks || 0}`,
          `${item.percentage || 0}%`,
          item.grade || '-',
          item.status || '-'
        ]);
      });
    } else if (dataSource === 'Books') {
      headers.push(['Borrower', 'Book', 'Issue Date', 'Due Date', 'Return Date', 'Status']);
      data.forEach(item => {
        tableData.push([
          item.borrowerName || '-',
          item.bookTitle || '-',
          item.issueDate ? new Date(item.issueDate).toLocaleDateString() : '-',
          item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-',
          item.returnDate ? new Date(item.returnDate).toLocaleDateString() : '-',
          item.status || '-'
        ]);
      });
    }

    // Create table
    autoTable(doc, {
      startY: 30,
      head: headers,
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold'
      }
    });

    // Save PDF
    const fileName = `${dataSource}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const exportToExcel = () => {
    const data = getData();
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    // Create CSV content
    let csvContent = '';
    
    if (dataSource === 'Students') {
      csvContent = 'Admission No,Name,Class,Section,Gender,Status\n';
      data.forEach(item => {
        csvContent += `${item.admissionNo || ''},${item.firstName || ''} ${item.lastName || ''},${item.class || ''},${item.section || ''},${item.gender || ''},${item.status || ''}\n`;
      });
    } else if (dataSource === 'Teachers') {
      csvContent = 'Employee ID,Name,Subject,Phone,Email,Status\n';
      data.forEach(item => {
        csvContent += `${item.employeeId || ''},${item.firstName || ''} ${item.lastName || ''},${item.subject || ''},${item.phone || ''},${item.email || ''},${item.status || ''}\n`;
      });
    } else if (dataSource === 'Fees') {
      csvContent = 'Student,Fee Type,Amount,Due Date,Paid Date,Status\n';
      data.forEach(item => {
        csvContent += `${item.studentName || ''},${item.feeType || ''},${item.amount || 0},${item.dueDate || ''},${item.paidDate || ''},${item.status || ''}\n`;
      });
    } else if (dataSource === 'Attendance') {
      csvContent = 'Student,Class,Date,Status,Remarks\n';
      data.forEach(item => {
        csvContent += `${item.studentName || ''},${item.class || ''},${item.date || ''},${item.status || ''},${item.remarks || ''}\n`;
      });
    } else if (dataSource === 'Results') {
      csvContent = 'Student,Exam,Subject,Marks,Percentage,Grade,Status\n';
      data.forEach(item => {
        csvContent += `${item.studentName || ''},${item.examName || ''},${item.subjectName || ''},${item.obtainedMarks || 0}/${item.maxMarks || 0},${item.percentage || 0}%,${item.grade || ''},${item.status || ''}\n`;
      });
    } else if (dataSource === 'Books') {
      csvContent = 'Borrower,Book,Issue Date,Due Date,Return Date,Status\n';
      data.forEach(item => {
        csvContent += `${item.borrowerName || ''},${item.bookTitle || ''},${item.issueDate || ''},${item.dueDate || ''},${item.returnDate || ''},${item.status || ''}\n`;
      });
    }

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${dataSource}_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = () => {
    if (exportType === 'PDF') {
      exportToPDF();
    } else {
      exportToExcel();
    }
  };

  const data = getData();

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Export Reports</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/reports">Reports</Link></li>
              <li className="breadcrumb-item active">Export Reports</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Export Options</h5>
                  <form>
                    <div className="row mb-3">
                      <div className="col-md-3">
                        <label className="form-label">Export Format</label>
                        <select
                          className="form-select"
                          value={exportType}
                          onChange={(e) => setExportType(e.target.value)}
                        >
                          <option value="PDF">PDF</option>
                          <option value="Excel">Excel (CSV)</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Data Source</label>
                        <select
                          className="form-select"
                          value={dataSource}
                          onChange={(e) => setDataSource(e.target.value)}
                        >
                          <option value="Students">Students</option>
                          <option value="Teachers">Teachers</option>
                          <option value="Fees">Fees</option>
                          <option value="Attendance">Attendance</option>
                          <option value="Results">Results</option>
                          <option value="Books">Books</option>
                        </select>
                      </div>
                      {(dataSource === 'Students' || dataSource === 'Fees') && (
                        <div className="col-md-3">
                          <label className="form-label">Class</label>
                          <select
                            className="form-select"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                          >
                            <option value="All">All Classes</option>
                            {[...new Set(students.map(s => s.class))].map(cls => (
                              <option key={cls} value={cls}>{cls}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      {(dataSource === 'Fees' || dataSource === 'Attendance') && (
                        <>
                          <div className="col-md-3">
                            <label className="form-label">Start Date</label>
                            <input
                              type="date"
                              className="form-control"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">End Date</label>
                            <input
                              type="date"
                              className="form-control"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="alert alert-info">
                      <strong>Records to Export:</strong> {data.length} record(s)
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className={`btn btn-lg ${exportType === 'PDF' ? 'btn-danger' : 'btn-success'}`}
                        onClick={handleExport}
                        disabled={data.length === 0}
                      >
                        <i className={`bi ${exportType === 'PDF' ? 'bi-file-pdf' : 'bi-file-excel'}`}></i> Export {exportType}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {data.length > 0 && (
            <div className="row mt-3">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Preview (First 10 Records)</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            {dataSource === 'Students' && (
                              <>
                                <th>Admission No</th>
                                <th>Name</th>
                                <th>Class</th>
                                <th>Section</th>
                                <th>Gender</th>
                                <th>Status</th>
                              </>
                            )}
                            {dataSource === 'Teachers' && (
                              <>
                                <th>Employee ID</th>
                                <th>Name</th>
                                <th>Subject</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Status</th>
                              </>
                            )}
                            {dataSource === 'Fees' && (
                              <>
                                <th>Student</th>
                                <th>Fee Type</th>
                                <th>Amount</th>
                                <th>Due Date</th>
                                <th>Status</th>
                              </>
                            )}
                            {dataSource === 'Attendance' && (
                              <>
                                <th>Student</th>
                                <th>Class</th>
                                <th>Date</th>
                                <th>Status</th>
                              </>
                            )}
                            {dataSource === 'Results' && (
                              <>
                                <th>Student</th>
                                <th>Exam</th>
                                <th>Subject</th>
                                <th>Marks</th>
                                <th>Grade</th>
                              </>
                            )}
                            {dataSource === 'Books' && (
                              <>
                                <th>Borrower</th>
                                <th>Book</th>
                                <th>Issue Date</th>
                                <th>Status</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {data.slice(0, 10).map((item, index) => (
                            <tr key={index}>
                              {dataSource === 'Students' && (
                                <>
                                  <td>{item.admissionNo}</td>
                                  <td>{item.firstName} {item.lastName}</td>
                                  <td>{item.class}</td>
                                  <td>{item.section}</td>
                                  <td>{item.gender}</td>
                                  <td>{item.status}</td>
                                </>
                              )}
                              {dataSource === 'Teachers' && (
                                <>
                                  <td>{item.employeeId || '-'}</td>
                                  <td>{item.firstName} {item.lastName}</td>
                                  <td>{item.subject}</td>
                                  <td>{item.phone}</td>
                                  <td>{item.email}</td>
                                  <td>{item.status}</td>
                                </>
                              )}
                              {dataSource === 'Fees' && (
                                <>
                                  <td>{item.studentName}</td>
                                  <td>{item.feeType}</td>
                                  <td>₹{item.amount?.toLocaleString()}</td>
                                  <td>{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-'}</td>
                                  <td>{item.status}</td>
                                </>
                              )}
                              {dataSource === 'Attendance' && (
                                <>
                                  <td>{item.studentName}</td>
                                  <td>{item.class}</td>
                                  <td>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                                  <td>{item.status}</td>
                                </>
                              )}
                              {dataSource === 'Results' && (
                                <>
                                  <td>{item.studentName}</td>
                                  <td>{item.examName}</td>
                                  <td>{item.subjectName}</td>
                                  <td>{item.obtainedMarks}/{item.maxMarks}</td>
                                  <td>{item.grade}</td>
                                </>
                              )}
                              {dataSource === 'Books' && (
                                <>
                                  <td>{item.borrowerName}</td>
                                  <td>{item.bookTitle}</td>
                                  <td>{item.issueDate ? new Date(item.issueDate).toLocaleDateString() : '-'}</td>
                                  <td>{item.status}</td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ExportReports;

