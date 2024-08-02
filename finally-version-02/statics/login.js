function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (username === '' || password === '') {
        alert('用户名或密码不能为空');
        return;
    }

    fetch('http://localhost:3000/loginuser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log(data);
                localStorage.setItem('u_username', JSON.stringify(data.data.map(item => item.u_username)));
                const jump = window.confirm('登录成功，是否跳转？');
                if (jump) {
                    window.location.href = 'menu.html';
                } else {
                    console.log('success!');
                }
            } else {
                alert('用户名或密码错误');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('登录失败，请稍后再试');
        });
}
