# MSSQL Schema Migration Notes

## Key Differences from MySQL Version

### 1. Data Types
- **AUTO_INCREMENT** → **IDENTITY(1,1)**
- **VARCHAR** → **NVARCHAR** (for Unicode support)
- **TEXT** → **NVARCHAR(MAX)**
- **BOOLEAN** → **BIT**
- **TIMESTAMP** → **DATETIME2**
- **ENUM** → **NVARCHAR with CHECK constraint**

### 2. Table Creation
- **MySQL:** `ENGINE=InnoDB DEFAULT CHARSET=utf8mb4` → **MSSQL:** Removed (not needed)
- **MySQL:** Table-level indexes → **MSSQL:** Separate CREATE INDEX statements
- **MySQL:** Inline UNIQUE → **MSSQL:** Separate CONSTRAINT or UNIQUE constraint

### 3. Constraints
- **ENUM** replaced with **CHECK constraints**: `CHECK ([status] IN ('Active', 'Inactive'))`
- **UNIQUE KEY** → **UNIQUE CONSTRAINT** or **UNIQUE** in column definition
- Foreign keys use **CONSTRAINT** keyword with names

### 4. Default Values
- **MySQL:** `DEFAULT CURRENT_TIMESTAMP` → **MSSQL:** `DEFAULT GETDATE()`
- **MySQL:** `ON UPDATE CURRENT_TIMESTAMP` → **MSSQL:** Handled via triggers or application logic

### 5. JSON Support
- **MySQL:** Native JSON type → **MSSQL:** `NVARCHAR(MAX)` with JSON functions
- MSSQL 2016+ supports JSON functions: `FOR JSON PATH`, `JSON_VALUE()`, etc.

### 6. Stored Procedures
- **MySQL:** `DELIMITER //` → **MSSQL:** Not needed, use `GO`
- **MySQL:** `IN`, `OUT` parameters → **MSSQL:** `@parameter_name` with `OUTPUT` keyword
- **MySQL:** `SET` for variables → **MSSQL:** `DECLARE` and `SET`

### 7. Triggers
- **MySQL:** `BEFORE` triggers → **MSSQL:** `INSTEAD OF` or `AFTER` only
- **MySQL:** `OLD`, `NEW` → **MSSQL:** `deleted`, `inserted` tables
- **MySQL:** `FOR EACH ROW` → **MSSQL:** Set-based operations

### 8. Views
- **MySQL:** `CREATE OR REPLACE VIEW` → **MSSQL:** `CREATE VIEW` (drop first if exists)
- Syntax differences in view definitions

### 9. Indexes
- **MySQL:** Inline indexes → **MSSQL:** Separate CREATE INDEX statements
- **MySQL:** `INDEX idx_name (column)` → **MSSQL:** `CREATE INDEX [IX_name] ON [table]([column])`

### 10. Comments
- **MySQL:** `COMMENT = 'text'` → **MSSQL:** Extended Properties using `sp_addextendedproperty`

## Important Notes

1. **Database Name**: Update `USE [SchoolManagementSystem];` with your actual database name
2. **Schema**: All objects are created in `[dbo]` schema (default)
3. **Unicode**: Using `NVARCHAR` for full Unicode support
4. **JSON**: JSON stored as `NVARCHAR(MAX)` - use `FOR JSON PATH` for queries
5. **Identity**: Primary keys use `IDENTITY(1,1)` for auto-increment
6. **Timestamps**: Using `DATETIME2` for better precision and range
7. **Boolean**: Using `BIT` (0 = false, 1 = true)

## Execution Order

1. Create tables in dependency order:
   - `roles` (no dependencies)
   - `permissions` (no dependencies)
   - `users` (depends on `roles`)
   - `role_permissions` (depends on `roles` and `permissions`)
   - `user_roles` (depends on `users` and `roles`)
   - `login_history` (depends on `users`)
   - `audit_logs` (depends on `users`)
   - `password_history` (depends on `users`)
   - `user_sessions` (depends on `users`)

2. Create indexes after tables

3. Insert default data

4. Create views

5. Create stored procedures

6. Create triggers

7. Add extended properties (comments)

## Testing the Schema

```sql
-- Test user creation
INSERT INTO [dbo].[users] ([username], [email], [password_hash], [first_name], [last_name], [role_id], [status])
VALUES ('testuser', 'test@school.com', 'hashed_password', 'Test', 'User', 1, 'Active');

-- Test permission check
DECLARE @has_permission BIT;
EXEC [dbo].[sp_check_user_permission] @p_user_id = 1, @p_permission_code = 'VIEW_STUDENTS', @p_has_permission = @has_permission OUTPUT;
SELECT @has_permission;

-- Test login history trigger
INSERT INTO [dbo].[login_history] ([user_id], [username], [login_time], [status])
VALUES (1, 'testuser', GETDATE(), 'Success');

-- Verify last_login was updated
SELECT [last_login] FROM [dbo].[users] WHERE [id] = 1;
```

## Maintenance

Run these procedures regularly:
- `sp_cleanup_expired_sessions` - Daily
- `sp_archive_login_history` - Monthly (keeps 1 year)
- `sp_archive_audit_logs` - Quarterly (keeps 2 years)

## Performance Considerations

1. **Partitioning**: Consider partitioning `login_history` and `audit_logs` by date for large datasets
2. **Index Maintenance**: Rebuild indexes regularly: `ALTER INDEX ALL ON [table] REBUILD;`
3. **Statistics**: Update statistics: `UPDATE STATISTICS [table];`
4. **Compression**: Consider page compression for large tables

## Security Best Practices

1. Use parameterized queries to prevent SQL injection
2. Encrypt sensitive columns (password_hash, tokens) at rest
3. Implement row-level security if needed
4. Use SQL Server authentication or Windows Authentication appropriately
5. Enable SQL Server audit for compliance

