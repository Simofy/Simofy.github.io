$(document).ready(function(){
    //--------------------------------------------------------------------------------------------------------------
    //
    //  Utils.
    //
    //--------------------------------------------------------------------------------------------------------------
    /**
     * Gets random float.
     * @param {number} min - From.
     * @param {number} max - To.
     * @returns {number}
     */
    var randomFloat = function (min, max) {
        return min + (max - min) * Math.random();
    };
    /**
     * Gets random integer.
     * @param {number} min - From.
     * @param {number} max - To.
     * @returns {number}
     */
    var test = 4;
    var randomInt = function (min, max) {
        return Math.round(randomFloat(min, max));
    };
    var infSketch = function(){
        this.d = 8;
        this.n = 5;
        this.scale = stage.width() / test;
        this.size = 25;
        this.colorArray = [];
        this.shapeArray = [];
        this.step = 0.06;
        this.time = 0.0;
        this.delay = 10;
        this.randDigit = 0;
        this.layer = stage.layer();
        //x = cos t , y = sin t * cos t
        for(let i = 0; i < this.size; i++) {
            let r_ = randomInt(0,255);
            let g_ = randomInt(0,255);
            let b_ = randomInt(0,255);
            this.colorArray.push({r:r_, g:g_, b:b_});
            this.shapeArray.push(this.layer.path());
        }
    }
    function getPos(t){
        let x = Math.cos(t);
        let y = Math.sin(t) * Math.cos(t);
        return [x, y];
    }
    infSketch.prototype.windowResized = function(){
        this.scale = stage.width() / test;
    }
    infSketch.prototype.draw = function() {
        this.time += this.step;
        stage.suspend();
        let r_ = randomInt(0,255);
        let g_ = randomInt(0,255);
        let b_ = randomInt(0,255);
        this.colorArray.shift();
        this.colorArray.push({r:r_, g:g_, b:b_});
        let start = getPos(this.time);
        let end = getPos(this.time - (this.size-1) * this.step);
        for (var a = 0; a < this.size; a++) {
            let pos = getPos(this.time - a * this.step);
            let c = this.colorArray[(this.size-1)- a];
            let linePath = this.shapeArray[a];
            linePath.clear();
            linePath.moveTo(end[0]*this.scale + stage.width() / 2, end[1]*this.scale + stage.height() / 2);
            linePath.lineTo(pos[0]*this.scale + stage.width() / 2, pos[1]*this.scale + stage.height() / 2);
            linePath.lineTo(start[0]*this.scale + stage.width() / 2, start[1]*this.scale + stage.height() / 2);
            linePath.fill("rgb("+c.r+","+c.g+","+c.b+")");
            linePath.stroke('none');
            linePath.close();
        }
        stage.resume();
    } 
    var stage = acgraph.create('infCanvas');
    window.requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        setTimeout(callback, 1000 / 60);
    };
    var infSign = new infSketch();
    draw();
    function draw() {
        window.requestAnimationFrame(draw);
        infSign.draw();
    }
    window.addEventListener('resize', function(){
        infSign.windowResized();
      }, true);
});