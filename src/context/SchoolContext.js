import React, { createContext, useState, useContext } from 'react';

const SchoolContext = createContext();

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within SchoolProvider');
  }
  return context;
};

export const SchoolProvider = ({ children }) => {
  // Students Data
  const [students, setStudents] = useState([
    {
      id: 1,
      admissionNo: 'ADM001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      dateOfBirth: '2010-05-15',
      gender: 'Male',
      address: '123 Main St',
      class: '10-A',
      section: 'A',
      parentName: 'Jane Doe',
      parentPhone: '9876543210',
      admissionDate: '2024-01-15',
      status: 'Active'
    },
    {
      id: 2,
      admissionNo: 'ADM002',
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'sarah.smith@example.com',
      phone: '1234567891',
      dateOfBirth: '2011-08-20',
      gender: 'Female',
      address: '456 Oak Ave',
      class: '9-B',
      section: 'B',
      parentName: 'Mike Smith',
      parentPhone: '9876543211',
      admissionDate: '2024-01-20',
      status: 'Active'
    }
  ]);

  // Teachers Data
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      firstName: 'Dr. Robert',
      lastName: 'Johnson',
      email: 'robert.johnson@school.com',
      phone: '1112223333',
      dateOfBirth: '1985-03-10',
      gender: 'Male',
      address: '789 Pine St',
      qualification: 'Ph.D. in Mathematics',
      experience: '10 years',
      subject: 'Mathematics',
      class: '10-A',
      joiningDate: '2020-01-01',
      salary: '50000',
      status: 'Active'
    }
  ]);

  // Staff Data (includes all staff types)
  const [staff, setStaff] = useState([
    {
      id: 1,
      firstName: 'Dr. Robert',
      lastName: 'Johnson',
      middleName: '',
      email: 'robert.johnson@school.com',
      phone: '1112223333',
      dateOfBirth: '1985-03-10',
      gender: 'Male',
      staffType: 'Teacher',
      employeeId: 'EMP001',
      designation: 'Senior Teacher',
      department: 'Mathematics',
      qualification: 'Ph.D. in Mathematics',
      experience: '10 years',
      subject: 'Mathematics',
      class: '10-A',
      joiningDate: '2020-01-01',
      contractType: 'Permanent',
      salary: '50000',
      status: 'Active'
    },
    {
      id: 2,
      firstName: 'Ms. Sarah',
      lastName: 'Williams',
      middleName: '',
      email: 'sarah.williams@school.com',
      phone: '1112223334',
      dateOfBirth: '1990-05-15',
      gender: 'Female',
      staffType: 'Administrator',
      employeeId: 'EMP002',
      designation: 'Administrative Officer',
      department: 'Administration',
      qualification: 'M.B.A.',
      experience: '5 years',
      joiningDate: '2021-06-01',
      contractType: 'Permanent',
      salary: '45000',
      status: 'Active'
    }
  ]);

  // Classes Data
  const [classes, setClasses] = useState([
    { id: 1, name: 'Class 1', sections: ['A', 'B'], capacity: 40 },
    { id: 2, name: 'Class 2', sections: ['A', 'B'], capacity: 40 },
    { id: 3, name: 'Class 3', sections: ['A', 'B'], capacity: 40 },
    { id: 4, name: 'Class 4', sections: ['A', 'B'], capacity: 40 },
    { id: 5, name: 'Class 5', sections: ['A', 'B'], capacity: 40 },
    { id: 6, name: 'Class 6', sections: ['A', 'B'], capacity: 40 },
    { id: 7, name: 'Class 7', sections: ['A', 'B'], capacity: 40 },
    { id: 8, name: 'Class 8', sections: ['A', 'B'], capacity: 40 },
    { id: 9, name: 'Class 9', sections: ['A', 'B'], capacity: 40 },
    { id: 10, name: 'Class 10', sections: ['A', 'B'], capacity: 40 }
  ]);

  // Subjects Data
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Mathematics', code: 'MATH', class: 'All', teacher: 'Dr. Robert Johnson' },
    { id: 2, name: 'English', code: 'ENG', class: 'All', teacher: 'Ms. Emily Brown' },
    { id: 3, name: 'Science', code: 'SCI', class: 'All', teacher: 'Mr. David Wilson' },
    { id: 4, name: 'Social Studies', code: 'SST', class: 'All', teacher: 'Ms. Lisa Anderson' }
  ]);

  // Attendance Data
  const [attendance, setAttendance] = useState([]);

  // Staff Attendance Data
  const [staffAttendance, setStaffAttendance] = useState([
    {
      id: 1,
      staffId: 1,
      staffName: 'Dr. Robert Johnson',
      employeeId: 'EMP001',
      date: '2024-12-15',
      status: 'Present',
      checkIn: '09:00',
      checkOut: '17:00',
      notes: ''
    },
    {
      id: 2,
      staffId: 2,
      staffName: 'Ms. Sarah Williams',
      employeeId: 'EMP002',
      date: '2024-12-15',
      status: 'Present',
      checkIn: '09:15',
      checkOut: '17:30',
      notes: ''
    }
  ]);

  // Leave Requests Data
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      staffId: 1,
      staffName: 'Dr. Robert Johnson',
      employeeId: 'EMP001',
      leaveType: 'Sick Leave',
      startDate: '2024-12-20',
      endDate: '2024-12-22',
      days: 3,
      reason: 'Medical treatment required',
      appliedDate: '2024-12-10',
      status: 'Pending',
      approvedBy: '',
      remarks: ''
    },
    {
      id: 2,
      staffId: 2,
      staffName: 'Ms. Sarah Williams',
      employeeId: 'EMP002',
      leaveType: 'Casual Leave',
      startDate: '2024-12-25',
      endDate: '2024-12-26',
      days: 2,
      reason: 'Personal work',
      appliedDate: '2024-12-15',
      status: 'Approved',
      approvedBy: 'Principal',
      remarks: 'Approved for personal work'
    }
  ]);

  // Payroll Data
  const [payrolls, setPayrolls] = useState([
    {
      id: 1,
      staffId: 1,
      employeeId: 'EMP001',
      staffName: 'Dr. Robert Johnson',
      month: '2024-12',
      year: 2024,
      basicSalary: 50000,
      allowances: {
        houseRent: 10000,
        medical: 5000,
        transport: 3000,
        other: 2000
      },
      deductions: {
        tax: 5000,
        providentFund: 3000,
        insurance: 2000,
        loan: 0,
        other: 0
      },
      overtime: 0,
      bonus: 5000,
      grossSalary: 75000,
      totalDeductions: 10000,
      netSalary: 65000,
      paymentDate: '2024-12-05',
      paymentMethod: 'Bank Transfer',
      status: 'Paid',
      remarks: 'December salary processed'
    },
    {
      id: 2,
      staffId: 2,
      employeeId: 'EMP002',
      staffName: 'Ms. Sarah Williams',
      month: '2024-12',
      year: 2024,
      basicSalary: 45000,
      allowances: {
        houseRent: 8000,
        medical: 4000,
        transport: 2500,
        other: 1500
      },
      deductions: {
        tax: 4000,
        providentFund: 2500,
        insurance: 1500,
        loan: 0,
        other: 0
      },
      overtime: 2000,
      bonus: 0,
      grossSalary: 63000,
      totalDeductions: 8000,
      netSalary: 55000,
      paymentDate: '',
      paymentMethod: 'Bank Transfer',
      status: 'Pending',
      remarks: ''
    }
  ]);

  // Class Allocation Data
  const [classAllocations, setClassAllocations] = useState([
    {
      id: 1,
      academicYearId: 1,
      academicYearName: '2024-2025',
      classId: 1,
      className: 'Class 1',
      sectionId: 1,
      sectionName: 'Section A',
      teacherId: 1,
      teacherName: 'Dr. Robert Johnson',
      subjectId: null,
      subjectName: null,
      allocationType: 'Class Teacher',
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      status: 'Active',
      remarks: 'Primary class teacher'
    },
    {
      id: 2,
      academicYearId: 1,
      academicYearName: '2024-2025',
      classId: 1,
      className: 'Class 1',
      sectionId: 1,
      sectionName: 'Section A',
      teacherId: 1,
      teacherName: 'Dr. Robert Johnson',
      subjectId: 1,
      subjectName: 'Mathematics',
      allocationType: 'Subject Teacher',
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      status: 'Active',
      remarks: ''
    },
    {
      id: 3,
      academicYearId: 1,
      academicYearName: '2024-2025',
      classId: 2,
      className: 'Class 2',
      sectionId: 2,
      sectionName: 'Section A',
      teacherId: 2,
      teacherName: 'Ms. Sarah Williams',
      subjectId: null,
      subjectName: null,
      allocationType: 'Class Teacher',
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      status: 'Active',
      remarks: ''
    }
  ]);

  // Teacher Subject Allocation Data
  const [teacherSubjectAllocations, setTeacherSubjectAllocations] = useState([
    {
      id: 1,
      academicYearId: 1,
      academicYearName: '2024-2025',
      teacherId: 1,
      teacherName: 'Dr. Robert Johnson',
      teacherEmployeeId: 'EMP001',
      classId: 1,
      className: 'Class 1',
      sectionId: 1,
      sectionName: 'Section A',
      subjectId: 1,
      subjectName: 'Mathematics',
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      status: 'Active',
      remarks: ''
    },
    {
      id: 2,
      academicYearId: 1,
      academicYearName: '2024-2025',
      teacherId: 2,
      teacherName: 'Ms. Sarah Williams',
      teacherEmployeeId: 'EMP002',
      classId: 1,
      className: 'Class 1',
      sectionId: 1,
      sectionName: 'Section A',
      subjectId: 2,
      subjectName: 'English',
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      status: 'Active',
      remarks: ''
    },
    {
      id: 3,
      academicYearId: 1,
      academicYearName: '2024-2025',
      teacherId: 1,
      teacherName: 'Dr. Robert Johnson',
      teacherEmployeeId: 'EMP001',
      classId: 2,
      className: 'Class 2',
      sectionId: 2,
      sectionName: 'Section A',
      subjectId: 1,
      subjectName: 'Mathematics',
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      status: 'Active',
      remarks: ''
    }
  ]);

  // Performance Evaluation Data
  const [performanceEvaluations, setPerformanceEvaluations] = useState([
    {
      id: 1,
      staffId: 1,
      staffName: 'Dr. Robert Johnson',
      employeeId: 'EMP001',
      staffType: 'Teacher',
      evaluationPeriod: 'Q1',
      evaluationDate: '2024-07-15',
      evaluatorName: 'Principal',
      teachingQuality: 4.5,
      subjectKnowledge: 4.8,
      classroomManagement: 4.3,
      studentEngagement: 4.6,
      lessonPlanning: 4.4,
      communication: 4.5,
      teamwork: 4.2,
      punctuality: 5.0,
      professionalism: 4.7,
      problemSolving: 4.3,
      studentSatisfaction: 4.6,
      parentFeedback: 4.4,
      attendance: 5.0,
      initiative: 4.5,
      overallRating: 4.5,
      strengths: 'Excellent subject knowledge, strong classroom management, good student engagement',
      areasForImprovement: 'Could improve on collaborative projects with other teachers',
      recommendations: 'Continue professional development in innovative teaching methods',
      status: 'Completed',
      remarks: 'Outstanding performance in Q1'
    },
    {
      id: 2,
      staffId: 2,
      staffName: 'Ms. Sarah Williams',
      employeeId: 'EMP002',
      staffType: 'Teacher',
      evaluationPeriod: 'Q1',
      evaluationDate: '2024-07-20',
      evaluatorName: 'Principal',
      teachingQuality: 4.2,
      subjectKnowledge: 4.3,
      classroomManagement: 4.0,
      studentEngagement: 4.4,
      lessonPlanning: 4.1,
      communication: 4.3,
      teamwork: 4.5,
      punctuality: 4.8,
      professionalism: 4.4,
      problemSolving: 4.2,
      studentSatisfaction: 4.3,
      parentFeedback: 4.2,
      attendance: 4.9,
      initiative: 4.3,
      overallRating: 4.3,
      strengths: 'Great teamwork, consistent performance, good communication skills',
      areasForImprovement: 'Can enhance lesson planning and classroom management techniques',
      recommendations: 'Attend workshops on advanced teaching methodologies',
      status: 'Completed',
      remarks: 'Good performance, room for growth'
    }
  ]);

  // Fees Data
  const [fees, setFees] = useState([
    {
      id: 1,
      studentId: 1,
      studentName: 'John Doe',
      admissionNo: 'ADM001',
      class: '10-A',
      section: 'A',
      feeType: 'Tuition Fee',
      categoryId: 1,
      amount: 5000,
      dueDate: '2024-02-01',
      paidDate: '2024-01-25',
      status: 'Paid',
      paymentMethod: 'Online',
      transactionId: 'TXN001',
      paymentGateway: 'Razorpay',
      academicYearId: 1
    }
  ]);

  // Fee Categories Data
  const [feeCategories, setFeeCategories] = useState([
    {
      id: 1,
      name: 'Tuition Fee',
      code: 'TUIT',
      description: 'Monthly tuition fee',
      isRecurring: true,
      frequency: 'Monthly',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Library Fee',
      code: 'LIB',
      description: 'Library membership fee',
      isRecurring: false,
      frequency: 'Yearly',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Sports Fee',
      code: 'SPRT',
      description: 'Sports and activities fee',
      isRecurring: true,
      frequency: 'Quarterly',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Lab Fee',
      code: 'LAB',
      description: 'Laboratory fee',
      isRecurring: true,
      frequency: 'Yearly',
      status: 'Active'
    },
    {
      id: 5,
      name: 'Transport Fee',
      code: 'TRANS',
      description: 'Transportation fee',
      isRecurring: true,
      frequency: 'Monthly',
      status: 'Active'
    }
  ]);

  // Fee Structures Data
  const [feeStructures, setFeeStructures] = useState([]);

  // Exams Data
  const [exams, setExams] = useState([
    {
      id: 1,
      name: 'Mid Term Exam',
      class: '10-A',
      subject: 'Mathematics',
      examDate: '2024-03-15',
      maxMarks: 100,
      passingMarks: 33
    }
  ]);

  // Exam Types Data
  const [examTypes, setExamTypes] = useState([
    {
      id: 1,
      name: 'Mid-Term Examination',
      code: 'MT',
      description: 'Mid-term examination for all classes',
      weightage: 30,
      isFinal: false,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Final Examination',
      code: 'FE',
      description: 'Final examination for all classes',
      weightage: 50,
      isFinal: true,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Unit Test',
      code: 'UT',
      description: 'Unit test examination',
      weightage: 20,
      isFinal: false,
      status: 'Active'
    }
  ]);

  // Exam Schedules Data
  const [examSchedules, setExamSchedules] = useState([]);

  // Grade Configurations Data
  const [gradeConfigs, setGradeConfigs] = useState([
    {
      id: 1,
      name: 'Standard Grading System',
      description: 'Standard 7-point grading system',
      grades: [
        { grade: 'A+', minPercentage: 90, maxPercentage: 100, points: 10, description: 'Outstanding' },
        { grade: 'A', minPercentage: 80, maxPercentage: 89.99, points: 9, description: 'Excellent' },
        { grade: 'B+', minPercentage: 70, maxPercentage: 79.99, points: 8, description: 'Very Good' },
        { grade: 'B', minPercentage: 60, maxPercentage: 69.99, points: 7, description: 'Good' },
        { grade: 'C+', minPercentage: 50, maxPercentage: 59.99, points: 6, description: 'Average' },
        { grade: 'C', minPercentage: 40, maxPercentage: 49.99, points: 5, description: 'Below Average' },
        { grade: 'F', minPercentage: 0, maxPercentage: 39.99, points: 0, description: 'Fail' }
      ],
      status: 'Active'
    }
  ]);

  // Results Data
  const [results, setResults] = useState([]);

  // Academic Years Data
  const [academicYears, setAcademicYears] = useState([
    {
      id: 1,
      name: '2024-2025',
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      description: 'Current Academic Year',
      status: 'Active',
      isCurrent: true
    },
    {
      id: 2,
      name: '2023-2024',
      startDate: '2023-04-01',
      endDate: '2024-03-31',
      description: 'Previous Academic Year',
      status: 'Completed',
      isCurrent: false
    }
  ]);

  // Sections Data
  const [sections, setSections] = useState([
    {
      id: 1,
      name: 'A',
      className: 'Class 1',
      capacity: 40,
      currentStudents: 35,
      classTeacher: 'Ms. Sarah Johnson',
      description: 'Section A of Class 1',
      status: 'Active'
    },
    {
      id: 2,
      name: 'B',
      className: 'Class 1',
      capacity: 40,
      currentStudents: 38,
      classTeacher: 'Mr. David Wilson',
      description: 'Section B of Class 1',
      status: 'Active'
    },
    {
      id: 3,
      name: 'A',
      className: 'Class 2',
      capacity: 40,
      currentStudents: 32,
      classTeacher: 'Ms. Emily Brown',
      description: 'Section A of Class 2',
      status: 'Active'
    }
  ]);

  // Curriculums Data
  const [curriculums, setCurriculums] = useState([
    {
      id: 1,
      name: 'Mathematics Curriculum 2024',
      className: 'Class 10',
      subject: 'Mathematics',
      academicYear: '2024-2025',
      description: 'Complete mathematics curriculum for Class 10',
      chapters: [
        { id: 1, name: 'Algebra', topics: [] },
        { id: 2, name: 'Geometry', topics: [] },
        { id: 3, name: 'Trigonometry', topics: [] }
      ],
      status: 'Active'
    },
    {
      id: 2,
      name: 'Science Curriculum 2024',
      className: 'Class 9',
      subject: 'Science',
      academicYear: '2024-2025',
      description: 'Complete science curriculum for Class 9',
      chapters: [
        { id: 1, name: 'Physics', topics: [] },
        { id: 2, name: 'Chemistry', topics: [] },
        { id: 3, name: 'Biology', topics: [] }
      ],
      status: 'Active'
    }
  ]);

  // Syllabuses Data
  const [syllabuses, setSyllabuses] = useState([
    {
      id: 1,
      name: 'Mathematics Syllabus 2024-2025',
      className: 'Class 10',
      subject: 'Mathematics',
      academicYear: '2024-2025',
      description: 'Detailed mathematics syllabus for Class 10',
      units: [
        {
          id: 1,
          name: 'Unit 1: Number Systems',
          description: 'Real numbers and their properties',
          topics: [
            { id: 1, name: 'Real Numbers' },
            { id: 2, name: 'Rational Numbers' },
            { id: 3, name: 'Irrational Numbers' }
          ]
        },
        {
          id: 2,
          name: 'Unit 2: Algebra',
          description: 'Polynomials and linear equations',
          topics: [
            { id: 1, name: 'Polynomials' },
            { id: 2, name: 'Linear Equations' },
            { id: 3, name: 'Quadratic Equations' }
          ]
        }
      ],
      status: 'Active'
    },
    {
      id: 2,
      name: 'English Syllabus 2024-2025',
      className: 'Class 9',
      subject: 'English',
      academicYear: '2024-2025',
      description: 'Complete English syllabus for Class 9',
      units: [
        {
          id: 1,
          name: 'Unit 1: Reading Comprehension',
          description: 'Reading and understanding texts',
          topics: [
            { id: 1, name: 'Prose' },
            { id: 2, name: 'Poetry' },
            { id: 3, name: 'Drama' }
          ]
        }
      ],
      status: 'Active'
    }
  ]);

  // Lesson Plans Data
  const [lessonPlans, setLessonPlans] = useState([
    {
      id: 1,
      title: 'Introduction to Algebra',
      className: 'Class 10',
      subject: 'Mathematics',
      teacher: 'Dr. Robert Johnson',
      date: '2024-12-15',
      duration: '45 minutes',
      topic: 'Linear Equations',
      objectives: [
        { id: 1, text: 'Understand the concept of linear equations' },
        { id: 2, text: 'Solve simple linear equations' },
        { id: 3, text: 'Apply linear equations to real-world problems' }
      ],
      materials: [
        { id: 1, text: 'Whiteboard' },
        { id: 2, text: 'Markers' },
        { id: 3, text: 'Textbook' },
        { id: 4, text: 'Worksheet' }
      ],
      activities: [
        { id: 1, text: 'Introduction and warm-up (5 min)' },
        { id: 2, text: 'Explanation of concepts (15 min)' },
        { id: 3, text: 'Practice problems (20 min)' },
        { id: 4, text: 'Review and Q&A (5 min)' }
      ],
      homework: 'Complete exercises 1-10 from textbook page 45',
      notes: 'Focus on students who struggle with basic algebra concepts',
      status: 'Published'
    },
    {
      id: 2,
      title: 'Photosynthesis Process',
      className: 'Class 9',
      subject: 'Science',
      teacher: 'Mr. David Wilson',
      date: '2024-12-16',
      duration: '1 hour',
      topic: 'Plant Biology',
      objectives: [
        { id: 1, text: 'Explain the process of photosynthesis' },
        { id: 2, text: 'Identify the components involved' }
      ],
      materials: [
        { id: 1, text: 'Projector' },
        { id: 2, text: 'Plant samples' },
        { id: 3, text: 'Microscope' }
      ],
      activities: [
        { id: 1, text: 'Video presentation (10 min)' },
        { id: 2, text: 'Lab observation (30 min)' },
        { id: 3, text: 'Discussion (20 min)' }
      ],
      homework: 'Write a report on photosynthesis',
      notes: 'Ensure all students have access to lab equipment',
      status: 'Draft'
    }
  ]);

  // Homework Data
  const [homeworks, setHomeworks] = useState([
    {
      id: 1,
      title: 'Chapter 5: Algebra Exercises',
      className: 'Class 10',
      subject: 'Mathematics',
      teacher: 'Dr. Robert Johnson',
      assignedDate: '2024-12-10',
      dueDate: '2024-12-20',
      description: 'Complete all exercises from Chapter 5 on linear equations',
      instructions: 'Solve problems 1-20. Show all working steps. Submit handwritten solutions.',
      maxMarks: 100,
      attachments: [
        { id: 1, name: 'Chapter5_Exercises.pdf' },
        { id: 2, name: 'Solution_Template.docx' }
      ],
      status: 'Active'
    },
    {
      id: 2,
      title: 'Science Project: Photosynthesis',
      className: 'Class 9',
      subject: 'Science',
      teacher: 'Mr. David Wilson',
      assignedDate: '2024-12-05',
      dueDate: '2024-12-25',
      description: 'Create a project demonstrating the process of photosynthesis',
      instructions: 'Create a model or presentation. Include diagrams and explanations. Present findings in class.',
      maxMarks: 50,
      attachments: [
        { id: 1, name: 'Project_Guidelines.pdf' },
        { id: 2, name: 'Rubric.pdf' }
      ],
      status: 'Active'
    },
    {
      id: 3,
      title: 'English Essay: My Favorite Book',
      className: 'Class 8',
      subject: 'English',
      teacher: 'Ms. Emily Brown',
      assignedDate: '2024-12-01',
      dueDate: '2024-12-15',
      description: 'Write an essay about your favorite book',
      instructions: 'Minimum 500 words. Include introduction, body paragraphs, and conclusion. Use proper grammar and punctuation.',
      maxMarks: 30,
      attachments: [
        { id: 1, name: 'Essay_Rubric.pdf' }
      ],
      status: 'Completed'
    }
  ]);

  // Assignments Data
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Research Paper: Climate Change Impact',
      className: 'Class 10',
      subject: 'Science',
      teacher: 'Mr. David Wilson',
      assignedDate: '2024-12-01',
      dueDate: '2024-12-30',
      submissionType: 'Individual',
      description: 'Write a comprehensive research paper on the impact of climate change',
      instructions: 'Minimum 2000 words. Include introduction, literature review, methodology, findings, and conclusion. Use APA citation style. Submit as PDF.',
      maxMarks: 100,
      weightage: 25,
      attachments: [
        { id: 1, name: 'Research_Guidelines.pdf' },
        { id: 2, name: 'APA_Style_Guide.pdf' },
        { id: 3, name: 'Sample_Paper.docx' }
      ],
      rubric: 'Content (40%), Research Quality (30%), Writing Style (20%), Citations (10%)',
      status: 'Active'
    },
    {
      id: 2,
      title: 'Group Project: Historical Timeline',
      className: 'Class 9',
      subject: 'Social Studies',
      teacher: 'Ms. Lisa Anderson',
      assignedDate: '2024-12-05',
      dueDate: '2024-12-20',
      submissionType: 'Group',
      description: 'Create a visual timeline of major historical events',
      instructions: 'Work in groups of 3-4. Create a visual timeline with at least 20 events. Include images and brief descriptions. Present to class.',
      maxMarks: 50,
      weightage: 15,
      attachments: [
        { id: 1, name: 'Project_Requirements.pdf' },
        { id: 2, name: 'Timeline_Template.pptx' }
      ],
      rubric: 'Accuracy (30%), Visual Appeal (25%), Completeness (25%), Presentation (20%)',
      status: 'Active'
    },
    {
      id: 3,
      title: 'Mathematics Problem Set',
      className: 'Class 8',
      subject: 'Mathematics',
      teacher: 'Dr. Robert Johnson',
      assignedDate: '2024-11-25',
      dueDate: '2024-12-10',
      submissionType: 'Individual',
      description: 'Solve advanced algebra problems',
      instructions: 'Complete problems 1-25 from Chapter 8. Show all working steps. Submit handwritten solutions.',
      maxMarks: 100,
      weightage: 20,
      attachments: [
        { id: 1, name: 'Problem_Set_Chapter8.pdf' }
      ],
      rubric: 'Correctness (60%), Method (30%), Presentation (10%)',
      status: 'Completed'
    }
  ]);

  // Academic Calendar Data
  const [academicCalendars, setAcademicCalendars] = useState([
    {
      id: 1,
      title: 'Diwali Holiday',
      academicYear: '2024-2025',
      eventType: 'Holiday',
      startDate: '2024-11-01',
      endDate: '2024-11-05',
      description: 'Diwali festival holidays',
      location: 'School Closed',
      category: 'General',
      isHoliday: true,
      isExam: false,
      isImportant: false,
      status: 'Active'
    },
    {
      id: 2,
      title: 'Mid-Term Examinations',
      academicYear: '2024-2025',
      eventType: 'Exam',
      startDate: '2024-12-10',
      endDate: '2024-12-20',
      description: 'Mid-term examinations for all classes',
      location: 'School Campus',
      category: 'Academic',
      isHoliday: false,
      isExam: true,
      isImportant: true,
      status: 'Active'
    },
    {
      id: 3,
      title: 'Annual Day Celebration',
      academicYear: '2024-2025',
      eventType: 'Event',
      startDate: '2024-12-25',
      endDate: '2024-12-25',
      description: 'Annual day celebration with cultural programs',
      location: 'Main Auditorium',
      category: 'Cultural',
      isHoliday: false,
      isExam: false,
      isImportant: true,
      status: 'Active'
    },
    {
      id: 4,
      title: 'Parent-Teacher Meeting',
      academicYear: '2024-2025',
      eventType: 'Meeting',
      startDate: '2024-12-15',
      endDate: '2024-12-15',
      description: 'Quarterly parent-teacher meeting',
      location: 'School Campus',
      category: 'Parent-Teacher',
      isHoliday: false,
      isExam: false,
      isImportant: true,
      status: 'Active'
    },
    {
      id: 5,
      title: 'Christmas Holiday',
      academicYear: '2024-2025',
      eventType: 'Holiday',
      startDate: '2024-12-24',
      endDate: '2024-12-26',
      description: 'Christmas holidays',
      location: 'School Closed',
      category: 'General',
      isHoliday: true,
      isExam: false,
      isImportant: false,
      status: 'Active'
    }
  ]);

  // Add Student
  const addStudent = (student) => {
    const newStudent = {
      ...student,
      id: students.length + 1,
      admissionNo: `ADM${String(students.length + 1).padStart(3, '0')}`
    };
    setStudents([...students, newStudent]);
  };

  // Update Student
  const updateStudent = (id, updatedStudent) => {
    setStudents(students.map(s => s.id === id ? { ...updatedStudent, id } : s));
  };

  // Delete Student
  const deleteStudent = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  // Add Teacher
  const addTeacher = (teacher) => {
    const newTeacher = {
      ...teacher,
      id: teachers.length + 1,
      employeeId: `EMP${String(teachers.length + 1).padStart(3, '0')}`
    };
    setTeachers([...teachers, newTeacher]);
  };

  // Update Teacher
  const updateTeacher = (id, updatedTeacher) => {
    setTeachers(teachers.map(t => t.id === id ? { ...updatedTeacher, id } : t));
  };

  // Delete Teacher
  const deleteTeacher = (id) => {
    setTeachers(teachers.filter(t => t.id !== id));
  };

  // Add Staff
  const addStaff = (staffMember) => {
    setStaff([...staff, { ...staffMember, id: staff.length + 1 }]);
  };

  // Update Staff
  const updateStaff = (id, updatedStaff) => {
    setStaff(staff.map(s => s.id === id ? { ...updatedStaff, id } : s));
  };

  // Delete Staff
  const deleteStaff = (id) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  // Add Class
  const addClass = (newClass) => {
    setClasses([...classes, { ...newClass, id: classes.length + 1 }]);
  };

  // Update Class
  const updateClass = (id, updatedClass) => {
    setClasses(classes.map(c => c.id === id ? { ...updatedClass, id } : c));
  };

  // Delete Class
  const deleteClass = (id) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  // Add Subject
  const addSubject = (subject) => {
    setSubjects([...subjects, { ...subject, id: subjects.length + 1 }]);
  };

  // Update Subject
  const updateSubject = (id, updatedSubject) => {
    setSubjects(subjects.map(s => s.id === id ? { ...updatedSubject, id } : s));
  };

  // Delete Subject
  const deleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  // Add Fee
  const addFee = (fee) => {
    setFees([...fees, { ...fee, id: fees.length + 1 }]);
  };

  // Update Fee
  const updateFee = (id, updatedFee) => {
    setFees(fees.map(f => f.id === id ? { ...updatedFee, id } : f));
  };

  // Delete Fee
  const deleteFee = (id) => {
    setFees(fees.filter(f => f.id !== id));
  };

  // Add Fee Category
  const addFeeCategory = (category) => {
    setFeeCategories([...feeCategories, { ...category, id: feeCategories.length + 1 }]);
  };

  // Update Fee Category
  const updateFeeCategory = (id, updatedCategory) => {
    setFeeCategories(feeCategories.map(fc => fc.id === id ? { ...updatedCategory, id } : fc));
  };

  // Delete Fee Category
  const deleteFeeCategory = (id) => {
    setFeeCategories(feeCategories.filter(fc => fc.id !== id));
  };

  // Add Fee Structure
  const addFeeStructure = (structure) => {
    setFeeStructures([...feeStructures, { ...structure, id: feeStructures.length + 1 }]);
  };

  // Update Fee Structure
  const updateFeeStructure = (id, updatedStructure) => {
    setFeeStructures(feeStructures.map(fs => fs.id === id ? { ...updatedStructure, id } : fs));
  };

  // Delete Fee Structure
  const deleteFeeStructure = (id) => {
    setFeeStructures(feeStructures.filter(fs => fs.id !== id));
  };

  // Vehicles Data
  const [vehicles, setVehicles] = useState([]);

  // Drivers Data
  const [drivers, setDrivers] = useState([]);

  // Routes Data
  const [routes, setRoutes] = useState([]);

  // Pickup & Drop Points Data
  const [pickupDropPoints, setPickupDropPoints] = useState([]);

  // Student Transport Allocations Data
  const [studentTransportAllocations, setStudentTransportAllocations] = useState([]);

  // Add Vehicle
  const addVehicle = (vehicle) => {
    setVehicles([...vehicles, { ...vehicle, id: vehicles.length + 1 }]);
  };

  // Update Vehicle
  const updateVehicle = (id, updatedVehicle) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...updatedVehicle, id } : v));
  };

  // Delete Vehicle
  const deleteVehicle = (id) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  // Add Driver
  const addDriver = (driver) => {
    setDrivers([...drivers, { ...driver, id: drivers.length + 1 }]);
  };

  // Update Driver
  const updateDriver = (id, updatedDriver) => {
    setDrivers(drivers.map(d => d.id === id ? { ...updatedDriver, id } : d));
  };

  // Delete Driver
  const deleteDriver = (id) => {
    setDrivers(drivers.filter(d => d.id !== id));
  };

  // Add Route
  const addRoute = (route) => {
    setRoutes([...routes, { ...route, id: routes.length + 1 }]);
  };

  // Update Route
  const updateRoute = (id, updatedRoute) => {
    setRoutes(routes.map(r => r.id === id ? { ...updatedRoute, id } : r));
  };

  // Delete Route
  const deleteRoute = (id) => {
    setRoutes(routes.filter(r => r.id !== id));
  };

  // Add Pickup Drop Point
  const addPickupDropPoint = (point) => {
    setPickupDropPoints([...pickupDropPoints, { ...point, id: pickupDropPoints.length + 1 }]);
  };

  // Update Pickup Drop Point
  const updatePickupDropPoint = (id, updatedPoint) => {
    setPickupDropPoints(pickupDropPoints.map(p => p.id === id ? { ...updatedPoint, id } : p));
  };

  // Delete Pickup Drop Point
  const deletePickupDropPoint = (id) => {
    setPickupDropPoints(pickupDropPoints.filter(p => p.id !== id));
  };

  // Add Student Transport Allocation
  const addStudentTransportAllocation = (allocation) => {
    setStudentTransportAllocations([...studentTransportAllocations, { ...allocation, id: studentTransportAllocations.length + 1 }]);
  };

  // Update Student Transport Allocation
  const updateStudentTransportAllocation = (id, updatedAllocation) => {
    setStudentTransportAllocations(studentTransportAllocations.map(a => a.id === id ? { ...updatedAllocation, id } : a));
  };

  // Delete Student Transport Allocation
  const deleteStudentTransportAllocation = (id) => {
    setStudentTransportAllocations(studentTransportAllocations.filter(a => a.id !== id));
  };

  // Announcements Data
  const [announcements, setAnnouncements] = useState([]);

  // Notices Data
  const [notices, setNotices] = useState([]);

  // SMS History Data
  const [smsHistory, setSmsHistory] = useState([]);

  // Email History Data
  const [emailHistory, setEmailHistory] = useState([]);

  // Push Notification History Data
  const [pushNotificationHistory, setPushNotificationHistory] = useState([]);

  // Parent-Teacher Messages Data
  const [parentTeacherMessages, setParentTeacherMessages] = useState([]);

  // Add Announcement
  const addAnnouncement = (announcement) => {
    setAnnouncements([...announcements, { ...announcement, id: announcements.length + 1 }]);
  };

  // Update Announcement
  const updateAnnouncement = (id, updatedAnnouncement) => {
    setAnnouncements(announcements.map(a => a.id === id ? { ...updatedAnnouncement, id } : a));
  };

  // Delete Announcement
  const deleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  // Add Notice
  const addNotice = (notice) => {
    setNotices([...notices, { ...notice, id: notices.length + 1 }]);
  };

  // Update Notice
  const updateNotice = (id, updatedNotice) => {
    setNotices(notices.map(n => n.id === id ? { ...updatedNotice, id } : n));
  };

  // Delete Notice
  const deleteNotice = (id) => {
    setNotices(notices.filter(n => n.id !== id));
  };

  // Send SMS
  const sendSMS = (smsData) => {
    setSmsHistory([...smsHistory, { ...smsData, id: smsHistory.length + 1 }]);
  };

  // Send Email
  const sendEmail = (emailData) => {
    setEmailHistory([...emailHistory, { ...emailData, id: emailHistory.length + 1 }]);
  };

  // Send Push Notification
  const sendPushNotification = (notificationData) => {
    setPushNotificationHistory([...pushNotificationHistory, { ...notificationData, id: pushNotificationHistory.length + 1 }]);
  };

  // Add Parent-Teacher Message
  const addParentTeacherMessage = (messageData) => {
    setParentTeacherMessages([...parentTeacherMessages, { ...messageData, id: parentTeacherMessages.length + 1 }]);
  };

  // Books Data
  const [books, setBooks] = useState([]);

  // Book Categories Data
  const [bookCategories, setBookCategories] = useState([
    {
      id: 1,
      name: 'Fiction',
      code: 'FIC',
      description: 'Fictional books and novels',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Non-Fiction',
      code: 'NFIC',
      description: 'Non-fictional books',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Science',
      code: 'SCI',
      description: 'Science and technology books',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Mathematics',
      code: 'MATH',
      description: 'Mathematics books',
      status: 'Active'
    },
    {
      id: 5,
      name: 'History',
      code: 'HIST',
      description: 'History books',
      status: 'Active'
    }
  ]);

  // Book Issues Data
  const [bookIssues, setBookIssues] = useState([]);

  // Add Book
  const addBook = (book) => {
    setBooks([...books, { ...book, id: books.length + 1 }]);
  };

  // Update Book
  const updateBook = (id, updatedBook) => {
    setBooks(books.map(b => b.id === id ? { ...updatedBook, id } : b));
  };

  // Delete Book
  const deleteBook = (id) => {
    setBooks(books.filter(b => b.id !== id));
  };

  // Add Book Category
  const addBookCategory = (category) => {
    setBookCategories([...bookCategories, { ...category, id: bookCategories.length + 1 }]);
  };

  // Update Book Category
  const updateBookCategory = (id, updatedCategory) => {
    setBookCategories(bookCategories.map(c => c.id === id ? { ...updatedCategory, id } : c));
  };

  // Delete Book Category
  const deleteBookCategory = (id) => {
    setBookCategories(bookCategories.filter(c => c.id !== id));
  };

  // Add Book Issue
  const addBookIssue = (issue) => {
    setBookIssues([...bookIssues, { ...issue, id: bookIssues.length + 1 }]);
  };

  // Update Book Issue
  const updateBookIssue = (id, updatedIssue) => {
    setBookIssues(bookIssues.map(i => i.id === id ? { ...updatedIssue, id } : i));
  };

  // Delete Book Issue
  const deleteBookIssue = (id) => {
    setBookIssues(bookIssues.filter(i => i.id !== id));
  };

  // Add Exam
  const addExam = (exam) => {
    setExams([...exams, { ...exam, id: exams.length + 1 }]);
  };

  // Delete Exam
  const deleteExam = (id) => {
    setExams(exams.filter(e => e.id !== id));
  };

  // Add Academic Year
  const addAcademicYear = (academicYear) => {
    // If setting as current, unset all other current years
    if (academicYear.isCurrent) {
      setAcademicYears(prevYears => 
        prevYears.map(year => ({ ...year, isCurrent: false }))
      );
    }
    setAcademicYears([...academicYears, { ...academicYear, id: academicYears.length + 1 }]);
  };

  // Update Academic Year
  const updateAcademicYear = (id, updatedAcademicYear) => {
    // If setting as current, unset all other current years
    if (updatedAcademicYear.isCurrent) {
      setAcademicYears(prevYears => 
        prevYears.map(year => 
          year.id === id ? updatedAcademicYear : { ...year, isCurrent: false }
        )
      );
    } else {
      setAcademicYears(academicYears.map(y => y.id === id ? { ...updatedAcademicYear, id } : y));
    }
  };

  // Delete Academic Year
  const deleteAcademicYear = (id) => {
    setAcademicYears(academicYears.filter(y => y.id !== id));
  };

  // Add Section
  const addSection = (section) => {
    setSections([...sections, { ...section, id: sections.length + 1 }]);
  };

  // Update Section
  const updateSection = (id, updatedSection) => {
    setSections(sections.map(s => s.id === id ? { ...updatedSection, id } : s));
  };

  // Delete Section
  const deleteSection = (id) => {
    setSections(sections.filter(s => s.id !== id));
  };

  // Add Curriculum
  const addCurriculum = (curriculum) => {
    setCurriculums([...curriculums, { ...curriculum, id: curriculums.length + 1 }]);
  };

  // Update Curriculum
  const updateCurriculum = (id, updatedCurriculum) => {
    setCurriculums(curriculums.map(c => c.id === id ? { ...updatedCurriculum, id } : c));
  };

  // Delete Curriculum
  const deleteCurriculum = (id) => {
    setCurriculums(curriculums.filter(c => c.id !== id));
  };

  // Add Syllabus
  const addSyllabus = (syllabus) => {
    setSyllabuses([...syllabuses, { ...syllabus, id: syllabuses.length + 1 }]);
  };

  // Update Syllabus
  const updateSyllabus = (id, updatedSyllabus) => {
    setSyllabuses(syllabuses.map(s => s.id === id ? { ...updatedSyllabus, id } : s));
  };

  // Delete Syllabus
  const deleteSyllabus = (id) => {
    setSyllabuses(syllabuses.filter(s => s.id !== id));
  };

  // Add Lesson Plan
  const addLessonPlan = (lessonPlan) => {
    setLessonPlans([...lessonPlans, { ...lessonPlan, id: lessonPlans.length + 1 }]);
  };

  // Update Lesson Plan
  const updateLessonPlan = (id, updatedLessonPlan) => {
    setLessonPlans(lessonPlans.map(lp => lp.id === id ? { ...updatedLessonPlan, id } : lp));
  };

  // Delete Lesson Plan
  const deleteLessonPlan = (id) => {
    setLessonPlans(lessonPlans.filter(lp => lp.id !== id));
  };

  // Add Homework
  const addHomework = (homework) => {
    setHomeworks([...homeworks, { ...homework, id: homeworks.length + 1 }]);
  };

  // Update Homework
  const updateHomework = (id, updatedHomework) => {
    setHomeworks(homeworks.map(hw => hw.id === id ? { ...updatedHomework, id } : hw));
  };

  // Delete Homework
  const deleteHomework = (id) => {
    setHomeworks(homeworks.filter(hw => hw.id !== id));
  };

  // Add Assignment
  const addAssignment = (assignment) => {
    setAssignments([...assignments, { ...assignment, id: assignments.length + 1 }]);
  };

  // Update Assignment
  const updateAssignment = (id, updatedAssignment) => {
    setAssignments(assignments.map(ass => ass.id === id ? { ...updatedAssignment, id } : ass));
  };

  // Delete Assignment
  const deleteAssignment = (id) => {
    setAssignments(assignments.filter(ass => ass.id !== id));
  };

  // Add Academic Calendar Event
  const addAcademicCalendar = (calendarEvent) => {
    setAcademicCalendars([...academicCalendars, { ...calendarEvent, id: academicCalendars.length + 1 }]);
  };

  // Update Academic Calendar Event
  const updateAcademicCalendar = (id, updatedCalendarEvent) => {
    setAcademicCalendars(academicCalendars.map(cal => cal.id === id ? { ...updatedCalendarEvent, id } : cal));
  };

  // Delete Academic Calendar Event
  const deleteAcademicCalendar = (id) => {
    setAcademicCalendars(academicCalendars.filter(cal => cal.id !== id));
  };

  // Add Leave Request
  const addLeaveRequest = (leaveRequest) => {
    setLeaveRequests([...leaveRequests, { ...leaveRequest, id: leaveRequests.length + 1 }]);
  };

  // Update Leave Request
  const updateLeaveRequest = (id, updatedLeaveRequest) => {
    setLeaveRequests(leaveRequests.map(lr => lr.id === id ? { ...updatedLeaveRequest, id } : lr));
  };

  // Delete Leave Request
  const deleteLeaveRequest = (id) => {
    setLeaveRequests(leaveRequests.filter(lr => lr.id !== id));
  };

  // Add Payroll
  const addPayroll = (payroll) => {
    setPayrolls([...payrolls, { ...payroll, id: payrolls.length + 1 }]);
  };

  // Update Payroll
  const updatePayroll = (id, updatedPayroll) => {
    setPayrolls(payrolls.map(p => p.id === id ? { ...updatedPayroll, id } : p));
  };

  // Delete Payroll
  const deletePayroll = (id) => {
    setPayrolls(payrolls.filter(p => p.id !== id));
  };

  // Add Class Allocation
  const addClassAllocation = (allocation) => {
    setClassAllocations([...classAllocations, { ...allocation, id: classAllocations.length + 1 }]);
  };

  // Update Class Allocation
  const updateClassAllocation = (id, updatedAllocation) => {
    setClassAllocations(classAllocations.map(a => a.id === id ? { ...updatedAllocation, id } : a));
  };

  // Delete Class Allocation
  const deleteClassAllocation = (id) => {
    setClassAllocations(classAllocations.filter(a => a.id !== id));
  };

  // Add Teacher Subject Allocation
  const addTeacherSubjectAllocation = (allocation) => {
    setTeacherSubjectAllocations([...teacherSubjectAllocations, { ...allocation, id: teacherSubjectAllocations.length + 1 }]);
  };

  // Update Teacher Subject Allocation
  const updateTeacherSubjectAllocation = (id, updatedAllocation) => {
    setTeacherSubjectAllocations(teacherSubjectAllocations.map(a => a.id === id ? { ...updatedAllocation, id } : a));
  };

  // Delete Teacher Subject Allocation
  const deleteTeacherSubjectAllocation = (id) => {
    setTeacherSubjectAllocations(teacherSubjectAllocations.filter(a => a.id !== id));
  };

  // Add Performance Evaluation
  const addPerformanceEvaluation = (evaluation) => {
    setPerformanceEvaluations([...performanceEvaluations, { ...evaluation, id: performanceEvaluations.length + 1 }]);
  };

  // Update Performance Evaluation
  const updatePerformanceEvaluation = (id, updatedEvaluation) => {
    setPerformanceEvaluations(performanceEvaluations.map(e => e.id === id ? { ...updatedEvaluation, id } : e));
  };

  // Delete Performance Evaluation
  const deletePerformanceEvaluation = (id) => {
    setPerformanceEvaluations(performanceEvaluations.filter(e => e.id !== id));
  };

  // Timetables Data
  const [timetables, setTimetables] = useState([
    {
      id: 1,
      academicYearId: 1,
      academicYearName: '2024-2025',
      className: 'Class 10',
      sectionId: 1,
      sectionName: 'Section A',
      periodSlots: [
        { period: 1, startTime: '08:00', endTime: '08:45' },
        { period: 2, startTime: '08:45', endTime: '09:30' },
        { period: 3, startTime: '09:30', endTime: '10:15' },
        { period: 4, startTime: '10:15', endTime: '11:00' },
        { period: 5, startTime: '11:00', endTime: '11:15' },
        { period: 6, startTime: '11:15', endTime: '12:00' },
        { period: 7, startTime: '12:00', endTime: '12:45' },
        { period: 8, startTime: '12:45', endTime: '13:30' }
      ],
      monday: [
        { subjectId: 1, subjectName: 'Mathematics', teacherId: 1, teacherName: 'Dr. Robert Johnson', room: '101' },
        { subjectId: 2, subjectName: 'English', teacherId: 2, teacherName: 'Ms. Sarah Williams', room: '102' },
        { subjectId: 1, subjectName: 'Mathematics', teacherId: 1, teacherName: 'Dr. Robert Johnson', room: '101' },
        { subjectId: 3, subjectName: 'Science', teacherId: 3, teacherName: 'Mr. David Wilson', room: 'Lab-1' },
        {},
        { subjectId: 4, subjectName: 'Social Studies', teacherId: 4, teacherName: 'Ms. Lisa Anderson', room: '103' },
        { subjectId: 2, subjectName: 'English', teacherId: 2, teacherName: 'Ms. Sarah Williams', room: '102' },
        { subjectId: 1, subjectName: 'Mathematics', teacherId: 1, teacherName: 'Dr. Robert Johnson', room: '101' }
      ],
      tuesday: [
        { subjectId: 2, subjectName: 'English', teacherId: 2, teacherName: 'Ms. Sarah Williams', room: '102' },
        { subjectId: 1, subjectName: 'Mathematics', teacherId: 1, teacherName: 'Dr. Robert Johnson', room: '101' },
        { subjectId: 3, subjectName: 'Science', teacherId: 3, teacherName: 'Mr. David Wilson', room: 'Lab-1' },
        { subjectId: 4, subjectName: 'Social Studies', teacherId: 4, teacherName: 'Ms. Lisa Anderson', room: '103' },
        {},
        { subjectId: 1, subjectName: 'Mathematics', teacherId: 1, teacherName: 'Dr. Robert Johnson', room: '101' },
        { subjectId: 2, subjectName: 'English', teacherId: 2, teacherName: 'Ms. Sarah Williams', room: '102' },
        { subjectId: 3, subjectName: 'Science', teacherId: 3, teacherName: 'Mr. David Wilson', room: 'Lab-1' }
      ],
      wednesday: [
        { subjectId: 3, subjectName: 'Science', teacherId: 3, teacherName: 'Mr. David Wilson', room: 'Lab-1' },
        { subjectId: 4, subjectName: 'Social Studies', teacherId: 4, teacherName: 'Ms. Lisa Anderson', room: '103' },
        { subjectId: 1, subjectName: 'Mathematics', teacherId: 1, teacherName: 'Dr. Robert Johnson', room: '101' },
        { subjectId: 2, subjectName: 'English', teacherId: 2, teacherName: 'Ms. Sarah Williams', room: '102' },
        {},
        { subjectId: 1, subjectName: 'Mathematics', teacherId: 1, teacherName: 'Dr. Robert Johnson', room: '101' },
        { subjectId: 3, subjectName: 'Science', teacherId: 3, teacherName: 'Mr. David Wilson', room: 'Lab-1' },
        { subjectId: 4, subjectName: 'Social Studies', teacherId: 4, teacherName: 'Ms. Lisa Anderson', room: '103' }
      ],
      thursday: [
        { subjectId: 4, subjectName: 'Social Studies', teacherId: 4, teacherName: 'Ms. Lisa Anderson', room: '103' },
        { subjectId: 1, subjectName: 'Mathematics', teacherId: 1, teacherName: 'Dr. Robert Johnson', room: '101' },
        { subjectId: 2, subjectName: 'English', teacherId: 2, teacherName: 'Ms. Sarah Williams', room: '102' },
        { subjectId: 3, subjectName: 'Science', teacherId: 3, teacherName: 'Mr. David Wilson', room: 'Lab-1' },
        {},
        { subjectId: 2, subjectName: 'English', teacherId: 2, teacherName: 'Ms. Sarah Williams', room: '102' },
        { subjectId: 4, subjectName: 'Social Studies', teacherId: 4, teacherName: 'Ms. Lisa Anderson', room: '103' },
        { subjectId: 1, subjectName: 'Mathematics', teacherId: 1, teacherName: 'Dr. Robert Johnson', room: '101' }
      ],
      friday: [
        { subjectId: 1, subjectName: 'Mathematics', teacherId: 1, teacherName: 'Dr. Robert Johnson', room: '101' },
        { subjectId: 3, subjectName: 'Science', teacherId: 3, teacherName: 'Mr. David Wilson', room: 'Lab-1' },
        { subjectId: 2, subjectName: 'English', teacherId: 2, teacherName: 'Ms. Sarah Williams', room: '102' },
        { subjectId: 4, subjectName: 'Social Studies', teacherId: 4, teacherName: 'Ms. Lisa Anderson', room: '103' },
        {},
        { subjectId: 3, subjectName: 'Science', teacherId: 3, teacherName: 'Mr. David Wilson', room: 'Lab-1' },
        { subjectId: 1, subjectName: 'Mathematics', teacherId: 1, teacherName: 'Dr. Robert Johnson', room: '101' },
        { subjectId: 2, subjectName: 'English', teacherId: 2, teacherName: 'Ms. Sarah Williams', room: '102' }
      ],
      saturday: [],
      status: 'Active',
      remarks: 'Regular timetable for Class 10 Section A'
    }
  ]);

  // Add Timetable
  const addTimetable = (timetable) => {
    setTimetables([...timetables, { ...timetable, id: timetables.length + 1 }]);
  };

  // Update Timetable
  const updateTimetable = (id, updatedTimetable) => {
    setTimetables(timetables.map(t => t.id === id ? { ...updatedTimetable, id } : t));
  };

  // Delete Timetable
  const deleteTimetable = (id) => {
    setTimetables(timetables.filter(t => t.id !== id));
  };

  // Add Attendance
  const addAttendance = (attendanceRecord) => {
    setAttendance([...attendance, { ...attendanceRecord, id: attendance.length + 1 }]);
  };

  // Update Attendance
  const updateAttendance = (id, updatedAttendance) => {
    setAttendance(attendance.map(a => a.id === id ? { ...updatedAttendance, id } : a));
  };

  // Delete Attendance
  const deleteAttendance = (id) => {
    setAttendance(attendance.filter(a => a.id !== id));
  };

  // Add Exam Type
  const addExamType = (examType) => {
    setExamTypes([...examTypes, { ...examType, id: examTypes.length + 1 }]);
  };

  // Update Exam Type
  const updateExamType = (id, updatedExamType) => {
    setExamTypes(examTypes.map(et => et.id === id ? { ...updatedExamType, id } : et));
  };

  // Delete Exam Type
  const deleteExamType = (id) => {
    setExamTypes(examTypes.filter(et => et.id !== id));
  };

  // Add Exam Schedule
  const addExamSchedule = (schedule) => {
    setExamSchedules([...examSchedules, { ...schedule, id: examSchedules.length + 1 }]);
  };

  // Update Exam Schedule
  const updateExamSchedule = (id, updatedSchedule) => {
    setExamSchedules(examSchedules.map(es => es.id === id ? { ...updatedSchedule, id } : es));
  };

  // Delete Exam Schedule
  const deleteExamSchedule = (id) => {
    setExamSchedules(examSchedules.filter(es => es.id !== id));
  };

  // Add Grade Config
  const addGradeConfig = (config) => {
    setGradeConfigs([...gradeConfigs, { ...config, id: gradeConfigs.length + 1 }]);
  };

  // Update Grade Config
  const updateGradeConfig = (id, updatedConfig) => {
    setGradeConfigs(gradeConfigs.map(gc => gc.id === id ? { ...updatedConfig, id } : gc));
  };

  // Delete Grade Config
  const deleteGradeConfig = (id) => {
    setGradeConfigs(gradeConfigs.filter(gc => gc.id !== id));
  };

  // Add Result
  const addResult = (result) => {
    setResults([...results, { ...result, id: results.length + 1 }]);
  };

  // Update Result
  const updateResult = (id, updatedResult) => {
    setResults(results.map(r => r.id === id ? { ...updatedResult, id } : r));
  };

  // Delete Result
  const deleteResult = (id) => {
    setResults(results.filter(r => r.id !== id));
  };

  // User Management Data
  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'admin',
      email: 'admin@school.com',
      firstName: 'Admin',
      lastName: 'User',
      phone: '1234567890',
      roleId: 1,
      status: 'Active',
      lastLogin: new Date().toISOString(),
      createdAt: '2024-01-01'
    }
  ]);

  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Administrator',
      code: 'ADMIN',
      description: 'Full system access',
      permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      status: 'Active'
    },
    {
      id: 2,
      name: 'Teacher',
      code: 'TEACHER',
      description: 'Teacher access',
      permissions: [1, 2, 3],
      status: 'Active'
    },
    {
      id: 3,
      name: 'Accountant',
      code: 'ACCOUNTANT',
      description: 'Financial access',
      permissions: [4, 5],
      status: 'Active'
    }
  ]);

  const [permissions, setPermissions] = useState([
    { id: 1, name: 'View Students', module: 'Students', action: 'View' },
    { id: 2, name: 'Add Students', module: 'Students', action: 'Create' },
    { id: 3, name: 'Edit Students', module: 'Students', action: 'Update' },
    { id: 4, name: 'Delete Students', module: 'Students', action: 'Delete' },
    { id: 5, name: 'View Fees', module: 'Fees', action: 'View' },
    { id: 6, name: 'Manage Fees', module: 'Fees', action: 'Manage' },
    { id: 7, name: 'View Reports', module: 'Reports', action: 'View' },
    { id: 8, name: 'Export Reports', module: 'Reports', action: 'Export' },
    { id: 9, name: 'Manage Users', module: 'Users', action: 'Manage' },
    { id: 10, name: 'System Settings', module: 'Settings', action: 'Manage' }
  ]);

  const [loginHistory, setLoginHistory] = useState([
    {
      id: 1,
      userId: 1,
      username: 'admin',
      loginTime: new Date().toISOString(),
      ipAddress: '192.168.1.1',
      location: 'Local',
      userAgent: 'Chrome/120.0',
      status: 'Success',
      failureReason: null
    }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      userId: 1,
      username: 'admin',
      action: 'Create',
      module: 'Students',
      description: 'Created new student record',
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1',
      status: 'Success'
    }
  ]);

  // Settings Data
  const [settings, setSettings] = useState({
    schoolName: 'School Management System',
    schoolCode: 'SMS001',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'INR',
    currencySymbol: '₹',
    language: 'en'
  });

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // User Management Functions
  const addUser = (user) => {
    setUsers([...users, { ...user, id: users.length + 1, createdAt: new Date().toISOString().split('T')[0] }]);
  };

  const updateUser = (id, updatedUser) => {
    setUsers(users.map(u => u.id === id ? { ...updatedUser, id } : u));
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const addRole = (role) => {
    setRoles([...roles, { ...role, id: roles.length + 1 }]);
  };

  const updateRole = (id, updatedRole) => {
    setRoles(roles.map(r => r.id === id ? { ...updatedRole, id } : r));
  };

  const deleteRole = (id) => {
    setRoles(roles.filter(r => r.id !== id));
  };

  const value = {
    students,
    setStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    teachers,
    setTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    classes,
    setClasses,
    addClass,
    updateClass,
    deleteClass,
    subjects,
    setSubjects,
    addSubject,
    updateSubject,
    deleteSubject,
    attendance,
    setAttendance,
    addAttendance,
    updateAttendance,
    deleteAttendance,
    staffAttendance,
    setStaffAttendance,
    fees,
    setFees,
    addFee,
    updateFee,
    deleteFee,
    feeCategories,
    setFeeCategories,
    addFeeCategory,
    updateFeeCategory,
    deleteFeeCategory,
    feeStructures,
    setFeeStructures,
    addFeeStructure,
    updateFeeStructure,
    deleteFeeStructure,
    vehicles,
    setVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    drivers,
    setDrivers,
    addDriver,
    updateDriver,
    deleteDriver,
    routes,
    setRoutes,
    addRoute,
    updateRoute,
    deleteRoute,
    pickupDropPoints,
    setPickupDropPoints,
    addPickupDropPoint,
    updatePickupDropPoint,
    deletePickupDropPoint,
    studentTransportAllocations,
    setStudentTransportAllocations,
    addStudentTransportAllocation,
    updateStudentTransportAllocation,
    deleteStudentTransportAllocation,
    announcements,
    setAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    notices,
    setNotices,
    addNotice,
    updateNotice,
    deleteNotice,
    smsHistory,
    setSmsHistory,
    sendSMS,
    emailHistory,
    setEmailHistory,
    sendEmail,
    pushNotificationHistory,
    setPushNotificationHistory,
    sendPushNotification,
    parentTeacherMessages,
    setParentTeacherMessages,
    addParentTeacherMessage,
    books,
    setBooks,
    addBook,
    updateBook,
    deleteBook,
    bookCategories,
    setBookCategories,
    addBookCategory,
    updateBookCategory,
    deleteBookCategory,
    bookIssues,
    setBookIssues,
    addBookIssue,
    updateBookIssue,
    deleteBookIssue,
    exams,
    setExams,
    addExam,
    deleteExam,
    examTypes,
    setExamTypes,
    addExamType,
    updateExamType,
    deleteExamType,
    examSchedules,
    setExamSchedules,
    addExamSchedule,
    updateExamSchedule,
    deleteExamSchedule,
    gradeConfigs,
    setGradeConfigs,
    addGradeConfig,
    updateGradeConfig,
    deleteGradeConfig,
    results,
    setResults,
    addResult,
    updateResult,
    deleteResult,
    academicYears,
    setAcademicYears,
    addAcademicYear,
    updateAcademicYear,
    deleteAcademicYear,
    sections,
    setSections,
    addSection,
    updateSection,
    deleteSection,
    curriculums,
    setCurriculums,
    addCurriculum,
    updateCurriculum,
    deleteCurriculum,
    syllabuses,
    setSyllabuses,
    addSyllabus,
    updateSyllabus,
    deleteSyllabus,
    lessonPlans,
    setLessonPlans,
    addLessonPlan,
    updateLessonPlan,
    deleteLessonPlan,
    homeworks,
    setHomeworks,
    addHomework,
    updateHomework,
    deleteHomework,
    assignments,
    setAssignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    academicCalendars,
    setAcademicCalendars,
    addAcademicCalendar,
    updateAcademicCalendar,
    deleteAcademicCalendar,
    staff,
    setStaff,
    addStaff,
    updateStaff,
    deleteStaff,
    leaveRequests,
    setLeaveRequests,
    addLeaveRequest,
    updateLeaveRequest,
    deleteLeaveRequest,
    payrolls,
    setPayrolls,
    addPayroll,
    updatePayroll,
    deletePayroll,
    classAllocations,
    setClassAllocations,
    addClassAllocation,
    updateClassAllocation,
    deleteClassAllocation,
    teacherSubjectAllocations,
    setTeacherSubjectAllocations,
    addTeacherSubjectAllocation,
    updateTeacherSubjectAllocation,
    deleteTeacherSubjectAllocation,
    performanceEvaluations,
    setPerformanceEvaluations,
    addPerformanceEvaluation,
    updatePerformanceEvaluation,
    deletePerformanceEvaluation,
    timetables,
    setTimetables,
    addTimetable,
    updateTimetable,
    deleteTimetable,
    // User Management
    users,
    setUsers,
    addUser,
    updateUser,
    deleteUser,
    roles,
    setRoles,
    addRole,
    updateRole,
    deleteRole,
    permissions,
    setPermissions,
    loginHistory,
    setLoginHistory,
    auditLogs,
    setAuditLogs,
    settings,
    setSettings,
    updateSettings
  };

  return (
    <SchoolContext.Provider value={value}>
      {children}
    </SchoolContext.Provider>
  );
};

