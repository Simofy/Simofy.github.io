$(document).ready(function(){
    //--------------------------------------------------------------------------------------------------------------
    //
    //  Utils.
    //
    //--------------------------------------------------------------------------------------------------------------
    var animate = true;
    window.infAnimationToggle = function(){
        animate = !animate;
    }
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
        this.scale = stage.width() / test;
        this.size = 40;
        this.colorArray = [];
        this.shapeArray = [];
        this.step = 0.04;
        this.time = 0.0;
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
        let start = getPos(this.time + this.step);
        let end = getPos(this.time - (this.size-1) * this.step);
        //let end = getPos(this.time);
        //let last = 
        for (var a = 1; a < this.size; a++) {
            let pos = getPos(this.time - a * this.step);
            let c = this.colorArray[(this.size-1)- a];
            let linePath = this.shapeArray[a];
            linePath.clear();
            linePath.moveTo(end[0]*this.scale + stage.width() / 2, end[1]*this.scale + stage.height() / 2);
            linePath.lineTo(pos[0]*this.scale + stage.width() / 2, pos[1]*this.scale + stage.height() / 2);
            linePath.lineTo(start[0]*this.scale + stage.width() / 2, start[1]*this.scale + stage.height() / 2);
            linePath.fill("rgb("+c.r+","+c.g+","+c.b+")");
            linePath.stroke('none');
            //end = getPos(this.time - (a) * this.step);
            //start = getPos(this.time - (a+20) * this.step );
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
        if(animate)
            infSign.draw();
    }
    // window.addEventListener('resize', function(){
    //     infSign.windowResized();
    //   }, true);
    // window.addEventListener('mousedown', function(){
    // animate = true;
    // }, true);
    // window.addEventListener('mouseup', function(){
    //     animate = false;
    //     }, true);


});