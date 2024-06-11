document.addEventListener('DOMContentLoaded', function () {
    const fallingPetalsContainer = document.getElementById('falling-petals');
    const flower = document.querySelector('.pulsing-flower');

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

    document.querySelectorAll('#menu button').forEach(button => {
        button.addEventListener('click', (e) => {
            const { color, design, shape } = e.target.dataset;
            if (color) {
                changeFlowerColor(color);
                updateBackgroundPetals(color);
            }
            if (design) {
                changeFlowerDesign(design);
            }
            if (shape) {
                changePetalShape(shape);
            }
        });
    });

    document.getElementById('apply-custom-color').addEventListener('click', () => {
        const customColor = document.getElementById('custom-color').value;
        changeFlowerColor(customColor);
        updateBackgroundPetals(customColor);
    });

    document.getElementById('apply-petal-color').addEventListener('click', () => {
        const petalNumber = parseInt(document.getElementById('petal-number').value, 10);
        const petalColor = document.getElementById('petal-color').value;
        changeIndividualPetalColor(petalNumber, petalColor);
    });

    function changeFlowerColor(color) {
        const colorMap = {
            pink: ['#ff69b4', '#ff1493'],
            red: ['#ff6347', '#ff4500'],
            yellow: ['#ffff00', '#ffd700'],
            blue: ['#87ceeb', '#4682b4'],
            green: ['#32cd32', '#228b22']
        };

        const isCustom = !colorMap[color];
        const colors = isCustom ? [color, color] : colorMap[color];

        document.querySelectorAll('.layer .petal').forEach(petal => {
            petal.style.background = `radial-gradient(circle, ${colors[0]}, ${colors[1]})`;
        });
    }

    function updateBackgroundPetals(color) {
        const colorMap = {
            pink: '#ff69b4',
            red: '#ff6347',
            yellow: '#ffff00',
            blue: '#87ceeb',
            green: '#32cd32'
        };

        const isCustom = !colorMap[color];
        const petalColor = isCustom ? color : colorMap[color];

        document.querySelectorAll('.petal-fall').forEach(petal => {
            petal.style.background = `radial-gradient(circle, ${petalColor}, ${petalColor})`;
        });
    }

    function changeFlowerDesign(design) {
        document.querySelectorAll('.layer .petal').forEach(petal => {
            petal.classList.remove('striped', 'dotted');
            if (design === 'gradient') {
                petal.style.borderRadius = '20px 20px 0 0';
            } else if (design === 'basic') {
                petal.style.borderRadius = '50%';
            } else if (design === 'striped') {
                petal.classList.add('striped');
            } else if (design === 'dotted') {
                petal.classList.add('dotted');
            }
        });
    }

    function changePetalShape(shape) {
        document.querySelectorAll('.layer .petal').forEach(petal => {
            petal.classList.remove('round', 'pointed', 'heart', 'tear');
            if (shape === 'round') {
                petal.classList.add('round');
            } else if (shape === 'pointed') {
                petal.classList.add('pointed');
            } else if (shape === 'heart') {
                petal.classList.add('heart');
            } else if (shape === 'tear') {
                petal.classList.add('tear');
            }
        });
    }

    function changeIndividualPetalColor(petalNumber, color) {
        const layers = document.querySelectorAll('.layer');
        layers.forEach(layer => {
            const petal = layer.children[petalNumber - 1];
            if (petal) {
                petal.style.background = color;
                petal.style.background = `radial-gradient(circle, ${color}, ${color})`;
            }
        });
    }
});
