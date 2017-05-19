function ScoreBoard(p) {
    var THIS = this;
    var width = p.floor(p.width * 0.8);
    var height = p.floor(p.height * 0.8);
    var isActive = false;
    var x = p.width * 1.5;
    var y = p.height / 14;
    var dsx = x;
    var dsy = y;
    var shareBt = new ScaleButton(p, x + width * 0.8, y + height * 0.8, p.store.sharebt.width, p.store.sharebt.height);
    var scoreTxt = "data";
    var songTxt = "Level Zero";


    this.setScore = function(val) {
        scoreTxt = "".concat(val);
    };
    this.setSong = function(val) {
        songTxt = val;
    };

    shareBt.onClicked = function() {
        shareBt.setVisitbility(false);
        // console.log("share canvas");
        // getFacebookInf(function(obj) {
        //     console.log(obj);
        // });
        shareCanvas("defaultCanvas0", new NewFeedBuilder(),
            function() {
                alert("Chia sẻ ảnh thành công");

            },
            function() {
                alert("Có lỗi rồi");
            });
    }
    console.log(p.store.sharebt);
    shareBt.onDraw = function() {
        p.image(p.store.sharebt, 0, 0);
    };
    this.setActive = function(val) {
        isActive = true;
        if (val) {
            dsx = p.width / 10;
        }
        else {
            dsx = p.height / 10;
        }
    };

    this.draw = function() {
        if (isActive) {
            if (p.abs(x - dsx) < 1) {
                x = dsx;
                isActive = false;
            }
            x = dsx * 0.05 + x * 0.95;
        }
        if (x > p.width) return;

        p.stroke(100, 0, 200, 200);
        p.fill(200, 200, 200, 190);
        p.rect(x, y, width, height);
        // // if (p.store.logo) {
        var h = p.min(width / p.store.logo.width * 0.7, height / p.store.logo.height * 0.5);
        p.image(p.store.logo, x - width / 7, y - height / 9, p.store.logo.width * h, p.store.logo.height * h);
        // 
        p.fill(251, 4, 161);
        p.strokeWeight(4);
        p.stroke(255, 255, 255);
        p.textSize(p.height / 5);
        p.textFont(p.store.icebergFont);
        p.textAlign(p.LEFT, p.BOTTOM);
        p.text(songTxt, x + width / 3.3, y + height / 2.5);


        h = p.height / 5 / p.store.starIcon.height;
        p.image(
            p.store.starIcon,

            x + width / 3.3,
            y + height / 1.4 - p.store.starIcon.height * h,
            p.store.starIcon.width * h,
            p.store.starIcon.height * h

        );

        p.textFont(p.store.moonFont);
        p.textSize(p.store.starIcon.width * h);
        p.noStroke();
        p.fill(255, 240, 0);
        p.text(scoreTxt, x + width / 3.1 + p.store.starIcon.width * h,
            y + height / 1.4);

        shareBt.setPosition(x + width - p.store.sharebt.width * 1.22, y + height - p.store.sharebt.height * 1.22);
        shareBt.draw();
    };


    this.onPressed = function() {
        shareBt.onPressed();
    };

    this.onReleased = function() {
        shareBt.onReleased();
    };


}



function ScaleButton(p, _x, _y, _w, _h) {

    var x = _x;
    var y = _y;
    var w = _w;
    var h = _h;

    var _this = this;
    var clicked = false;
    var visitbility = true;

    this.setVisitbility = function(val) {
        visitbility = val;
    };


    this.setPosition = function(_x, _y) {
        x = _x;
        y = _y;
    };

    this.draw = function() {
        if (!visitbility) return;
        if (clicked) {
            clicked = false;
            this.onClicked();
        }
        p.push();
        if (p.mouseX >= x && p.mouseY >= y && p.mouseX <= x + w && p.mouseY <= y + h) {
            p.translate(x - w / 10, y - h / 10);
            p.scale(1.2);
        }
        else
            p.translate(x, y);
        _this.onDraw();
        p.pop();



    };

    this.onPressed = function() {
        if (!visitbility) return;
        if (p.mouseX >= x && p.mouseY >= y && p.mouseX <= x + w && p.mouseY <= y + h)
            return true;
        return false;
    };


    this.onReleased = function() {
        if (!visitbility) return;
        if (p.mouseX >= x && p.mouseY >= y && p.mouseX <= x + w && p.mouseY <= y + h) {
            clicked = true;
        }
    };


    this.onDraw = function() {

    }
    this.onClicked = function() {

        // console.log("On clicked");
    }
}




function View(p, builder) {
    var _this = this;
    this.width = 100;
    this.height = 50;
    this.x = 0;
    this.y = 0;
    this.isPressed = false;
    var readyClick = false;
    this.setPosition = function(x, y) {
        _this.x = x;
        _this.y = y;
        return _this;
    };

    this.draw = function() {
        if (readyClick) {
            readyClick = false;
            _this.onClicked();
        }
        _this.onDraw();
    };
    this.isHover = function(x, y) {

        if (!x) {
            x = p.mouseX;
            y = p.mouseY;
        }
        // console.log(x + " " + y +( x >= _this.x && x <= _this.x && y >= _this.y && y <= _this.y));
        return x >= _this.x && x <= _this.x + _this.width && y >= _this.y && y <= _this.y + _this.height;
    };
    this.onPressed = function() {
        if (_this.isHover(p.mouseX, p.mouseY)) {
            _this.isPressed = true;
            return true;
        }
        return false;
    };
    this.onReleased = function() {
        _this.isPressed = false;
        if (_this.isHover(p.mouseX, p.mouseY)) {
            readyClick = true;
        }
        return false;
    };

    this.onClicked = function() {

    };

    this.onDraw = function() {
        p.rect(_this.x, _this.y, _this.width, _this.height);
    };
    builder(p, this);
}


function PageView(p, width, height, _rows) {
    var rows = _rows;
    var _this = this;
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.ofset = 0;
    var _ofset = 0;
    this.dataHeight = 0;

    for (var i = 0; i < rows.length; ++i) {
        this.dataHeight += rows[i].height;
    }
    this.setOfset = function(val) {

        _ofset = val;
        if (_ofset < 0) _ofset = 0;
        if (_ofset > _this.dataHeight)
            _ofset = _this.dataHeight;
    };
    this.setData = function(_rows) {
        rows = _rows;
        // console.log(rows);
        _this.dataHeight = 0;

        for (var i = 0; i < rows.length; ++i) {
            _this.dataHeight += rows[i].height;
        }
        return _this;
    };
    this.up = new View(p, function(p, v) {
        v.x = _this.x;
        v.y = _this.y;
        v.width = 30;
        v.height = 30;


        v.onDraw = function() {
            if (v.isPressed) p.fill(100, 50);
            else
                p.noFill();
            if (v.isHover())
                p.strokeWeight(3);
            else
                p.strokeWeight(1);

            p.stroke(255);
            p.rect(v.x, v.y, v.width, v.height, 5);
            p.fill(220);
            p.triangle(
                v.x + v.width / 2, v.y + v.height / 5,
                v.x + v.width / 5, v.y + 4 * v.height / 5,
                v.x + 4 * v.width / 5, v.y + 4 * v.height / 5
            );

        };
        v.onClicked = function() {
            _this.pageUp();
        };
    });


    this.down = new View(p, function(p, v) {
        v.width = 30;
        v.height = 30;
        v.x = _this.x;
        v.y = _this.y + _this.height - v.height;
        v.onDraw = function() {
            if (v.isPressed) p.fill(100, 50);
            else
                p.noFill();
            if (v.isHover())
                p.strokeWeight(3);
            else
                p.strokeWeight(1);

            p.stroke(255);
            p.rect(v.x, v.y, v.width, v.height, 5);
            p.fill(220);
            p.triangle(
                v.x + v.width / 2, v.y + 4 * v.height / 5,
                v.x + v.width / 5, v.y + v.height / 5,
                v.x + 4 * v.width / 5, v.y + v.height / 5
            );
        };
        v.onClicked = function() {
            _this.pageDown();
        };
    });
    this.pageUp = function() {
        _this.setOfset(_this.ofset - 400);

    };
    this.pageDown = function() {
        _this.setOfset(_this.ofset + 400);

    };
    this.setPosition = function(x, y) {
        _this.x = x;
        _this.y = y;
        _this.up.setPosition(x + _this.width, y);
        _this.down.setPosition(x + _this.width, y + _this.height - _this.down.height);
        return _this;
    };


    this.draw = function() {
        _this.drawScroll();
        _this.drawData();

    };

    this.drawData = function() {
        // console.log(rows);
        for (var i = 0; i < rows.length; ++i)
            rows[i].draw();
    };

    this.drawScroll = function() {
        _this.ofset = _this.ofset * 0.98 + _ofset * 0.02;
        var y = _this.y - _this.ofset;
        for (var i = 0; i < rows.length; ++i) {
            rows[i].x = _this.x;
            rows[i].y = y;
            y += rows[i].height;
        }
        _this.up.draw();
        _this.down.draw();
        p.strokeWeight(1);
        p.noFill();
        p.stroke(255);
        p.rect(_this.x + _this.width, _this.y + 34, 30, _this.height - 68);
        var y = p.map(_this.ofset / (_this.dataHeight + 1), 0, 1, _this.y + 64, _this.y + _this.height - 64);
        p.noStroke();
        p.fill(255);
        p.ellipse(_this.x + _this.width + 15, y, 26, 26);

    };

    var lastClick = false;
    this.onPressed = function() {
        lastClick = false;
        if (_this.up.onPressed()) {
            lastClick = _this.up;
            return true;
        }
        if (_this.down.onPressed()) {
            lastClick = _this.down;
            return true;
        }
        for (var i = 0; i < rows.length; ++i) {
            if (rows[i].onPressed()) {
                lastClick = rows[i];
                return true;
            }
        }
        return false;
    };
    this.onReleased = function() {
        // console.log(lastClick);
        if (lastClick)
            lastClick.onReleased();
        lastClick = false;
    };
}
