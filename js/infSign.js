var infSketch = function(sketch){
    var d = 8;
    var n = 5;
    let scale = 200;
    let size = 25;
    let colorArray = [];
    let step = 0.06;
    let time = 0.0;
    let delay = 10;
    function getPos(t){
        let x = sketch.cos(t);
        let y = sketch.sin(t) * sketch.cos(t);
        return [x, y];
    }
    sketch.windowResized = function(){
        
        sketch.resizeCanvas($( "#infCanvas" ).width(), $(  "#infCanvas" ).height());
    }
    sketch.setup =function() {
        //x = cos t , y = sin t * cos t
        var myCanvas = sketch.createCanvas($( "#infCanvas" ).width() , $(  "#infCanvas" ).height());
        myCanvas.parent('infCanvas');
        for(let i = 0; i < size; i++) {
            let r_ = sketch.random(255);
            let g_ = sketch.random(255);
            let b_ = sketch.random(255);
            colorArray.push({r:r_, g:g_, b:b_});
        }
    }
    let randDigit = 0;

     sketch.draw = function() {
        time += step;
        sketch.background(51);
        sketch.push();
        sketch.translate(sketch.width / 2, sketch.height / 2);
        sketch.stroke(51);
        let r_ = sketch.random(255);
        let g_ = sketch.random(255);
        let b_ = sketch.random(255);
        colorArray.shift();
        colorArray.push({r:r_, g:g_, b:b_});
        
        //noFill();
        sketch.strokeWeight(1);
        let start = getPos(time);
        let end = getPos(time - (size-1) * step);
        for (var a = 0; a < size; a++) {
            let pos = getPos(time - a * step);
            let c = colorArray[(size-1)- a];
            sketch.fill(c.r,c.g,c.b);
            sketch.push();
            sketch.beginShape();
            sketch.vertex(end[0]*scale, end[1]*scale);
            sketch.vertex(pos[0]*scale, pos[1]*scale);
            sketch.vertex(start[0]*scale, start[1]*scale);
            sketch.endShape(sketch.CLOSE);
            sketch.pop();
        }
        
        sketch.pop();
        //sketch.noLoop();
        // sketch.push();
        // sketch.translate(sketch.width / 2, sketch.height / 2);
        // sketch.beginShape();
        // sketch.fill(r,g,b);
        // //noFill();
        // sketch.strokeWeight(2);
        // for (var a = 0; a < size; a++) {
        //     let pos = getPos(time - a * step);
        //     sketch.vertex(pos[1]*scale, pos[0]*scale);
        // }
        // sketch.endShape(sketch.OPEN);
        // sketch.pop();
    } 
};