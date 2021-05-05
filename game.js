const cvs = document.getElementById('game');
const ctx = cvs.getContext("2d");

let frames = 0;

// sprite
const sprite = new Image();
sprite.src = 'img/sprite.png';

// canvas click event
cvs.addEventListener('click', () => {
    bird.flap();
})

// for now this is how we end the game when bird dies
let die = false;

// background image object
const background = {
    sX: 0,
    sY: 0,
    w: 254,
    h: 208,
    x: 0,
    y: cvs.height - 208,

    draw() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.w + this.x, this.y, this.w, this.h);
    }
}

// ground image object
const ground = {
    sX: 276,
    sY: 0,
    w: 203,
    h: 92,
    x: 0,
    y: cvs.height - 92,

    draw() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.w + this.x, this.y, this.w, this.h);
    } 
}

// bird object
const bird = {
    positions: [
        {sX: 276, sY: 112},
        {sX: 276, sY: 140},
        {sX: 276, sY: 166},
        {sX: 276, sY: 140},
    ],

    // for animating the bird's flapping
    frame: 0,

    speed: 0,
    // increment the speed with the gravity value
    gravity: 0.25,
    // used for flap
    jump: 4.6,

    x: 50,
    y: 150,
    w: 34,
    h: 26,
    
    draw() {
        ctx.drawImage(sprite, this.positions[this.frame].sX, this.positions[this.frame].sY, this.w, this.h, this.x, this.y, this.w, this.h);
    },

    update() {
        this.speed += this.gravity; 
        this.y += this.speed;

        // if bird touches the ground
        if (bird.y + bird.h >= ground.y) {
            // bird.y = ground.y - bird.h;
            die = true;
        }
    },

    flap() {
        // go up by 4.6 px; also resets the speed
        this.speed = -this.jump;
    },
}

const pipes = {
    pipesArray: [], // array to store the pipe pairs

    pipeUp: {
        sX: 554,
        sY: 0,
    },
    pipeDown: {
        sX: 502,
        sY: 0
    },

    gap: 85, // gap between the pipes

    w: 52,
    h: 400,

    dx: 2, // 2px to the left every loop

    draw() {
        for (let i = 0; i < this.pipesArray.length; i++) {
            const p = this.pipesArray[i];

            const topYPos = p.y;
            const botYPos = p.y + this.gap + this.h;

            ctx.drawImage(sprite, this.pipeUp.sX, this.pipeUp.sY, this.w, this.h, p.x, topYPos, this.w, this.h);
            ctx.drawImage(sprite, this.pipeDown.sX, this.pipeDown.sY, this.w, this.h, p.x, botYPos, this.w, this.h);
        }
    },

    update() {
        // every 100 frames, create a new pair of pipes
        if (frames % 100 === 0) {
            this.pipesArray.push({
                x: cvs.width,
                y: Math.floor(Math.random() * (-300 - -150) + -150) // random value between -300 and -150
            })
        }

        for (let i = 0; i < this.pipesArray.length; i++) {
            const p = this.pipesArray[i];

            // move pipes to the left 2 pixels every frame
            p.x -= this.dx;

            // collisions
            if (bird.x + bird.w > p.x &&
                bird.x < p.x + this.w &&
                bird.y + bird.h > p.y &&
                bird.y < p.y + this.h) {
                die = true;
            }

            if (bird.x + bird.w > p.x &&
                bird.x < p.x + this.w &&
                bird.y + bird.h > p.y + this.h + this.gap &&
                bird.y < p.y + this.h + this.gap + this.h) {
                die = true;
            }

            // when pipe dissapears from screen, remove it from array
            if (p.x + this.w === 0) {
                this.pipesArray.shift();
            }

            // when bird passes a pipe, increment score
            if (bird.x === p.x + this.w) {
                score.value++;
            }
        }

    }
}

const score = {
    value: 0,
    
    draw() {
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.font = "45px Arial";
        ctx.fillText(this.value, cvs.width / 2, 50);
        ctx.strokeText(this.value, cvs.width / 2, 50);
    }
}

// draw function
function draw() {
    // BACKGROUND COLOR
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    background.draw();
    ground.draw();
    bird.draw();
    pipes.draw();
    score.draw();
}

function update() {
    if (die) return; // if die, don't update the game anymore (stops everything)
    bird.update();
    pipes.update();
}

// loop function
function loop() {
    update();
    draw();
    frames++;
    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);