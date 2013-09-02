var Badguy = $class(Character, {
  isBadguy : true,

  initialize : function ($super, options) {
    $super(options)
  },

  die : function ($super) {
    if (this.falling) this.kinematics = Physics.PROJECTILE_MOTION.bind(this);
    else this.stop();
    $super();
  },

  collide : function (other) {
  },

  kinematics : function () {
      var level = Game.level;
      var speed = 2;
      this.velocity.x += this.acceleration.x;
      this.velocity.y += this.acceleration.y;
      this.velocity.x = Math.max(Math.min(this.velocity.x, +speed), -speed);
      this.velocity.y = Math.max(this.velocity.y, -15);
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
          if (! this.dead) this.goLeft();
        }
      } else if (newX < this.position.x) {
        var wallTop = level.xyBlock({x : newLeft, y : top});
        var wallBottom = level.xyBlock({x : newLeft, y : bottom});
        if ((wallTop && wallTop.solid) || (wallBottom && wallBottom.solid)) {
          newX = this.position.x;
          this.velocity.x = 0;
          if (! this.dead) this.goRight();
        }
      }

      if (newY > this.position.y) {
        var ceilingLeft = level.xyBlock({x : left, y : newTop});
        var ceilingRight = level.xyBlock({x : right, y : newTop});
        if ((ceilingLeft && ceilingLeft.solid) || (ceilingRight && ceilingRight.solid)) {
          var ceiling = level.xyBlock({x : (left+right)/2, y : newTop}) || ceilingLeft || ceilingRight;
          newY = ceiling.position.y - this.dimension.y;
          this.velocity.y = 0;
        }
      } else if (newY < this.position.y) {
        var groundLeft = level.xyBlock({x : left, y : newBottom});
        var groundRight = level.xyBlock({x : right, y : newBottom});
        if ((groundLeft && groundLeft.solid) || (groundRight && groundRight.solid)) {
          var ground = groundLeft || groundRight;
          if (! this.dead) {
            if (! groundLeft || ! groundLeft.solid) this.goRight();
            if (! groundRight || ! groundRight.solid) this.goLeft();
          }
          newY = ground.position.y + ground.dimension.y;
          if (this.falling) {
            if (ground.land) ground.land();
            this.falling = false;
            this.jumping = false;
          }
          this.velocity.y = 0;
        } else this.falling = true;
      }

      if (bottom < -.5*this.dimension.y && ! this.dead) this.die(); //Fall out of screen
      this.updatePosition(new Vector2D(newX, newY));
  }

});

Badguy.Goomba = $class(Badguy, {

  initialize : function ($super, options) {
    $extend((options = options || {}), {
      dimension : new Vector2D(24, 32),
      sprite : new Sprite({
        dimension : new Vector2D(48, 48),
        spritemap : "Images/goomba.png"
      }),
      spriteOffset : new Vector2D(-12, 0)
    });
    $super(options);
    Math.random() > .5 ? this.goLeft() : this.goRight();
  },

  toString : function () {
    return "[object Badguy.Goomba]";
  },

  animate : function () {
    var right = this.orientation.x > 0;
    var animation;
    if (this.dead) {
      if (this.falling) animation = this.deathPopAnimation;
      else animation = right ? this.deathRightAnimation : this.deathLeftAnimation;
    } else if (this.acceleration.x != 0) {
      animation = right ? this.runRightAnimation : this.runLeftAnimation;
    } else {
      animation = right ? this.standRightPose : this.standLeftPose;
    }
    animation.call(this);
  },
  standRightPose : function () {
    this.frame = 0;
    this.sprite.setFrame(0, 0);
  },
  standLeftPose : function () {
    this.frame = 0;
    this.sprite.setFrame(0, 1);
  },
  runRightAnimation : function () {
    var frames = 6;
    this.frame = (this.frame + 1)%frames;
    this.sprite.setFrame(this.frame, 0);
  },
  runLeftAnimation : function () {
    var frames = 6;
    this.frame = (this.frame + 1)%frames;
    this.sprite.setFrame(this.frame, 1);
  },
  deathRightAnimation : function () {
    var frames = 4;
    var offset = 6;
    if (this.frame == frames) return;
    this.frame = (this.frame + 1)%frames;
    this.sprite.setFrame(this.frame + offset, 0);
    if (this.frame == frames-1) {
      setTimeout(this.dispose.bind(this), 500);
      this.frame += 1;
    }
  },
  deathLeftAnimation : function () {
    var frames = 4;
    var offset = 6;
    if (this.frame == frames) return;
    this.frame = (this.frame + 1)%frames;
    this.sprite.setFrame(this.frame + offset, 1);
    if (this.frame == frames-1) {
      setTimeout(this.dispose.bind(this), 500);
      this.frame += 1;
    }
  },
  deathPopAnimation : function () {
    var frames = 2;
    this.frame = (this.frame + 1)%frames;
    this.sprite.setFrame(this.frame, 2);
  }

});

Badguy.Koopa = $class(Badguy, {

  initialize : function ($super, options) {
    $extend((options = options || {}), {
      dimension : new Vector2D(24, 32),
      sprite : new Sprite({
        dimension : new Vector2D(48, 48),
        spritemap : "Images/koopa.png"
      }),
      spriteOffset : new Vector2D(-12, 0)
    });
    $super(options);
    Math.random() > .5 ? this.goLeft() : this.goRight();
  },

  toString : function () {
    return "[object Badguy.Koopa]";
  },

  animate : function () {
    var right = this.orientation.x > 0;
    var animation;
    if (this.dead) {
      if (this.velocity.y != 0) animation = this.deathPopAnimation;
      else animation = right ? this.deathRightAnimation : this.deathLeftAnimation;
    } else if (this.acceleration.x != 0) {
      animation = right ? this.runRightAnimation : this.runLeftAnimation;
    } else {
      animation = right ? this.standRightPose : this.standLeftPose;
    }
    animation.call(this);
  },
  standRightPose : function () {
    this.frame = 0;
    this.sprite.setFrame(0, 0);
  },
  standLeftPose : function () {
    this.frame = 0;
    this.sprite.setFrame(0, 1);
  },
  runRightAnimation : function () {
    var slow = 2;
    var frames = 4;
    this.frame = (this.frame+1)%(slow*frames);
    var frame = this.frame/slow|0;
    this.sprite.setFrame(frame, 0);
  },
  runLeftAnimation : function () {
    var slow = 2;
    var frames = 4;
    this.frame = (this.frame+1)%(slow*frames);
    var frame = this.frame/slow|0;
    this.sprite.setFrame(frame, 1);
  },
  deathRightAnimation : function () {
    var frames = 4;
    var offset = 6;
    if (this.frame == frames) return;
    this.frame = (this.frame + 1)%frames;
    this.sprite.setFrame(this.frame + offset, 0);
    if (this.frame == frames-1) {
      setTimeout(this.dispose.bind(this), 500);
      this.frame += 1;
    }
  },
  deathLeftAnimation : function () {
    var frames = 4;
    var offset = 6;
    if (this.frame == frames) return;
    this.frame = (this.frame + 1)%frames;
    this.sprite.setFrame(this.frame + offset, 1);
    if (this.frame == frames-1) {
      setTimeout(this.dispose.bind(this), 500);
      this.frame += 1;
    }
  },
  deathPopAnimation : function () {
    var frames = 2;
    this.frame = (this.frame + 1)%frames;
    this.sprite.setFrame(this.frame, 2);
  }

});