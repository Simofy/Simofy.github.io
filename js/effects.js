

function rotate_p(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return { x: nx, y: ny };
}
class wiggle {
    constructor(sketch, x, y, w, h, theta, period, dir, scale, c, speed) {
        this.sketch = sketch;
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.xspacing = 30;    // Distance between each horizontal location
        this.w = w;
        this.h = h;
        this.c = c;
        this.scale = scale;
        this.theta = theta;      // Start angle at 0
        this.period = period;   // How many pixels before the wave repeats
        this.dir = dir;

        this.amplitude = h / 2; // Height of wave
        this.dx = ((sketch.TWO_PI * 3) / this.period) * this.xspacing;
        this.yvalues = new Array(sketch.floor(w / this.xspacing));

    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    calcWave() {
        // Increment theta (try different values for 
        // 'angular velocity' here)
        this.theta += this.speed;

        // For every x value, calculate a y value with sine function
        var x = this.theta;
        for (var i = 0; i < this.yvalues.length; i++) {
            this.yvalues[i] = this.sketch.sin(x) * this.amplitude;
            x += this.dx;
        }
    }
    getAngle() {
        return this.dir;
    }
    getPosition() {
        return { x: this.x, y: this.y };
    }
    renderWave() {
        let sketch = this.sketch;

        sketch.push();
        sketch.stroke(255);

        sketch.noFill();

        sketch.translate(this.x, this.y);
        if (this.dir)
            sketch.rotate(sketch.PI)
        let offset_m = this.h / 2;


        let hyp = Math.sqrt((this.h / 2) * (this.h / 2) + this.w * this.w);

        let cos_ = Math.acos((this.h / 2) / hyp);
        cos_ = cos_ * (180 / Math.PI);
        let angle_ = 90 - cos_;


        let main_body = new Array(this.yvalues.length * 2);
        for (let x = 0; x < this.yvalues.length; x++) {

            let x_ = x * this.xspacing;
            let y_ = this.h / 2 + this.yvalues[x] * sketch.map(x, 0, this.yvalues.length - 1, 0, 0.9);

            let tranf_p_0 = rotate_p(0, 0, x_, y_, -angle_);
            let tranf_p_1 = rotate_p(0, 0, x_, y_, angle_);
            main_body[x * 2] = { x: tranf_p_0.x, y: tranf_p_0.y - offset_m };
            main_body[x * 2 + 1] = { x: tranf_p_1.x, y: tranf_p_1.y + offset_m };


        }
        sketch.fill(this.c);
        sketch.stroke(this.c);
        sketch.beginShape(sketch.TRIANGLE_STRIP);
        main_body.pop();
        main_body.forEach(point => {
            sketch.vertex(point.x, point.y);
        });
        sketch.endShape();
        sketch.pop();

    }
}

var background_game = function (sketch) {

    let to_play_with_bounds = document.getElementById("prep_day_intro_text").getBoundingClientRect();
    sketch.windowResized = function () {
        to_play_with_bounds = document.getElementById("prep_day_intro_text").getBoundingClientRect();
        sketch.resizeCanvas(parent.width(), parent.height());
        tree.forEach(e => {
            if (e.getAngle() == 1) {
                e.setPosition(to_play_with_bounds.left + 5, e.getPosition().y);
            } else
                e.setPosition(to_play_with_bounds.right - 5, e.getPosition().y);
        });

    }


    var canvas;
    let parent = $("#backgroundSketch");

    let leaf;
    let tree = [];
    sketch.setup = function () {

        canvas = sketch.createCanvas(parent.width(), parent.height());
        sketch.frameRate(10)
        let color = 0;
        canvas.parent("backgroundSketch");
        //constructor(sketch, x, y, w, h , theta, period, dir, scale, c)
        //leaf = new wiggle(sketch,sketch.width/2,sketch.height/2,200,50,0, 0, 1000, 0, 1, 0);

        for (let i = 0; i < parent.height() + 100; i += 50) {
            tree.push(new wiggle(sketch, to_play_with_bounds.left + 5, i, 100 + sketch.random(30), 20 + sketch.random(5), sketch.random(0, 50), sketch.random(500, 1000), 1, 1, color, sketch.random(0.03, 0.08)));
        }
        for (let i = 0; i < parent.height() + 100; i += 50) {
            tree.push(new wiggle(sketch, to_play_with_bounds.right - 5, i, 100 + sketch.random(30), 20 + sketch.random(5), sketch.random(0, 50), sketch.random(500, 1000), 0, 0, color, sketch.random(0.03, 0.08)));
        }
        sketch.background(0, 85, 0);

    }
    sketch.draw = function () {
        sketch.background(255,192, 203);
        //sketch.noStroke();
        tree.forEach(leaf => {
            leaf.calcWave();
            leaf.renderWave();

        });
    }
};
