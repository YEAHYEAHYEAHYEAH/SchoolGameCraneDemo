var playerOne;
var playerOneLives = 3;
var playerTwo;
var playerTwoLives = 3;

var obstacles = [];
var myScorePOne;
var myScorePTwo;

function startGame() {
    myScorePOne = new score("30px", "Segoe UI", "#06c", 40, 32);
    myScorePTwo = new score("30px", "Segoe UI", "#06c", 1000, 32);
    livesPOne = new score("30px", "Segoe UI", "#06c", 240, 32);
    livesPTwo = new score("30px", "Segoe UI", "#06c", 800, 32);
    newP1(false);
    newP2(false);

    GameArea.start();
}
function newP1(immunity) {
    if (playerOneLives > 0) playerOne = new component(50, 50, 10, 300, "playerOne", 'germ.png', immunity);
}

function newP2(immunity) {
    if (playerTwoLives > 0) playerTwo = new component(50, 50, 200, 300, "playerTwo", 'bacteria.png', immunity);
}

var GameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1200;
        this.canvas.id = 'background';
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 5);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function score(fontsize, font, color, x, y) {
    this.score = 0;
    this.font = font;
    this.fontsize = fontsize;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = GameArea.context;
        ctx.font = this.fontsize + " " + this.font;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
    }
    
}

function component(width, height, x, y, id, imageUrl, immune) {
    this.id = id;
    this.immune = immune;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = imageUrl || '';
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0.05;
    this.update = function() {
        ctx = GameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    this.newPosition = function() {
        // this.hitTop();
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.hitBottom();
    }

    this.hitBottom = function() {
        var rockbottom = GameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }

    this.hitTop = function() {
        if (this.y < this.height) {
            this.speedY = 0;
        }
    }

    this.isCrashedInto = function(otherobj) {
        var left = this.x;
        var right = this.x + (this.width);
        var top = this.y;
        var bottom = this.y + (this.height);
        var otherleft = otherobj.x + 20;
        var otherright = otherobj.x + (otherobj.width - 20);
        var othertop = otherobj.y + 20;
        var otherbottom = otherobj.y + (otherobj.height - 20);
        var crash = true;
        if ((bottom < othertop) || (top > otherbottom) || (right < otherleft) || (left > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function isGermCollided(player) {
    var startingPoint = 0;
    if (player.immune) return false;
    if (obstacles.length > 10) startingPoint = obstacles.length - 8;

    for (i = startingPoint; i < obstacles.length; i += 1) {
        if (player.isCrashedInto(obstacles[i])) {
            return true;
        }
    }
    return false;
}

function createObstacles() {
    var x, lampRandomSize, docRandomSize;

    if (GameArea.frameNo === 1 || GameArea.frameNo % 500 === 0) {
        x = GameArea.canvas.width;

        lampRandomSize = Math.random() * (0.9 - 0.3) + 0.5;
        docRandomSize =  Math.random() * (0.9 - 0.3) + 0.5;

        obstacles.push(new component(lampRandomSize*100, lampRandomSize*200, x, 0, "lamp", "lamp.png"));
        obstacles.push(new component(docRandomSize*100, docRandomSize*400, x + 250, 580 - (docRandomSize*400), "doctor", "doctor.png"));
    }

    for (i = 0; i < obstacles.length; i += 1) {
        obstacles[i].x += -1;
        obstacles[i].update();
    }
}

function updateGameArea() {
    GameArea.clear();
    GameArea.frameNo += 1;
    createObstacles();
    myScorePOne.text = "SCORE: " + myScorePOne.score;
    livesPOne.text = "LIVES: " + playerOneLives;
    livesPOne.update();
    myScorePOne.update();

    myScorePTwo.text = "SCORE: " + myScorePTwo.score;
    livesPTwo.text = "LIVES: " + playerTwoLives;
    livesPTwo.update();
    myScorePTwo.update();

    if (playerOne) {
        if (isGermCollided(playerOne)) {
            playerOne = null;
            playerOneLives -= 1;
        } else {
            playerOne.newPosition();
            playerOne.update();
            if (GameArea.frameNo % 200 === 0) {
                myScorePOne.score += 1;
            }
            if (GameArea.frameNo % 2000 === 0) {
                playerOne.immune = false;
            }
        };
    }
    
    if (playerTwo) {
        if (isGermCollided(playerTwo)) {
            playerTwo = null;
            playerTwoLives -= 1;
        } else {
            playerTwo.newPosition();
            playerTwo.update();
            if (GameArea.frameNo % 200 === 0) {
                myScorePTwo.score += 1;
            }
            if (GameArea.frameNo % 2000 === 0) {
                playerTwo.immune = false;
            }
        };
    }
    
}

function jump(event) {
    const key = event.keyCode;
    if (playerOne && key === 65) { //a
        playerOne.speedY = -3;
    }
    else if (playerTwo && key === 38) {//UP
        playerTwo.speedY = -3;
    }
}

function revivePlayers() {
    newP1(true);
    newP2(true);
}