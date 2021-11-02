// original code taken from class

class HButton {
    constructor(posX, posY, label) {
        this.x = posX;
        this.y = posY;
        this.label = label;
        this.hover = 0;
    }

    update(lx, ly, rx, ry) {
        
        // push();
        // imageMode(CENTER);
        // scale(0.5);

        // // select image based on label, images coordinates are multiplied to account for scaling
        // if (this.label == "block7") {
        //     image(img1, this.x * 2, this.y * 2 + 275);
        // } else if (this.label == "block2") {
        //     image(img2, this.x * 2, this.y * 2 + 275);
        // } else if (this.label == "block3") {
        //     image(img3, this.x * 2, this.y * 2 + 275);
        // } else if (this.label == "block4") {
        //     image(img4, this.x * 2, this.y * 2 + 200);
        // } else if (this.label == "block5") {
        //     image(img5, this.x * 2, this.y * 2 + 275);
        // } else if (this.label == "block6") {
        //     image(img6, this.x * 2, this.y * 2 + 275);
        // }

        // pop();

        rectMode(CENTER);
        noStroke();
        fill(50, 50, 255, 10);
        rect(this.x, this.y, 50, 50);

        let ld = dist(this.x, this.y, lx, ly);
        let rd = dist(this.x, this.y, rx, ry);

        if (ld < 50 || rd < 50) {
            this.hover += 2;

            if (this.hover > 60) {
                controller = this.label;
                // console.log("it works");
                this.hover -= 6;

            }
        } else {
            if (this.hover > 0) this.hover -= 6;
            if (this.hover < 0) this.hover = 0;
        }

        fill(255, 125, 0, 100);
        rect(this.x, this.y, this.hover, 40);

        rectMode(CORNERS);
        fill(255);
        textAlign(CENTER);
        textSize(24);
        // text(this.label, this.x, this.y + 9);
    }
}

function randomLocation() {
    for (i = 0; i < 10; i++) {
        randX = random(100, windowWidth);
        randY = random(100, windowHeight);
        let interval = i + 1;
        this["btn" + i] = new HButton(randX, randY, "block" + interval);
    }
}