-- =====================================================
-- USER MANAGEMENT DATABASE SCHEMA - SQL SERVER
-- School Management System
-- =====================================================

USE [SchoolManagementSystem];
GO

-- =====================================================
-- 1. USERS TABLE
-- Stores user account information
-- =====================================================
CREATE TABLE [dbo].[users] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [username] NVARCHAR(50) NOT NULL UNIQUE,
    [email] NVARCHAR(100) NOT NULL UNIQUE,
    [password_hash] NVARCHAR(255) NOT NULL,
    [first_name] NVARCHAR(50) NOT NULL,
    [last_name] NVARCHAR(50) NULL,
    [phone] NVARCHAR(20) NULL,
    [role_id] INT NULL,
    [status] NVARCHAR(20) NOT NULL DEFAULT 'Active' CHECK ([status] IN ('Active', 'Inactive', 'Suspended')),
    [last_login] DATETIME2 NULL,
    [password_reset_token] NVARCHAR(255) NULL,
    [password_reset_expires] DATETIME2 NULL,
    [email_verified] BIT NOT NULL DEFAULT 0,
    [email_verification_token] NVARCHAR(255) NULL,
    [created_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [created_by] INT NULL,
    [updated_by] INT NULL,
    CONSTRAINT [FK_users_roles] FOREIGN KEY ([role_id]) REFERENCES [dbo].[roles]([id]) ON DELETE SET NULL,
    CONSTRAINT [FK_users_created_by] FOREIGN KEY ([created_by]) REFERENCES [dbo].[users]([id]) ON DELETE SET NULL,
    CONSTRAINT [FK_users_updated_by] FOREIGN KEY ([updated_by]) REFERENCES [dbo].[users]([id]) ON DELETE SET NULL
);
GO

CREATE INDEX [IX_users_username] ON [dbo].[users]([username]);
CREATE INDEX [IX_users_email] ON [dbo].[users]([email]);
CREATE INDEX [IX_users_role_id] ON [dbo].[users]([role_id]);
CREATE INDEX [IX_users_status] ON [dbo].[users]([status]);
CREATE INDEX [IX_users_role_status] ON [dbo].[users]([role_id], [status]);
GO

-- =====================================================
-- 2. ROLES TABLE
-- Stores role definitions
-- =====================================================
CREATE TABLE [dbo].[roles] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(100) NOT NULL,
    [code] NVARCHAR(50) NOT NULL UNIQUE,
    [description] NVARCHAR(MAX) NULL,
    [status] NVARCHAR(20) NOT NULL DEFAULT 'Active' CHECK ([status] IN ('Active', 'Inactive')),
    [created_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [created_by] INT NULL,
    [updated_by] INT NULL,
    CONSTRAINT [FK_roles_created_by] FOREIGN KEY ([created_by]) REFERENCES [dbo].[users]([id]) ON DELETE SET NULL,
    CONSTRAINT [FK_roles_updated_by] FOREIGN KEY ([updated_by]) REFERENCES [dbo].[users]([id]) ON DELETE SET NULL
);
GO

CREATE INDEX [IX_roles_code] ON [dbo].[roles]([code]);
CREATE INDEX [IX_roles_status] ON [dbo].[roles]([status]);
GO

-- =====================================================
-- 3. PERMISSIONS TABLE
-- Stores system permissions
-- =====================================================
CREATE TABLE [dbo].[permissions] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(100) NOT NULL,
    [code] NVARCHAR(50) NOT NULL UNIQUE,
    [module] NVARCHAR(50) NOT NULL,
    [action] NVARCHAR(50) NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [created_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [updated_at] DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

CREATE INDEX [IX_permissions_module] ON [dbo].[permissions]([module]);
CREATE INDEX [IX_permissions_action] ON [dbo].[permissions]([action]);
CREATE INDEX [IX_permissions_code] ON [dbo].[permissions]([code]);
GO

-- =====================================================
-- 4. ROLE_PERMISSIONS TABLE
-- Many-to-many relationship between roles and permissions
-- =====================================================
CREATE TABLE [dbo].[role_permissions] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [role_id] INT NOT NULL,
    [permission_id] INT NOT NULL,
    [granted] BIT NOT NULL DEFAULT 1,
    [created_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [created_by] INT NULL,
    CONSTRAINT [UQ_role_permissions] UNIQUE ([role_id], [permission_id]),
    CONSTRAINT [FK_role_permissions_roles] FOREIGN KEY ([role_id]) REFERENCES [dbo].[roles]([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_role_permissions_permissions] FOREIGN KEY ([permission_id]) REFERENCES [dbo].[permissions]([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_role_permissions_created_by] FOREIGN KEY ([created_by]) REFERENCES [dbo].[users]([id]) ON DELETE SET NULL
);
GO

CREATE INDEX [IX_role_permissions_role_id] ON [dbo].[role_permissions]([role_id]);
CREATE INDEX [IX_role_permissions_permission_id] ON [dbo].[role_permissions]([permission_id]);
GO

-- =====================================================
-- 5. USER_ROLES TABLE (Optional - for multiple roles per user)
-- Many-to-many relationship between users and roles
-- =====================================================
CREATE TABLE [dbo].[user_roles] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [role_id] INT NOT NULL,
    [assigned_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [assigned_by] INT NULL,
    [is_primary] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [UQ_user_roles] UNIQUE ([user_id], [role_id]),
    CONSTRAINT [FK_user_roles_users] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_user_roles_roles] FOREIGN KEY ([role_id]) REFERENCES [dbo].[roles]([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_user_roles_assigned_by] FOREIGN KEY ([assigned_by]) REFERENCES [dbo].[users]([id]) ON DELETE SET NULL
);
GO

CREATE INDEX [IX_user_roles_user_id] ON [dbo].[user_roles]([user_id]);
CREATE INDEX [IX_user_roles_role_id] ON [dbo].[user_roles]([role_id]);
GO

-- =====================================================
-- 6. LOGIN_HISTORY TABLE
-- Tracks user login activities
-- =====================================================
CREATE TABLE [dbo].[login_history] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [username] NVARCHAR(50) NOT NULL,
    [login_time] DATETIME2 NOT NULL,
    [logout_time] DATETIME2 NULL,
    [ip_address] NVARCHAR(45) NULL,
    [user_agent] NVARCHAR(MAX) NULL,
    [device_type] NVARCHAR(50) NULL,
    [browser] NVARCHAR(100) NULL,
    [operating_system] NVARCHAR(100) NULL,
    [location] NVARCHAR(255) NULL,
    [status] NVARCHAR(20) NOT NULL DEFAULT 'Success' CHECK ([status] IN ('Success', 'Failed')),
    [failure_reason] NVARCHAR(255) NULL,
    [session_id] NVARCHAR(255) NULL,
    [created_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [FK_login_history_users] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_login_history_user_id] ON [dbo].[login_history]([user_id]);
CREATE INDEX [IX_login_history_login_time] ON [dbo].[login_history]([login_time]);
CREATE INDEX [IX_login_history_status] ON [dbo].[login_history]([status]);
CREATE INDEX [IX_login_history_ip_address] ON [dbo].[login_history]([ip_address]);
CREATE INDEX [IX_login_history_user_status] ON [dbo].[login_history]([user_id], [status]);
GO

-- =====================================================
-- 7. AUDIT_LOGS TABLE
-- Tracks system activities and changes
-- =====================================================
CREATE TABLE [dbo].[audit_logs] (
    [id] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [username] NVARCHAR(50) NOT NULL,
    [action] NVARCHAR(50) NOT NULL,
    [module] NVARCHAR(50) NOT NULL,
    [entity_type] NVARCHAR(50) NULL,
    [entity_id] INT NULL,
    [description] NVARCHAR(MAX) NULL,
    [old_values] NVARCHAR(MAX) NULL, -- JSON stored as NVARCHAR(MAX)
    [new_values] NVARCHAR(MAX) NULL, -- JSON stored as NVARCHAR(MAX)
    [ip_address] NVARCHAR(45) NULL,
    [user_agent] NVARCHAR(MAX) NULL,
    [timestamp] DATETIME2 NOT NULL,
    [status] NVARCHAR(20) NOT NULL DEFAULT 'Success' CHECK ([status] IN ('Success', 'Failed', 'Warning')),
    [error_message] NVARCHAR(MAX) NULL,
    [created_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [FK_audit_logs_users] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_audit_logs_user_id] ON [dbo].[audit_logs]([user_id]);
CREATE INDEX [IX_audit_logs_action] ON [dbo].[audit_logs]([action]);
CREATE INDEX [IX_audit_logs_module] ON [dbo].[audit_logs]([module]);
CREATE INDEX [IX_audit_logs_timestamp] ON [dbo].[audit_logs]([timestamp]);
CREATE INDEX [IX_audit_logs_entity] ON [dbo].[audit_logs]([entity_type], [entity_id]);
CREATE INDEX [IX_audit_logs_status] ON [dbo].[audit_logs]([status]);
CREATE INDEX [IX_audit_logs_user_module] ON [dbo].[audit_logs]([user_id], [module]);
CREATE INDEX [IX_audit_logs_timestamp_status] ON [dbo].[audit_logs]([timestamp], [status]);
GO

-- =====================================================
-- 8. PASSWORD_HISTORY TABLE
-- Stores password history for security (prevent reuse)
-- =====================================================
CREATE TABLE [dbo].[password_history] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [password_hash] NVARCHAR(255) NOT NULL,
    [changed_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [changed_by] INT NULL,
    CONSTRAINT [FK_password_history_users] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE,
    CONSTRAINT [FK_password_history_changed_by] FOREIGN KEY ([changed_by]) REFERENCES [dbo].[users]([id]) ON DELETE SET NULL
);
GO

CREATE INDEX [IX_password_history_user_id] ON [dbo].[password_history]([user_id]);
CREATE INDEX [IX_password_history_changed_at] ON [dbo].[password_history]([changed_at]);
GO

-- =====================================================
-- 9. USER_SESSIONS TABLE
-- Tracks active user sessions
-- =====================================================
CREATE TABLE [dbo].[user_sessions] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [user_id] INT NOT NULL,
    [session_token] NVARCHAR(255) NOT NULL UNIQUE,
    [ip_address] NVARCHAR(45) NULL,
    [user_agent] NVARCHAR(MAX) NULL,
    [login_time] DATETIME2 NOT NULL,
    [last_activity] DATETIME2 NOT NULL,
    [expires_at] DATETIME2 NOT NULL,
    [is_active] BIT NOT NULL DEFAULT 1,
    [created_at] DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT [FK_user_sessions_users] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE
);
GO

CREATE INDEX [IX_user_sessions_user_id] ON [dbo].[user_sessions]([user_id]);
CREATE INDEX [IX_user_sessions_session_token] ON [dbo].[user_sessions]([session_token]);
CREATE INDEX [IX_user_sessions_expires_at] ON [dbo].[user_sessions]([expires_at]);
CREATE INDEX [IX_user_sessions_is_active] ON [dbo].[user_sessions]([is_active]);
GO

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert default permissions
INSERT INTO [dbo].[permissions] ([name], [code], [module], [action], [description]) VALUES
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
GO

-- Insert default roles
INSERT INTO [dbo].[roles] ([name], [code], [description], [status]) VALUES
('Administrator', 'ADMIN', 'Full system access with all permissions', 'Active'),
('Teacher', 'TEACHER', 'Teacher access with limited permissions', 'Active'),
('Accountant', 'ACCOUNTANT', 'Financial access for fee management', 'Active'),
('Staff', 'STAFF', 'General staff access', 'Active'),
('Parent', 'PARENT', 'Parent access to view student information', 'Active');
GO

-- Assign permissions to Administrator role (all permissions)
INSERT INTO [dbo].[role_permissions] ([role_id], [permission_id])
SELECT 1, [id] FROM [dbo].[permissions];
GO

-- Assign permissions to Teacher role
INSERT INTO [dbo].[role_permissions] ([role_id], [permission_id])
SELECT 2, [id] FROM [dbo].[permissions] WHERE [module] = 'Students' OR [module] = 'Reports';
GO

-- Assign permissions to Accountant role
INSERT INTO [dbo].[role_permissions] ([role_id], [permission_id])
SELECT 3, [id] FROM [dbo].[permissions] WHERE [module] = 'Fees' OR [module] = 'Reports';
GO

-- Create default admin user (password should be hashed in production)
-- Default password: admin123 (should be changed on first login)
-- Using BCrypt hash: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO [dbo].[users] ([username], [email], [password_hash], [first_name], [last_name], [role_id], [status], [email_verified])
VALUES ('admin', 'admin@school.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 1, 'Active', 1);
GO

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: User with Role Information
CREATE VIEW [dbo].[vw_users_with_roles]
AS
SELECT 
    u.[id],
    u.[username],
    u.[email],
    u.[first_name],
    u.[last_name],
    u.[phone],
    u.[status],
    u.[last_login],
    u.[created_at],
    r.[id] AS [role_id],
    r.[name] AS [role_name],
    r.[code] AS [role_code]
FROM [dbo].[users] u
LEFT JOIN [dbo].[roles] r ON u.[role_id] = r.[id];
GO

-- View: Role with Permission Count
CREATE VIEW [dbo].[vw_roles_with_permissions]
AS
SELECT 
    r.[id],
    r.[name],
    r.[code],
    r.[description],
    r.[status],
    COUNT(rp.[permission_id]) AS [permission_count],
    r.[created_at]
FROM [dbo].[roles] r
LEFT JOIN [dbo].[role_permissions] rp ON r.[id] = rp.[role_id] AND rp.[granted] = 1
GROUP BY r.[id], r.[name], r.[code], r.[description], r.[status], r.[created_at];
GO

-- View: User Login Statistics
CREATE VIEW [dbo].[vw_user_login_stats]
AS
SELECT 
    u.[id] AS [user_id],
    u.[username],
    COUNT(lh.[id]) AS [total_logins],
    SUM(CASE WHEN lh.[status] = 'Success' THEN 1 ELSE 0 END) AS [successful_logins],
    SUM(CASE WHEN lh.[status] = 'Failed' THEN 1 ELSE 0 END) AS [failed_logins],
    MAX(lh.[login_time]) AS [last_login_time]
FROM [dbo].[users] u
LEFT JOIN [dbo].[login_history] lh ON u.[id] = lh.[user_id]
GROUP BY u.[id], u.[username];
GO

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

-- Procedure: Get User Permissions
CREATE PROCEDURE [dbo].[sp_get_user_permissions]
    @p_user_id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT DISTINCT p.*
    FROM [dbo].[permissions] p
    INNER JOIN [dbo].[role_permissions] rp ON p.[id] = rp.[permission_id]
    INNER JOIN [dbo].[users] u ON u.[role_id] = rp.[role_id]
    WHERE u.[id] = @p_user_id 
    AND rp.[granted] = 1 
    AND u.[status] = 'Active';
END;
GO

-- Procedure: Check User Permission
CREATE PROCEDURE [dbo].[sp_check_user_permission]
    @p_user_id INT,
    @p_permission_code NVARCHAR(50),
    @p_has_permission BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @v_count INT;
    
    SELECT @v_count = COUNT(*)
    FROM [dbo].[permissions] p
    INNER JOIN [dbo].[role_permissions] rp ON p.[id] = rp.[permission_id]
    INNER JOIN [dbo].[users] u ON u.[role_id] = rp.[role_id]
    WHERE u.[id] = @p_user_id 
    AND p.[code] = @p_permission_code 
    AND rp.[granted] = 1 
    AND u.[status] = 'Active';
    
    SET @p_has_permission = CASE WHEN @v_count > 0 THEN 1 ELSE 0 END;
END;
GO

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Update last_login on successful login
CREATE TRIGGER [trg_update_last_login]
ON [dbo].[login_history]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE u
    SET u.[last_login] = i.[login_time]
    FROM [dbo].[users] u
    INNER JOIN inserted i ON u.[id] = i.[user_id]
    WHERE i.[status] = 'Success';
END;
GO

-- Trigger: Log user creation in audit_logs
CREATE TRIGGER [trg_audit_user_create]
ON [dbo].[users]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO [dbo].[audit_logs] ([user_id], [username], [action], [module], [entity_type], [entity_id], [description], [timestamp])
    SELECT 
        i.[created_by],
        (SELECT [username] FROM [dbo].[users] WHERE [id] = i.[created_by]),
        'Create',
        'Users',
        'User',
        i.[id],
        'User created: ' + i.[username],
        GETDATE()
    FROM inserted i;
END;
GO

-- Trigger: Log user update in audit_logs
CREATE TRIGGER [trg_audit_user_update]
ON [dbo].[users]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO [dbo].[audit_logs] ([user_id], [username], [action], [module], [entity_type], [entity_id], [description], [timestamp], [old_values], [new_values])
    SELECT 
        i.[updated_by],
        (SELECT [username] FROM [dbo].[users] WHERE [id] = i.[updated_by]),
        'Update',
        'Users',
        'User',
        i.[id],
        'User updated: ' + i.[username],
        GETDATE(),
        (SELECT [username], [email], [status], [role_id] FROM deleted d WHERE d.[id] = i.[id] FOR JSON PATH),
        (SELECT [username], [email], [status], [role_id] FROM inserted i2 WHERE i2.[id] = i.[id] FOR JSON PATH)
    FROM inserted i
    INNER JOIN deleted d ON i.[id] = d.[id]
    WHERE i.[username] != d.[username] 
    OR i.[email] != d.[email] 
    OR i.[status] != d.[status] 
    OR ISNULL(i.[role_id], 0) != ISNULL(d.[role_id], 0);
END;
GO

-- Trigger: Log user deletion in audit_logs
CREATE TRIGGER [trg_audit_user_delete]
ON [dbo].[users]
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO [dbo].[audit_logs] ([user_id], [username], [action], [module], [entity_type], [entity_id], [description], [timestamp])
    SELECT 
        d.[id],
        d.[username],
        'Delete',
        'Users',
        'User',
        d.[id],
        'User deleted: ' + d.[username],
        GETDATE()
    FROM deleted d;
END;
GO

-- =====================================================
-- COMMENTS (Extended Properties)
-- =====================================================

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'User accounts for system access', 
    @level0type = N'SCHEMA', @level0name = N'dbo', 
    @level1type = N'TABLE', @level1name = N'users';
GO

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'User roles defining access levels', 
    @level0type = N'SCHEMA', @level0name = N'dbo', 
    @level1type = N'TABLE', @level1name = N'roles';
GO

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'System permissions for access control', 
    @level0type = N'SCHEMA', @level0name = N'dbo', 
    @level1type = N'TABLE', @level1name = N'permissions';
GO

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Many-to-many relationship between roles and permissions', 
    @level0type = N'SCHEMA', @level0name = N'dbo', 
    @level1type = N'TABLE', @level1name = N'role_permissions';
GO

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Login activity tracking', 
    @level0type = N'SCHEMA', @level0name = N'dbo', 
    @level1type = N'TABLE', @level1name = N'login_history';
GO

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'System activity audit trail', 
    @level0type = N'SCHEMA', @level0name = N'dbo', 
    @level1type = N'TABLE', @level1name = N'audit_logs';
GO

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function: Check if user has permission
CREATE FUNCTION [dbo].[fn_user_has_permission]
(
    @user_id INT,
    @permission_code NVARCHAR(50)
)
RETURNS BIT
AS
BEGIN
    DECLARE @has_permission BIT = 0;
    DECLARE @count INT;
    
    SELECT @count = COUNT(*)
    FROM [dbo].[permissions] p
    INNER JOIN [dbo].[role_permissions] rp ON p.[id] = rp.[permission_id]
    INNER JOIN [dbo].[users] u ON u.[role_id] = rp.[role_id]
    WHERE u.[id] = @user_id 
    AND p.[code] = @permission_code 
    AND rp.[granted] = 1 
    AND u.[status] = 'Active';
    
    IF @count > 0
        SET @has_permission = 1;
    
    RETURN @has_permission;
END;
GO

-- =====================================================
-- MAINTENANCE SCRIPTS
-- =====================================================

-- Procedure: Cleanup expired sessions
CREATE PROCEDURE [dbo].[sp_cleanup_expired_sessions]
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM [dbo].[user_sessions]
    WHERE [expires_at] < GETDATE() OR [is_active] = 0;
    
    SELECT @@ROWCOUNT AS [deleted_sessions];
END;
GO

-- Procedure: Archive old login history (older than specified days)
CREATE PROCEDURE [dbo].[sp_archive_login_history]
    @days_to_keep INT = 365
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Create archive table if it doesn't exist
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'login_history_archive')
    BEGIN
        SELECT * INTO [dbo].[login_history_archive]
        FROM [dbo].[login_history]
        WHERE 1 = 0; -- Create structure only
    END
    
    -- Move old records to archive
    INSERT INTO [dbo].[login_history_archive]
    SELECT * FROM [dbo].[login_history]
    WHERE [login_time] < DATEADD(DAY, -@days_to_keep, GETDATE());
    
    -- Delete archived records
    DELETE FROM [dbo].[login_history]
    WHERE [login_time] < DATEADD(DAY, -@days_to_keep, GETDATE());
    
    SELECT @@ROWCOUNT AS [archived_records];
END;
GO

-- Procedure: Archive old audit logs (older than specified days)
CREATE PROCEDURE [dbo].[sp_archive_audit_logs]
    @days_to_keep INT = 730
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Create archive table if it doesn't exist
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'audit_logs_archive')
    BEGIN
        SELECT * INTO [dbo].[audit_logs_archive]
        FROM [dbo].[audit_logs]
        WHERE 1 = 0; -- Create structure only
    END
    
    -- Move old records to archive
    INSERT INTO [dbo].[audit_logs_archive]
    SELECT * FROM [dbo].[audit_logs]
    WHERE [timestamp] < DATEADD(DAY, -@days_to_keep, GETDATE());
    
    -- Delete archived records
    DELETE FROM [dbo].[audit_logs]
    WHERE [timestamp] < DATEADD(DAY, -@days_to_keep, GETDATE());
    
    SELECT @@ROWCOUNT AS [archived_records];
END;
GO

