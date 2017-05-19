/*global PGame*/
/*global PActivity*/
var demo1Act = function (act){
    act.onCreated = function()
    {
        act.p.cursor(act.p.ARROW);
    }
    act.draw = function () {
        act.p.background(200);
    }
}


var p5 = new p5((new PGame(new PActivity( demo1Act), 200, 100)).p5Obj, 'gamespace');
