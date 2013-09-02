var Hero = $class(Character, {
  isHero : true,

  initialize : function ($super, options) {
    $super(options);
    this.powerup = Hero.POWERUP_NONE;
    this.listen();
  },

  dispose : function ($super) {
    this.ignore();
    $super();
  },

  toString : function () {
    return "[object Hero]";
  },

  listen : function () {
    Keyboard.observe(Keyboard.RIGHT, "keydown", this.H_rightKeydown = this.onRightKeydown.bindAsEventListener(this));
    Keyboard.observe(Keyboard.LEFT, "keydown", this.H_leftKeydown = this.onLeftKeydown.bindAsEventListener(this));
    Keyboard.observe(Keyboard.DOWN, "keydown", this.H_downKeydown = this.onDownKeydown.bindAsEventListener(this));
    Keyboard.observe(Keyboard.Z, "keydown", this.H_ZKeydown = this.onZKeydown.bindAsEventListener(this));
    Keyboard.observe(Keyboard.X, "keydown", this.H_XKeydown = this.onXKeydown.bindAsEventListener(this));
    Keyboard.observe(Keyboard.SPACE, "keydown", this.H_SpaceKeydown = this.onZKeydown.bindAsEventListener(this));
    Keyboard.observe(Keyboard.RIGHT, "keyup", this.H_rightKeyup = this.onRightKeyup.bindAsEventListener(this));
    Keyboard.observe(Keyboard.LEFT, "keyup", this.H_leftKeyup = this.onLeftKeyup.bindAsEventListener(this));
    Keyboard.observe(Keyboard.DOWN, "keyup", this.H_downKeyup = this.onDownKeyup.bindAsEventListener(this));
    Keyboard.observe(Keyboard.Z, "keyup", this.H_ZKeyup = this.onZKeyup.bindAsEventListener(this));
    Keyboard.observe(Keyboard.X, "keyup", this.H_XKeyup = this.onXKeyup.bindAsEventListener(this));
    Keyboard.observe(Keyboard.SPACE, "keyup", this.H_SpaceKeyup = this.onZKeyup.bindAsEventListener(this));
  },

  ignore : function () {
    Keyboard.stopObserving(Keyboard.RIGHT, "keydown", this.H_rightKeydown);
    Keyboard.stopObserving(Keyboard.LEFT, "keydown", this.H_leftKeydown);
    Keyboard.stopObserving(Keyboard.DOWN, "keydown", this.H_downKeydown);
    Keyboard.stopObserving(Keyboard.Z, "keydown", this.H_ZKeydown);
    Keyboard.stopObserving(Keyboard.X, "keydown", this.H_XKeydown);
    Keyboard.stopObserving(Keyboard.SPACE, "keydown", this.H_SpaceKeydown);
    Keyboard.stopObserving(Keyboard.RIGHT, "keyup", this.H_rightKeyup);
    Keyboard.stopObserving(Keyboard.LEFT, "keyup", this.H_leftKeyup);
    Keyboard.stopObserving(Keyboard.DOWN, "keyup", this.H_downKeyup);
    Keyboard.stopObserving(Keyboard.Z, "keyup", this.H_ZKeyup);
    Keyboard.stopObserving(Keyboard.X, "keyup", this.H_XKeyup);
    Keyboard.stopObserving(Keyboard.SPACE, "keyup", this.H_SpaceKeyup);
  },

  onRightKeydown : function (event) {
    if (! Keyboard[Keyboard.LEFT]) {
      this.orientation.x = 1;
      if (! this.ducking || this.falling) this.goRight();
    } else this.acceleration.x = 0;
  },

  onLeftKeydown : function (event) {
    if (! Keyboard[Keyboard.RIGHT]) {
      this.orientation.x = -1;
      if (! this.ducking || this.falling) this.goLeft();
    } else this.acceleration.x = 0;
  },

  onDownKeydown : function (event) {
    this.duck();
    if (! this.falling) this.acceleration.x = 0;
  },

  onZKeydown : function (event) {
    if (! this.falling) {
      this.jump();
      if (Keyboard[Keyboard.LEFT] && ! Keyboard[Keyboard.RIGHT]) this.goLeft();
      if (Keyboard[Keyboard.RIGHT] && ! Keyboard[Keyboard.LEFT]) this.goRight();
    }
  },

  onXKeydown : function (event) {
    var right = this.orientation.x > 0;
    if (this.powerup == Hero.POWERUP_FIREFLOWER) {
      new Projectile.Fireball({
        position : right ? $copy(this.position).plus({x : 16, y : 16}) : $copy(this.position).plus({x : -16, y : 16}),
        velocity : right ? new Vector2D(7, -5) : new Vector2D(-7, -5)
      });
    }
	this.running = true;
  },

  onRightKeyup : function (event) {
    if (Keyboard[Keyboard.LEFT]) {
      this.orientation.x = -1;
      if (! this.ducking || this.falling) this.goLeft();
    }
    else this.acceleration.x = 0;
  },

  onLeftKeyup : function (event) {
    if (Keyboard[Keyboard.RIGHT]) {
      this.orientation.x = 1;
      if (! this.ducking || this.falling) this.goRight();
    }
    else this.acceleration.x = 0;
  },

  onDownKeyup : function (event) {
    this.unduck();
    if (Keyboard[Keyboard.LEFT] && ! Keyboard[Keyboard.RIGHT]) this.goLeft();
    if (Keyboard[Keyboard.RIGHT] && ! Keyboard[Keyboard.LEFT]) this.goRight();
  },

  onZKeyup : function (event) {},

  onXKeyup : function (event) {
	this.running = false;
  },

  getDrag : function () {
    var drag = .15;
    if (this.ducking) drag = .08;
    if (this.falling) drag = .10;
    return drag;
  },

  getSpeed : function () {
    var speed = 4;
    if (this.ducking) speed = 4;
    if (this.running) speed = 7;
    return speed;
  },

  phase : function () {
    if (this.phaseTimer) return;
    this.phaseTimer = setTimeout(this.phaseUpdate.bind(this), 1000);
    this.phased = true;
  },

  phaseUpdate : function () {
    this.phaseTimer = null;
    this.phased = false;
  },

  takeDamage : function (damage) {
    this.life -= damage;
    Game.level.hud.setLife(this.life, this.maxLife);
    this.powerup = Hero.POWERUP_NONE;
    if (this.life <= 0) this.die();
  },

  takeHealing : function (healing) {
    this.life += healing;
    if (this.life > this.maxLife) this.life = this.maxLife;
    Game.level.hud.setLife(this.life, this.maxLife);
  },

  die : function ($super) {
    this.ignore();
    this.acceleration.x = 0;
    this.velocity = new Vector2D(0, 7);
    setTimeout(function () { Game.level.unload(); Game.level.load(); }, 1000);
    $super();
  },

  animate : function () {
    var right = this.orientation.x > 0;
    var animation;
    if (this.dead) {
      animation = this.deathPose;
    } else if (this.ducking) {
      animation = right ? this.duckRightPose : this.duckLeftPose;
    } else if (this.jumping) {
      animation = right ? this.jumpRightPose : this.jumpLeftPose;
    } else if (this.acceleration.x != 0) {
      animation = right ? this.runRightAnimation : this.runLeftAnimation;
    } else {
      animation = right ? this.standRightPose : this.standLeftPose;
    }
    if (this.phased) {
      this.sprite.element.setStyle({opacity: 0.50});
    } else {
      this.sprite.element.setStyle({opacity: 1.00});
    }
    animation.call(this);
  },
  standRightPose : function () {
    this.frame = 0;
    this.sprite.setFrame(0, 3 * this.powerup);
  },
  standLeftPose : function () {
    this.frame = 0;
    this.sprite.setFrame(0, 1 + (3 * this.powerup));
  },
  runRightAnimation : function () {
    var frames = 3;
    this.frame = (this.frame + 1)%frames;
    this.sprite.setFrame((frames - 1) - this.frame, 3 * this.powerup);
  },
  runLeftAnimation : function () {
    var frames = 3;
    this.frame = (this.frame + 1)%frames;
    this.sprite.setFrame((frames - 1) - this.frame, 1 + (3 * this.powerup));
  },
  jumpRightPose : function () {
    this.frame = 0;
    this.sprite.setFrame(3, 3 * this.powerup);
  },
  jumpLeftPose : function () {
    this.frame = 0;
    this.sprite.setFrame(3, 1 + (3 * this.powerup));
  },
  duckRightPose : function () {
    this.frame = 0;
    this.sprite.setFrame(4, 3 * this.powerup);
  },
  duckLeftPose : function () {
    this.frame = 0;
    this.sprite.setFrame(4, 1 + (3 * this.powerup));
  },
  deathPose : function () {
    this.frame = 0;
    this.sprite.setFrame(0, 2 + (3 * this.powerup));
  },
  victoryPose : function () {
    this.frame = 0;
    this.sprite.setFrame(1, 2 + (3 * this.powerup));
  },

  kinematics : function () {
      var level = Game.level;
      var drag = this.getDrag();
      var speed = this.getSpeed();
      this.velocity.x += this.acceleration.x;
      this.velocity.y += this.acceleration.y;
      this.velocity.x = Math.clamp(-speed, this.velocity.x, speed);
      this.velocity.y = Math.max(this.velocity.y, -15);
      this.velocity.x *= 1-drag;
      if (Math.abs(this.velocity.x) < .1 ) this.velocity.x = 0;

      var newX = this.position.x + this.velocity.x;
      var newY = this.position.y + this.velocity.y;

      var left = this.position.x;
      var bottom = this.position.y;
      var right = left+this.dimension.x-1;
      var top = bottom+this.dimension.y-1;
      var newLeft = newX;
      var newBottom = newY;
      var newRight = newLeft+this.dimension.x-1;
      var newTop = newBottom+this.dimension.y-1;

      if (newX > this.position.x) {
        var wallTop = level.xyBlock({x : newRight, y : top});
        var wallBottom = level.xyBlock({x : newRight, y : bottom});
        if ((wallTop && wallTop.solid) || (wallBottom && wallBottom.solid)) {
          newX = this.position.x;
          this.velocity.x = 0;
        }
      } else if (newX < this.position.x) {
        var wallTop = level.xyBlock({x : newLeft, y : top});
        var wallBottom = level.xyBlock({x : newLeft, y : bottom});
        if ((wallTop && wallTop.solid) || (wallBottom && wallBottom.solid)) {
          newX = this.position.x;
          this.velocity.x = 0;
        }
      }

      if (newY > this.position.y) {
        var ceilingLeft = level.xyBlock({x : left, y : newTop});
        var ceilingRight = level.xyBlock({x : right, y : newTop});
        if ((ceilingLeft && ceilingLeft.solid) || (ceilingRight && ceilingRight.solid)) {
          var ceiling = level.xyBlock({x : (left+right)/2, y : newTop}) || ceilingLeft || ceilingRight;
          newY = ceiling.position.y - this.dimension.y;
          if (this.velocity.y > 5 && ceiling.onBreak) ceiling.onBreak();
          this.velocity.y = 0;
        }
      } else if (newY < this.position.y) {
        var groundLeft = level.xyBlock({x : left, y : newBottom});
        var groundRight = level.xyBlock({x : right, y : newBottom});
        if ((groundLeft && groundLeft.solid) || (groundRight && groundRight.solid)) {
          var ground = groundLeft || groundRight;
          newY = ground.position.y + ground.dimension.y;
          if (this.falling) {
            if (ground.land) ground.land();
            if (this.ducking) this.acceleration.x = 0;  
            this.falling = false;
            this.jumping = false;
          }
          this.velocity.y = 0;
        } else this.falling = true;
      }

      if (bottom < -.5*this.dimension.y && ! this.dead) this.die(); //Fall out of screen
      this.updatePosition(new Vector2D(newX, newY));

      // Update camera

      var camera = Console.getCamera();
      var cameraPosition = camera.position;
      var cameraDimension = camera.dimension;
      var boundXBuffer = .25*camera.dimension.x;
      var boundYBuffer = .25*camera.dimension.y;
      var boundLeft = -cameraPosition.x + boundXBuffer;
      var boundRight = -cameraPosition.x + cameraDimension.x - 2*boundXBuffer;
      var boundBottom = -cameraPosition.y + 2*boundYBuffer;
      var boundTop = -cameraPosition.y + cameraDimension.y - boundYBuffer;
      var updateCamera = false;
      if (newLeft < boundLeft) {
        cameraPosition.x += (boundLeft-newLeft+1)/2;
        updateCamera = true;
      }
      if (newRight > boundRight) {
        cameraPosition.x += -(newRight-boundRight+4)/2;
        updateCamera = true;
      }
      if (newBottom < boundBottom) {
        cameraPosition.y += (boundBottom-newBottom+5)/2;
        if (cameraPosition.y > 0) cameraPosition.y = 0;
        updateCamera = true;
      }
      if (newTop > boundTop) {
        cameraPosition.y += -(newTop-boundTop+5)/2;
        updateCamera = true;
      }
      if (updateCamera) Console.setCamera(camera);
  },

  collide : function (other) {
    if (this.dead || other.dead || ! other.isBadguy) return;
    if (this.velocity.y <= 0 && this.position.y > other.position.y + .3*other.dimension.y) {
      $fork(this.stomp.bind(this).curry(other));
    } else if (! this.phased) {
      this.takeDamage(1);
      if (! this.dead) this.phase();
    }
  },
  stomp : function (other) {
    this.velocity.y = 7;
    other.takeDamage(1);
  }

});

$extend(Hero, {
  POWERUP_NONE       : 0,
  POWERUP_FIREFLOWER : 1

});

Hero.Mario = $class(Hero, {

  initialize : function ($super, options) {
    $extend((options = options || {}), {
      dimension : new Vector2D(24, 42),
      sprite : new Sprite({
        dimension : new Vector2D(48, 48),
        spritemap : "Images/mario.png"
      }),
      spriteOffset : new Vector2D(-12, 0)
    });
    $super(options);
  },

  toString : function () {
    return "[object Hero.Mario]";
  }

});
