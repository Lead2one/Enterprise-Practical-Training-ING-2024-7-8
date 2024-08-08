function login(){
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    if (username === '' || password === '') {
        alert('用户名或密码不能为空');
        return;
    }
    fetch('http://localhost:3000/loginuser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('u_username', data.data.map(item => item.u_username));
            const jump = window.confirm('登录成功，是否跳转？');
            if (jump) {
                // 发送用户 ID 到 http://127.0.0.1:5001
                fetch('http://127.0.0.1:5001/set_user_id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user_id: username })  // 假设 data.data 包含用户 ID
                })
                .then(() => {
                    window.location.href = 'menu.html';
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('登录失败，请检查服务器连接');
                });
            } else {
                console.log('success!');
            }
        } else {
            alert('用户名或密码错误');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('登录失败，请检查服务器连接');
    });
}