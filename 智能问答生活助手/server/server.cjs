const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const port = 3000; // 这是固定的端口，最好不要修改

// 1. 此处修改数据库的相关配置
// 2. 根据需求 create table
const db = mysql.createConnection({
    host: 'localhost',
    user: 'myuser',
    password: 'ruzhou990925',
    database: 'summer_practice' //注意在 SCHEMAS 确认
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

app.use(cors());
app.use(bodyParser.json());

app.post('/loginuser', (req, res) => {
    const { username, password } = req.body;

    //3. 此处根据需求修改 SQL 语句
    const sql = 'select * from user_login where u_username = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            res.status(500).send({ error: 'Failed to fetch user' });
            return;
        }
        if (results.length === 0) {
            res.status(400).send({ error: 'User not found' });
            return;
        }
        const user = results[0];
        // 验证密码
        bcrypt.compare(password, user.u_password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                res.json({ success: true, data: results, username: username, password: password });
            } else {
                res.status(400).send({ error: 'Incorrect password' });
            }
        });
    });
});

app.post('/addUser', (req, res) => {
    const { username, password } = req.body;
    // 生成盐并哈希密码
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            // 存储哈希密码到数据库
            const sql = 'INSERT INTO user_login (u_username, u_password) VALUES (?, ?)';
            db.query(sql, [username, hash], (err, result) => {
                if (err) {
                    res.status(500).send({ error: 'Failed to register user' });
                    return;
                }
                res.json({ success: true, data: result, username: username, password: password });
            });
        });
    });
});

app.post('/addChat', (req, res) => {
    const { username, chat ,mode} = req.body;
    const sql = 'insert into user_chat (u_username, u_chat ,u_mode) values (?, ? ,?)';
    db.query(sql, [username, chat, mode], (err, result) => {
        if (err) {
            res.status(500).send({ error: 'Failed to save reservation' });
            return;
        }
        res.json({ success: true, data: result, username: username, chat: chat ,mode: mode});
    });
});

app.get('/getUserChats', (req, res) => {
    const username = req.query.username;
    const mode=req.query.mode;
    const sql = 'SELECT u_chat FROM user_chat WHERE u_username = ? AND u_mode = ?';
    db.query(sql, [username,mode], (err, results) => {
        if (err) {
            res.status(500).send({ error: 'Failed to fetch user chats' });
            return;
        }
        const chats = results.map(row => row.u_chat);
        res.json({ success: true, chats: chats });
    });
});




app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});