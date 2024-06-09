const flowerContainer = document.getElementById('flower-container');
const flowerColors = ['#ff69b4', '#ff6347', '#ffb6c1', '#ffa07a', '#da70d6', '#eee8aa', '#98fb98', '#afeeee'];

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    if (scrollPosition > document.body.offsetHeight - 200) {
        spawnFlower();
    }
});

function spawnFlower() {
    const flower = document.createElement('div');
    const size = Math.random() * 50 + 50;
    const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    flower.classList.add('flower');
    flower.style.width = `${size}px`;
    flower.style.height = `${size}px`;
    flower.style.backgroundColor = color;
    flower.style.borderRadius = '50%';
    flower.style.left = `${Math.random() * window.innerWidth}px`;

    flowerContainer.appendChild(flower);
}
