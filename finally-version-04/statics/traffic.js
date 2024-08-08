let locations
let location_first
let location_last
let route = ""

function sendtrafficMessage() {
    locations = ""
    location_first = ""
    location_last = ""
    route = ""
    const input = document.getElementById('userinput').value;
    const resultFirst = document.getElementById('result_first');
    const resultLast = document.getElementById('result_last');
    const resultRoute = document.getElementById('result_route');
    //let locations
    document.getElementById('userinput').value = '';


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
        userText.innerText = input;
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


    //我想从南开大学津南校区去南开大学泰达校区，怎么走？
    const source = new EventSource(`http://127.0.0.1:5001/load_address?input=${encodeURIComponent(input)}`);
    let message_data_message=""
    source.addEventListener('message', function (event) {
        const data = JSON.parse(event.data);
        console.log('Received SSE message:', data);

        if (data.processed === '[DONE]') {
            source.close();
            input.value = '';
            console.log(message_data_message)
            message_data_message = message_data_message.slice(8, message_data_message.length - 4);
            console.log(message_data_message);

            locations = JSON.parse(message_data_message);
            console.log(locations);
            const url_first = `https://restapi.amap.com/v3/geocode/geo?address=${locations['出发地']}&output=JSON&key=bd19408cf2742665ca31111211794459`;

            fetch(url_first)
            .then(response => response.json())  // 处理第二个 fetch 的响应
                .then(geoData => {
                    console.log(geoData);  // 输出 AMap API 返回的数据

                    if (geoData.status === '1' && geoData.geocodes.length > 0) {
                        const location = geoData.geocodes[0].location;
                        location_first = location;
                    }
                    const url_last = `https://restapi.amap.com/v3/geocode/geo?address=${locations['目的地']}&output=JSON&key=bd19408cf2742665ca31111211794459`

                    return fetch(url_last);  // 发起第三个 fetch 请求
                })
                .then(response => response.json())  // 处理第二个 fetch 的响应
                .then(geoData => {
                    console.log(geoData);  // 输出 AMap API 返回的数据

                    if (geoData.status === '1' && geoData.geocodes.length > 0) {
                        const location = geoData.geocodes[0].location;
                        location_last = location;
                    }
                    url_getway = "";
                    if(locations['交通工具'] == "汽车"){
                        url_getway = `https://restapi.amap.com/v5/direction/driving?origin=${location_first}&destination=${location_last}&output=JSON&key=bd19408cf2742665ca31111211794459`
                    }
                    else if(locations['交通工具'] == "骑行"){
                        url_getway = `https://restapi.amap.com/v5/direction/bicycling?origin=${location_first}&destination=${location_last}&output=JSON&key=bd19408cf2742665ca31111211794459`
                    }
                    else if(locations['交通工具'] == "步行"){
                        url_getway = `https://restapi.amap.com/v5/direction/walking?origin=${location_first}&destination=${location_last}&output=JSON&key=bd19408cf2742665ca31111211794459`
                    }
                    return fetch(url_getway);  // 发起第四个 fetch 请求
                })
                .then(response => response.json())  // 处理第四个 fetch 的响应
                .then(drivingData => {

                    console.log(drivingData);  // 输出 AMap API 返回的数据
                    drivingData['route']['paths'][0]['steps'].forEach((step) => {
                        route += step.instruction + '\n'
                        // console.log(step.instruction);
                    });
                    route += ("出发地：" + locations['出发地'] + " " + "目的地：" + locations['目的地'])
                    console.log(route)

                    let answer = ""
                    const source = new EventSource(`http://127.0.0.1:5001/route_process?input=${encodeURIComponent(route)}`);
                    source.addEventListener('message', function (event) {
                        const data = JSON.parse(event.data);
                        console.log('Received SSE message:', data);


                        if (data.processed === '[DONE]') {
                            source.close();
                            console.log(answer)
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
                    // 滚动到底部
                    chatbox.scrollTop = chatbox.scrollHeight;

                    // 限制聊天框高度并保持滚动条在底部
                    chatbox.style.maxWidth = '100%';
                    chatbox.style.maxHeight = '100%'; // 设置最大高度
                    chatbox.style.overflowY = 'auto'; // 启用垂直滚动条

                })
        }
        else {
            message_data_message += data.processed;
            console.log(message_data_message)
        }
    });


    source.addEventListener('error', function (event) {
        console.error('SSE error:', event);
        if (event.readyState === EventSource.CLOSED) {
            source.close();
        }
    });
}

function handleKeyDown_traffic(event) {
    if (event.key === 'Enter') {
        sendtrafficMessage();
    }
}