const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const player1score = document.getElementById('player1Score');
const player2score = document.getElementById('player2Score');
const startGameButton = document.getElementById('startGameButton');
const displayText = document.getElementById('displayText');
const playerScores = document.getElementById('playerScores');
const displayWinner = document.getElementById('finalWinner');

canvas.width = 1024;
canvas.height = 576;

const paddleVelocity = 5;
let ballVelocity = 2;
let score1 = 0;
let score2 = 0;

class Paddle {
    constructor({ position, color }) {
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.width = 10;
        this.height = 100;
        this.color = color;
    }

    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();

        if (
            this.position.y + this.velocity.y >= 0 &&
            this.position.y + this.height + this.velocity.y <= canvas.height
        ) {
            this.position.y += this.velocity.y;
        }
        else {
            this.velocity.y = 0;
        }
    }
};

class Ball {
    constructor({ position, color = '#FB923C' }) {
        this.position = position;
        this.velocity = {
            x: Math.random() - 0.5 >= 0 ? -ballVelocity : ballVelocity,
            y: Math.random() - 0.5 >= 0 ? -ballVelocity : ballVelocity
        };
        this.radius = 10;
        this.color = color;
        this.sideCollusionDetect = false;
    }

    draw() {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }

    update() {
        // Player 1 misses
        if (
            this.position.x - this.radius + this.velocity.x <= 0
        ) {
            score2++;
            player2score.innerHTML = score2;
            if (score2 === 3) {
                resetGame();
            }
            init();

            return;
        }

        // Player 2 misses
        if (
            this.position.x + this.radius + this.velocity.x >= canvas.width
        ) {
            score1++;
            player1score.innerHTML = score1;
            if (score1 === 3) {
                resetGame();
            }
            init();

            return;
        }

        this.draw();

        // Reverse y collusions
        if (
            this.position.y - this.radius + this.velocity.y < 0 ||
            this.position.y + this.radius + this.velocity.y > canvas.height
        ) {
            this.velocity.y *= -1;
        }

        // Reverse x collusions
        if (
            (
                this.position.x - this.radius + this.velocity.x < 0 ||
                this.position.x + this.radius + this.velocity.x > canvas.width ||
                (
                    this.position.x - this.radius + this.velocity.x < paddle1.position.x + paddle1.width &&
                    this.position.x + this.radius + this.velocity.x > paddle1.position.x &&
                    this.position.y + this.radius > paddle1.position.y &&
                    this.position.y - this.radius < paddle1.position.y + paddle1.height
                ) ||
                (
                    this.position.x - this.radius + this.velocity.x < paddle2.position.x + paddle2.width &&
                    this.position.x + this.radius + this.velocity.x > paddle2.position.x &&
                    this.position.y + this.radius > paddle2.position.y &&
                    this.position.y - this.radius < paddle2.position.y + paddle2.height
                )
            ) &&
            !this.sideCollusionDetect
        ) {
            this.velocity.x *= -1;
            this.sideCollusionDetect = true;

            setTimeout(() => {
                this.sideCollusionDetect = false;
            }, 100);
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
};


context.fillStyle = 'black';
context.fillRect(0, 0, canvas.width, canvas.height);

// context.fillStyle = '#262626';
// context.fillRect(0, 0, canvas.width, canvas.height);

// context.fillStyle = 'white';
// context.fillRect(0, canvas.height / 2 - 0.5, canvas.width, 1);
// context.fillRect(canvas.width / 2 - 2.5, 0, 5, canvas.height);

let paddle1 = new Paddle({
    position: {
        x: 50,
        y: 100
    },
    color: 'red'
});

let paddle2 = new Paddle({
    position: {
        x: canvas.width - 60,
        y: canvas.height - 200
    },
    color: 'blue'
});

let ball = new Ball({
    position: {
        x: canvas.width / 2,
        y: canvas.height / 2
    },
});

function init() {
    context.fillStyle = '#262626';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'white';
    context.fillRect(0, canvas.height / 2 - 0.5, canvas.width, 1);
    context.fillRect(canvas.width / 2 - 2.5, 0, 5, canvas.height);

    paddle1 = new Paddle({
        position: {
            x: 50,
            y: 100
        },
        color: 'red'
    });

    paddle2 = new Paddle({
        position: {
            x: canvas.width - 60,
            y: canvas.height - 200
        },
        color: 'blue'
    });

    ball = new Ball({
        position: {
            x: canvas.width / 2,
            y: canvas.height / 2
        },
    });
}

function resetGame() {
    if (score1 < score2) {
        displayWinner.innerHTML = 'Player 2 Wins !!!';
    }
    else if (score2 < score1) {
        displayWinner.innerHTML = 'Player 1 Wins !!!';
    }
    else {
        displayWinner.innerHTML = 'Tie';
    }

    cancelAnimationFrame(animationId);

    score1 = 0;
    score2 = 0;
    player1score.innerHTML = score1;
    player2score.innerHTML = score2;
    playerScores.style.display = 'none';
    displayText.style.display = 'flex';
}

const incrementBallVelocity = () => {
    if (ball.velocity.x > 10 || ball.velocity.y > 10) {
        return;
    }

    ball.velocity.x *= 1.2;
    ball.velocity.y *= 1.2;
    setTimeout(incrementBallVelocity, 10000);
}

incrementBallVelocity();

let animationId;

function animate() {
    animationId = requestAnimationFrame(animate);

    context.fillStyle = '#262626';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'white';
    context.fillRect(0, canvas.height / 2 - 0.5, canvas.width, 1);
    context.fillRect(canvas.width / 2 - 2.5, 0, 5, canvas.height);

    paddle1.update();
    paddle2.update();

    ball.update();
}

// animate();

addEventListener('keydown', ({ key }) => {
    switch (key) {
        // Player 1 down
        case 's':
            console.log('down 1');
            paddle1.velocity.y = paddleVelocity;

            break;

        // Player 1 up
        case 'w':
            console.log('up 1');
            paddle1.velocity.y = -paddleVelocity;

            break;

        // Player 2 down
        case 'ArrowDown':
            console.log('down 2');
            paddle2.velocity.y = paddleVelocity;

            break;

        // Player 2 up
        case 'ArrowUp':
            console.log('up 2');
            paddle2.velocity.y = -paddleVelocity;

            break;

        default:
            break;
    }
});

startGameButton.addEventListener('click', (event) => {
    resetGame();
    init();
    animate();
    playerScores.style.display = 'flex';
    startGameButton.innerHTML = "Restart";
    displayText.style.display = 'none';
});

