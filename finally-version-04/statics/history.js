var currentIndex = -1;
var index = 0;
var username;

function history_fold() {
    const historybox = document.getElementById('historybox');
    historybox.classList.remove('show');
}

function history_show() {
    const historybox = document.getElementById('historybox');
    historybox.classList.add('show');
}

function add_history() {
    let mode;
    if (window.location.pathname.endsWith('food.html')) {
        mode = 'food';
    } else if (window.location.pathname.endsWith('medical.html')) {
        mode = 'medical';
    } else if (window.location.pathname.endsWith('traffic.html')) {
        mode = 'traffic';
    } else if (window.location.pathname.endsWith('travel.html')) {
        mode = 'travel';
    }

    fetch('http://127.0.0.1:5001/getUsername', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const username = data.username;
            fetch('http://localhost:3000/addChat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    chat: index,
                    mode: mode
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('成功创建');
                } else {
                    console.error('Failed to add chat:', data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            console.error('Failed to get username:', data.error);
        }
    })
    .catch(error => {
        console.error('Error fetching username:', error);
    });

    var $li = $(`
        <li class="historyli ${index === currentIndex ? "currentchat" : ""}" onclick="change_history(${index})">
          <span>${index}</span>
          <span>新聊天</span>
        </li>
    `);
    $(".historylist").append($li);
    change_history(index);
    index++;
}

function change_history(myindex) {
    if (currentIndex === myindex) return;
    else {
        if (currentIndex != -1) {
            document.getElementsByClassName("historyli")[currentIndex].classList.remove("currentchat");
        }
        currentIndex = myindex;
        document.getElementsByClassName("historyli")[currentIndex].classList.add("currentchat");

        // 发送 currentIndex 到后端
        fetch('http://127.0.0.1:5001/update_chat_id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: currentIndex
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('成功更新 chat_id');
                loadChatHistory();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

        // render_history(currentIndex);
    }
}

function render_history(myindex) {
    // 实现渲染历史记录的逻辑
}

$(document).ready(function() {
    function render_history_list(username) {
        console.log(username)
        if (window.location.pathname.endsWith('food.html')) {
            mode='food';
        }
        else if(window.location.pathname.endsWith('medical.html')) {
            mode='medical';
        }
        else if(window.location.pathname.endsWith('traffic.html')) {
            mode='traffic';
        }
        else if(window.location.pathname.endsWith('travel.html')) {
            mode='travel';
        }
        fetch(`http://localhost:3000/getUserChats?username=${username}&mode=${mode}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const historyList = document.querySelector('.historylist');
                    historyList.innerHTML = '';  // 清空当前的历史记录
                    if (data.chats.length === 0) {
                        index=0;
                        add_history();  // 如果没有聊天记录，则添加一个新的聊天记录
                    } else {
                        index=data.chats.length;
                        data.chats.forEach((chat, myindex) => {
                            var $li = $(`
                                <li class="historyli ${myindex === currentIndex ? "currentchat" : ""}" onclick="change_history(${myindex})">
                                  <span>${myindex}</span>
                                  <span>新聊天</span>
                                </li>
                            `);
                            $(".historylist").append($li);
                        });
                        // 默认选中第一个对话
                        currentIndex = 0;
                        document.getElementsByClassName("historyli")[currentIndex].classList.add("currentchat");
                        // 将第一个对话的ID传给后端
                        fetch('http://127.0.0.1:5001/update_chat_id', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                chat_id: currentIndex
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                console.log('成功更新 chat_id');
                                loadChatHistory();
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                    }
                } else {
                    console.error('Failed to load user chats');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // 获取 username
    fetch('http://127.0.0.1:5001/getUsername', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            username = data.username;
            render_history_list(username); // 确保在 jQuery 加载后调用
        }
    })
    .catch(error => {
        console.error('Error fetching username:', error);
    });
});


async function loadChatHistory() {

    const chatbox = document.getElementById('chatbox');
    chatbox.innerHTML = '';  // 清空当前聊天记录

    try {
        const response = await fetch('http://127.0.0.1:5001/history');
        const history = await response.json();

        history.forEach((message, index) => {

            if (message.type === 'human') {
                const userMessage = document.createElement('div');
                userMessage.classList.add('message', 'user-message');
                userMessage.style.display = 'flex';
                userMessage.style.alignItems = 'flex-start';
                userMessage.style.margin = '20px';

                // 创建用户头像
                const userAvatar = document.createElement('img');
                userAvatar.src = '../resource/image/user.svg'; // 替换为用户头像的路径
                userAvatar.style.width = '40px'; // 设置头像宽度
                userAvatar.style.height = '40px'; // 设置头像高度
                userAvatar.style.borderRadius = '50%'; // 使头像为圆形
                userAvatar.style.marginRight = '10px'; // 头像与消息之间的间隔

                // 创建消息文本
                const userText = document.createElement('div');
                userText.innerText = message.content;
                userText.style.backgroundColor = 'white';
                userText.style.borderRadius = '10px';
                userText.style.padding = '10px';
                userText.style.maxWidth = '70%';
                userText.style.overflowWrap = 'break-word';

                // 将头像和消息文本添加到用户消息容器中
                userMessage.appendChild(userAvatar);
                userMessage.appendChild(userText);
                chatbox.appendChild(userMessage);
            } else if (message.type === 'ai') {
                const botMessage = document.createElement('div');
                botMessage.classList.add('message', 'bot-message');
                botMessage.style.display = 'flex';
                botMessage.style.alignItems = 'flex-start';
                botMessage.style.margin = '20px';
                botMessage.style.justifyContent = 'flex-end';

                // 创建机器人头像
                const botAvatar = document.createElement('img');
                botAvatar.src = '../resource/image/consultant.svg'; // 替换为机器人头像的路径
                botAvatar.style.width = '40px'; // 设置头像宽度
                botAvatar.style.height = '40px'; // 设置头像高度
                botAvatar.style.borderRadius = '50%'; // 使头像为圆形
                botAvatar.style.marginLeft = '10px'; // 头像与消息之间的间隔

                // 创建消息文本容器
                const botTextContainer = document.createElement('div');
                botTextContainer.style.display = 'flex';
                botTextContainer.style.flexDirection = 'column';
                botTextContainer.style.maxWidth = '70%';
                botTextContainer.style.overflowWrap = 'break-word';

                // 创建消息文本
                const botText = document.createElement('div');
                botText.innerHTML = marked.parse(message.content);
                botText.style.backgroundColor = 'white';
                botText.style.borderRadius = '10px';
                botText.style.padding = '10px';

                // 将消息文本添加到消息文本容器中
                botTextContainer.appendChild(botText);

                // 将消息文本容器和机器人头像添加到机器人消息容器中
                botMessage.appendChild(botTextContainer);
                botMessage.appendChild(botAvatar);

                // 将机器人消息容器添加到聊天框中
                chatbox.appendChild(botMessage);
            }

        });

        // Scroll to the bottom of the chatbox
        chatbox.scrollTop = chatbox.scrollHeight;
        // 限制聊天框高度并保持滚动条在底部
        chatcontent.style.maxWidth = '100%';
        chatcontent.style.maxHeight = '85%'; // 设置最大高度
        chatcontent.style.overflowY = 'auto'; // 启用垂直滚动条

    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}



async function loadBaseHistory() {

    const chatcontent = document.getElementById('chatcontent');
    chatcontent.innerHTML = '';  // 清空当前聊天记录

    try {
        const response = await fetch('http://127.0.0.1:5001/base_history');
        const history = await response.json();

        history.forEach((message, index) => {

            if (message.type === 'human') {
                const userMessage = document.createElement('div');
                userMessage.classList.add('message', 'user-message');
                userMessage.style.display = 'flex';
                userMessage.style.alignItems = 'flex-start';
                userMessage.style.margin = '20px';

                // 创建用户头像
                const userAvatar = document.createElement('img');
                userAvatar.src = '../resource/image/user.svg'; // 替换为用户头像的路径
                userAvatar.style.width = '20px'; // 设置头像宽度
                userAvatar.style.height = '20px'; // 设置头像高度
                userAvatar.style.borderRadius = '50%'; // 使头像为圆形
                userAvatar.style.marginRight = '5px'; // 头像与消息之间的间隔

                // 创建消息文本
                const userText = document.createElement('div');
                userText.innerText = message.content;
                userText.style.backgroundColor = '#ccc';
                userText.style.borderRadius = '20px';
                userText.style.padding = '5px';
                userText.style.maxWidth = '70%';
                userText.style.overflowWrap = 'break-word';

                // 将头像和消息文本添加到用户消息容器中
                userMessage.appendChild(userAvatar);
                userMessage.appendChild(userText);
                chatcontent.appendChild(userMessage);

            } else if (message.type === 'ai') {

                const botMessage = document.createElement('div');
                botMessage.classList.add('message', 'bot-message');
                botMessage.style.display = 'flex';
                botMessage.style.alignItems = 'flex-start';
                botMessage.style.margin = '20px';
                botMessage.style.justifyContent = 'flex-end';

                // 创建机器人头像
                const botAvatar = document.createElement('img');
                botAvatar.src = '../resource/image/voice_fill.svg'; // 替换为机器人头像的路径
                botAvatar.style.width = '20px'; // 设置头像宽度
                botAvatar.style.height = '20px'; // 设置头像高度
                botAvatar.style.borderRadius = '50%'; // 使头像为圆形
                botAvatar.style.marginLeft = '5px'; // 头像与消息之间的间隔

                // 创建消息文本
                const botText = document.createElement('div');
                botText.innerText = message.content;
                botText.style.backgroundColor = '#ccc';
                botText.style.borderRadius = '20px';
                botText.style.padding = '5px';
                botText.style.maxWidth = '70%';
                botText.style.overflowWrap = 'break-word';

                // 将消息文本和机器人头像添加到机器人消息容器中
                botMessage.appendChild(botText);
                botMessage.appendChild(botAvatar);

                // 将机器人消息容器添加到聊天框中
                chatcontent.appendChild(botMessage);
            }

        });

        // Scroll to the bottom of the chatcontent
        chatcontent.scrollTop = chatcontent.scrollHeight;
        // 限制聊天框高度并保持滚动条在底部
        chatcontent.style.maxWidth = '100%';
        chatcontent.style.maxHeight = '85%'; // 设置最大高度
        chatcontent.style.overflowY = 'auto'; // 启用垂直滚动条

    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}
document.addEventListener('DOMContentLoaded', function() {
    loadBaseHistory();
});