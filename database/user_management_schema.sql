-- =====================================================
-- USER MANAGEMENT DATABASE SCHEMA
-- School Management System
-- =====================================================

-- =====================================================
-- 1. USERS TABLE
-- Stores user account information
-- =====================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    phone VARCHAR(20),
    role_id INT,
    status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    last_login DATETIME NULL,
    password_reset_token VARCHAR(255) NULL,
    password_reset_expires DATETIME NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_by INT NULL,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role_id (role_id),
    INDEX idx_status (status),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. ROLES TABLE
-- Stores role definitions
-- =====================================================
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_by INT NULL,
    INDEX idx_code (code),
    INDEX idx_status (status),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. PERMISSIONS TABLE
-- Stores system permissions
-- =====================================================
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_module (module),
    INDEX idx_action (action),
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. ROLE_PERMISSIONS TABLE
-- Many-to-many relationship between roles and permissions
-- =====================================================
CREATE TABLE role_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    granted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    UNIQUE KEY unique_role_permission (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_role_id (role_id),
    INDEX idx_permission_id (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. USER_ROLES TABLE (Optional - for multiple roles per user)
-- Many-to-many relationship between users and roles
-- =====================================================
CREATE TABLE user_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    UNIQUE KEY unique_user_role (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. LOGIN_HISTORY TABLE
-- Tracks user login activities
-- =====================================================
CREATE TABLE login_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    login_time DATETIME NOT NULL,
    logout_time DATETIME NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    operating_system VARCHAR(100),
    location VARCHAR(255),
    status ENUM('Success', 'Failed') DEFAULT 'Success',
    failure_reason VARCHAR(255) NULL,
    session_id VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_login_time (login_time),
    INDEX idx_status (status),
    INDEX idx_ip_address (ip_address),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. AUDIT_LOGS TABLE
-- Tracks system activities and changes
-- =====================================================
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    module VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    description TEXT,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp DATETIME NOT NULL,
    status ENUM('Success', 'Failed', 'Warning') DEFAULT 'Success',
    error_message TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_module (module),
    INDEX idx_timestamp (timestamp),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_status (status),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. PASSWORD_HISTORY TABLE
-- Stores password history for security (prevent reuse)
-- =====================================================
CREATE TABLE password_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by INT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_changed_at (changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. USER_SESSIONS TABLE
-- Tracks active user sessions
-- =====================================================
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    login_time DATETIME NOT NULL,
    last_activity DATETIME NOT NULL,
    expires_at DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_expires_at (expires_at),
    INDEX idx_is_active (is_active),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert default permissions
INSERT INTO permissions (name, code, module, action, description) VALUES
('View Students', 'VIEW_STUDENTS', 'Students', 'View', 'Permission to view student records'),
('Add Students', 'ADD_STUDENTS', 'Students', 'Create', 'Permission to add new students'),
('Edit Students', 'EDIT_STUDENTS', 'Students', 'Update', 'Permission to edit student records'),
('Delete Students', 'DELETE_STUDENTS', 'Students', 'Delete', 'Permission to delete students'),
('View Fees', 'VIEW_FEES', 'Fees', 'View', 'Permission to view fee records'),
('Manage Fees', 'MANAGE_FEES', 'Fees', 'Manage', 'Permission to manage all fee operations'),
('View Reports', 'VIEW_REPORTS', 'Reports', 'View', 'Permission to view reports'),
('Export Reports', 'EXPORT_REPORTS', 'Reports', 'Export', 'Permission to export reports'),
('Manage Users', 'MANAGE_USERS', 'Users', 'Manage', 'Permission to manage user accounts'),
('System Settings', 'SYSTEM_SETTINGS', 'Settings', 'Manage', 'Permission to manage system settings');

-- Insert default roles
INSERT INTO roles (name, code, description, status) VALUES
('Administrator', 'ADMIN', 'Full system access with all permissions', 'Active'),
('Teacher', 'TEACHER', 'Teacher access with limited permissions', 'Active'),
('Accountant', 'ACCOUNTANT', 'Financial access for fee management', 'Active'),
('Staff', 'STAFF', 'General staff access', 'Active'),
('Parent', 'PARENT', 'Parent access to view student information', 'Active');

-- Assign permissions to Administrator role (all permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Assign permissions to Teacher role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions WHERE module = 'Students' OR module = 'Reports';

-- Assign permissions to Accountant role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions WHERE module = 'Fees' OR module = 'Reports';

-- Create default admin user (password should be hashed in production)
-- Default password: admin123 (should be changed on first login)
INSERT INTO users (username, email, password_hash, first_name, last_name, role_id, status, email_verified)
VALUES ('admin', 'admin@school.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 1, 'Active', TRUE);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: User with Role Information
CREATE OR REPLACE VIEW vw_users_with_roles AS
SELECT 
    u.id,
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    u.phone,
    u.status,
    u.last_login,
    u.created_at,
    r.id AS role_id,
    r.name AS role_name,
    r.code AS role_code
FROM users u
LEFT JOIN roles r ON u.role_id = r.id;

-- View: Role with Permission Count
CREATE OR REPLACE VIEW vw_roles_with_permissions AS
SELECT 
    r.id,
    r.name,
    r.code,
    r.description,
    r.status,
    COUNT(rp.permission_id) AS permission_count,
    r.created_at
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id AND rp.granted = TRUE
GROUP BY r.id, r.name, r.code, r.description, r.status, r.created_at;

-- View: User Login Statistics
CREATE OR REPLACE VIEW vw_user_login_stats AS
SELECT 
    u.id AS user_id,
    u.username,
    COUNT(lh.id) AS total_logins,
    SUM(CASE WHEN lh.status = 'Success' THEN 1 ELSE 0 END) AS successful_logins,
    SUM(CASE WHEN lh.status = 'Failed' THEN 1 ELSE 0 END) AS failed_logins,
    MAX(lh.login_time) AS last_login_time
FROM users u
LEFT JOIN login_history lh ON u.id = lh.user_id
GROUP BY u.id, u.username;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

-- Procedure: Get User Permissions
DELIMITER //
CREATE PROCEDURE sp_get_user_permissions(IN p_user_id INT)
BEGIN
    SELECT DISTINCT p.*
    FROM permissions p
    INNER JOIN role_permissions rp ON p.id = rp.permission_id
    INNER JOIN users u ON u.role_id = rp.role_id
    WHERE u.id = p_user_id AND rp.granted = TRUE AND u.status = 'Active';
END //
DELIMITER ;

-- Procedure: Check User Permission
DELIMITER //
CREATE PROCEDURE sp_check_user_permission(
    IN p_user_id INT,
    IN p_permission_code VARCHAR(50),
    OUT p_has_permission BOOLEAN
)
BEGIN
    DECLARE v_count INT;
    
    SELECT COUNT(*) INTO v_count
    FROM permissions p
    INNER JOIN role_permissions rp ON p.id = rp.permission_id
    INNER JOIN users u ON u.role_id = rp.role_id
    WHERE u.id = p_user_id 
    AND p.code = p_permission_code 
    AND rp.granted = TRUE 
    AND u.status = 'Active';
    
    SET p_has_permission = (v_count > 0);
END //
DELIMITER ;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Update last_login on successful login
DELIMITER //
CREATE TRIGGER trg_update_last_login
AFTER INSERT ON login_history
FOR EACH ROW
BEGIN
    IF NEW.status = 'Success' THEN
        UPDATE users 
        SET last_login = NEW.login_time 
        WHERE id = NEW.user_id;
    END IF;
END //
DELIMITER ;

-- Trigger: Log user creation in audit_logs
DELIMITER //
CREATE TRIGGER trg_audit_user_create
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, username, action, module, entity_type, entity_id, description, timestamp)
    VALUES (NEW.created_by, (SELECT username FROM users WHERE id = NEW.created_by), 'Create', 'Users', 'User', NEW.id, 
            CONCAT('User created: ', NEW.username), NOW());
END //
DELIMITER ;

-- Trigger: Log user update in audit_logs
DELIMITER //
CREATE TRIGGER trg_audit_user_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    IF OLD.username != NEW.username OR OLD.email != NEW.email OR OLD.status != NEW.status OR OLD.role_id != NEW.role_id THEN
        INSERT INTO audit_logs (user_id, username, action, module, entity_type, entity_id, description, timestamp, old_values, new_values)
        VALUES (NEW.updated_by, (SELECT username FROM users WHERE id = NEW.updated_by), 'Update', 'Users', 'User', NEW.id,
                CONCAT('User updated: ', NEW.username), NOW(),
                JSON_OBJECT('username', OLD.username, 'email', OLD.email, 'status', OLD.status, 'role_id', OLD.role_id),
                JSON_OBJECT('username', NEW.username, 'email', NEW.email, 'status', NEW.status, 'role_id', NEW.role_id));
    END IF;
END //
DELIMITER ;

-- Trigger: Log user deletion in audit_logs
DELIMITER //
CREATE TRIGGER trg_audit_user_delete
BEFORE DELETE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, username, action, module, entity_type, entity_id, description, timestamp)
    VALUES (OLD.id, OLD.username, 'Delete', 'Users', 'User', OLD.id,
            CONCAT('User deleted: ', OLD.username), NOW());
END //
DELIMITER ;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_users_role_status ON users(role_id, status);
CREATE INDEX idx_login_history_user_status ON login_history(user_id, status);
CREATE INDEX idx_audit_logs_user_module ON audit_logs(user_id, module);
CREATE INDEX idx_audit_logs_timestamp_status ON audit_logs(timestamp, status);

-- =====================================================
-- COMMENTS
-- =====================================================

ALTER TABLE users COMMENT = 'User accounts for system access';
ALTER TABLE roles COMMENT = 'User roles defining access levels';
ALTER TABLE permissions COMMENT = 'System permissions for access control';
ALTER TABLE role_permissions COMMENT = 'Many-to-many relationship between roles and permissions';
ALTER TABLE login_history COMMENT = 'Login activity tracking';
ALTER TABLE audit_logs COMMENT = 'System activity audit trail';

