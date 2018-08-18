$( document ).ready(function() {
   $("#intro-text > h2").css('opacity',1).lettering('words').children("span").lettering().children("span").lettering(); 
 
  function rotateImg() {
     var tl = new TimelineMax({repeat:-1}),
         img = $(".book");
          
     tl.to(img, 4, {rotationY:"360deg"});
           return tl;
   }

  var master = new TimelineMax();
master
.add(rotateImg)
  
 
});

//pixi
const NumberUtils = {

  map( num, min1, max1, min2, max2 ) {

    let num1 = ( num - min1 ) / ( max1 - min1 )
    let num2 = ( num1 * ( max2 - min2 ) ) + min2

    return num2;

  },

  randomRange(min, max) {
    return min + Math.random() * (max - min);
  },

  randomRangeInt(min, max) {
    return Math.floor(min + Math.random() * (max - min));
  }

};

class Scene {

  /**
   * @constructor
   */
  constructor() {

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer = new PIXI.WebGLRenderer( this.width, this.height, { antialias: true } );
    this.renderer.backgroundColor = 0x101010;

    this.stage = new PIXI.Container();
  }

  /**
   * Add a child to the stage
   *
   * @param {Obj} child - a PIXI object
   */
  addChild( child ) {

    this.stage.addChild( child )
  }

  /**
   * Remove a child from the stage
   *
   * @param {Obj} child - a PIXI object
   */
  removeChild( child ) {

    this.stage.removeChild( child )
  }

  /**
   * Renders/Draw the scene
   */
  render() {

    this.renderer.render( this.stage );
  }

  /**
   * Resize the scene according to screen size
   *
   * @param {Number} newWidth
   * @param {Number} newHeight
   */
  resize( newWidth, newHeight ) {

    this.renderer.resize( newWidth, newHeight )
  }

}

class Particle extends PIXI.Sprite {

  constructor(options) {
    super();
    this.x = NumberUtils.randomRange(options.x - 900, options.x);
    this.y = NumberUtils.randomRange(options.y - 600, options.y);
    this.life = NumberUtils.randomRange(3000,6000);
    this.isDead = false;


    this.velocity = {
      x: options.velocity.x,
      y: options.velocity.y
    };

    this.tint = Math.random() * 0xFFFFFF;this.rotation =  Math.random * 100;
    this.blendMode = PIXI.BLEND_MODES.ADD;
    this.scale.set(1 + Math.random() * 0.5);

    this.texture = PIXI.Texture.fromImage("https://lab.hengpatrick.fr/codevember-assets/cloud700.png");

  }

  reset(options) {
      this.baseLife = NumberUtils.randomRange(1000, 3000);
      this.life = this.baseLife;
      this.isDead = false;

      this.scaleVal = 0;

      this.angle = NumberUtils.randomRange(-Math.PI, Math.PI);
      this.x = NumberUtils.randomRange(options.x - 900, options.x);
      this.y = NumberUtils.randomRange(options.y - 600, options.y);


      this.velocity = {
          x: options.velocity.x,
          y: options.velocity.y
      };
  }

  update(dt) {

      if(this.life < 0.2) {
        this.isDead = true;
        return;
      }

      this.life -= dt;
      this.x += this.velocity.x;
      this.y += this.velocity.y;

  }

}

class Emitter {
  constructor(scene) {this.scene = scene;
    this.angle = 0;
    this.particles = [];
    this.particlesNumber = 40;
    this.poolIndex = 0;
    this.pool = [];
    
    this.populate(Particle, 1000);
    this.throw(this.particlesNumber);
  }

  populate(classEl, poolLength) {
      for (var i = 0; i < poolLength; i++) {
          const options = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            velocity: {
              x: NumberUtils.randomRange(-3, 3),
              y: NumberUtils.randomRange(-3, 3)
            }
          }
          const p = new classEl(options);
          this.pool.push(p);
      };
  }

  takeFromPool() {

      if (this.poolIndex >= this.pool.length - 1) {
          this.poolIndex = 0;
      } else {
          this.poolIndex++;
      }

      return this.pool[this.poolIndex];
  }
    
  throw(number) {
    for (let i = 0; i < number; i++) {

      const options = {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          velocity: {
            x: NumberUtils.randomRange(-3, 3),
            y: NumberUtils.randomRange(-3, 3)
          }
        }

      const p = this.takeFromPool();

      this.particles.push(p);

      this.scene.addChild(p);
    }
  }

  update(dt) {
    this.angle += 0.05;

    for (let i = 0; i < this.particles.length; i++) {
      if(this.particles[i].isDead) {

        const options = {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          velocity: {
            x: NumberUtils.randomRange(-3, 3),
            y: NumberUtils.randomRange(-3, 3)
          }
        }

        this.scene.removeChild(this.particles[i]);
        this.particles[i] = this.takeFromPool();
        this.particles[i].reset(options);
        this.scene.addChild(this.particles[i]);

      } else {
        this.particles[i].update(dt);
      }

    }
  }
}

class App {

  constructor() {

    this.DELTA_TIME = 0;
    this.LAST_TIME = Date.now();

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.scene = new Scene();

    let root = document.body.querySelector('.app');
    root.appendChild(this.scene.renderer.view);

    this.emmiter = new Emitter(this.scene);

    this.addListeners();
  }

  /**
   * addListeners
   */
  addListeners() {

    window.addEventListener('resize', this.onResize.bind(this));
    TweenMax.ticker.addEventListener('tick', this.update.bind(this));
  }

  /**
   * update
   * - Triggered on every TweenMax tick
   */
  update() {

    this.DELTA_TIME = Date.now() - this.LAST_TIME;
    this.LAST_TIME = Date.now();

    this.emmiter.update(this.DELTA_TIME);
    this.scene.render();
  }

  /**
   * onResize
   * - Triggered when window is resized
   * @param  {obj} evt
   */
  onResize( evt ) {

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.scene.resize(this.width, this.height);
  }
}

const app = new App();
var container = $("#demo"),
    _sentenceEndExp = /(\.|\?|!)$/g; //regular expression to sense punctuation that indicates the end of a sentence so that we can adjust timing accordingly

function machineGun(text) {
  var words = text.split(" "),
      tl = new TimelineMax({delay:0.6, repeat:-1, repeatDelay:2}),
      wordCount = words.length,
      time = 0,
      word, element, duration, isSentenceEnd, i;
  
  for(i = 0; i < wordCount; i++){
    word = words[i];
    isSentenceEnd = _sentenceEndExp.test(word);
    element = $("<h3>" + word + "</h3>").appendTo(container);
    duration = Math.max(0.5, word.length * 0.08); //longer words take longer to read, so adjust timing. Minimum of 0.5 seconds.
    if (isSentenceEnd) {
      duration += 0.6; //if it's the last word in a sentence, drag out the timing a bit for a dramatic pause.
    }
    //set opacity and scale to 0 initially. We set z to 0.01 just to kick in 3D rendering in the browser which makes things render a bit more smoothly.
    TweenLite.set(element, {autoAlpha:0, scale:0, z:0.01});
    //the SlowMo ease is like an easeOutIn but it's configurable in terms of strength and how long the slope is linear. See https://www.greensock.com/v12/#slowmo and https://api.greensock.com/js/com/greensock/easing/SlowMo.html
    tl.to(element, duration, {scale:1.2,  ease:SlowMo.ease.config(0.25, 0.9)}, time)
      //notice the 3rd parameter of the SlowMo config is true in the following tween - that causes it to yoyo, meaning opacity (autoAlpha) will go up to 1 during the tween, and then back down to 0 at the end. 
		 	.to(element, duration, {autoAlpha:1, ease:SlowMo.ease.config(0.25, 0.9, true)}, time);
    time += duration - 0.05;
    if (isSentenceEnd) {
      time += 0.6; //at the end of a sentence, add a pause for dramatic effect.
    }
  }
}

machineGun("Compendium-Vol.2 Pidelo gratis en: colaacida@gmail.com twitter:cola_acida cola-acida.netlify.com");

/* learn more about the GreenSock Animation Platfrom (GSAP) for JS

https://www.greensock.com/gsap-js/

watch a quick video on how TimelineLite allows you to sequence animations like a pro
https://www.greensock.com/sequence-video/

*/

//Check out this enhanced version that intelligently groups words together: https://codepen.io/GreenSock/pen/sxdfe