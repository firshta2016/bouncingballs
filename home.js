const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width = window.outerWidth;
const height = canvas.height = window.outerHeight;

/**
 * Creates an object instance of a single ball with methods to animate
 */
class Sphere {
    constructor(xStart, yStart, deltaX, deltaY, color, size, canvasContext) {
       this.x = xStart;
       this.y = yStart;
       this.deltaX = deltaX;
       this.deltaY = deltaY;
       this.color = color;
       this.size = size;
       this.ctx = canvasContext;
    }

    /**
     * Creates a sphere with a radial gradient
     */
    drawSphere() {
        // Starts rendered path on canvas
        this.ctx.beginPath();
        // Arguments to create Radial Gradient style
        const innerRadius = this.size * .15;
        const outerRadius = this.size * .95;
        const radius = this.size;
        const offsetX = this.x + 5;
        const offsetY = this.y - 10;
        // Creating style for radial gradient to create appearance of sphere
        const gradient = this.ctx.createRadialGradient(this.x, this.y, innerRadius, offsetX, offsetY, outerRadius);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(1, this.color);
        this.ctx.fillStyle = gradient;
        // Creating circle shape in path
        this.ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }
 
    /**
     * Updates the deltaX and deltaY that control the shift/direction of the position for next sphere draw
     * Updates x and y position by the determined deltas
     */
    updateSpherePosition() {
        // Moves sphere x to the right
       if ((this.x + this.size) >= width) {
          this.deltaX = -(this.deltaX);
       }
       // Moves sphere x to the left
       if ((this.x - this.size) <= 0) {
          this.deltaX = -(this.deltaX);
       }
       // Moves sphere y to the down
       if ((this.y + this.size) >= height) {
          this.deltaY = -(this.deltaY);
       }
       // Moves sphere y to the up
       if ((this.y - this.size) <= 0) {
          this.deltaY = -(this.deltaY);
       }
       /**
        * Updates the x and y position by moving it adding the x/y delta's
       */
       this.x += this.deltaX;
       this.y += this.deltaY;
    }

    random(min, max) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        return num;
    }
}
 
 /**
  * Takes a list / array of the Ball object 
  * Has method loop to iterate through the list perform the animation (draw/update/collisionDetect)
  */
 class AnimateCollectionOfSpheres {
     spheres = [];
     deltaX = 3;
     deltaY = 3;
     constructor(canvasContext) {
         this.ctx = canvasContext;
         this.animateSingleSphere = this.animateSingleSphere.bind(this);
         this.animateAllSpheres = this.animateAllSpheres.bind(this);
     }

    random(min, max) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        return num;
    }

    /**
     * Creates an instance of the sphere class and adds it to the spheres property
     */
    createPreDefinedSphere() {
        const size = 60;
        const xStartPosition =  width / 2;
        const yStartPosition = height / 2;
        const sphere = new Sphere(
            xStartPosition,
            yStartPosition,
            this.deltaX,
            this.deltaY,
            'rgb(' + this.random(0,255) + ',' + this.random(0,255) + ',' + this.random(0,255) +')',
            size,
            this.ctx,
        );
        this.spheres.push(sphere);
        return sphere;
    }

    /**
     * Accesses the spheres list and starts the animation of targeted sphere
     */
    animateSingleSphere(index) {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, width, height);
        this.spheres[0].drawSphere();
        this.spheres[0].updateSpherePosition();
        requestAnimationFrame(this.animateSingleSphere);
    }
    
    /**
     * Takes all spheres in the spheres list and begins animation for spheres
     */
    animateAllSpheres() {
         this.ctx.fillStyle = 'white';
         this.ctx.fillRect(0, 0, width, height);
        for (let i = 0; i < this.spheres.length; i++) {
          this.spheres[i].drawSphere();
          this.spheres[i].updateSpherePosition();
        }
        requestAnimationFrame(this.animateAllSpheres);
     }
}

let clickCount = 0;
let bounceSpeed = 3;

/**
 * Creating and Retrieving elements to be used in lower scope
 */
const divText = document.getElementById('update');
const img = document.createElement('img');
const button = document.getElementById('pressedBtn');
const sphereParent = document.getElementById("sphere");
button.onclick = buttonOnClickHandler;
/**
 * Create Instance of Animate Collection of Balls to create / render / animate the balls
 */
const animateSpheres = new AnimateCollectionOfSpheres(ctx);
/**
 * Handler added to the button to handle the click functionality
 * Is added to the button above
 */
function buttonOnClickHandler() {
    clickCount++;
    if(clickCount===1) {
        divText.innerHTML = 'Keep Clicking Me To Add Up To Two Balls and To Speed Up The Balls!';
    } else if(clickCount === 3) {
        button.style.color = 'purple';
    } else if(clickCount === 4) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        animateSpheres.createPreDefinedSphere();
        animateSpheres.spheres[0].drawSphere();
    } else if (clickCount === 5) {
        animateSpheres.animateSingleSphere(0);
    } else if (clickCount === 6) {
        animateSpheres.createPreDefinedSphere();
        animateSpheres.animateAllSpheres();
    } else if (clickCount > 6) {
        animateSpheres.xVelocity++;
        animateSpheres.yVelocity++;
        animateSpheres.animateAllSpheres();    
    }
};