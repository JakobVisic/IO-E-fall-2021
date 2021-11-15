// Creates the letter body

function LetterTemplate(path) {
  var pointsAsString = "";
  for (var j = 0; j < path.length; j++) {
    pointsAsString += path[j].x*8 + " ";
    pointsAsString += path[j].y*8 + " ";
  }
  this.vertices = Vertices.fromPath(pointsAsString);

  this.points = path;
  this.options = {
    friction: 0.2,
    restitution: 0.5
  };
}

function Letter(world, x, y, template) {
  this.points = template.points;
  this.vertices = JSON.parse(JSON.stringify(template.vertices));
  this.body = Bodies.fromVertices(x, y, this.vertices);

  //this.body = Bodies.circle(x, y, 30, template.options);
  //this.body = Bodies.rectangle(x, y, 50, 50, template.options);
  //this.body = Bodies.trapezoid(x, y, 50, 50, 1, template.options);
  //Body.setVertices(this.body, this.vertices);

  if (this.body) {
    World.add(world, this.body);
  }

  this.show = function() {
    var pos = this.body.position;
    var angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    //rectMode(CENTER);
    stroke(1);
    fill(d3.interpolateRainbow(map(angle, 0, TWO_PI, 0, 1)));

    // uncomment to see the body shape behind the letter
    //ellipse(pos.x, pos.y, 30, 30);
    //rect(0,0, 50, 50);

    beginShape();
    translate(-25, 25);
    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i];
      vertex(
        p.x * 8,
        p.y * 8
      );
    }
    endShape(CLOSE);
    pop();
  }
}