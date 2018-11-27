var playerOne;
var playerTwo;

var myObstacles = [];
var myScore;

function startGame() {
    playerOne = new component(30, 30, "red", 10, 120);
    playerTwo = new component(30, 30, "blue", 50, 120);
    myScore = new component("30px", "Consolas", "black", 1200, 40, "text");
    myGameArea.start();
}

var myGameArea = {
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


function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0.05;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type === "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function isBirdCollided() {
    for (i = 0; i < myObstacles.length; i += 1) {
        if (playerOne.crashWith(myObstacles[i]) || playerTwo.crashWith(myObstacles[i])) {
            return true;
        }

    }
    return false;
}

function createPipes() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    if (myGameArea.frameNo === 1 || everyinterval(300)) {
        x = myGameArea.canvas.width;
        minHeight = 50;
        maxHeight = myGameArea.canvas.height - 50;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 200;
        maxGap = myGameArea.canvas.height - 200;
        gap = Math.floor(Math.random() * (maxGap - minGap+1) + minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }

    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
}

function updateGameArea() {
    if(isBirdCollided()) {
        return false;
    };

    myGameArea.clear();

    myGameArea.frameNo += 1;

    createPipes();

    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();

    playerOne.newPos();
    playerOne.update();

    playerTwo.newPos();
    playerTwo.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 === 0) {return true;}
    return false;
}

function jump(event) {
    console.log('good');
    const key = event.keyCode;
    if (key === 32) {
        playerOne.speedY = -3;
    }
    else if (key === 38) {
        playerTwo.speedY = -3;
    }
}