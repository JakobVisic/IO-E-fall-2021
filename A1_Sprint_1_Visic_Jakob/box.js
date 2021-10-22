function Box(x, y, w, h) {
    var options = {
        friction: 0.3,
        restitution: 0.6
    };
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    World.add(world, this.body);

    let r = random(50,255);
        let g = random(50,255);
        let b = random(50,255);

    this.show = function () {
        var pos = this.body.position;
        var angle = this.body.angle;
        
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        strokeWeight(1);
        noStroke();
        fill(r,g,b);
        rect(0, 0, this.w, this.h);
        pop();
    };

    // Delete objects to prevent sketch from lagging
    this.delete = () => {
        let pos = this.body.position;
        return (pos.y > 19000);
    }
}