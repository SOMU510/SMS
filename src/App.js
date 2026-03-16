import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SchoolProvider } from './context/SchoolContext';
import { SidebarProvider } from './context/SidebarContext';
import Header from './components/header';
import Sidebar from './components/sidebar';
import Dashboard from './sms/dashboard';
import Students from './sms/students/Students';
import AddStudent from './sms/students/AddStudent';
import EditStudent from './sms/students/EditStudent';
import StudentAdmission from './sms/students/StudentAdmission';
import StudentRegistration from './sms/students/StudentRegistration';
import Teachers from './sms/teachers/Teachers';
import AddTeacher from './sms/teachers/AddTeacher';
import EditTeacher from './sms/teachers/EditTeacher';
import Classes from './sms/classes/Classes';
import AddClass from './sms/classes/AddClass';
import EditClass from './sms/classes/EditClass';
import Subjects from './sms/subjects/Subjects';
import AddSubject from './sms/subjects/AddSubject';
import EditSubject from './sms/subjects/EditSubject';
import Attendance from './sms/attendance/Attendance';
import StudentAttendance from './sms/attendance/StudentAttendance';
import PeriodAttendance from './sms/attendance/PeriodAttendance';
import AttendanceReports from './sms/attendance/AttendanceReports';
import Fees from './sms/fees/Fees';
import AddFee from './sms/fees/AddFee';
import FeeStructure from './sms/fees/FeeStructure';
import FeeCategories from './sms/fees/FeeCategories';
import AssignFees from './sms/fees/AssignFees';
import OnlinePayments from './sms/fees/OnlinePayments';
import OfflinePayments from './sms/fees/OfflinePayments';
import Receipts from './sms/fees/Receipts';
import FeeDefaulters from './sms/fees/FeeDefaulters';
import FeeReports from './sms/fees/FeeReports';
import Exams from './sms/exams/Exams';
import AddExam from './sms/exams/AddExam';
import ExamTypes from './sms/exams/ExamTypes';
import ExamSchedule from './sms/exams/ExamSchedule';
import MarksEntry from './sms/exams/MarksEntry';
import GradeConfig from './sms/exams/GradeConfig';
import Results from './sms/results/Results';
import ReportCards from './sms/results/ReportCards';
import PerformanceAnalytics from './sms/results/PerformanceAnalytics';
import AcademicYear from './sms/academic/AcademicYear';
import AddAcademicYear from './sms/academic/AddAcademicYear';
import EditAcademicYear from './sms/academic/EditAcademicYear';
import Sections from './sms/academic/Sections';
import AddSection from './sms/academic/AddSection';
import EditSection from './sms/academic/EditSection';
import Curriculum from './sms/academic/Curriculum';
import Syllabus from './sms/academic/Syllabus';
import LessonPlanning from './sms/academic/LessonPlanning';
import Homework from './sms/academic/Homework';
import Assignments from './sms/academic/Assignments';
import AcademicCalendar from './sms/academic/AcademicCalendar';
import AddStaff from './sms/staff/AddStaff';
import Staff from './sms/staff/Staff';
import TeacherProfile from './sms/staff/TeacherProfile';
import StaffAttendance from './sms/staff/StaffAttendance';
import LeaveManagement from './sms/staff/LeaveManagement';
import Payroll from './sms/staff/Payroll';
import TeacherSubjectAllocation from './sms/academic/TeacherSubjectAllocation';
import ClassSubjectAllocation from './sms/academic/Allocation';
import PerformanceEvaluation from './sms/staff/PerformanceEvaluation';
import Timetable from './sms/academic/Timetable';
import Vehicles from './sms/transport/Vehicles';
import Drivers from './sms/transport/Drivers';
import TransportRoutes from './sms/transport/Routes';
import PickupDropPoints from './sms/transport/PickupDropPoints';
import StudentAllocation from './sms/transport/StudentAllocation';
import TransportFees from './sms/transport/TransportFees';
import TransportReports from './sms/transport/TransportReports';
import Announcements from './sms/communication/Announcements';
import Notices from './sms/communication/Notices';
import SMS from './sms/communication/SMS';
import Email from './sms/communication/Email';
import PushNotifications from './sms/communication/PushNotifications';
import ParentTeacherMessaging from './sms/communication/ParentTeacherMessaging';
import Books from './sms/library/Books';
import BookCategories from './sms/library/BookCategories';
import IssueBooks from './sms/library/IssueBooks';
import ReturnBooks from './sms/library/ReturnBooks';
import LibraryReports from './sms/library/LibraryReports';
import DashboardAnalytics from './sms/reports/DashboardAnalytics';
import StudentReports from './sms/reports/StudentReports';
import StudentManagementReports from './sms/students/StudentReports';
import ExaminationReports from './sms/reports/ExaminationReports';
import FeeFinanceReports from './sms/reports/FeeFinanceReports';
import CustomReports from './sms/reports/CustomReports';
import ExportReports from './sms/reports/ExportReports';
import Users from './sms/users/Users';
import RolesPermissions from './sms/users/RolesPermissions';
import RoleAssignment from './sms/users/RoleAssignment';
import LoginHistory from './sms/users/LoginHistory';
import AuditLogs from './sms/users/AuditLogs';
import SchoolProfile from './sms/settings/SchoolProfile';
import AcademicSettings from './sms/settings/AcademicSettings';
import GradeSettings from './sms/settings/GradeSettings';
import FeeSettings from './sms/settings/FeeSettings';
import NotificationSettings from './sms/settings/NotificationSettings';
import BackupRestore from './sms/settings/BackupRestore';
import ClassAllocation from './sms/students/ClassAllocation';
import StudentPromotion from './sms/students/StudentPromotion';
import TransferCertificate from './sms/students/TransferCertificate';
import IDCards from './sms/students/IDCards';
import './App.css';

function App() {
  return (
    <SchoolProvider>
      <SidebarProvider>
    <div className="App">
          <Header />
          <Sidebar />
          <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/add" element={<AddStudent />} />
          <Route path="/students/admission" element={<StudentAdmission />} />
          <Route path="/students/registration" element={<StudentRegistration />} />
          <Route path="/students/edit/:id" element={<EditStudent />} />
          <Route path="/students/allocation" element={<ClassAllocation />} />
          <Route path="/students/attendance" element={<StudentAttendance />} />
          <Route path="/students/promotion" element={<StudentPromotion />} />
          <Route path="/students/transfer-certificate" element={<TransferCertificate />} />
          <Route path="/students/transfer-certificate/:id" element={<TransferCertificate />} />
          <Route path="/students/reports" element={<StudentManagementReports />} />
          <Route path="/students/id-cards" element={<IDCards />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teachers/add" element={<AddTeacher />} />
          <Route path="/teachers/edit/:id" element={<EditTeacher />} />
          <Route path="/staff/profiles" element={<TeacherProfile />} />
          <Route path="/staff/profiles/:id" element={<TeacherProfile />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/classes/add" element={<AddClass />} />
          <Route path="/classes/edit/:id" element={<EditClass />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/subjects/add" element={<AddSubject />} />
          <Route path="/subjects/edit/:id" element={<EditSubject />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/attendance/student" element={<StudentAttendance />} />
          <Route path="/attendance/period" element={<PeriodAttendance />} />
          <Route path="/attendance/reports" element={<AttendanceReports />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/fees/add" element={<AddFee />} />
          <Route path="/fees/structure" element={<FeeStructure />} />
          <Route path="/fees/structure/add" element={<FeeStructure />} />
          <Route path="/fees/structure/:id" element={<FeeStructure />} />
          <Route path="/fees/categories" element={<FeeCategories />} />
          <Route path="/fees/categories/add" element={<FeeCategories />} />
          <Route path="/fees/categories/:id" element={<FeeCategories />} />
          <Route path="/fees/assign" element={<AssignFees />} />
          <Route path="/fees/online" element={<OnlinePayments />} />
          <Route path="/fees/offline" element={<OfflinePayments />} />
          <Route path="/fees/offline/add" element={<OfflinePayments />} />
          <Route path="/fees/offline/:id" element={<OfflinePayments />} />
          <Route path="/fees/receipts" element={<Receipts />} />
          <Route path="/fees/receipts/:id" element={<Receipts />} />
          <Route path="/fees/defaulters" element={<FeeDefaulters />} />
          <Route path="/fees/reports" element={<FeeReports />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/exams/add" element={<AddExam />} />
          <Route path="/exams/types" element={<ExamTypes />} />
          <Route path="/exams/types/add" element={<ExamTypes />} />
          <Route path="/exams/types/:id" element={<ExamTypes />} />
          <Route path="/exams/schedule" element={<ExamSchedule />} />
          <Route path="/exams/schedule/add" element={<ExamSchedule />} />
          <Route path="/exams/schedule/:id" element={<ExamSchedule />} />
          <Route path="/exams/marks-entry" element={<MarksEntry />} />
          <Route path="/exams/grade-config" element={<GradeConfig />} />
          <Route path="/exams/grade-config/add" element={<GradeConfig />} />
          <Route path="/exams/grade-config/:id" element={<GradeConfig />} />
          <Route path="/results" element={<Results />} />
          <Route path="/results/report-cards" element={<ReportCards />} />
          <Route path="/results/analytics" element={<PerformanceAnalytics />} />
          <Route path="/academic/year" element={<AcademicYear />} />
          <Route path="/academic/year/add" element={<AddAcademicYear />} />
          <Route path="/academic/year/edit/:id" element={<EditAcademicYear />} />
          <Route path="/academic/sections" element={<Sections />} />
          <Route path="/academic/sections/add" element={<AddSection />} />
          <Route path="/academic/sections/edit/:id" element={<EditSection />} />
          <Route path="/academic/curriculum" element={<Curriculum />} />
          <Route path="/academic/curriculum/add" element={<Curriculum />} />
          <Route path="/academic/curriculum/:id" element={<Curriculum />} />
          <Route path="/academic/syllabus" element={<Syllabus />} />
          <Route path="/academic/syllabus/add" element={<Syllabus />} />
          <Route path="/academic/syllabus/:id" element={<Syllabus />} />
          <Route path="/academic/lesson-planning" element={<LessonPlanning />} />
          <Route path="/academic/lesson-planning/add" element={<LessonPlanning />} />
          <Route path="/academic/lesson-planning/:id" element={<LessonPlanning />} />
          <Route path="/academic/homework" element={<Homework />} />
          <Route path="/academic/homework/add" element={<Homework />} />
          <Route path="/academic/homework/:id" element={<Homework />} />
          <Route path="/academic/assignments" element={<Assignments />} />
          <Route path="/academic/assignments/add" element={<Assignments />} />
          <Route path="/academic/assignments/:id" element={<Assignments />} />
          <Route path="/academic/calendar" element={<AcademicCalendar />} />
          <Route path="/academic/calendar/add" element={<AcademicCalendar />} />
          <Route path="/academic/calendar/:id" element={<AcademicCalendar />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/staff/add" element={<AddStaff />} />
          <Route path="/staff/attendance" element={<StaffAttendance />} />
          <Route path="/attendance/staff" element={<StaffAttendance />} />
          <Route path="/staff/leave" element={<LeaveManagement />} />
          <Route path="/staff/leave/add" element={<LeaveManagement />} />
          <Route path="/staff/leave/:id" element={<LeaveManagement />} />
          <Route path="/attendance/leave-requests" element={<LeaveManagement />} />
          <Route path="/staff/payroll" element={<Payroll />} />
          <Route path="/staff/payroll/add" element={<Payroll />} />
          <Route path="/staff/payroll/:id" element={<Payroll />} />
          <Route path="/academic/allocation" element={<ClassSubjectAllocation />} />
          <Route path="/academic/allocation/add" element={<ClassSubjectAllocation />} />
          <Route path="/academic/allocation/:id" element={<ClassSubjectAllocation />} />
          <Route path="/academic/teacher-subject-allocation" element={<TeacherSubjectAllocation />} />
          <Route path="/academic/teacher-subject-allocation/add" element={<TeacherSubjectAllocation />} />
          <Route path="/academic/teacher-subject-allocation/:id" element={<TeacherSubjectAllocation />} />
          <Route path="/staff/PerformanceEvaluation" element={<PerformanceEvaluation />} />
          <Route path="/staff/performance-evaluation" element={<PerformanceEvaluation />} />
          <Route path="/staff/performance-evaluation/add" element={<PerformanceEvaluation />} />
          <Route path="/staff/performance-evaluation/:id" element={<PerformanceEvaluation />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/timetable/view" element={<Timetable />} />
          <Route path="/timetable/create" element={<Timetable />} />
          <Route path="/timetable/add" element={<Timetable />} />
          <Route path="/timetable/print" element={<Timetable />} />
          <Route path="/timetable/print/:id" element={<Timetable />} />
          <Route path="/timetable/:id" element={<Timetable />} />
          <Route path="/timetable/view/:id" element={<Timetable />} />
          <Route path="/transport/vehicles" element={<Vehicles />} />
          <Route path="/transport/vehicles/add" element={<Vehicles />} />
          <Route path="/transport/vehicles/:id" element={<Vehicles />} />
          <Route path="/transport/drivers" element={<Drivers />} />
          <Route path="/transport/drivers/add" element={<Drivers />} />
          <Route path="/transport/drivers/:id" element={<Drivers />} />
          <Route path="/transport/routes" element={<TransportRoutes />} />
          <Route path="/transport/routes/add" element={<TransportRoutes />} />
          <Route path="/transport/routes/:id" element={<TransportRoutes />} />
          <Route path="/transport/points" element={<PickupDropPoints />} />
          <Route path="/transport/points/add" element={<PickupDropPoints />} />
          <Route path="/transport/points/:id" element={<PickupDropPoints />} />
          <Route path="/transport/allocation" element={<StudentAllocation />} />
          <Route path="/transport/fees" element={<TransportFees />} />
          <Route path="/transport/reports" element={<TransportReports />} />
          <Route path="/communication/announcements" element={<Announcements />} />
          <Route path="/communication/announcements/add" element={<Announcements />} />
          <Route path="/communication/announcements/:id" element={<Announcements />} />
          <Route path="/communication/notices" element={<Notices />} />
          <Route path="/communication/notices/add" element={<Notices />} />
          <Route path="/communication/notices/:id" element={<Notices />} />
          <Route path="/communication/sms" element={<SMS />} />
          <Route path="/communication/email" element={<Email />} />
          <Route path="/communication/push" element={<PushNotifications />} />
          <Route path="/communication/messaging" element={<ParentTeacherMessaging />} />
          <Route path="/library/books" element={<Books />} />
          <Route path="/library/books/add" element={<Books />} />
          <Route path="/library/books/:id" element={<Books />} />
          <Route path="/library/categories" element={<BookCategories />} />
          <Route path="/library/categories/add" element={<BookCategories />} />
          <Route path="/library/categories/:id" element={<BookCategories />} />
          <Route path="/library/issue" element={<IssueBooks />} />
          <Route path="/library/return" element={<ReturnBooks />} />
          <Route path="/library/reports" element={<LibraryReports />} />
          <Route path="/reports/dashboard" element={<DashboardAnalytics />} />
          <Route path="/reports/students" element={<StudentReports />} />
          <Route path="/reports/attendance" element={<AttendanceReports />} />
          <Route path="/reports/examinations" element={<ExaminationReports />} />
          <Route path="/reports/fees" element={<FeeFinanceReports />} />
          <Route path="/reports/transport" element={<TransportReports />} />
          <Route path="/reports/custom" element={<CustomReports />} />
          <Route path="/reports/export" element={<ExportReports />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/add" element={<Users />} />
          <Route path="/users/:id" element={<Users />} />
          <Route path="/users/roles" element={<RolesPermissions />} />
          <Route path="/users/roles/add" element={<RolesPermissions />} />
          <Route path="/users/roles/:id" element={<RolesPermissions />} />
          <Route path="/users/role-assignment" element={<RoleAssignment />} />
          <Route path="/users/login-history" element={<LoginHistory />} />
          <Route path="/users/audit-logs" element={<AuditLogs />} />
          <Route path="/settings/school-profile" element={<SchoolProfile />} />
          <Route path="/settings/academic" element={<AcademicSettings />} />
          <Route path="/settings/grades" element={<GradeSettings />} />
          <Route path="/settings/fees" element={<FeeSettings />} />
          <Route path="/settings/notifications" element={<NotificationSettings />} />
          <Route path="/settings/backup" element={<BackupRestore />} />
          </Routes>
    </div>
      </SidebarProvider>
    </SchoolProvider>
  );
}

export default App;
