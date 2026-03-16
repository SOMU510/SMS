import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import './sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { isCollapsed } = useSidebar();
  const [expandedMenus, setExpandedMenus] = useState([]);

  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [isCollapsed]);

  // Auto-expand parent menus when child routes are active
  useEffect(() => {
    const path = location.pathname;
    const activeMenus = [];
    
    // Student Management
    if (path.startsWith('/students')) {
      activeMenus.push('students');
    }
    // Staff Management
    if (path.startsWith('/staff') || path.startsWith('/teachers')) {
      activeMenus.push('staff');
    }
    // Academic Management
    if (path.startsWith('/academic') || path.startsWith('/classes') || path.startsWith('/subjects')) {
      activeMenus.push('academic');
    }
    // Timetable
    if (path.startsWith('/timetable')) {
      activeMenus.push('timetable');
    }
    // Attendance
    if (path.startsWith('/attendance')) {
      activeMenus.push('attendance');
    }
    // Examination
    if (path.startsWith('/exams') || path.startsWith('/results') || path.startsWith('/grading')) {
      activeMenus.push('examination');
    }
    // Fee Management
    if (path.startsWith('/fees') || path.startsWith('/fee')) {
      activeMenus.push('fee');
    }
    // Transport
    if (path.startsWith('/transport')) {
      activeMenus.push('transport');
    }
    // Communication
    if (path.startsWith('/communication')) {
      activeMenus.push('communication');
    }
    // Library
    if (path.startsWith('/library')) {
      activeMenus.push('library');
    }
    // Reports
    if (path.startsWith('/reports')) {
      activeMenus.push('reports');
    }
    // User Management
    if (path.startsWith('/users') || path.startsWith('/user-management')) {
      activeMenus.push('users');
    }
    // Settings
    if (path.startsWith('/settings')) {
      activeMenus.push('settings');
    }
    // Help
    if (path.startsWith('/help')) {
      activeMenus.push('help');
    }
    
    setExpandedMenus(activeMenus);
  }, [location.pathname]);

  const toggleMenu = (menu) => {
    if (expandedMenus.includes(menu)) {
      setExpandedMenus(expandedMenus.filter((m) => m !== menu));
    } else {
      setExpandedMenus([...expandedMenus, menu]);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const MenuItem = ({ icon, label, tooltip, path, children, menuKey }) => {
    const hasChildren = children && children.length > 0;
    const isExpanded = expandedMenus.includes(menuKey);
    const isParentActive = hasChildren && children.some(child => isActive(child.path));

    if (hasChildren) {
      return (
        <li className="nav-item">
          <a
            className={`nav-link ${isExpanded || isParentActive ? '' : 'collapsed'}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!isCollapsed) {
                toggleMenu(menuKey);
              }
            }}
            data-tooltip={tooltip || label}
          >
            <i className={icon}></i>
            {!isCollapsed && <span>{label}</span>}
            {!isCollapsed && (
              <i className={`bi bi-chevron-down ms-auto ${isExpanded ? 'rotated' : ''}`}></i>
            )}
          </a>
          <ul className={`nav-content ${isExpanded ? 'show' : 'collapse'}`}>
            {children.map((child, index) => (
              <li key={index}>
                <Link
                  to={child.path}
                  className={isActive(child.path) ? 'active' : ''}
                  onClick={() => isCollapsed && toggleMenu(menuKey)}
                >
                  <i className="bi bi-circle"></i>
                  <span>{child.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </li>
      );
    }

    return (
      <li className="nav-item">
        <Link
          className={`nav-link ${isActive(path) ? 'active' : ''}`}
          to={path}
          data-tooltip={tooltip || label}
        >
          <i className={icon}></i>
          {!isCollapsed && <span>{label}</span>}
        </Link>
      </li>
    );
  };

  const menuItems = [
    {
      icon: 'bi bi-grid',
      label: 'Dashboard',
      tooltip: 'Dashboard',
      path: '/',
      menuKey: 'dashboard'
    },
    {
      icon: 'bi bi-people',
      label: 'Student Management',
      tooltip: 'Students',
      menuKey: 'students',
      children: [
        { label: 'Student Admission', path: '/students/admission' },
        { label: 'Student Registration', path: '/students/registration' },
        { label: 'Student List', path: '/students' },
        { label: 'Class & Section Allocation', path: '/students/allocation' },
        { label: 'Student Attendance', path: '/students/attendance' },
        { label: 'Student Promotion', path: '/students/promotion' },
        { label: 'Transfer Certificate', path: '/students/transfer-certificate' },
        { label: 'Student Reports', path: '/students/reports' },
        { label: 'ID Card Generation', path: '/students/id-cards' }
      ]
    },
    {
      icon: 'bi bi-person-badge',
      label: 'Teacher / Staff Management',
      tooltip: 'Staff',
      menuKey: 'staff',
      children: [
        { label: 'Add Staff', path: '/staff/add' },
        { label: 'Staff List', path: '/staff' },
        { label: 'Teacher Profiles', path: '/staff/profiles' },
        { label: 'Staff Attendance', path: '/staff/attendance' },
        { label: 'Leave Management', path: '/staff/leave' },
        { label: 'Payroll & Salary', path: '/staff/payroll' },
        { label: 'Class & Subject Allocation', path: '/academic/allocation' },
        { label: 'Performance Evaluation', path: '/staff/PerformanceEvaluation' }
      ]
    },
    {
      icon: 'bi bi-book',
      label: 'Academic Management',
      tooltip: 'Academic',
      menuKey: 'academic',
      children: [
        { label: 'Academic Year', path: '/academic/year' },
        { label: 'Classes', path: '/classes' },
        { label: 'Sections', path: '/academic/sections' },
        { label: 'Subjects', path: '/subjects' },
        { label: 'Curriculum', path: '/academic/curriculum' },
        { label: 'Syllabus Management', path: '/academic/syllabus' },
        { label: 'Lesson Planning', path: '/academic/lesson-planning' },
        { label: 'Homework', path: '/academic/homework' },
        { label: 'Assignments', path: '/academic/assignments' },
        { label: 'Academic Calendar', path: '/academic/calendar' }
      ]
    },
    {
      icon: 'bi bi-calendar-week',
      label: 'Timetable Management',
      tooltip: 'Timetable',
      menuKey: 'timetable',
      children: [
        { label: 'Create Timetable', path: '/timetable/create' },
        { label: 'View Timetable', path: '/timetable/view' },
        { label: 'Teacher Timetable', path: '/timetable/teacher' },
        { label: 'Class Timetable', path: '/timetable/class' },
        { label: 'Substitute Teacher', path: '/timetable/substitute' },
        { label: 'Print / Export Timetable', path: '/timetable/print' }
      ]
    },
    {
      icon: 'bi bi-calendar-check',
      label: 'Attendance Management',
      tooltip: 'Attendance',
      menuKey: 'attendance',
      children: [
        { label: 'Student Attendance', path: '/attendance/student' },
        { label: 'Staff Attendance', path: '/attendance/staff' },
        { label: 'Period-wise Attendance', path: '/attendance/period' },
        { label: 'Leave Requests', path: '/attendance/leave-requests' },
        { label: 'Attendance Reports', path: '/attendance/reports' }
      ]
    },
    {
      icon: 'bi bi-file-earmark-text',
      label: 'Examination & Grading',
      tooltip: 'Examinations',
      menuKey: 'examination',
      children: [
        { label: 'Exam Types', path: '/exams/types' },
        { label: 'Create Exam', path: '/exams/add' },
        { label: 'Exam Schedule', path: '/exams/schedule' },
        { label: 'Marks Entry', path: '/exams/marks-entry' },
        { label: 'Grade Configuration', path: '/exams/grade-config' },
        { label: 'Result Generation', path: '/results' },
        { label: 'Report Cards', path: '/results/report-cards' },
        { label: 'Performance Analytics', path: '/results/analytics' }
      ]
    },
    {
      icon: 'bi bi-cash-coin',
      label: 'Fee Management',
      tooltip: 'Fees',
      menuKey: 'fee',
      children: [
        { label: 'Fee Structure', path: '/fees/structure' },
        { label: 'Fee Categories', path: '/fees/categories' },
        { label: 'Assign Fees', path: '/fees/assign' },
        { label: 'Fee Collection', path: '/fees' },
        { label: 'Online Payments', path: '/fees/online' },
        { label: 'Offline Payments', path: '/fees/offline' },
        { label: 'Receipts', path: '/fees/receipts' },
        { label: 'Fee Defaulters', path: '/fees/defaulters' },
        { label: 'Fee Reports', path: '/fees/reports' }
      ]
    },
    {
      icon: 'bi bi-bus-front',
      label: 'Transportation Management',
      tooltip: 'Transport',
      menuKey: 'transport',
      children: [
        { label: 'Vehicles', path: '/transport/vehicles' },
        { label: 'Drivers', path: '/transport/drivers' },
        { label: 'Routes', path: '/transport/routes' },
        { label: 'Pickup & Drop Points', path: '/transport/points' },
        { label: 'Student Transport Allocation', path: '/transport/allocation' },
        { label: 'Transport Fees', path: '/transport/fees' },
        { label: 'Transport Reports', path: '/transport/reports' }
      ]
    },
    {
      icon: 'bi bi-chat-dots',
      label: 'Communication',
      tooltip: 'Communication',
      menuKey: 'communication',
      children: [
        { label: 'Announcements', path: '/communication/announcements' },
        { label: 'Notices & Circulars', path: '/communication/notices' },
        { label: 'SMS', path: '/communication/sms' },
        { label: 'Email', path: '/communication/email' },
        { label: 'Push Notifications', path: '/communication/push' },
        { label: 'Parent–Teacher Messaging', path: '/communication/messaging' }
      ]
    },
    {
      icon: 'bi bi-book-half',
      label: 'Library Management',
      tooltip: 'Library',
      menuKey: 'library',
      children: [
        { label: 'Books', path: '/library/books' },
        { label: 'Book Categories', path: '/library/categories' },
        { label: 'Issue Books', path: '/library/issue' },
        { label: 'Return Books', path: '/library/return' },
        { label: 'Library Reports', path: '/library/reports' }
      ]
    },
    {
      icon: 'bi bi-graph-up',
      label: 'Reports & Analytics',
      tooltip: 'Reports',
      menuKey: 'reports',
      children: [
        { label: 'Student Reports', path: '/reports/students' },
        { label: 'Attendance Reports', path: '/reports/attendance' },
        { label: 'Examination Reports', path: '/reports/examinations' },
        { label: 'Fee & Finance Reports', path: '/reports/fees' },
        { label: 'Transport Reports', path: '/reports/transport' },
        { label: 'Custom Reports', path: '/reports/custom' },
        { label: 'Export (PDF / Excel)', path: '/reports/export' }
      ]
    },
    {
      icon: 'bi bi-people-fill',
      label: 'User Management',
      tooltip: 'Users',
      menuKey: 'users',
      children: [
        { label: 'Users', path: '/users' },
        { label: 'Roles & Permissions', path: '/users/roles' },
        { label: 'Role Assignment', path: '/users/role-assignment' },
        { label: 'Login History', path: '/users/login-history' },
        { label: 'Audit Logs', path: '/users/audit-logs' }
      ]
    },
    {
      icon: 'bi bi-gear',
      label: 'Settings',
      tooltip: 'Settings',
      menuKey: 'settings',
      children: [
        { label: 'School Profile', path: '/settings/school-profile' },
        { label: 'Academic Settings', path: '/settings/academic' },
        { label: 'Grade Settings', path: '/settings/grades' },
        { label: 'Fee Settings', path: '/settings/fees' },
        { label: 'Notification Settings', path: '/settings/notifications' },
        { label: 'Backup & Restore', path: '/settings/backup' }
      ]
    },
    {
      icon: 'bi bi-question-circle',
      label: 'Help & Support',
      tooltip: 'Help',
      menuKey: 'help',
      children: [
        { label: 'User Guide', path: '/help/guide' },
        { label: 'FAQs', path: '/help/faqs' },
        { label: 'Contact Support', path: '/help/contact' }
      ]
    }
  ];

  return (
    <aside id="sidebar" className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <ul className="sidebar-nav" id="sidebar-nav">
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            icon={item.icon}
            label={item.label}
            tooltip={item.tooltip}
            path={item.path}
            children={item.children}
            menuKey={item.menuKey}
          />
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
