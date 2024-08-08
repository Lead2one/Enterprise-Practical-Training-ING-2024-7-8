function register(){
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    if (username == '' || password == '') {
        alert('用户名或密码不能为空')
        return
    }
    if (password.length < 6) {
        alert('密码长度不能小于6位')
        return
    }
    fetch('http://localhost:3000/addUser', {
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
            const jump = window.confirm('注册成功，是否跳转到登录界面？');
            if (jump) {
                window.location.href = 'login.html';
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