import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const Exams = () => {
  const { exams, deleteExam } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExams = exams.filter(exam =>
    exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteExam(id);
    }
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Examinations</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Exams</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">All Exams</h5>
                    <Link to="/exams/add" className="btn btn-primary">
                      <i className="bi bi-plus-circle"></i> Add New Exam
                    </Link>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input type="text" className="form-control" placeholder="Search exams..."
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Exam Name</th>
                          <th>Class</th>
                          <th>Subject</th>
                          <th>Exam Date</th>
                          <th>Max Marks</th>
                          <th>Passing Marks</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExams.length === 0 ? (
                          <tr><td colSpan="7" className="text-center"><p className="text-muted">No exams found</p></td></tr>
                        ) : (
                          filteredExams.map((exam) => (
                            <tr key={exam.id}>
                              <td>{exam.name}</td>
                              <td>{exam.class}</td>
                              <td>{exam.subject}</td>
                              <td>{exam.examDate}</td>
                              <td>{exam.maxMarks}</td>
                              <td>{exam.passingMarks}</td>
                              <td>
                                <button className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(exam.id, exam.name)}>
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
};

export default Exams;

