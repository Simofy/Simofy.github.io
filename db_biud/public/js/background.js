class block{
  constructor(x, y, w, h, dir, angle, canvas){
    this.display = true;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.dir = dir;
    this.angle = angle;
    this.previousState = 0;
    this.rotating = this.dir == 1 ? false : true;
    this.CurrentAngle = 0;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.canvas = canvas;
  }
  setColor(r,g,b){
    this.r = r;
    this.g = g;
    this.b = b;
  }
  update(time){
    
    let canvas = this.canvas;
    if(this.rotating == true){
      let angle = canvas.HALF_PI / 10;
      let dir = this.dir % 2;
      this.CurrentAngle+=dir == 0 ? angle : -angle;
      if(this.CurrentAngle > canvas.HALF_PI || this.CurrentAngle < -canvas.HALF_PI){
        this.rotating = false;
        this.CurrentAngle = 0;
        this.angle +=dir == 0 ? canvas.HALF_PI : -canvas.HALF_PI;
      }
    }
  }
  setRotDir(dir){
    if(this.rotating == false){
      this.CurrentAngle = 0;
      this.previousState = this.dir;
      this.rotating = true;
      this.dir = dir;
    }
  }
  setPos(x,y){
    this.x = x;
    this.y = y;
  }
  getPosition(){
    return this.x, this.y;
  }
  setSize(w, h){
    this.w = w;
    this.h = h;
  }
  setAngle(angle){
    this.angle = angle;
  }
  getAngle(){
    return this.angle;
  }
  getSize(){
    return this.w,this.h;
  }
  draw(){
    if(this.display){
      let canvas = this.canvas;
      canvas.push();
      canvas.translate(this.x, this.y,this.w/2, this.w/2);
      canvas.noFill();
      canvas.stroke(0);
      canvas.strokeWeight(5);
      canvas.rotate(this.angle + this.CurrentAngle);
      let y = canvas.cos(this.angle) * this.w / 2;
      let x = canvas.sin(this.angle) * this.h / 4;
      canvas.stroke(this.r,this.g,this.b);
      canvas.arc(-this.w/2,-this.w/2, this.w, this.w, 0 , canvas.HALF_PI, canvas.OPEN );
      canvas.arc(this.w/2,this.w/2, this.w, this.w, canvas.PI, 3 * canvas.HALF_PI, canvas.OPEN );
      canvas. pop();
    }
  }
}

var backgroundSketch = function(sketch){
    var canvas;
    var grid = [];
    var widthOfBlock = 100;
    sketch.windowResized = function(){
      sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
    }
    sketch.setup = function(){
      canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
      canvas.position(0, 0);
      canvas.id('backgroundCanvas');
      let w = widthOfBlock;
      for(let x = 0; x < 50; x++){
        grid.push([]);
        for(let y = 0; y < 50; y++){
          let a = new block(x*w, y*w, w, w, sketch.random(Array(0,1)), 0, sketch);
          a.setColor(210,180,140);
          grid[x].push(a);
        }
      }
    }
//labai daug resursu reikalauja jei is zoomini ar ekranas labai didelis
    sketch.draw = function(){
          //reikia random geriau padaryti
      let rand =  sketch.random(0, 100000);
      if(rand>93000){
        let randX = parseInt(sketch.random(0, sketch.width) / widthOfBlock + 1);
        let randY = parseInt( sketch.random(0, sketch.height)/ widthOfBlock + 1);
        grid[randX][randY].setRotDir(sketch.random(Array(0,1)));
      }
      sketch.background(102, 102, 153);
      sketch.fill(255, 51, 153);
      sketch.stroke(50);
      for(let i = 0; i < sketch.width / widthOfBlock + 1; i++){
        for(let k = 0; k < sketch.height / widthOfBlock + 1; k++){
          if(i < 50 && k < 50){         
            grid[i][k].update(0);
            grid[i][k].draw(sketch);
          }
        }
      }
      sketch.noFill();
    }
};
