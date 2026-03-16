# User Management Database Schema Documentation

## Overview
This document describes the database schema for the User Management module of the School Management System. The schema is designed to support user authentication, authorization, role-based access control, and comprehensive audit logging.

## Database Tables

### 1. `users`
Stores user account information and authentication details.

**Fields:**
- `id` - Primary key, auto-increment
- `username` - Unique username for login (VARCHAR(50), UNIQUE, NOT NULL)
- `email` - Unique email address (VARCHAR(100), UNIQUE, NOT NULL)
- `password_hash` - Hashed password (VARCHAR(255), NOT NULL)
- `first_name` - User's first name (VARCHAR(50), NOT NULL)
- `last_name` - User's last name (VARCHAR(50))
- `phone` - Contact phone number (VARCHAR(20))
- `role_id` - Foreign key to `roles` table (INT, nullable)
- `status` - User status: Active, Inactive, Suspended (ENUM, default: 'Active')
- `last_login` - Timestamp of last successful login (DATETIME, nullable)
- `password_reset_token` - Token for password reset (VARCHAR(255), nullable)
- `password_reset_expires` - Expiration time for reset token (DATETIME, nullable)
- `email_verified` - Email verification status (BOOLEAN, default: FALSE)
- `email_verification_token` - Token for email verification (VARCHAR(255), nullable)
- `created_at` - Record creation timestamp
- `updated_at` - Record update timestamp
- `created_by` - User who created this record (self-reference)
- `updated_by` - User who last updated this record (self-reference)

**Indexes:**
- Primary key on `id`
- Unique index on `username`
- Unique index on `email`
- Index on `role_id` for foreign key lookups
- Index on `status` for filtering active users

**Relationships:**
- Many-to-one with `roles` (via `role_id`)
- Self-referencing for `created_by` and `updated_by`

---

### 2. `roles`
Stores role definitions for role-based access control.

**Fields:**
- `id` - Primary key, auto-increment
- `name` - Role name (VARCHAR(100), NOT NULL) - e.g., "Administrator", "Teacher"
- `code` - Unique role code (VARCHAR(50), UNIQUE, NOT NULL) - e.g., "ADMIN", "TEACHER"
- `description` - Role description (TEXT)
- `status` - Role status: Active, Inactive (ENUM, default: 'Active')
- `created_at` - Record creation timestamp
- `updated_at` - Record update timestamp
- `created_by` - User who created this role
- `updated_by` - User who last updated this role

**Indexes:**
- Primary key on `id`
- Unique index on `code`
- Index on `status`

**Relationships:**
- One-to-many with `users` (via `role_id` in users table)
- Many-to-many with `permissions` (via `role_permissions` junction table)

---

### 3. `permissions`
Stores system permissions that can be assigned to roles.

**Fields:**
- `id` - Primary key, auto-increment
- `name` - Permission name (VARCHAR(100), NOT NULL) - e.g., "View Students"
- `code` - Unique permission code (VARCHAR(50), UNIQUE, NOT NULL) - e.g., "VIEW_STUDENTS"
- `module` - Module/feature name (VARCHAR(50), NOT NULL) - e.g., "Students", "Fees"
- `action` - Action type (VARCHAR(50), NOT NULL) - e.g., "View", "Create", "Update", "Delete"
- `description` - Permission description (TEXT)
- `created_at` - Record creation timestamp
- `updated_at` - Record update timestamp

**Indexes:**
- Primary key on `id`
- Unique index on `code`
- Index on `module` for filtering by module
- Index on `action` for filtering by action type

**Relationships:**
- Many-to-many with `roles` (via `role_permissions` junction table)

---

### 4. `role_permissions`
Junction table for many-to-many relationship between roles and permissions.

**Fields:**
- `id` - Primary key, auto-increment
- `role_id` - Foreign key to `roles` (INT, NOT NULL)
- `permission_id` - Foreign key to `permissions` (INT, NOT NULL)
- `granted` - Whether permission is granted (BOOLEAN, default: TRUE)
- `created_at` - Record creation timestamp
- `created_by` - User who assigned this permission

**Constraints:**
- Unique constraint on (`role_id`, `permission_id`) to prevent duplicates
- Cascade delete: if role or permission is deleted, this record is deleted

**Indexes:**
- Primary key on `id`
- Unique index on (`role_id`, `permission_id`)
- Index on `role_id`
- Index on `permission_id`

---

### 5. `user_roles` (Optional)
Junction table for users with multiple roles (if needed in future).

**Fields:**
- `id` - Primary key, auto-increment
- `user_id` - Foreign key to `users` (INT, NOT NULL)
- `role_id` - Foreign key to `roles` (INT, NOT NULL)
- `assigned_at` - When role was assigned
- `assigned_by` - User who assigned this role
- `is_primary` - Whether this is the primary role (BOOLEAN, default: FALSE)

**Note:** Currently, the form design uses a single `role_id` in the `users` table. This table is included for future extensibility if multiple roles per user are needed.

---

### 6. `login_history`
Tracks all user login attempts and sessions.

**Fields:**
- `id` - Primary key, auto-increment
- `user_id` - Foreign key to `users` (INT, NOT NULL)
- `username` - Username used for login (VARCHAR(50), NOT NULL)
- `login_time` - Login timestamp (DATETIME, NOT NULL)
- `logout_time` - Logout timestamp (DATETIME, nullable)
- `ip_address` - IP address of login (VARCHAR(45)) - supports IPv6
- `user_agent` - Browser/client information (TEXT)
- `device_type` - Device type (VARCHAR(50)) - e.g., "Desktop", "Mobile"
- `browser` - Browser name (VARCHAR(100))
- `operating_system` - OS information (VARCHAR(100))
- `location` - Geographic location (VARCHAR(255))
- `status` - Login status: Success, Failed (ENUM, default: 'Success')
- `failure_reason` - Reason for failed login (VARCHAR(255), nullable)
- `session_id` - Session identifier (VARCHAR(255), nullable)
- `created_at` - Record creation timestamp

**Indexes:**
- Primary key on `id`
- Index on `user_id` for user-specific queries
- Index on `login_time` for time-based queries
- Index on `status` for filtering by success/failure
- Index on `ip_address` for security analysis

**Relationships:**
- Many-to-one with `users` (via `user_id`)

---

### 7. `audit_logs`
Comprehensive audit trail of all system activities.

**Fields:**
- `id` - Primary key, auto-increment
- `user_id` - Foreign key to `users` (INT, NOT NULL)
- `username` - Username at time of action (VARCHAR(50), NOT NULL)
- `action` - Action performed (VARCHAR(50), NOT NULL) - e.g., "Create", "Update", "Delete", "View"
- `module` - Module/feature where action occurred (VARCHAR(50), NOT NULL) - e.g., "Students", "Fees"
- `entity_type` - Type of entity affected (VARCHAR(50)) - e.g., "User", "Student"
- `entity_id` - ID of entity affected (INT)
- `description` - Action description (TEXT)
- `old_values` - Previous values (JSON) - for updates
- `new_values` - New values (JSON) - for updates/creates
- `ip_address` - IP address of user (VARCHAR(45))
- `user_agent` - Browser/client information (TEXT)
- `timestamp` - Action timestamp (DATETIME, NOT NULL)
- `status` - Action status: Success, Failed, Warning (ENUM, default: 'Success')
- `error_message` - Error message if action failed (TEXT, nullable)
- `created_at` - Record creation timestamp

**Indexes:**
- Primary key on `id`
- Index on `user_id` for user-specific queries
- Index on `action` for filtering by action type
- Index on `module` for filtering by module
- Index on `timestamp` for time-based queries
- Composite index on (`entity_type`, `entity_id`) for entity-specific queries
- Index on `status` for filtering by status

**Relationships:**
- Many-to-one with `users` (via `user_id`)

---

### 8. `password_history`
Stores password history to prevent password reuse.

**Fields:**
- `id` - Primary key, auto-increment
- `user_id` - Foreign key to `users` (INT, NOT NULL)
- `password_hash` - Hashed password (VARCHAR(255), NOT NULL)
- `changed_at` - When password was changed (TIMESTAMP)
- `changed_by` - User who changed the password (INT, nullable) - can be self or admin

**Indexes:**
- Primary key on `id`
- Index on `user_id` for user-specific queries
- Index on `changed_at` for time-based queries

**Relationships:**
- Many-to-one with `users` (via `user_id`)

---

### 9. `user_sessions`
Tracks active user sessions for session management.

**Fields:**
- `id` - Primary key, auto-increment
- `user_id` - Foreign key to `users` (INT, NOT NULL)
- `session_token` - Unique session token (VARCHAR(255), UNIQUE, NOT NULL)
- `ip_address` - IP address of session (VARCHAR(45))
- `user_agent` - Browser/client information (TEXT)
- `login_time` - Session start time (DATETIME, NOT NULL)
- `last_activity` - Last activity timestamp (DATETIME, NOT NULL)
- `expires_at` - Session expiration time (DATETIME, NOT NULL)
- `is_active` - Whether session is active (BOOLEAN, default: TRUE)
- `created_at` - Record creation timestamp

**Indexes:**
- Primary key on `id`
- Unique index on `session_token`
- Index on `user_id` for user-specific queries
- Index on `expires_at` for cleanup queries
- Index on `is_active` for filtering active sessions

**Relationships:**
- Many-to-one with `users` (via `user_id`)

---

## Database Views

### 1. `vw_users_with_roles`
Combines user information with role details for easy querying.

**Columns:**
- All user fields
- `role_id`, `role_name`, `role_code` from roles table

**Use Case:** Quick access to user information with role details without joins.

---

### 2. `vw_roles_with_permissions`
Shows roles with their permission counts.

**Columns:**
- All role fields
- `permission_count` - Number of permissions assigned to the role

**Use Case:** Display role list with permission counts in the UI.

---

### 3. `vw_user_login_stats`
Provides login statistics per user.

**Columns:**
- `user_id`, `username`
- `total_logins` - Total number of login attempts
- `successful_logins` - Number of successful logins
- `failed_logins` - Number of failed logins
- `last_login_time` - Most recent login time

**Use Case:** Dashboard statistics and user activity reports.

---

## Stored Procedures

### 1. `sp_get_user_permissions(user_id)`
Returns all permissions for a given user based on their role.

**Parameters:**
- `p_user_id` (INT) - User ID

**Returns:** All permissions assigned to the user's role.

**Use Case:** Check user permissions in application code.

---

### 2. `sp_check_user_permission(user_id, permission_code)`
Checks if a user has a specific permission.

**Parameters:**
- `p_user_id` (INT) - User ID
- `p_permission_code` (VARCHAR(50)) - Permission code to check

**Returns:** Boolean output parameter `p_has_permission`

**Use Case:** Permission checks in application logic.

---

## Triggers

### 1. `trg_update_last_login`
Automatically updates the `last_login` field in the `users` table when a successful login is recorded.

**Trigger:** AFTER INSERT on `login_history`
**Action:** Updates `users.last_login` if login status is 'Success'

---

### 2. `trg_audit_user_create`
Automatically logs user creation in audit_logs.

**Trigger:** AFTER INSERT on `users`
**Action:** Creates audit log entry for user creation

---

### 3. `trg_audit_user_update`
Automatically logs user updates in audit_logs with old and new values.

**Trigger:** AFTER UPDATE on `users`
**Action:** Creates audit log entry with JSON of old and new values

---

### 4. `trg_audit_user_delete`
Automatically logs user deletion in audit_logs.

**Trigger:** BEFORE DELETE on `users`
**Action:** Creates audit log entry before user is deleted

---

## Default Data

### Permissions
The schema includes default permissions for:
- Students module (View, Add, Edit, Delete)
- Fees module (View, Manage)
- Reports module (View, Export)
- Users module (Manage)
- Settings module (Manage)

### Roles
Default roles created:
- **Administrator** - Full system access (all permissions)
- **Teacher** - Access to Students and Reports modules
- **Accountant** - Access to Fees and Reports modules
- **Staff** - General staff access
- **Parent** - Limited access to view student information

### Default Admin User
- Username: `admin`
- Email: `admin@school.com`
- Password: `admin123` (should be changed on first login)
- Role: Administrator

---

## Security Considerations

1. **Password Storage:** Passwords are stored as hashes (use bcrypt or similar)
2. **Password History:** Prevents reuse of recent passwords
3. **Session Management:** Tracks active sessions with expiration
4. **Audit Trail:** Comprehensive logging of all user actions
5. **Login Tracking:** Records all login attempts for security analysis
6. **Email Verification:** Supports email verification workflow
7. **Password Reset:** Token-based password reset mechanism

---

## Performance Optimization

1. **Indexes:** Strategic indexes on foreign keys and frequently queried fields
2. **Composite Indexes:** For common query patterns (e.g., user_id + status)
3. **Views:** Pre-computed views for common queries
4. **Partitioning:** Consider partitioning `login_history` and `audit_logs` by date for large datasets

---

## Maintenance Tasks

1. **Cleanup Old Sessions:** Regularly delete expired sessions from `user_sessions`
2. **Archive Login History:** Archive old login history records (older than 1 year)
3. **Archive Audit Logs:** Archive old audit logs (older than 2 years)
4. **Password History Cleanup:** Keep only last N passwords per user
5. **Index Maintenance:** Regularly analyze and optimize indexes

---

## ER Diagram Relationships

```
users (1) ----< (N) login_history
users (1) ----< (N) audit_logs
users (1) ----< (N) password_history
users (1) ----< (N) user_sessions
users (N) ----< (1) roles
roles (N) ----< (N) permissions [via role_permissions]
users (N) ----< (N) roles [via user_roles] (optional)
```

---

## Migration Notes

1. Run the schema creation script in order
2. Default data will be inserted automatically
3. Change default admin password immediately after deployment
4. Configure email verification if using email verification feature
5. Set up scheduled jobs for cleanup tasks

---

## Future Enhancements

1. **Two-Factor Authentication:** Add 2FA support with additional tables
2. **API Keys:** Support for API-based authentication
3. **OAuth Integration:** Support for third-party authentication
4. **Role Hierarchy:** Support for role inheritance
5. **Time-based Permissions:** Permissions that expire or activate at specific times
6. **IP Whitelisting:** Restrict access by IP address

