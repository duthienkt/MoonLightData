/*global loadAct*/
var loadAct = function(act) {
    var p = act.p;
    act.cat = p.store.sleepy;
    act.texts = [];
    act.textSize = 40;
    act.percent = 0;
    act.bgColor = act.cat.getColor(1, 1);
    act.draw = function() {
        p.background(act.bgColor);
        p.noStroke();
        p.fill(255, 0, 0);
        p.rect(0, p.height - 30, p.width * act.percent / 100.0, 30);
        p.textSize(act.textSize);
        var y = p.height - 40;
        for (var i = act.texts.length - 1; i >= 0; --i) {
            p.fill(20 * (act.texts.length - i) + 13, 255 - (act.texts.length - i) * 10);
            p.text(act.texts[i], 10, y);
            y -= act.textSize * 1.5;
        }
        act.cat.draw(p.width - 300, p.height - 250);

    };

    act.addText = function(str) {
        if (act.texts.length > 10) act.texts.shift();
        act.texts.push(str);
    };


    act.update = function(deltaTime) {
        act.cat.update(deltaTime);
    };
};
