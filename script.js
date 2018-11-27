var playerOne;
var playerOneLives = 3;
var playerTwo;
var playerTwoLives = 3;

var obstacles = [];
var myScorePOne;
var myScorePTwo;

function startGame() {
    myScorePOne = new score("30px", "Consolas", "black", 200, 40, "text");
    livesPOne = new score("30px", "Consolas", "black", 40, 40, "text");
    myScorePTwo = new score("30px", "Consolas", "black", 1000, 40, "text");
    livesPTwo = new score("30px", "Consolas", "black", 800, 40, "text");
    newP1();
    newP2();

    GameArea.start();
}
function newP1() {
    if (playerOneLives > 0) playerOne = new component(50, 50, 10, 550, "playerOne", 'germ.png');
}

function newP2() {
    if (playerTwoLives > 0) playerTwo = new component(50, 50, 200, 550, "playerTwo", 'bacteria.png');
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
function score(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function () {
        ctx = GameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    
}

function component(width, height, x, y, id, imageUrl) {
    this.id = id;
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
    this.newPos = function() {
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

function isBirdCollided(player) {
    for (i = 0; i < obstacles.length; i += 1) {
        if (player.isCrashedInto(obstacles[i])) {
            return true;
        }

    }
    return false;
}

function createPipes() {
    var x, lampRandomSize, docRandomSize;

    if (GameArea.frameNo === 1 || GameArea.frameNo % 300 === 0) {
        x = GameArea.canvas.width;

        lampRandomSize = Math.random();
        docRandomSize = Math.random();

        obstacles.push(new component(lampRandomSize*100, lampRandomSize*200, x, 0, "lamp", "lamp.png"));
        obstacles.push(new component(docRandomSize*100, docRandomSize*400, x + 100, 550 - (docRandomSize*400), "doctor", "doctor.png"));
    }

    for (i = 0; i < obstacles.length; i += 1) {
        obstacles[i].x += -1;
        obstacles[i].update();
    }
}

function updateGameArea() {
    GameArea.clear();
    GameArea.frameNo += 1;
    createPipes();
    myScorePOne.text = "SCORE: " + myScorePOne.score;
    livesPOne.text = "LIVES: " + playerOneLives;
    livesPOne.update();
    myScorePOne.update();

    myScorePTwo.text = "SCORE: " + myScorePTwo.score;
    livesPTwo.text = "LIVES: " + playerTwoLives;
    livesPTwo.update();
    myScorePTwo.update();

    if (playerOne) {
        if (isBirdCollided(playerOne)) {
            playerOne = null;
            playerOneLives -= 1;
        } else {
            playerOne.newPos();
            playerOne.update();
            myScorePOne.score = GameArea.frameNo;
        };
    }
    
    if (playerTwo) {
        if (isBirdCollided(playerTwo)) {
            playerTwo = null;
            playerTwoLives -= 1;
        } else {
            playerTwo.newPos();
            playerTwo.update();
            myScorePTwo.score = GameArea.frameNo;
        };
    }
    
}

function jump(event) {
    const key = event.keyCode;
    if (playerOne && key === 32) { //SPACE
        playerOne.speedY = -3;
    }
    else if (playerTwo && key === 38) {//UP
        playerTwo.speedY = -3;
    }
}