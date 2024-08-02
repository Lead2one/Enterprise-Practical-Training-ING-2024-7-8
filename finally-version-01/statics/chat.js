let model_choice = 0;

document.addEventListener("DOMContentLoaded", function () {
    const chatbox = document.getElementById('chatbox');
    const chatcontent = document.getElementById('chatcontent');
    chatbox.style.overflowY = 'auto'; // 启用垂直滚动条
    chatcontent.style.overflowY = 'auto'; // 启用垂直滚动条
})


function sendMessage() {
    const input = document.getElementById('userinput');
    const message = input.value;
    if (message) {
        const chatbox = document.getElementById('chatbox');
        // 创建用户消息
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
        userText.innerText = message;
        userText.style.backgroundColor = '#ccc';
        userText.style.borderRadius = '10px';
        userText.style.padding = '10px';
        userText.style.maxWidth = '70%';
        userText.style.overflowWrap = 'break-word';
        userText.style.backgroundColor = 'white';
        // 将头像和消息文本添加到用户消息容器中
        userMessage.appendChild(userAvatar);
        userMessage.appendChild(userText);
        chatbox.appendChild(userMessage);

        // 模拟大语言模型响应
        // 创建机器人消息
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

        // 创建消息文本
        const botText = document.createElement('div');
        // botText.innerText = 'This is a response from the language model.';
        botText.style.backgroundColor = '#ccc';
        botText.style.borderRadius = '10px';
        botText.style.padding = '10px';
        botText.style.maxWidth = '70%';
        botText.style.overflowWrap = 'break-word';
        botText.style.backgroundColor = 'white';

        // 将头像和消息文本添加到机器人消息容器中
        botMessage.appendChild(botText);
        botMessage.appendChild(botAvatar);
        chatbox.appendChild(botMessage);

        // 清空输入框
        input.value = '';

        const source = new EventSource(`http://127.0.0.1:5001/stream?input=${encodeURIComponent(message)}&model_choice=${encodeURIComponent(model_choice)}`);
        let jsonResponse = "";
        let processingMessage;
        let answer = "";

        source.addEventListener('message', function (event) {
            const data = JSON.parse(event.data);
            console.log('Received SSE message:', data);

            if (data.processed === '[DONE]') {
                source.close();
                input.value = '';

                if (model_choice == 2) {
                    try {
                        jsonResponse = jsonResponse.slice(8, jsonResponse.length - 4);
                        console.log(jsonResponse);
                        const locations = JSON.parse(jsonResponse);
                        chatbox.removeChild(processingMessage);

                        locations.forEach(async (location) => {
                            await fetchAndRenderMap(location);
                        });
                    } catch (e) {
                        console.error('Error parsing JSON response:', e);
                    }
                }
            } else if (model_choice == 2) {
                jsonResponse += data.processed;

                if (!processingMessage) {
                    processingMessage = document.createElement('div');
                    processingMessage.classList.add('message', 'bot-message');
                    processingMessage.innerText = '正在为您查找，获取实时地图需要一些时间请耐心等待...预计等待时间不会超过一分钟...';
                    chatbox.appendChild(processingMessage);
                    processingMessage.scrollIntoView({ behavior: 'smooth', block: "end" });
                }
            } else {
                answer += data.processed;
                botText.innerHTML = marked.parse(answer);
                botMessage.scrollIntoView({ behavior: 'smooth', block: "end" });
            }
        });

        source.addEventListener('error', function (event) {
            console.error('SSE error:', event);
            if (event.readyState === EventSource.CLOSED) {
                source.close();
            }
        });

        // 滚动到底部
        chatbox.scrollTop = chatbox.scrollHeight;

        // 限制聊天框高度并保持滚动条在底部
        chatbox.style.maxWidth = '100%';
        chatbox.style.maxHeight = '100%'; // 设置最大高度
        chatbox.style.overflowY = 'auto'; // 启用垂直滚动条
    }
}

function handleKeyDown(event) {
    if (event.keyCode === 13) { 
        sendMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatinput');
    const message = input.value;
    if (message) {
        const chatcontent = document.getElementById('chatcontent');
        // 创建用户消息
        const userMessage = document.createElement('div');
        userMessage.classList.add('message', 'user-message');
        userMessage.style.display = 'flex';
        userMessage.style.alignItems = 'flex-start';
        userMessage.style.margin = '20px';

        // 创建用户头像
        const userAvatar = document.createElement('img');
        userAvatar.src = ''; // 替换为用户头像的路径
        userAvatar.style.width = '20px'; // 设置头像宽度
        userAvatar.style.height = '20px'; // 设置头像高度
        userAvatar.style.borderRadius = '50%'; // 使头像为圆形
        userAvatar.style.marginRight = '5px'; // 头像与消息之间的间隔

        // 创建消息文本
        const userText = document.createElement('div');
        userText.innerText = message;
        userText.style.backgroundColor = '#ccc';
        userText.style.borderRadius = '20px';
        userText.style.padding = '5px';
        userText.style.maxWidth = '70%';
        userText.style.overflowWrap = 'break-word';

        // 将头像和消息文本添加到用户消息容器中
        userMessage.appendChild(userAvatar);
        userMessage.appendChild(userText);
        chatcontent.appendChild(userMessage);

        // 模拟大语言模型响应
        // 创建机器人消息
        const botMessage = document.createElement('div');
        botMessage.classList.add('message', 'bot-message');
        botMessage.style.display = 'flex';
        botMessage.style.alignItems = 'flex-start';
        botMessage.style.margin = '10px';
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
        botText.style.backgroundColor = '#ccc';
        botText.style.borderRadius = '20px';
        botText.style.padding = '5px';
        botText.style.maxWidth = '70%';
        botText.style.overflowWrap = 'break-word';

        const source = new EventSource(`http://127.0.0.1:5001/stream1?input=${encodeURIComponent(message)}`);
        let answer = "";

        source.addEventListener('message', function (event) {
            const data = JSON.parse(event.data);
            console.log('Received SSE message:', data);

            if (data.processed === '[DONE]') {
                source.close();
                input.value = '';
                assistant_result = answer
                if(IsAudio){
                    text_read_assistant()
                }
            }
             else {
                answer += data.processed;
                botText.innerHTML = marked.parse(answer);
                botMessage.scrollIntoView({ behavior: 'smooth', block: "end" });
            }
        });

        source.addEventListener('error', function (event) {
            console.error('SSE error:', event);
            if (event.readyState === EventSource.CLOSED) {
                source.close();
            }
        });

        // 将头像和消息文本添加到机器人消息容器中
        botMessage.appendChild(botText);
        botMessage.appendChild(botAvatar);
        chatcontent.appendChild(botMessage);

        // 清空输入框
        input.value = '';

        // 滚动到底部
        chatcontent.scrollTop = chatcontent.scrollHeight;

        // 限制聊天框高度并保持滚动条在底部
        chatcontent.style.maxWidth = '100%';
        chatcontent.style.maxHeight = '85%'; // 设置最大高度
        chatcontent.style.overflowY = 'auto'; // 启用垂直滚动条
    }
}

function handleChatKeyDown(event) {
    if (event.keyCode === 13) {
        sendChatMessage();
    }
}

var assistant_result = ''

// 2.9 阅读机器回答文本
function text_read_assistant() {
    const params = {
        text: assistant_result
    }

    fetch('http://127.0.0.1:5000/text_read', {  // 确保端口为5000
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message)
        })
        .catch(error => {
            console.error('Error:', error);
        })
}

/*-----------------------------------------------------------------*/

async function fetchAndRenderMap(location) {
    const marker = `mid,,A:${location['经度']},${location['纬度']}`;
    const url = `https://restapi.amap.com/v3/staticmap?location=${location['经度']},${location['纬度']}&zoom=13&size=200*200&scale=2&markers=${marker}&key=205e64db6b5961d51c7a6526fd00687e&traffic=1`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        const nameElement = document.createElement('div');
        nameElement.innerHTML = marked.parse(`## ${location['餐馆名称']}`);


        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Map Image';
        img.style.maxWidth = '100%';


        const botMessage = document.createElement('div');
        botMessage.classList.add('message', 'bot-message');
        botMessage.style.display = 'flex';
        botMessage.style.alignItems = 'flex-start';
        botMessage.style.margin = '20px';
        botMessage.style.justifyContent = 'flex-end';
        botMessage.style.backgroundColor = '#ccc';

        botMessage.appendChild(nameElement);
        botMessage.appendChild(img);


        const chatbox = document.getElementById('chatbox');
        chatbox.appendChild(botMessage);
        botMessage.scrollIntoView({ behavior: 'smooth', block: "end" });
    } catch (error) {
        console.error('Error fetching and rendering image:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const chatbox = document.getElementById('chatbox');
    // Function to render chat history
    async function loadChatHistory() {

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
                    userAvatar.style.width = '20px'; // 设置头像宽度
                    userAvatar.style.height = '20px'; // 设置头像高度
                    userAvatar.style.borderRadius = '50%'; // 使头像为圆形
                    userAvatar.style.marginRight = '5px'; // 头像与消息之间的间隔

                    // 创建消息文本
                    const userText = document.createElement('div');
                    userText.innerText = message;
                    userText.style.backgroundColor = '#ccc';
                    userText.style.borderRadius = '20px';
                    userText.style.padding = '5px';
                    userText.style.maxWidth = '70%';
                    userText.style.overflowWrap = 'break-word';
                    userText.style.backgroundColor = 'white';

                    // 将头像和消息文本添加到用户消息容器中
                    userMessage.appendChild(userAvatar);
                    userMessage.appendChild(userText);
                    chatbox.appendChild(userMessage);
                    userText.innerText = message.content;

                } else if (message.type === 'ai') {
                    const botMessage = document.createElement('div');
                    botMessage.classList.add('message', 'bot-message');
                    botMessage.style.display = 'flex';
                    botMessage.style.alignItems = 'flex-start';
                    botMessage.style.margin = '10px';
                    botMessage.style.justifyContent = 'flex-end';

                    // 创建机器人头像
                    const botAvatar = document.createElement('img');
                    botAvatar.src = '../resource/image/consultant.svg'; // 替换为机器人头像的路径
                    botAvatar.style.width = '20px'; // 设置头像宽度
                    botAvatar.style.height = '20px'; // 设置头像高度
                    botAvatar.style.borderRadius = '50%'; // 使头像为圆形
                    botAvatar.style.marginLeft = '5px'; // 头像与消息之间的间隔

                    // 创建消息文本
                    const botText = document.createElement('div');
                    botText.style.backgroundColor = '#ccc';
                    botText.style.borderRadius = '20px';
                    botText.style.padding = '5px';
                    botText.style.maxWidth = '70%';
                    botText.style.overflowWrap = 'break-word';
                    botText.style.backgroundColor = 'white';

                    // 将头像和消息文本添加到机器人消息容器中
                    botMessage.appendChild(botText);
                    chatbox.appendChild(botMessage);
                    botText.innerHTML = marked.parse(message.content);
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

    loadChatHistory();
});