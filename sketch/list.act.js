/*global PageView*/
/*global View*/
/*global PActivity*/
/*global ScaleButton*/
var listAct = function(act) {
    var p = act.p;
    act.cat = p.store.cat;
    // act.cat = p.store.sleepy;
    act.bg = p.store.songbg;
    var hbg = p.max(p.width / act.bg.width, p.height / act.bg.height);
    act.bgColor = act.cat.getColor(1, 1);
    act.list = new PageView(p, p.width / 1.8, p.height * 0.8, []).setPosition(p.width / 20, p.height / 10);
    act.wating = false;
    act.readyToPlay = false;
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
                // p.store.bundle.music.stop();
                location.href = "./index.html";
            }

        };


    };
    act.onResume = function() {
        act.refresh();
        p.textAlign(p.LEFT);
    };
    act.createMenu = function() {
        act.wating = true;
        // console.log(p.store.cpIcon);
        p.httpPost("./api/mysong.php", "json", {}, function(obj) {
            p.store.mySong = obj.results;
            p.httpPost("./api/challenge.php", "json", {}, function(obj2)
                // console.log(p.store.mySong);
                {
                    p.store.challenge = obj2.results;
                    // console.log(p.store.challenge);
                    var views = [];
                    // console.log(p.store.allSong);
                    for (var i = 0; i < p.store.allSong.length; ++i) {
                        // console.log(p.store.allSong[i].musicId.subString(0, 2));
                        const sif = p.store.allSong[i];
                        if (p.store.allSong[i].musicId.substring(0, 2) != "LV") continue;
                        var id = parseInt(p.store.allSong[i].musicId.substring(2));

                        var _c = false;
                        if (id < 6) _c = true;
                        else
                            for (var k = 0; k < p.store.mySong.length; ++k) {
                                if (p.store.mySong[k].music_musicId == p.store.allSong[i].musicId) {
                                    _c = true;
                                    break;
                                }
                            }

                        var _c2 = false;
                        var _c2sc = -1;
                        for (var k = 0; k < p.store.challenge.length; ++k) {
                            if (p.store.allSong[i].musicId == p.store.challenge[k].music_musicId) {
                                _c2 = true;
                                _c2sc = p.max(_c2sc, p.store.challenge[k].score1);
                                break;
                            }
                        }

                        views[id - 1] = (new View(p, function(p, v) {
                            var c = _c;
                            var csc = _c2sc;
                            var cbt;
                            var plbt;
                            var infor = sif;

                            plbt = new ScaleButton(p, 0, 0, 70, 70);
                            plbt.onDraw = function() {
                                if (c)
                                    p.image(p.store.playIcon, 0, 0);
                                else
                                    p.image(p.store.buyIcon, 0, 0);
                            };
                            plbt.onClicked = function() {
                                if (c) {
                                    if (act.wating) return;
                                    act.wating = true;
                                    p.store.bundle = {};
                                    p.store.bundle.songInf = infor;
                                    p.loadSound(infor.musicLink, function(ms) {
                                        p.store.bundle.music = ms;
                                        p.loadJSON(infor.nodesLink, function(js) {
                                            act.wating = false;
                                            p.store.bundle.jsnotes = js;
                                            // console.log(p.store.bundle.music);
                                            act.readyToPlay = true;
                                        });
                                    });
                                }
                                else {
                                    var r = confirm("Bạn thực sự muốn mua không?");
                                    if (r = true) {
                                        p.httpPost("./api/buy.php", {
                                            musicId: infor.musicId
                                        }, function(res) {
                                            console.log(res);
                                            act.refresh();
                                        });
                                    }
                                }
                            };

                            if (_c2) {
                                cbt = new ScaleButton(p, 0, 0, 40, 40);
                                cbt.onDraw = function() {
                                    if (p.frameCount % 60 < 50) {
                                        // p.rect(0, 0, 40, 40);
                                        p.image(p.store.cpIcon, 0, 0);
                                        p.push();
                                        p.noStroke();
                                        p.fill(0, 233, 0);
                                        p.textSize(20);
                                        p.textFont(p.store.icebergFont);
                                        p.textAlign(p.RIGHT);
                                        p.text("" + csc + "pts", -5, 20);
                                        p.pop();
                                    }
                                }
                            }

                            v.width = act.list.width;
                            v.height = 80;
                            v.onDraw = function() {
                                // console.log(v);

                                p.stroke(200);
                                p.strokeWeight(2);
                                p.fill(254, 165, 240, 100);
                                p.rect(v.x + 3, v.y + 3, v.width - 3, v.height - 3, 12);

                                if (c) {
                                    p.image(p.store.openIcon, v.x + 10, v.y + 10);

                                }
                                else
                                    p.image(p.store.lockIcon, v.x + 10, v.y + 10);
                                plbt.setPosition(v.x + v.width - 80, v.y + 5);
                                plbt.draw();
                                p.textFont(p.store.icebergFont);
                                p.textSize(30);
                                p.stroke(255, 100, 100);
                                p.strokeWeight(3);
                                p.fill(113, 34, 256);
                                p.text(infor.musicName + " - " + infor.author, v.x + 130, v.y + 40);
                                if (cbt) {
                                    cbt.setPosition(v.x + v.width - 160, v.y + 30);
                                    cbt.draw();

                                }
                            };

                            var lastPressed = false;
                            v.onPressed = function() {
                                lastPressed = false;

                                if (plbt) {
                                    if (plbt.onPressed()) {
                                        lastPressed = plbt;
                                        return true;
                                    }
                                }
                                return false;
                            };
                            v.onReleased = function() {
                                if (lastPressed) {
                                    lastPressed.onReleased();
                                    lastPressed = false;
                                }
                            };


                        }));
                    }
                    act.list.setData(views);
                    act.wating = false;
                });
        });
    };

    act.draw = function() {
        p.image(act.bg, p.width - act.bg.width * hbg, p.height - act.bg.height * hbg, act.bg.width * hbg, act.bg.height * hbg)
        act.list.draw();
        if (act.wating) {
            act.cat.draw(p.width - act.cat.width, p.height - act.cat.height);
        }

        p.image(p.store.coinIcon, p.width - 150, 50, 80, 80);
        p.push();
        p.stroke(255);
        p.strokeWeight(4);
        p.fill(255, 240, 0);
        p.textAlign(p.RIGHT);
        p.textSize(70);
        p.text("" + p.store.profile.coin, p.width - 170, 110);
        p.pop();
        if (act.exitBT) act.exitBT.draw();
    };

    act.refresh = function() {
        act.wating = true;
        p.httpPost("./api/profile.php", "json", {}, function(obj) {
            p.store.profile = obj.results;
            act.wating = false;
            act.createMenu();
        });

    };


    act.update = function(deltaTime) {
        if (act.readyToPlay) {
            act.readyToPlay = false;
            act.startActivity(new PActivity(playAct));
        }
        // act.cat.update(deltaTime);
        if (act.wating) {
            act.cat.update(deltaTime);
        }
    };

    var lastPressed = false;
    act.mousePressed = function() {
        if (act.wating) return;
        if (act.list.onPressed()) {
            lastPressed = act.list;
        }
        if (act.exitBT)
            if (act.exitBT.onPressed())
                lastPressed = act.exitBT;

    };
    act.mouseReleased = function() {
        if (lastPressed) {
            lastPressed.onReleased();
            lastPressed = false;
        }
    };
};
