import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Receipts = () => {
  const { id } = useParams();
  const { fees, students } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Paid');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Get specific receipt if ID is provided
  const specificReceipt = id ? fees.find(f => f.id === parseInt(id)) : null;

  // Filter receipts
  let filteredReceipts = fees.filter(fee => {
    const isPaid = fee.status === 'Paid';
    const matchesSearch = 
      fee.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || fee.status === filterStatus;
    const matchesStartDate = !startDate || (fee.paidDate && fee.paidDate >= startDate);
    const matchesEndDate = !endDate || (fee.paidDate && fee.paidDate <= endDate);
    return isPaid && matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
  });

  const generatePDF = (fee) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('FEE PAYMENT RECEIPT', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('School Management System', 105, 28, { align: 'center' });
    doc.text('Receipt No: RCP' + String(fee.id).padStart(6, '0'), 105, 35, { align: 'center' });
    
    // Receipt details
    let yPos = 50;
    doc.setFontSize(12);
    doc.text('Receipt Details', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.text(`Date: ${fee.paidDate ? new Date(fee.paidDate).toLocaleDateString() : '-'}`, 20, yPos);
    yPos += 7;
    doc.text(`Student Name: ${fee.studentName || '-'}`, 20, yPos);
    yPos += 7;
    doc.text(`Admission No: ${fee.admissionNo || '-'}`, 20, yPos);
    yPos += 7;
    doc.text(`Class: ${fee.class || '-'}`, 20, yPos);
    yPos += 7;
    doc.text(`Fee Type: ${fee.feeType || '-'}`, 20, yPos);
    yPos += 7;
    doc.text(`Amount: ₹${fee.amount?.toLocaleString() || '0'}`, 20, yPos);
    yPos += 7;
    doc.text(`Payment Method: ${fee.paymentMethod || '-'}`, 20, yPos);
    if (fee.transactionId) {
      yPos += 7;
      doc.text(`Transaction ID: ${fee.transactionId}`, 20, yPos);
    }
    if (fee.chequeNumber) {
      yPos += 7;
      doc.text(`Cheque No: ${fee.chequeNumber}`, 20, yPos);
    }
    
    yPos += 15;
    doc.setFontSize(10);
    doc.text('This is a computer-generated receipt.', 105, yPos, { align: 'center' });
    
    // Save PDF
    const fileName = `Receipt_${fee.studentName?.replace(/\s+/g, '_')}_${fee.id}.pdf`;
    doc.save(fileName);
  };

  const handlePrint = (fee) => {
    window.print();
  };

  // If viewing specific receipt
  if (specificReceipt) {
    const student = students.find(s => s.id === specificReceipt.studentId);
    
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Payment Receipt</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/fees/receipts">Receipts</Link></li>
                <li className="breadcrumb-item active">View Receipt</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className="card print-receipt">
                  <div className="card-body">
                    <div className="text-center mb-4">
                      <h3>FEE PAYMENT RECEIPT</h3>
                      <p className="text-muted">School Management System</p>
                      <p><strong>Receipt No:</strong> RCP{String(specificReceipt.id).padStart(6, '0')}</p>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <p><strong>Date:</strong> {specificReceipt.paidDate ? new Date(specificReceipt.paidDate).toLocaleDateString() : '-'}</p>
                        <p><strong>Student Name:</strong> {specificReceipt.studentName}</p>
                        <p><strong>Admission No:</strong> {specificReceipt.admissionNo || '-'}</p>
                        <p><strong>Class:</strong> {specificReceipt.class}</p>
                        <p><strong>Section:</strong> {specificReceipt.section || '-'}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Fee Type:</strong> {specificReceipt.feeType}</p>
                        <p><strong>Amount:</strong> ₹{specificReceipt.amount?.toLocaleString() || '0'}</p>
                        <p><strong>Payment Method:</strong> {specificReceipt.paymentMethod}</p>
                        {specificReceipt.transactionId && (
                          <p><strong>Transaction ID:</strong> {specificReceipt.transactionId}</p>
                        )}
                        {specificReceipt.chequeNumber && (
                          <p><strong>Cheque No:</strong> {specificReceipt.chequeNumber}</p>
                        )}
                        {specificReceipt.bankName && (
                          <p><strong>Bank:</strong> {specificReceipt.bankName}</p>
                        )}
                      </div>
                    </div>

                    <div className="border-top pt-3 mt-3">
                      <p className="text-center text-muted small">
                        This is a computer-generated receipt. No signature required.
                      </p>
                    </div>

                    <div className="text-end mt-4">
                      <button
                        className="btn btn-primary me-2"
                        onClick={() => generatePDF(specificReceipt)}
                      >
                        <i className="bi bi-file-pdf"></i> Download PDF
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={handlePrint}
                      >
                        <i className="bi bi-printer"></i> Print
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <style>{`
              @media print {
                body * {
                  visibility: hidden;
                }
                .print-receipt, .print-receipt * {
                  visibility: visible;
                }
                .print-receipt {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                }
                .pagetitle, .breadcrumb, .btn {
                  display: none !important;
                }
              }
            `}</style>
          </section>
        </div>
      </main>
    );
  }

  // List view
  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Payment Receipts</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/fees">Fees</Link></li>
              <li className="breadcrumb-item active">Receipts</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Filter Receipts</h5>
                  <div className="row">
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by student, transaction ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2">
                      <select
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="Paid">Paid</option>
                        <option value="All">All Status</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Start Date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="End Date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">All Receipts</h5>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Receipt No</th>
                          <th>Date</th>
                          <th>Student Name</th>
                          <th>Class</th>
                          <th>Fee Type</th>
                          <th>Amount</th>
                          <th>Payment Method</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReceipts.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center text-muted">
                              No receipts found
                            </td>
                          </tr>
                        ) : (
                          filteredReceipts.map((fee) => (
                            <tr key={fee.id}>
                              <td><strong>RCP{String(fee.id).padStart(6, '0')}</strong></td>
                              <td>{fee.paidDate ? new Date(fee.paidDate).toLocaleDateString() : '-'}</td>
                              <td>{fee.studentName}</td>
                              <td>{fee.class}</td>
                              <td>{fee.feeType}</td>
                              <td>₹{fee.amount?.toLocaleString() || '0'}</td>
                              <td>{fee.paymentMethod}</td>
                              <td>
                                <Link
                                  to={`/fees/receipts/${fee.id}`}
                                  className="btn btn-sm btn-primary me-1"
                                >
                                  <i className="bi bi-eye"></i> View
                                </Link>
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => generatePDF(fee)}
                                >
                                  <i className="bi bi-file-pdf"></i> PDF
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
};

export default Receipts;

