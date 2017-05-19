/*global ScoreBoard*/
/*global PageView*/
/*global p5*/
// const TIME_RUN = 1600;
/*global ScaleButton*/


function Note(p, im, note, cx, cy, hs) {

    this.size = 1;
    this.r = 0;
    this.isHit = false;
    var e = p.PI - note * p.PI / 5;

    this.isAlive = function() {
        return (this.size > 0) && (this.size < 1.8);
    };
    this.hit = function() {
        this.isHit = true;
    };
    this.miss = function() {
        this.size = -1;
    };

    this.update = function(deltaTime) {
        if (this.r < 1) this.r += deltaTime / 1600;
        if (this.r > 1) this.r = 1;
        if (this.isHit) {
            this.size *= 1 + deltaTime / 500;
        }
    };

    this.draw = function() {
        if (this.size < 0) return;
        p.push();
        p.translate(cx + hs * this.r * this.r * p.cos(e), cy + hs * this.r * this.r * p.sin(e));
        p.scale(this.r * this.size);
        p.image(im, -im.width / 2, -im.height / 2);
        p.pop();
    };

}
var playAct = function(act) {
    var p = act.p;
    var scoreb;

    var isFinish = false;
    var startTime;
    var timex = 0;
    var centerX;
    var centerY;
    var centerNote;
    var buttonNotes;
    var circles;
    var rGame;
    var fft;
    var combo = 0;
    var comboTextS = 4;
    var comboText = "";
    var score = 0;
    // var dancer;
    var lastCombo = -1;
    var noteQueues = [
        [],
        [],
        [],
        [],
        [],
        []
    ];

    var energy = [0, 0, 0];
    var exp = [];
    // var isStop = false;

    // var lastAddNote = -1;

    act.exitBT;


    act.onCreated = function() {

        act.exitBT = new ScaleButton(p, p.width - 70, p.height - 70, 64, 64);
        // console.log(act.exitBT);
        act.exitBT.onDraw = function() {
            p.image(p.store.turnOffIcon, 0, 0);
        };
        act.exitBT.onClicked = function() {
            var r = confirm("Bạn có chắc là muốn thoát không?");
            if (r == true) {
                p.store.bundle.music.stop();
                act.finish();
            }

        };

        lastCombo = -1;
        combo = 0;
        comboTextS = 4;
        comboText = "";
        score = 0;
        noteQueues = [
            [],
            [],
            [],
            [],
            [],
            []
        ];
        energy = [0, 0, 0];
        exp = [];

        scoreb = new ScoreBoard(p);
        centerX = p.width / 3;
        centerY = p.height / 4;
        centerNote = p.store.noteCenter;
        buttonNotes = p.store.noteButtonImgs;
        rGame = p.min(p.height - centerY - buttonNotes[0].height / 1.8, centerX - buttonNotes[0].height / 1.8);
        circles = p.store.circleImgs;
        fft = new p5.FFT();
        p.store.bundle.music.play();
        startTime = p.millis();
        timex = 0;
    };

    act.drawBg = function() {
        p.image(p.store.playingbg, 0, 0, p.width, p.height);
    };


    act.draw = function() {
        p.background(200);
        act.drawBg();
        act.drawTile();
        act.drawGame();
        act.drawPerfect();
        act.drawScore();
        scoreb.draw();
        if (act.exitBT) act.exitBT.draw();
        // gr.draw();

    };

    act.drawTile = function() {
        p.stroke(155, 190, 100);
        p.strokeWeight(8);
        p.line(p.width, 70, p.width - 600, 70);
        p.push();
        p.textAlign(p.RIGHT, p.BOTTOM);
        p.textFont(p.store.icebergFont);
        p.textSize(45);
        p.stroke(255, 100, 100);
        p.strokeWeight(3);
        p.fill(113, 34, 256);
        p.text(p.store.bundle.songInf.musicName + " - " + p.store.bundle.songInf.author, p.width - 50, 50);
        p.pop();
        // dancer.draw(p.width - 140, 20);
    };

    act.drawScore = function() {
        p.stroke(155, 190, 100);
        p.strokeWeight(2);
        p.fill(28, 3, 255);
        p.textSize(60);
        p.textFont(p.store.moonFont);
        p.textAlign(p.RIGHT, p.TOP);
        p.text(score + " POINTS", p.width - 30, 100);
        p.strokeWeight(1);
    };

    act.drawGame = function() {
        p.push();
        p.translate(centerX, centerY);
        p.scale(0.8 + energy[2] / 500);
        p.image(centerNote, -centerNote.width / 2, -centerNote.height / 2);
        p.pop();
        var e = p.PI;
        for (var i = 0; i < 6; ++i) {
            p.image(buttonNotes[i],
                centerX + rGame * p.cos(e) - buttonNotes[i].width / 2,
                centerY + rGame * p.sin(e) - buttonNotes[i].height / 2
            );
            e -= p.PI / 5;
        }
        act.drawNote();

        // p.text("" + combo, 100, 100);
    };

    act.drawNote = function() {
        for (var i = 0; i < noteQueues.length; ++i) {
            for (var k = 0; k < noteQueues[i].length; ++k)
                noteQueues[i][k].draw();
        }
        for (var i = 0; i < exp.length; ++i)
            exp[i].draw();
    };

    act.updateNote = function(deltaTime) {
        for (var i = 0; i < noteQueues.length; ++i) {
            for (var k = 0; k < noteQueues[i].length; ++k) {
                // console.log(noteQueues[i][k]);
                noteQueues[i][k].update(deltaTime);
            }
            if (noteQueues[i].length > 1)
                if (noteQueues[i][0].r >= 1 && noteQueues[i][1].r >= 1) {
                    {
                        noteQueues[i][0].miss();
                        noteQueues[i].shift();
                        combo = 0;
                    }

                }

        }
        for (var i = 0; i < exp.length; ++i)
            exp[i].update(deltaTime);
        while (exp.length > 0) {
            if (!exp[0].isAlive()) exp.shift();
            else break;
        }

    };


    act.drawPerfect = function() {
        if (comboTextS == 4) {
            if (lastCombo != combo) {
                lastCombo = combo;
                if (combo > 3) {
                    comboText = "-" + combo + "-";
                    if (combo > 9)
                        comboText = comboText + "\ncharming";
                }
                else
                    comboText = "";
            }
            else
                comboText = "";
        }
        comboTextS = comboTextS + 2;
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(comboTextS);
        p.fill(250, 5, 146);
        p.noStroke();
        p.text(comboText, centerX, centerY + 120);
        if (comboTextS > 50) comboTextS = 4;
    };



    act.update = function(deltaTime) {

        timex = p.millis() - startTime;

        fft.analyze();
        energy.shift();
        energy.push(fft.getEnergy("highMid"));
        // console.log(p.store.bundle.jsnotes);
        if (p.store.bundle.jsnotes.length > 0) {
            if (p.store.bundle.jsnotes[0].millis <= timex + 1600) {
                act.addNote(p.store.bundle.jsnotes[0].note);
                p.store.bundle.jsnotes.shift();
            }
        }
        act.updateNote(deltaTime);
        if (!p.store.bundle.music.isPlaying()) {
            if (!isFinish) {
                isFinish = true;
                scoreb.setActive(true);

                scoreb.setScore(score);
                scoreb.setSong(p.store.bundle.songInf.musicName);
                p.httpPost("./api/played.php", "json", {
                    musicId: p.store.bundle.songInf.musicId,
                    score: score
                }, function(res) {
                    console.log(res);
                });
            }
        }
    };

    act.addNote = function(ix) {
        noteQueues[ix].push(new Note(p, p.random(circles), ix, centerX, centerY, rGame));
    };

    act.hitOne = function() {
        lastCombo = -1;
        combo++;
        score += 1 + p.floor(p.log(1 + combo));
    };

    var lastCheckId = -1;
    var lastCheckTime = 0;
    act.checkHit = function(id) {
        if (noteQueues[id].length < 1) {
            if (lastCheckId != id || timex - lastCheckTime > 128)
                combo = 0;
        }
        else {
            if (noteQueues[id][0].r >= 0.7) {

                noteQueues[id][0].hit();
                exp.push(noteQueues[id][0]);
                noteQueues[id].shift();
                act.hitOne();
            }
            else {
                combo = 0;
            }
        }
        lastCheckId = id;
        lastCheckTime = timex;

    };


    act.keyPressed = function(keyCode) {

        if (keyCode == 83)
            act.checkHit(0);
        if (keyCode == 68)
            act.checkHit(1);
        if (keyCode == 70)
            act.checkHit(2);
        if (keyCode == 74)
            act.checkHit(3);
        if (keyCode == 75)
            act.checkHit(4);
        if (keyCode == 76)
            act.checkHit(5);

    };


    var lastClicked = false;
    act.mouseReleased = function() {
        scoreb.onReleased();
        if (lastClicked) {
            lastClicked.onReleased();
        }
        lastClicked = false;
    };



    act.mousePressed = function() {
        var e = p.PI;
        var x;
        var y;
        for (var i = 0; i < 6; ++i) {
            x = centerX + rGame * p.cos(e);
            y = centerY + rGame * p.sin(e);
            if (p.dist(x, y, p.mouseX, p.mouseY) < circles[0].width / 2) {
                act.checkHit(i);
                return;
            }
            e -= p.PI / 5;
        }
        if (act.exitBT)
            if (act.exitBT.onPressed())
                lastClicked = act.exitBT;
        scoreb.onPressed();


    };

};


//  function Note(_tick, _note) {
//     this.tick = _tick;
//     this.note = _note;
// }
