import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';

const Results = () => {
  const { students, exams, results, setResults } = useSchool();
  const [selectedExam, setSelectedExam] = useState('');
  const [resultData, setResultData] = useState({});

  const selectedExamData = exams.find(e => e.id === parseInt(selectedExam));
  const filteredStudents = selectedExamData
    ? students.filter(s => s.class === selectedExamData.class)
    : [];

  const handleMarksChange = (studentId, marks) => {
    setResultData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks: parseFloat(marks) || 0
      }
    }));
  };

  const calculateGrade = (marks, maxMarks) => {
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedExam) {
      alert('Please select an exam');
      return;
    }

    const newResults = Object.keys(resultData).map(studentId => ({
      id: results.length + parseInt(studentId),
      examId: parseInt(selectedExam),
      studentId: parseInt(studentId),
      marks: resultData[studentId].marks,
      maxMarks: selectedExamData.maxMarks,
      grade: calculateGrade(resultData[studentId].marks, selectedExamData.maxMarks),
      status: resultData[studentId].marks >= selectedExamData.passingMarks ? 'Pass' : 'Fail'
    }));

    setResults([...results, ...newResults]);
    setResultData({});
    alert('Results saved successfully!');
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Results</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active">Results</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Enter Results</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Select Exam</label>
                        <select className="form-select" value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
                          <option value="">Select Exam</option>
                          {exams.map(exam => (
                            <option key={exam.id} value={exam.id}>
                              {exam.name} - {exam.class} - {exam.subject}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {selectedExamData && filteredStudents.length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Admission No</th>
                              <th>Name</th>
                              <th>Marks Obtained</th>
                              <th>Max Marks</th>
                              <th>Grade</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredStudents.map((student) => {
                              const marks = resultData[student.id]?.marks || 0;
                              const grade = calculateGrade(marks, selectedExamData.maxMarks);
                              const status = marks >= selectedExamData.passingMarks ? 'Pass' : 'Fail';
                              return (
                                <tr key={student.id}>
                                  <td>{student.admissionNo}</td>
                                  <td>{student.firstName} {student.lastName}</td>
                                  <td>
                                    <input type="number" className="form-control" style={{ width: '100px' }}
                                      value={marks} onChange={(e) => handleMarksChange(student.id, e.target.value)}
                                      max={selectedExamData.maxMarks} min={0} />
                                  </td>
                                  <td>{selectedExamData.maxMarks}</td>
                                  <td><span className={`badge ${grade === 'F' ? 'bg-danger' : 'bg-success'}`}>{grade}</span></td>
                                  <td><span className={`badge ${status === 'Pass' ? 'bg-success' : 'bg-danger'}`}>{status}</span></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <div className="text-end mt-3">
                          <button type="submit" className="btn btn-primary">
                            <i className="bi bi-save"></i> Save Results
                          </button>
                        </div>
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

export default Results;

