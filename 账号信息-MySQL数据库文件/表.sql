-- 用户账号信息表
CREATE TABLE user_login (
    u_username VARCHAR(50) NOT NULL COMMENT '用户名',
    u_password VARCHAR(255) NOT NULL COMMENT '密码字段',
    PRIMARY KEY (u_username)
) COMMENT='用户账号信息表';

-- 用户聊天信息表
CREATE TABLE user_chat (
    u_username VARCHAR(50) NOT NULL COMMENT '用户的唯一标识符',
    u_chat VARCHAR(50) COMMENT '用户创建的聊天',
    u_mode VARCHAR(50) COMMENT '用户使用的模型',
    PRIMARY KEY (u_username),
    FOREIGN KEY (u_username) REFERENCES user_login(u_username) ON DELETE CASCADE
) COMMENT='用户聊天信息表';

-- 日志记录表
CREATE TABLE user_logs (
    log_id INT AUTO_INCREMENT NOT NULL COMMENT '日志的唯一标识符',
    u_username VARCHAR(50) NOT NULL COMMENT '用户的唯一标识符',
    l_type VARCHAR(50) NOT NULL COMMENT '日志类型',
    l_description VARCHAR(255) COMMENT '日志描述',
    l_time VARCHAR(50) NOT NULL COMMENT '日志创建时间',
    PRIMARY KEY (log_id),
    FOREIGN KEY (u_username) REFERENCES user_login(u_username)
) COMMENT='日志记录表';
