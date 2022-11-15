// JavaScript source code
const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;
const bounce = 0.2;
let scrollOffset = 100;

class Player {
    constructor({ position, dims, colour }) {
        this.position = position;
        this.velocity = { x: 0, y: 0 };
        this.dims = dims;
        this.colour = colour;
        this.lives = 3;
        this.jumps = 0;
        this.maxJumps = 2;
    }

    draw() {
        c.fillStyle = this.colour;
        c.fillRect(this.position.x, this.position.y, this.dims.w, this.dims.h);
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        this.velocity.y += gravity;
    }
}

class Platform {
    constructor({ position, dims, colour }) {
        this.position = position;
        this.dims = dims;
        this.colour = colour;
    }

    draw() {
        c.fillStyle = this.colour;
        c.fillRect(this.position.x, this.position.y, this.dims.w, this.dims.h);
    }
}

class Enemy {
    constructor({ position, dims, platformIndex }) {
        this.position = position;
        this.dims = dims;
        this.platformIndex = platformIndex;
        this.velocity = -1;
    }

    draw() {
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, this.dims.w, this.dims.h);
    }

    update() {
        this.draw();
        this.position.x += this.velocity;
        if (this.position.x + 2 <= platforms[this.platformIndex].position.x) {
            this.velocity = 1;
        } else if (this.position.x + this.dims.w - 2 >=
                   platforms[this.platformIndex].position.x + platforms[this.platformIndex].dims.w) {
            this.velocity = -1;
        }
    }
}

const player1 = new Player({
    position: { x: canvas.width*0.1, y: 450},
    dims: { w: 30, h: 60 },
    colour: "purple",
})

const keys = { 
    right: { pressed: false, },
    left: { pressed: false, },
}

function makeLevelOnePlatforms() {
    let platforms =
        [new Platform({ //floor 1
            position: { x: -50, y: 530 },
            dims: { w: 550, h: 100 },
            colour: "brown"
        }), new Platform({ //floor 2
            position: { x: 1000, y: 530 },
            dims: { w: 5000, h: 100 },
            colour: "brown"
        }), new Platform({ //left wall
            position: { x: -100, y: 0 },
            dims: { w: 50, h: 1200 },
            colour: "brown"
        }), new Platform({
            position: { x: 230, y: 350 },
            dims: { w: 200, h: 15 },
            colour: "blue"
        }), new Platform({
            position: { x: 600, y: 150 },
            dims: { w: 150, h: 15 },
            colour: "green"
        }), new Platform({
            position: { x: 1800, y: 300 },
            dims: { w: 300, h: 15 },
            colour: "aquamarine"
        }), new Platform({
            position: { x: 2200, y: 170 },
            dims: { w: 200, h: 15 },
            colour: "turquoise"
        })]
    return platforms;
}

function makeLevelOneEnd() {
    let endGoals = [new Platform({
        position: { x: 2520, y: 90 },
        dims: { w: 10, h: 10 },
        colour: "gold"
    }), new Platform({ //flagpole
        position: { x: 2520, y: 100 },
        dims: { w: 10, h: 1000 },
        colour: "grey"
    })];
    return endGoals
}

function makeLevelOneEnemies() {
    let enemies = [new Enemy({
        position: { x: 465, y: 500 },
        dims: { w: 30, h: 30 },
        platformIndex: 0
    }), new Enemy({
        position: { x: 405, y: 500 },
        dims: { w: 30, h: 30 },
        platformIndex: 0
    })]
    return enemies;
}

let platforms = makeLevelOnePlatforms();
let endGoals = makeLevelOneEnd();
let enemies = makeLevelOneEnemies();
let end;
let endGoalScore = 0;
let killCount = 0;

function endScreen() {
    end = requestAnimationFrame(endScreen);
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);
    endGoals.forEach((endGoal) => {
        endGoal.draw();
    })
    platforms.forEach((platform) => {
        platform.draw();
    })
    player1.draw();
    drawWinText();
    if (player1.position.y + player1.dims.h <= 530) {
        player1.position.y += 2;
    } else if (player1.position.x < 3000) {
        player1.position.x += 2;
    } else {
        cancelAnimationFrame(end);
    }
}

function drawWinText() {
    c.fillStyle = "lightgrey";
    c.fillRect(312, 150, 400, 250);
    c.strokeStyle = "grey";
    c.strokeRect(312, 150, 400, 250);
    const grad = c.createLinearGradient(312, 250, 712, 250);
    for (let i = 0; i < 7; i++) {
        grad.addColorStop(i / 6, "hsl(" + (360 * i / 6) + ",80%,50%)")
    }
    c.fillStyle = grad;
    c.font = "72px Arial";
    c.fillText("You Win!", 362, 250);
    let finalScore = endGoalScore + player1.lives * 300 + killCount*100;
    c.fillStyle = "black";
    c.font = "42px Arial";
    c.fillText("Score: "+finalScore, 362, 350);
}

function animate() {
    end = requestAnimationFrame(animate);
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);
    endGoals.forEach((endGoal) => {
        endGoal.draw();
    });
    platforms.forEach((platform) => {
        platform.draw();
    });
    enemies.forEach((enemy) => {
        enemy.update();
    });
    player1.update();
    c.font = "32px Arial"
    c.fillText("Lives: "+player1.lives, 20, 40)
    if (keys.right.pressed && player1.position.x < canvas.width * 0.4) {
        player1.velocity.x = 4;
    } else if (keys.left.pressed && player1.position.x > 52) {
        player1.velocity.x = -4;
    } else {
        player1.velocity.x = 0;
        if (keys.right.pressed && scrollOffset < 2200) {
            scrollOffset += 4;
            platforms.forEach((platform) => {
                platform.position.x -= 4
            });
            endGoals.forEach((endGoal) => {
                endGoal.position.x -= 4;
            });
            enemies.forEach((enemy) => {
                enemy.position.x -= 4;
            });
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= 4;
            platforms.forEach((platform) => {
                platform.position.x += 4
            });
            endGoals.forEach((endGoal) => {
                endGoal.position.x += 4;
            });
            enemies.forEach((enemy) => {
                enemy.position.x += 4;
            });
        }
    }

    platforms.forEach((platform) => {
        if (player1.position.y + player1.dims.h <= platform.position.y &&
            player1.position.y + player1.dims.h + player1.velocity.y >= platform.position.y &&
            player1.position.x + player1.dims.w >= platform.position.x &&
            player1.position.x <= platform.position.x + platform.dims.w)
        {
            player1.velocity.y = - bounce * player1.velocity.y;
            player1.position.y = platform.position.y - player1.dims.h;
            player1.jumps = 0;
        }
    });

    if (player1.position.y + player1.dims.h >= 576) {
        cancelAnimationFrame(end);
        death();
    }

    endGoals.forEach((endGoal) => {
        if (player1.position.y + player1.dims.h >= endGoal.position.y &&
            player1.position.y <= endGoal.position.y + endGoal.dims.h &&
            player1.position.x + player1.dims.w >= endGoal.position.x &&
            player1.position.x <= endGoal.position.x + endGoal.dims.w)
        {
            player1.velocity.y = 0;
            endGoalScore = (1 - (player1.position.y + player1.dims.h - endGoals[0].position.y) / 440);
            endGoalScore = 20*Math.ceil(50 * endGoalScore);
            player1.position.x = endGoal.position.x + (endGoal.dims.w - player1.dims.w) / 2;
            cancelAnimationFrame(end);
            endScreen();
        }
    });

    enemies.forEach((enemy) => {
        if (player1.position.y + player1.dims.h <= enemy.position.y &&
            player1.position.y + player1.dims.h + player1.velocity.y >= enemy.position.y &&
            player1.position.x + player1.dims.w >= enemy.position.x &&
            player1.position.x <= enemy.position.x + enemy.dims.w)
        {
            player1.velocity.y = -player1.velocity.y;
            player1.position.y = enemy.position.y - player1.dims.h;
            enemies.splice(enemies.indexOf(enemy), 1);
            killCount++;
        } else if (player1.position.y + player1.dims.h === enemy.position.y + enemy.dims.h &&
            player1.position.x + player1.dims.w >= enemy.position.x + enemy.velocity &&
            player1.position.x <= enemy.position.x + enemy.dims.w + enemy.velocity)
        {
            cancelAnimationFrame(end);
            death();
        }

        enemies.forEach((enemy2) => {
            if (enemy.position.y === enemy2.position.y &&
                enemy.position.x + enemy.dims.w + enemy.velocity >= enemy2.position.x + enemy2.velocity &&
                enemy.position.x + enemy.velocity <= enemy2.position.x + enemy2.dims.w + enemy2.velocity)
            {
                enemy.velocity = -enemy.velocity;
                enemy2.velocity = -enemy2.velocity;
            }
        });
    });

}

function death() {
    player1.lives -= 1;
    if (player1.lives > 0) {
        scrollOffset = 100;
        player1.position = { x: canvas.width * 0.1, y: 450 };
        player1.velocity = { x: 0, y: 0 };
        player1.jumps = 0;
        platforms = makeLevelOnePlatforms();
        endGoals = makeLevelOneEnd();
        enemies = makeLevelOneEnemies();
        animate();
    } else {
        // Draw final frame
        c.fillStyle = "white";
        c.fillRect(0, 0, canvas.width, canvas.height);
        endGoals.forEach((endGoal) => {
            endGoal.draw();
        });
        platforms.forEach((platform) => {
            platform.draw();
        });
        enemies.forEach((enemy) => {
            enemy.update();
        });
        player1.update();
        c.font = "32px Arial"
        c.fillText("Lives: " + player1.lives, 20, 40)
        // Add game over message
        c.fillStyle = "lightgrey";
        c.fillRect(312, 150, 400, 150);
        c.strokeStyle = "grey";
        c.strokeRect(312, 150, 400, 150);
        c.fillStyle = "grey";
        c.font = "72px Arial";
        c.fillText("Game Over", 322, 250);
    }
}

animate();

addEventListener("keydown", ({ key }) => {
    switch (key) {
        case " ":
            if (player1.jumps < player1.maxJumps) {
                player1.velocity.y = -15;
                player1.jumps++;
            }
            break;
        case "w":
            if (player1.jumps < player1.maxJumps) {
                player1.velocity.y = -15;
                player1.jumps++;
            }
            break;
        case "a":
            keys.left.pressed = true;
            break;
        case "d":
            keys.right.pressed = true;
            break;
    }
})

addEventListener("keyup", ({ key }) => {
    switch (key) {
        case " ":
            break;
        case "w":
            break;
        case "a":
            keys.left.pressed = false;
            break;
        case "d":
            keys.right.pressed = false;
            break;
    }
})