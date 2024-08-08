document.addEventListener("DOMContentLoaded", function() {
// 1. 创建变量

// 1.1 区域
// 整个小人区域
const board = document.getElementById('assistant_board')
// 小人视频播放
const video = document.getElementById('videoPlayer')
// 用户对话框
const text_user = document.getElementById('userinput')
// 小人说话框
const assistant_text_box = document.getElementById('chat')
// 语音助手对话框
const conservation_box = document.getElementById('chatinput')

//1.2 按钮
// 切换人物按钮
const button_next = document.getElementById('skin')
// 是否播放音频按钮
const button_audio = document.getElementById('mute')
// 语音助手重命名按钮
const button_rename = document.getElementById('rename')
// 语音识别播放按钮
const button_recognition_main = document.getElementById('toggleimage')
const button_recognition_assistant = document.getElementById('voice')
// 音色改变按钮
const button_tone = document.getElementById('tone')

const button_photo = document.getElementById('photo')

// 1.3 毛毛所创建的变量
const videoPlayer = document.getElementById('videoPlayer')
const containerButton = document.getElementById('containerButton')
const dialog = document.getElementById('dialog')
const historychat = document.getElementById('history')
const img = document.getElementById('assistant_board')
const oimg=document.querySelectorAll('.oimg')
const videobox = document.getElementById('videobox')
const chat = document.getElementById('chat')
const chatcbtn = document.getElementById('chatcbtn');

// 1.4 各类辅助变量
// 人物
var character = [
    '../resource/Skadi the Corrupting Heart',
    '../resource/Specter the Unchained',
    '../resource/Virtuosa'
]
// 休闲状态
var state = [
    '/relax (1).webm',
    '/relax (2).webm',
    '/relax (3).webm'
]
// 点击状态
var interact = [
    '/interact (1).webm',
    '/interact (2).webm',
    '/interact (3).webm'
]
// 点击音频
var audio = [
    '/voice (1).wav',
    '/voice (2).wav',
    '/voice (3).wav'
]

// 点击文本
var text = [
    '请和我说说话。',
    '需要问我什么？',
    '我会尽己所能帮助你。'
]

// 用户可以选择是否播放音频
var IsAudio = true


// 各状态下标
var cur_character = 0
var cur_state = 0
var cur_interact = 0
var cur_audio = 0
var cur_text = 0
var music =new Audio(character[cur_character] + audio[cur_audio])

// 语音识别相关变量
var audio_state_main = false
var audio_state_assistant = false
var result_main = '主对话框语音识别结果'
var result_assistant = '小人对话框'
// 语音识别结果类型
// true表示主对话框，false表示语音助手聊天对话框
var type_text = true
// true表示当前正在监听，false表示没有监听
var listener = true





// 2. 各类功能函数
// 2.1 响应反应状态
function play_interact(){
    // 把上次未播放完毕的音频关闭
    music.pause()
    // 状态响应
    response_state()
    // 音频响应
    response_audio()
    // 文本响应
    response_text()
}

// 2.1.1 状态响应
function response_state(){
    cur_interact = Math.floor(Math.random() * interact.length)
    console.log('relax'+cur_state)
    video.src = character[cur_character] + interact[cur_interact]
    video.load()
    video.play()
}

// 2.1.2 音频响应
function response_audio(){
    if(IsAudio){
        cur_audio = Math.floor(Math.random() * audio.length)
        music =new Audio(character[cur_character] + audio[cur_audio])
        music.play()
    }
}

// 2.1.3文本响应
function response_text(){
    cur_text = Math.floor(Math.random() * cur_text.length)
    assistant_text_box.innerHTML = text[cur_text]
    assistant_text_box.classList.remove('hidden')
    // 为小人说话框设置显示时间
    setTimeout(()=>{
        assistant_text_box.classList.add('hidden')
    },5000)
}

// 2.2 休闲状态
function play_relax(){
    cur_state = Math.floor(Math.random() * state.length)
    console.log('relax'+cur_state)
    video.src = character[cur_character] + state[cur_state]
    video.load()
    video.play()
}

// 2.3 切换角色
function next_character(){
    cur_character = (cur_character + 1) % character.length
    // 切换角色时响应文本，音频，和休闲动作
    // 把上次未播放完毕的音频关闭
    music.pause()
    play_relax()
    response_audio()
    response_text()
}

// 2.4 用户选择是否播放音频
function choose_audio(){
    IsAudio = !IsAudio
}


// 2.6.1 唤醒语音助手
function assistant_listener(){
    if(listener)
        return
    else {
        audio_assistant_listener()
        listener = true
    }


}
// 2.6.2 唤醒语音助手
function audio_assistant (){
    console.log("唤醒语音助手")
    unfold()
    text_read()
}

// 2.6.3 语音监听唤醒助手，需要一直运行
async function audio_assistant_listener(){
    console.log("开启当前语音唤醒监听");

    try {
        const response = await fetch('http://127.0.0.1:5000/assistant_listener', {  // 确保端口为5000
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data.message)
        audio_assistant()  // 在成功接收数据后调用 audio_assistant
        listener = false

    } catch (error) {
        console.error('Error:', error);
    }
}

// 2.7.1 开始录音
function audio_begin_main(){
    audio_state_main = true

    fetch('http://127.0.0.1:5000/audio_begin', {  // 确保端口为5000
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        result_main = data.message
        ASR_main_text()

    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function audio_begin_assistant(){
    audio_state_assistant = true

    fetch('http://127.0.0.1:5000/audio_begin', {  // 确保端口为5000
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        result_assistant = data.message;
        ASR_assistant_text()
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// 2.7.2 结束录音
function audio_end_main(){
    fetch('http://127.0.0.1:5000/audio_end', {  // 确保端口为5000
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        audio_state_main = false
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function audio_end_assistant(){
    fetch('http://127.0.0.1:5000/audio_end', {  // 确保端口为5000
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        audio_state_assistant = false
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// 2.7.3语音识别按钮函数
function ASR_main(){
    if(audio_state_main){
        audio_end_main()
        return result_main
    }else{
        console.log("主文本框开始语音识别")
        audio_begin_main()
    }
}
function ASR_assistant(){
    if(audio_state_assistant){
        audio_end_assistant()
        return result_assistant
    }else{
        console.log("小人开始语音识别")
        audio_begin_assistant()
    }
}

// 2.7.4 把输出提交到主对话框
function ASR_main_text(){
    console.log("主文本框内容", result_main)
    text_user.value = text_user.value + result_main
}

// 2.7.5 把输出结果提交到语音助手对话框
function ASR_assistant_text(){
    conservation_box.value = conservation_box.value + result_assistant
}


// 2.8 音色改变
function tone_change(){
    fetch('http://127.0.0.1:5000/tone_change', {  // 确保端口为5000
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message)
    })
    .catch(error => {
        console.error('Error:', error);
    });

}

function text_read(){
    const params = {
        text: "你好啊，我一直都在"
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

function response_text(){
    cur_text = Math.floor(Math.random() * text.length)
    console.log(cur_text)
    console.log(text[cur_text])
    assistant_text_box.innerHTML = text[cur_text]

    assistant_text_box.style.visibility = 'visible'
    // 为小人说话框设置显示时间
    setTimeout(()=>{
    assistant_text_box.style.visibility = 'hidden'
    console.log("隐藏")
     },5000)
    }
// 毛毛所建立函数：

function unfold(){
    containerButton.style.transform = 'translateY(0)';
    containerButton.style.opacity = '1';
    containerButton.style.zIndex = '1';
    historychat.style.transform = 'translateY(0)';
    historychat.style.opacity = '1';
    historychat.style.zIndex = '1';
    img.style.height = '70%';
    containerButton.style.height = '10%';
    dialog.style.height = '5%';
    dialog.style.flexDirection = 'row';
    historychat.style.height = '60%';
    historychat.style.maxHeight = '60%';
    videobox.style.height = '30%';
    videoPlayer.style.width = '200%';
    videoPlayer.style.zIndex = '0';
    chat.style.width = '50%';
    oimg[0].style.height='100%';
    oimg[1].style.height='100%';
    oimg[2].style.height='100%';
}

img.onmouseover = function(){
    unfold();
}
chatcbtn.onclick = function(){
    img.style.height = '28%';
    videobox.style.height = '90%';
    videoPlayer.style.width = '90%';
    chat.style.width = '0';
    chat.innerHTML = '';
    containerButton.style.transform = 'translateY(100%)';
    containerButton.style.opacity = '0';
    historychat.style.transform = 'translateY(100%)';
    historychat.style.opacity = '0';
    containerButton.style.height = '0';
    historychat.style.height = '0';
    dialog.style.height = '55%';
    dialog.style.flexDirection = 'column';
    dialog.style.zIndex = '1';
    img.style.zIndex = '0';
    oimg[0].style.height='30%';
    oimg[1].style.height='30%';
    oimg[2].style.height='30%';

}


// 3. 连接触发器
// 点击助手，进入interact状态
video.addEventListener('click',play_interact)
// 休闲状态循环播放
video.addEventListener('ended',play_relax)
// 切换角色
button_next.addEventListener('click',next_character)
//是否播放音频
button_audio.addEventListener('click',choose_audio)
// 录音进行识别按钮
button_recognition_main.addEventListener('click',ASR_main)
button_recognition_assistant.addEventListener('click',ASR_assistant)
// 音色转换
button_tone.addEventListener('click',tone_change)
// 语音监听
chatcbtn.addEventListener('click',assistant_listener)

button_next.addEventListener('click',response_text)

// 4. 初始状态 ：休闲状态
play_relax()
audio_assistant_listener()

})


// const chatoutbtn = document.getElementById("chatoutbtn");
//
// async function callBackend() {
//     const prompt = "the most beautiful scene";
//     const response = await fetch('/call_ttp', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({prompt: prompt})
//     });
//
//     if (!response.ok) {
//         console.error('HTTP error:', response.status);
//         return;
//     }
//
//     const result = await response.json();
//     if (result.url) {
//         console.log(result.url);
//         document.getElementById('result').innerText = result.url;
//     } else {
//         console.error(result.error);
//         document.getElementById('result').innerText = result.error;
//     }
// }
//
// chatoutbtn.addEventListener('click', callBackend);

// async function callBackend() {
//     console.log('开启温升图')
//     const prompt = "the most beautiful scene";
//     const response = await fetch('http://localhost:5001/call_ttp', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ prompt: prompt })
//     });
//
//     if (!response.ok) {
//         console.error('HTTP error:', response.status);
//         return;
//     }
//
//     const result = await response.json();
//     if (result.url) {
//         console.log(result.url);
//         document.getElementById('result').innerText = result.url;
//     } else {
//         console.error(result.error);
//         document.getElementById('result').innerText = result.error;
//     }
// }
//
// document.addEventListener('DOMContentLoaded', () => {
//     const chatoutbtn = document.getElementById("chatoutbtn");
//     chatoutbtn.addEventListener('click', callBackend);
// });
