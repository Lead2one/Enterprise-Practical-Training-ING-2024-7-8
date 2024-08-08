-- 修改终止符
DELIMITER //

-- 创建一个触发器，记录对 user_login 表的 INSERT 操作
CREATE TRIGGER after_user_login_insert
AFTER INSERT ON user_login
FOR EACH ROW
BEGIN
    INSERT INTO user_logs (u_username, l_type, l_description, l_time)
    VALUES (NEW.u_username, 'INSERT', CONCAT('Inserted new user: ', NEW.u_username), NOW());
END//

-- 创建一个触发器，记录对 user_login 表的 UPDATE 操作
CREATE TRIGGER after_user_login_update
AFTER UPDATE ON user_login
FOR EACH ROW
BEGIN
    INSERT INTO user_logs (u_username, l_type, l_description, l_time)
    VALUES (NEW.u_username, 'UPDATE', CONCAT('Updated user: ', OLD.u_username, ' to ', NEW.u_username), NOW());
END//

-- 创建一个触发器，记录对 user_login 表的 DELETE 操作
CREATE TRIGGER after_user_login_delete
AFTER DELETE ON user_login
FOR EACH ROW
BEGIN
    INSERT INTO user_logs (u_username, l_type, l_description, l_time)
    VALUES (OLD.u_username, 'DELETE', CONCAT('Deleted user: ', OLD.u_username), NOW());
END//

-- 恢复默认终止符
DELIMITER ;


-- 修改终止符
DELIMITER //

-- 创建一个触发器，记录对 user_chat 表的 INSERT 操作
CREATE TRIGGER after_user_chat_insert
AFTER INSERT ON user_chat
FOR EACH ROW
BEGIN
    INSERT INTO user_logs (u_username, l_type, l_description, l_time)
    VALUES (NEW.u_username, 'INSERT', CONCAT('Inserted new chat for user: ', NEW.u_username), NOW());
END//

-- 创建一个触发器，记录对 user_chat 表的 UPDATE 操作
CREATE TRIGGER after_user_chat_update
AFTER UPDATE ON user_chat
FOR EACH ROW
BEGIN
    INSERT INTO user_logs (u_username, l_type, l_description, l_time)
    VALUES (NEW.u_username, 'UPDATE', CONCAT('Updated chat for user: ', OLD.u_username, ' to ', NEW.u_chat), NOW());
END//

-- 创建一个触发器，记录对 user_chat 表的 DELETE 操作
CREATE TRIGGER after_user_chat_delete
AFTER DELETE ON user_chat
FOR EACH ROW
BEGIN
    INSERT INTO user_logs (u_username, l_type, l_description, l_time)
    VALUES (OLD.u_username, 'DELETE', CONCAT('Deleted chat for user: ', OLD.u_username), NOW());
END//

-- 恢复默认终止符
DELIMITER ;
