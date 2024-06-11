document.addEventListener('DOMContentLoaded', function () {
    const fallingPetalsContainer = document.getElementById('falling-petals');

    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal-fall');
        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.animationDuration = `${Math.random() * 3 + 2}s`; 
        petal.style.opacity = Math.random();
        petal.style.width = `${Math.random() * 10 + 10}px`; 
        petal.style.height = petal.style.width; 
        fallingPetalsContainer.appendChild(petal);

        petal.addEventListener('animationend', () => {
            petal.remove();
        });
    }

    setInterval(createPetal, 300); 
});
