let isRelaxVideo = true;
document.getElementById('videoPlayer').addEventListener('click', function() {
    if (isRelaxVideo) {
        this.src = "../resource/tlxy/interact1.webm";
    } else {
        this.src = "../resource/tlxy/relax1.webm";
    }
    this.play();
    isRelaxVideo = !isRelaxVideo;
});

const particles = document.querySelector('.particles');
const particleCount = 100;
for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.top = `${Math.random() * 100}vh`;
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.width = `${Math.random() * 5 + 2}px`;
    particle.style.height = particle.style.width;
    particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    particles.appendChild(particle);
}
if(document.getElementById('food')){
document.getElementById('food').onmouseover = function() {
    document.documentElement.classList.toggle('food');
};
document.getElementById('food').onmouseleave = function(){
    document.documentElement.classList.remove('food');
}
}
if(document.getElementById('medical')){
document.getElementById('medical').onmouseover = function() {
    document.documentElement.classList.toggle('medical');
};
document.getElementById('medical').onmouseleave = function(){
    document.documentElement.classList.remove('medical');
}
}
if(document.getElementById('traffic')){
document.getElementById('traffic').onmouseover = function() {
    document.documentElement.classList.toggle('traffic');
};}
document.getElementById('traffic').onmouseleave = function(){
    document.documentElement.classList.remove('traffic');
}
if(document.getElementById('travel')){
document.getElementById('travel').onmouseover = function() {
    document.documentElement.classList.toggle('travel');
};
document.getElementById('travel').onmouseleave = function(){
    document.documentElement.classList.remove('travel');
}
}


