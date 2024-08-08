var record = false;
var animationRunning = false;
var muted = false;
// var photod = false;

voice.onclick = function(){
    record = !record
    if(record === false){
        voice.style.background = 'url("../resource/image/voice.svg") center no-repeat';
        voice.style.backgroundSize = 'cover';
        if(animationRunning) { // 如果动画正在运行，则停止它
            voice.classList.remove('scaling-button');
            animationRunning = false;
        }
    }
    else{
        voice.style.background = 'url("../resource/image/record.svg") center no-repeat';
        voice.style.backgroundSize = 'cover';
        if(!animationRunning) { // 如果动画没有运行，则启动它
            voice.classList.add('scaling-button');
            animationRunning = true;
        }
    }
}

// photo.onclick = function(){
//
//     photod = !photod;
//     if(photod === false){
//         photo.style.background = 'url("../resource/image/text.svg")';
//         photo.style.backgroundSize = 'cover';
//     }
//     else{
//         photo.style.background = 'url("../resource/image/photo.svg")';
//         photo.style.backgroundSize = 'cover';
//     }
// }

// function transphoto(){
//     if (photod === false){
//         console.log(0);
//         return 0;
//     }
//     else{
//         console.log(1);
//         return 1;
//     }
// }

/*------------------------------------------------------------------*/


// const skin = document.getElementById('skin');
// const tone = document.getElementById('tone');
// const voice = document.getElementById('voice');
// const rename = document.getElementById('rename');
// const mute = document.getElementById('mute');
// const historybox=document.getElementById('historybox');
// // const chat = document.getElementById('chat');
// $(document).ready(
//     function(){
//       renderHistoryList();
//     }
//   );
//
// function addOptionButtons(options) {
//     // 清空现有的chatcontent内容
//     chat.innerHTML = '';
//     const buttontext = document.createElement('div');
//     buttontext.innerText = "请选择："
//     buttontext.style.margin = '3%';
//     // 创建一个按钮容器
//     const buttonContainer = document.createElement('div');
//     buttonContainer.className = 'option-buttons-container';
//     buttonContainer.style.width = "100%";
//     buttonContainer.style.height = '100%';
//     buttonContainer.style.display = 'flex';
//     buttonContainer.style.flexDirection = 'column';
//     buttonContainer.style.overflow = 'auto';
//     buttonContainer.style.borderRadius = '10px';
//     // 为每个选项创建一个按钮
//     options.forEach(function(option) {
//         const optionButton = document.createElement('button');
//         optionButton.style.width = '90%';
//         optionButton.style.height = '30px';
//         optionButton.textContent = option;
//         optionButton.className = 'option-button';
//         optionButton.style.transition = '0.5s ease';
//         optionButton.onmouseover = function(){
//             optionButton.style.backgroundColor = 'green';
//             optionButton.style.cursor = 'pointer';
//         }
//         optionButton.onmouseout = function(){
//             optionButton.style.backgroundColor = 'white';
//         }
//         // 为每个选项按钮绑定点击事件
//         optionButton.onclick = function() {
//             displayContent('Selected: ' + option);
//         };
//         optionButton.style.margin = '1%';
//         optionButton.style.borderRadius = '10px';
//         buttonContainer.appendChild(optionButton);
//     });
//
//     // 将按钮容器添加到chatcontent中
//     chat.appendChild(buttontext);
//     chat.appendChild(buttonContainer);
// }
// function displayContent(message) {
//     // 创建一个新的div元素来显示消息
//     const newDiv = document.createElement('div');
//     newDiv.textContent = message;
//     // 清空现有的chatcontent内容
//     chat.innerHTML = '';
//     // 将新创建的div添加到chatcontent中
//     chat.appendChild(newDiv);
// }