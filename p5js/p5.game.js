/*
 * This is not P5.js library
 * 
 */



function Animation(p, imgs, elapseTime, _loop = true) {
    this.length = imgs.length;
    this.currentId = 0;
    this.width = imgs[0].width;
    this.height = imgs[0].height;
    this.delayRemain = elapseTime;
    this.elapseTime = elapseTime;
    this.isLoop = _loop;

    this.isAlive = function() {
        return this.isLoop || this.currentId < this.length;
    }
    this.copy = function() {
        return new Animation(p, imgs, this.elapseTime, this.isLoop);
    }

    this.draw = function(x, y, w = -1, h = -1) {
        if (!this.isAlive()) return;
        if (w < 0 || h < 0)
            p.image(imgs[this.currentId], x, y);
        else
            p.image(imgs[this.currentId], x, y, w, h);
    };

    this.update = function(deltaTime) {
        this.delayRemain -= deltaTime;
        while (this.delayRemain <= 0) {
            this.currentId += 1;
            this.delayRemain += this.elapseTime;
        }
        if (this.isLoop) {
            while (this.currentId >= this.length) {
                this.currentId = this.currentId - this.length;
            }
        }
    };

    this.noLoop = function() {
        this.isLoop = false;
    }

    this.loop = function() {
        this.isLoop = true;
    }

    this.reset = function() {
        this.currentId = 0;
        this.delayRemain = elapseTime;
    }

    this.getColor = function(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return 0;
        if (this.isAlive())
            return imgs[this.currentId].get(p.floor(x), p.floor(y));
    };


}





const NOT_IMPLEMENT = function(x, y, z) {

};

function PActivity(act) {
    this.bundle;
    this.keyPressed = NOT_IMPLEMENT;
    this.keyReleased = NOT_IMPLEMENT;
    this.mousePressed = NOT_IMPLEMENT;
    this.mouseReleased = NOT_IMPLEMENT;
    this.mouseMoved = NOT_IMPLEMENT;

    this.p;
    this.onStop = NOT_IMPLEMENT;
    this.onResume = NOT_IMPLEMENT;
    this.onPause = NOT_IMPLEMENT;
    this.onCreated = NOT_IMPLEMENT;
    this.draw = NOT_IMPLEMENT;
    this.update = NOT_IMPLEMENT;

    var THIS = this;
    this.finish = function() {
        if (THIS.p) {
            THIS.p.popActivity(THIS);
        }
        else {
            console.error("Activity isn't created!");
        }
    };
    this.startActivity = function(pAct) {
        THIS.p.pushActivity(THIS, pAct);
    };

    this.replaceItself = function(pAct) {
        THIS.p.replaceActivity(THIS, pAct);
    };
    this.onCreate = function(p) {
        THIS.p = p;
        act(THIS);
        THIS.onCreated();
    };
}


function PGame(topAct, width, height) {
    this.p5Obj = function(p) {
        p.animationCache = {};
        p.timeLast = 0;
        p.timex = 0;
        p.deltaTime = 0;

        p.activityStack = [];
        p.cursorAni;
        p.currentActivity = topAct;
        p.setup = function() {
            // p.noCursor();
            p.createCanvas(width, height);
            p.timex = p.millis();
            topAct.onCreate(p);
            topAct.onResume();
        };

        p.activityIsRunning = function(cr) {

            for (var i = 0; i < p.activityStack.length; ++i)
                if (cr == p.activityStack[i]) return true;
            return false;
        };
        p.pushActivity = function(cr, child) {
            if (p.activityIsRunning(cr)) {
                while (p.currentActivity != cr) {
                    p.currentActivity.onStop();
                    p.currentActivity = p.activityStack.pop();
                }
            }
            p.currentActivity.onPause();
            p.activityStack.push(p.currentActivity);
            p.currentActivity = child;
            child.onCreate(p);
            child.onResume();
        };
        p.popActivity = function(cr) {
            if (p.activityIsRunning(cr)) {
                while (p.currentActivity != cr) {
                    p.currentActivity.onStop();
                    p.currentActivity = p.activityStack.pop();
                }
            }
            if (p.activityStack.length > 0) {
                p.currentActivity.onStop();
                p.currentActivity = p.activityStack.pop();
                p.currentActivity.onResume();
            }
            else {
                if (p.exit)
                    p.exit();
            }
        };
        p.replaceActivity = function(cr, child) {
            if (p.activityIsRunning(cr)) {
                while (p.currentActivity != cr) {
                    p.currentActivity.onStop();
                    p.currentActivity = p.activityStack.pop();
                }
            }
            p.currentActivity.onStop();
            p.currentActivity = child;
            child.onCreate(p);
            child.onResume();
        };
        p.keyPressed = function() {
            p.currentActivity.keyPressed(p.keyCode);
        };

        p.keyReleased = function() {
            p.currentActivity.keyReleased(p.keyCode);
        };
        p.mousePressed = function() {

            p.currentActivity.mousePressed();
        };

        p.mouseMoved = function() {
            p.currentActivity.mouseMoved();
        };

        p.mouseDragged = function() {
            p.currentActivity.mouseMoved();
        };

        p.mouseReleased = function() {
            p.currentActivity.mouseReleased();
        };


        p.draw = function() {
            p.timeLast = p.timex;
            p.timex = p.millis();
            p.deltaTime = p.timex - p.timeLast;
            p.currentActivity.update(p.deltaTime);

            p.currentActivity.draw();
            if (p.cursorAni) {
                p.cursorAni.update(p.deltaTime);
                p.cursorAni.draw(p.mouseX, p.mouseY);
            }
        };

        p.splitImage = function(im, length) {
            var imgs = [];
            var w = Math.floor(im.width / length);
            for (var i = 0; i < length; ++i) {
                imgs.push(im.get(w * i, 0, w, im.height));
            }
            return imgs;
        };

        p.createAnimation = function(path, length, elapseTime, loop, onSuccess) {
            var res = p.animationCache[path];
            if (!res) {
                p.loadImage(path, function(im) {
                    var imgs = p.splitImage(im, length);
                    res = new Animation(p, imgs, elapseTime, loop);
                    p.animationCache[path] = res;
                    onSuccess(res.copy());
                });
            }
            else
                onSuccess(res.copy());
        };

        p.roundArc = function(x, y, R, r, start = 0, end = p.TWO_PI, n = 100) {
            var d = (end - start)/n;
            p.beginShape();
            var e;
            for (var i = 0; i <= n; ++i) {
                 e = d * i+ start;
                p.vertex(x + R * p.cos(e), y + R * p.sin(e));

            }
            for (var i = n; i >= 0; --i) {
                e = d * i+ start;
                p.vertex(x + r * p.cos(e), y + r * p.sin(e));

            }
            p.endShape();
        };

    };
}
