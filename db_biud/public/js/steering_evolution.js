var mr = 0.01;
var debug;
function Vehicle(x, y, sketch, dna) {
    this.sketch = sketch;
  this.acceleration = sketch.createVector(0, 0);
  this.velocity = sketch.createVector(0, -2);
  this.position = sketch.createVector(x, y);
  this.r = 4;
  this.maxspeed = 5;
  this.maxforce = 0.5;

  this.health = 1;

  this.dna = [];
  if (dna === undefined) {
    // Food weight
    this.dna[0] = sketch.random(-2, 2);
    // Poison weight
    this.dna[1] = sketch.random(-2, 2);
    // Food perception
    this.dna[2] = sketch.random(0, 100);
    // Poision Percepton
    this.dna[3] = sketch.random(0, 100);
  } else {
    // Mutation
    this.dna[0] = dna[0];
    if (sketch.random(1) < mr) {
      this.dna[0] += sketch.random(-0.1, 0.1);
    }
    this.dna[1] = dna[1];
    if (sketch.random(1) < mr) {
      this.dna[1] += sketch.random(-0.1, 0.1);
    }
    this.dna[2] = dna[2];
    if (sketch.random(1) < mr) {
      this.dna[2] += sketch.random(-10, 10);
    }
    this.dna[3] = dna[3];
    if (sketch.random(1) < mr) {
      this.dna[3] += sketch.random(-10, 10);
    }
  }

  // Method to update location
  this.update = function() {

    this.health -= 0.005;

    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  this.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  this.behaviors = function(good, bad) {
    var steerG = this.eat(good, 0.2, this.dna[2]);
    var steerB = this.eat(bad, -1, this.dna[3]);

    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    this.applyForce(steerB);
  }

  this.clone = function() {
    if (sketch.random(1) < 0.002) {
      return new Vehicle(this.position.x, this.position.y, this.sketch, this.dna);
    } else {
      return null;
    }
  }

  this.eat = function(list, nutrition, perception) {
    var record = Infinity;
    var closest = null;
    for (var i = list.length - 1; i >= 0; i--) {
      var d = this.position.dist(list[i]);

      if (d < this.maxspeed) {
        list.splice(i, 1);
        this.health += nutrition;
      } else {
        if (d < record && d < perception) {
          record = d;
          closest = list[i];
        }
      }
    }

    // This is the moment of eating!

    if (closest != null) {
      return this.seek(closest);
    }

    return sketch.createVector(0, 0);
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  this.seek = function(target) {

    var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    return steer;
    //this.applyForce(steer);
  }

  this.dead = function() {
    return (this.health < 0)
  }

  this.display = function() {
    // Draw a triangle rotated in the direction of velocity
    var angle = this.velocity.heading() + this.sketch.PI / 2;

    sketch.push();
    sketch.translate(this.position.x, this.position.y);
    sketch.rotate(angle);


    if (debug.checked()) {
        sketch.strokeWeight(3);
        sketch.stroke(0, 255, 0);
        sketch.noFill();
        sketch.line(0, 0, 0, -this.dna[0] * 25);
        sketch.strokeWeight(2);
        sketch.ellipse(0, 0, this.dna[2] * 2);
        sketch.stroke(255, 0, 0);
        sketch.line(0, 0, 0, -this.dna[1] * 25);
        sketch.ellipse(0, 0, this.dna[3] * 2);
    }

    var gr = sketch.color(0, 255, 0);
    var rd = sketch.color(255, 0, 0);
    var col = sketch.lerpColor(rd, gr, this.health);

    sketch.fill(col);
    sketch.stroke(col);
    sketch.strokeWeight(1);
    sketch.beginShape();
    sketch.vertex(0, -this.r * 2);
    sketch.vertex(-this.r, this.r * 2);
    sketch.vertex(this.r, this.r * 2);
    sketch.endShape(sketch.CLOSE);

    sketch.pop();
  }


  this.boundaries = function() {
    var d = 25;

    var desired = null;

    if (this.position.x < d) {
      desired = sketch.createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > sketch.width - d) {
      desired = sketch.createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = sketch.createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > sketch.height - d) {
      desired = sketch.createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }
}
//__________________________
var vehicleSketch = function(sketch){
    var vehicles = [];
    var food = [];
    var poison = [];
    
    



    sketch.windowResized = function(){
        sketch.resizeCanvas($( "#vehicleCanvas" ).width(), $(  "#vehicleCanvas" ).height());
      }
    sketch.setup = function() {
        var myCanvas = sketch.createCanvas($( "#vehicleCanvas" ).width(), $(  "#vehicleCanvas" ).height());
        myCanvas.parent('vehicleCanvas');
        for (var i = 0; i < 50; i++) {
            var x = sketch.random(sketch.width);
            var y = sketch.random(sketch.height);
            vehicles[i] = new Vehicle(x, y, sketch);
        }

        for (var i = 0; i < 40; i++) {
            var x = sketch.random(sketch.width);
            var y = sketch.random(sketch.height);
            food.push(sketch.createVector(x, y));
        }

        for (var i = 0; i < 20; i++) {
            var x = sketch.random(sketch.width);
            var y = sketch.random(sketch.height);
            poison.push(sketch.createVector(x, y));
        }

        debug = sketch.createCheckbox("Debug");
    }

    sketch.mouseDragged = function() {
    vehicles.push(new Vehicle(sketch.mouseX, sketch.mouseY, sketch));
    }

    sketch.draw = function() {
        sketch.background(51);

    if (sketch.random(1) < 0.1) {
        var x = sketch.random(sketch.width);
        var y = sketch.random(sketch.height);
        food.push(sketch.createVector(x, y));
    }

    if (sketch.random(1) < 0.01) {
        var x = sketch.random(sketch.width);
        var y = sketch.random(sketch.height);
        poison.push(sketch.createVector(x, y));
    }


    for (var i = 0; i < food.length; i++) {
        sketch.fill(0, 255, 0);
        sketch.noStroke();
        sketch.ellipse(food[i].x, food[i].y, 4, 4);
    }

    for (var i = 0; i < poison.length; i++) {
        sketch.fill(255, 0, 0);
        sketch.noStroke();
        sketch.ellipse(poison[i].x, poison[i].y, 4, 4);
    }

    for (var i = vehicles.length - 1; i >= 0; i--) {
        vehicles[i].boundaries();
        vehicles[i].behaviors(food, poison);
        vehicles[i].update();
        vehicles[i].display();

        var newVehicle = vehicles[i].clone();
        if (newVehicle != null) {
        vehicles.push(newVehicle);
        }

        if (vehicles[i].dead()) {
        var x = vehicles[i].position.x;
        var y = vehicles[i].position.y;
        food.push(sketch.createVector(x, y));
        vehicles.splice(i, 1);
        }

    }
    }
};