-- 为 app_user 授予对所有表的基本读写权限
GRANT SELECT, INSERT, UPDATE, DELETE ON summer_practice.user_login TO 'app_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON summer_practice.user_chat TO 'app_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON summer_practice.user_logs TO 'app_user'@'localhost';

-- 为 admin_user 授予对所有表的完全权限
GRANT ALL PRIVILEGES ON summer_practice.user_login TO 'admin_user'@'localhost';
GRANT ALL PRIVILEGES ON summer_practice.user_chat TO 'admin_user'@'localhost';
GRANT ALL PRIVILEGES ON summer_practice.user_logs TO 'admin_user'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;
