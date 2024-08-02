const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');
const port = 3000; // 这是固定的端口，最好不要修改

// 1. 此处修改数据库的相关配置
// 2. 根据需求 create table
const db = mysql.createConnection({
    host: 'localhost',
    user: 'myTestuser', // 数据库用户名
    password: 'asd123456', // 数据库密码
    database: 'dbsclabtest2024' // 数据库名
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
    const sql = 'select * from user_login where u_username = ? and u_password = ?';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            res.status(500).send({ error: 'Failed to save reservation' });
            return;
        }
        else if (result.length > 0) { // 修正拼写错误
            res.json({ success: true, data: result, username: username, password: password });

        }
        else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    });
});

app.post('/addUser', (req, res) => {
    const { username, password } = req.body;

    //3. 此处根据需求修改 SQL 语句
    const sql = 'insert into user_login (u_username, u_password) values (?, ?)';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            res.status(500).send({ error: 'Failed to save reservation' });
            return;
        }
        res.json({ success: true, data: result, username: username, password: password });
    });
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});