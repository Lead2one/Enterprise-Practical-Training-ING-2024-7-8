var currentIndex=0;
function history_fold(){
    const historybox = document.getElementById('historybox');
    historybox.classList.remove('show');
}
function history_show() {
    const historybox = document.getElementById('historybox');
    historybox.classList.add('show');
}
var index=0;
function add_history(){
    // const list=document.getElementById('historylist');
    var $li = $(`
        <li class="historyli ${index === currentIndex ? "currentchat" : ""}">
          <span>${index}</span>
          <span>新聊天</span>
        </li>
    `);
    index++;
    $(".historylist").append($li);
}