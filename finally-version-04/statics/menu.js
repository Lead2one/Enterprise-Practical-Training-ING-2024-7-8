// 生成粒子
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

// GSAP 动画
gsap.from(".overlay h1", { duration: 1, y: -50, opacity: 0, ease: "power1.out" });
gsap.from(".overlay h2", { duration: 1, y: 50, opacity: 0, ease: "power1.out", delay: 0.5 });
gsap.from(".option", {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: "power1.out",
    stagger: 0.2,
    delay: 1
});

// 选择模式函数
function selectMode(mode) {
    switch(mode){
        case "Food":     
            location.href = "food.html"
            break;
        case "Medical":
            location.href = "medical.html"
            break;
        case "Traffic":
            location.href = "traffic.html"
            break;
        case "Travel":
            location.href = "travel.html"
            break;
        default:
            location.href = "food.html"
            break;
    }
}
