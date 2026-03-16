import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';

const Attendance = () => {
  const { students, classes, attendance, setAttendance } = useSchool();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});

  const filteredStudents = selectedClass
    ? students.filter(s => s.class === selectedClass)
    : [];

  const uniqueClasses = [...new Set(students.map(s => s.class))].sort();

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAttendance = {
      id: attendance.length + 1,
      date: selectedDate,
      class: selectedClass,
      students: Object.keys(attendanceData).map(studentId => ({
        studentId: parseInt(studentId),
        status: attendanceData[studentId]
      }))
    };
    setAttendance([...attendance, newAttendance]);
    setAttendanceData({});
    alert('Attendance marked successfully!');
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Attendance</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active">Attendance</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Mark Attendance</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Select Class</label>
                        <select className="form-select" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                          <option value="">Select Class</option>
                          {uniqueClasses.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Date</label>
                        <input type="date" className="form-control" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                      </div>
                    </div>

                    {filteredStudents.length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Admission No</th>
                              <th>Name</th>
                              <th>Present</th>
                              <th>Absent</th>
                              <th>Leave</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredStudents.map((student) => (
                              <tr key={student.id}>
                                <td>{student.admissionNo}</td>
                                <td>{student.firstName} {student.lastName}</td>
                                <td>
                                  <input type="radio" name={`attendance_${student.id}`} value="Present"
                                    checked={attendanceData[student.id] === 'Present'}
                                    onChange={() => handleAttendanceChange(student.id, 'Present')} />
                                </td>
                                <td>
                                  <input type="radio" name={`attendance_${student.id}`} value="Absent"
                                    checked={attendanceData[student.id] === 'Absent'}
                                    onChange={() => handleAttendanceChange(student.id, 'Absent')} />
                                </td>
                                <td>
                                  <input type="radio" name={`attendance_${student.id}`} value="Leave"
                                    checked={attendanceData[student.id] === 'Leave'}
                                    onChange={() => handleAttendanceChange(student.id, 'Leave')} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="text-end mt-3">
                          <button type="submit" className="btn btn-primary">
                            <i className="bi bi-save"></i> Save Attendance
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

export default Attendance;

