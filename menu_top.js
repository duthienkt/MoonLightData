var cir;
var r1;
var menuFont;
var menuText;
var menuCheck;
var menuHover;
var menuTextA;
var menuImg;
var menuDa;
var menuRadius;
var buttonRadius;
var buttonLink;
var loginStatus;

function preload() {
    cir = loadImage("assets/i1.png");
    menuFont = loadFont("assets/Menuetto.ttf");
    var cc = loadJSON('./api/session.php', function(cc) {
        console.log(cc);
        console.log(cc.userId);
        console.log(cc);
        if (cc.userId)
            loginStatus = true;
        else
            loginStatus = false;
        loadMenu();
    });

}

function loadMenu() {
    //todo
    buttonRadius = 20;
    menuRadius = 200;
    var bt;
    if (loginStatus) {
        bt = ["Play", "Logout", "Credit", "Information"];
    }
    else {
        bt = ["Login", "Sign up"];
    }
    menuText = ["Home", ].concat(bt).concat(["Help"]);

    menuCheck = [false, false, false, false, false, false];
    menuHover = [false, false, false, false, false, false];
    menuTextA = [0, 0, 0, 0, 0, 0];
    menuDa = PI / 2.2 / menuText.length;
    if (loginStatus) {
        bt = [
            loadImage("assets/play.png"),
            loadImage("assets/logout.png"),
            loadImage("assets/coin.png"),
            loadImage("assets/info.png")
        ];
    }
    else {
        bt = [loadImage("assets/login.png"),
            loadImage("assets/sign.png")
        ];
    }

    menuImg = [
            loadImage("assets/home.png")
        ]
        .concat(bt).concat([loadImage("assets/help.png")]);

    if (loginStatus) {
        bt = [
            "game.html",
            "logout.html",
            "coin.html",
            "infomation.html"
        ];
    }
    else {
        bt = [
            "login.html",
            "register.html"
        ];
    }
    buttonLink = [
        "top.html"
    ].concat(bt).concat(["introduction.html"]);

}

function setup() {
    var cv = createCanvas(400, 250);
    cv.parent('sketch-holder');
    frameRate(25);
    loadPixels();
    textFont(menuFont);
    textSize(40);
    r1 = 0;

}

function clearBg() {
    updatePixels();
}


function drawCir() {
    r1 += 0.03;
    if (r1 > PI * 2) r1 -= PI * 2;
    push();
    rotate(r1);
    image(cir, -cir.width / 2, -cir.height / 2);
    pop();
}


function drawMenu() {

    var d = PI / 4 - (menuText.length - 1) * menuDa / 2;
    strokeWeight(4);
    for (var i = 0; i < menuText.length; ++i) {
        push();
        imageMode(CENTER);
        translate(menuRadius * cos(d), menuRadius * sin(d));
        if (menuHover[i]) {
            scale(1.5);

        }
        if (mouseIsPressed && menuHover[i]) {
            stroke(200, 255, 20, 100);
            fill(255, 255, 30, 100);
        }
        else {
            stroke(20, 200, 255, 100);
            fill(30, 255, 255, 100);
        }
        ellipse(0, 0, buttonRadius * 2, buttonRadius * 2);
        image(menuImg[i], 0, 0, 25, 25);
        if (menuHover[i]) {
            if (menuTextA[i] < 90) menuTextA[i] += 10;
        }
        else {
            if (menuTextA[i] > 0) menuTextA[i] -= 10;
        }
        if (menuTextA[i] > 0) {
            rotate(HALF_PI - menuTextA[i] / 90 * HALF_PI);
            scale(0.2 + menuTextA[i] / 112);
            noStroke();
            fill(0, 0, 255);
            textSize(30);
            text(menuText[i], 25, 5);
        }

        pop();
        d += menuDa;
    }

}

function draw() {
    clearBg();
    drawCir();
    drawMenu();
}

function distance(x0, y0, x1, y1) {
    var dx = x0 - x1;
    var dy = y0 - y1;
    return sqrt(dx * dx + dy * dy);

}

function mouseMoved() {
    if (!menuText) return;
    var d = PI / 4 - (menuText.length - 1) * menuDa / 2;
    
    for (var i = 0; i < menuText.length; ++i) {
        var x = menuRadius * cos(d);
        var y = menuRadius * sin(d);
        menuHover[i] = distance(x, y, mouseX, mouseY) < buttonRadius;
        d += menuDa;
    }
}

function mousePressed() {
    if (!menuText) return;
    var d = PI / 4 - (menuText.length - 1) * menuDa / 2;
    for (var i = 0; i < menuText.length; ++i) {
        var x = menuRadius * cos(d);
        var y = menuRadius * sin(d);
        menuHover[i] = distance(x, y, mouseX, mouseY) < buttonRadius;
        d += menuDa;
    }
}

function mouseReleased() {
    if (!menuText) return;
    var d = PI / 4 - (menuText.length - 1) * menuDa / 2;
    for (var i = 0; i < menuText.length; ++i) {
        var x = menuRadius * cos(d);
        var y = menuRadius * sin(d);
        if (menuHover[i])
            onClickButton(i);


        menuHover[i] = false;
    }
}

function onClickButton(id) {
    location.href = buttonLink[id];
}
