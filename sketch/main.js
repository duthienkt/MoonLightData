/*global PGame*/
/*global PActivity*/
/*global getScreenSize*/
/*global FILE_HOST*/
/*global ScoreBoard*/
/*global ScaleButton*/
/*global playAct*/
/*global loadAct*/
/*global listAct*/


// const DANCE_PATH = [
//     FILE_HOST+"dance_0.png",
//     FILE_HOST+"dance_1.png",
//     FILE_HOST+"dance_2.png",
//     FILE_HOST+"dance_3.png",
//     FILE_HOST+"dance_4.png",
//     FILE_HOST+"dance_5.png",
//     FILE_HOST+"dance_6.png",
//     FILE_HOST+"dance_7.png",
//     FILE_HOST+"dance_8.png",
//     FILE_HOST+"dance_9.png"
// ];
// function loadAnimationFromArray(p, arr, success) {
//     var res = [];
//     //  g.print("loadImageFromArray(arr, success, fail) len\n".concat(arr));
//     function loader(id, arr, ret) {
//         if (id < arr.length)
//             p.createAnimation(arr[id], 8, 125,true, function(pic) {
//                 ret.push(pic);
//                 // p.loadingAct.addText("load  ".concat(arr[id]))
//                 loader(id + 1, arr, ret);
//             });
//         else {
//             // p.loadingAct.addText("load animation complete!");
//             success(res);
//         }

//     }
//     loader(0, arr, res);
// }


var main = function(act) {
    var p = act.p;
    p.store = {};
    var xLoad = [];
    var logo;
    var progress = 0;
    var progressN = 100;
    var lx, ly;
    var icebergFont;
    var startBt;


    act.onCreated = function() {

        act.p.cursor(act.p.ARROW);
        //todo: load data
        lx = p.width - 180;
        ly = p.height - 140;
        p.loadJSON('./api/session.php', function(cc) {
            progress++;
            if (cc.userId)
                {
                    act.loadData();
                }
            else
                location.href = "./login.html";
        });
        

        //init data
        xLoad = [-3 * p.width / 4, -2 * p.width / 4, -p.width / 4, 0];
        startBt = new ScaleButton(p, lx - 80, ly - 40, 160, 80);
        startBt.onDraw = function() {
            p.fill(0, 200, 255);
            if (icebergFont)
                p.textFont(icebergFont);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("PLAY", 80, 40);

        };
        startBt.onClicked = function() {
            act.startActivity(new PActivity(listAct));
        };
    };


    act.loadData = function() {
        progressN = 32;
        
        if (p.width < p.height) return;
        p.loadFont(FILE_HOST + "IcebergRegular.ttf", function(fnt) {
            p.store.icebergFont = fnt;
            icebergFont = fnt;
            progress++;
        });
        p.loadFont(FILE_HOST + "beauty.ttf", function(fnt) {
            p.store.beautyFont = fnt;
            progress++;
        });
        p.loadImage(FILE_HOST + "logo.png", function(im) {
            p.store.logo = im;
            logo = im;
            progress++;
        });

        p.loadImage(FILE_HOST + "note_center.png", function(im) {
            p.store.noteCenter = im;
            progress++;
        });

        p.loadImage(FILE_HOST + "turnoff.png", function(im) {
            p.store.turnOffIcon = im;
            progress++;
        });


        p.loadImage(FILE_HOST + "sharebt.png", function(im) {

            p.store.sharebt = im;
            progress++;

        });

        p.loadImage(FILE_HOST + "buy.png", function(im) {

            p.store.buyIcon = im;
            progress++;

        });

        p.loadImage(FILE_HOST + "play.png", function(im) {

            p.store.playIcon = im;
            progress++;

        });

        // loadAnimationFromArray(p, DANCE_PATH, function(dcs){
        //     p.store.dancers = dcs;
        //     process+=10;
        // });

        p.loadImage(FILE_HOST + "playing.png", function(im) {

            p.store.playingbg = im;
            progress++;

        });
        p.loadFont(FILE_HOST + "moonhouse.ttf", function(fnt) {

            p.store.moonFont = fnt;
            progress++;
        });
        p.loadImage(FILE_HOST + "star.png", function(im) {
            p.store.starIcon = im;
            progress++;
        });

        p.loadImage(FILE_HOST + "songbg.png", function(im) {
            p.store.songbg = im;
            progress++;
        });

        p.loadImage(FILE_HOST + "open.png", function(im) {
            p.store.openIcon = im;
            progress++;
        });

        p.loadImage(FILE_HOST + "lock.png", function(im) {
            p.store.lockIcon = im;
            progress++;
        });

        p.createAnimation(FILE_HOST + "cat.png", 20, 130, true, function(an) {
            p.store.cat = an;
            progress++;
        });

        p.store.circleImgs = [];
        p.loadImage(FILE_HOST + "C0.png", function(im) {
            p.store.circleImgs[0] = im;
            progress++;
        });
        p.loadImage(FILE_HOST + "C1.png", function(im) {
            p.store.circleImgs[1] = im;
            progress++;
        });
        p.loadImage(FILE_HOST + "C2.png", function(im) {
            p.store.circleImgs[2] = im;
            progress++;
        });
        p.loadImage(FILE_HOST + "C3.png", function(im) {
            p.store.circleImgs[3] = im;
            progress++;
        });
        p.loadImage(FILE_HOST + "C4.png", function(im) {
            p.store.circleImgs[4] = im;
            progress++;
        });


        p.store.noteButtonImgs = [];
        p.loadImage(FILE_HOST + "BT_S.png", function(im) {
            p.store.noteButtonImgs[0] = im;
            progress++;
        });

        p.loadImage(FILE_HOST + "BT_D.png", function(im) {
            p.store.noteButtonImgs[1] = im;
            progress++;
        });

        p.loadImage(FILE_HOST + "BT_F.png", function(im) {
            p.store.noteButtonImgs[2] = im;
            progress++;
        });

        p.loadImage(FILE_HOST + "BT_J.png", function(im) {
            p.store.noteButtonImgs[3] = im;
            progress++;
        });

        p.loadImage(FILE_HOST + "BT_K.png", function(im) {
            p.store.noteButtonImgs[4] = im;
            progress++;
        });

        p.loadImage(FILE_HOST + "BT_L.png", function(im) {
            p.store.noteButtonImgs[5] = im;
            progress++;
        });

        p.createAnimation(FILE_HOST + "cat_sleepy.png", 20, 130, true, function(an) {
            p.store.sleepy = an;
            progress++;
        });

        p.loadImage(FILE_HOST + "cp.png", function(im) {
            p.store.cpIcon = im;
            progress++;
        });

        p.loadImage(FILE_HOST + "coin.png", function(im) {
            p.store.coinIcon = im;
            progress++;
        });

        p.httpPost("./api/allsong.php", "json", {}, function(obj) {
            p.store.allSong = obj.results;
            progress++;
        });

        p.httpPost("./api/profile.php", "json", {}, function(obj) {
            p.store.profile = obj.results;
            progress++;
        });





    };
    act.draw = function() {
        p.background(0);
        if (logo) {
            p.image(logo, p.width / 2 - logo.width / 2, 0);
        }
        if (p.width < p.height)
            act.drawWarring();
        else
            act.drawLoading();

    };

    act.drawWarring = function() {
        //todo      
        p.push();
        p.textAlign(p.CENTER, p.CENTER);
        p.text("Please rotate your device", p.width / 2, p.height / 2);
        act.p.pop();
    };

    act.update = function(deltaTime) {
        // for (var i = 0; i < xLoad.length; ++i)
        //     if (xLoad[i] > p.width)
        //         xLoad[i] = 0;
        //     else
        //         xLoad[i] += deltaTime / 2;
    };

    act.drawLoading = function() {
        p.noStroke();
        var div = 90;
        var bg = p.frameCount % div * p.TWO_PI / div;
        var e;
        for (var i = 0; i < div - 15; ++i) {
            e = bg + i * p.TWO_PI / div;
            p.fill(0, 255, 255, i * 5);
            p.roundArc(lx, ly, 130, 105, e, e + p.TWO_PI / div, 5);
            p.roundArc(lx, ly, 130, 105, e + 0.1, e + p.TWO_PI / div + 0.1, 5);
        }
        if (icebergFont)
            p.textFont(icebergFont);
        p.push();
        p.fill(0, 200, 255);
        p.textSize(50);
        p.textAlign(p.CENTER, p.CENTER);
        if (progressN > progress)
            p.text("" + p.floor(progress / progressN * 100) + "%", lx, ly);
        else {
            startBt.draw();
        }
        p.pop();
    };

    var lastClicked = false;
    act.mouseReleased = function() {
        if (lastClicked) {
            startBt.onReleased();
            lastClicked = false;
        }
    };
    act.mousePressed = function() {
        lastClicked = false;
        if (progressN > progress) return;
        if (startBt.onPressed()) {
            lastClicked = startBt;
        }
    };

};

var sc = getScreenSize();

var p5ob = new p5((new PGame(new PActivity(main), sc.width - 20, sc.height - 20)).p5Obj, 'gamespace');
