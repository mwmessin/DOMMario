var Item = $class(Body, {
  isItem : true,

  initialize : function ($super, options) {
    $super(options);
  },

  dispose : function ($super) {
    $super();
  }

});

Item.Mushroom = $class(Item, {

  initialize : function ($super, options) {
    $extend((options = options || {}), {
      dimension : new Vector2D(24, 42),
      acceleration : new Vector2D(1, -1),
      sprite : new Sprite({
        dimension : new Vector2D(48, 48),
        spritemap : "Images/mushroom.png"
      }),
      spriteOffset : new Vector2D(-12, 0)
    });
    $super(options);
  },

  kinematics : function () {
      var level = Game.level;
      var speed = 3;
      this.velocity.x += this.acceleration.x;
      this.velocity.y += this.acceleration.y;
      this.velocity.x = Math.max(Math.min(this.velocity.x, +speed), -speed);
      this.velocity.y = Math.max(this.velocity.y, -15);
      if (Math.abs(this.velocity.x) < .1 ) this.velocity.x = 0;
      if (! this.born) this.velocity.x = 0;

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
          this.velocity.x = -this.velocity.x;
          this.acceleration.x = -this.acceleration.x;
        }
      } else if (newX < this.position.x) {
        var wallTop = level.xyBlock({x : newLeft, y : top});
        var wallBottom = level.xyBlock({x : newLeft, y : bottom});
        if ((wallTop && wallTop.solid) || (wallBottom && wallBottom.solid)) {
          newX = this.position.x;
          this.velocity.x = -this.velocity.x;
          this.acceleration.x = -this.acceleration.x;
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
          newY = ground.position.y + ground.dimension.y;
          this.velocity.y = 0;
        }
      }

      if (bottom < -.5*this.dimension.y) $fork(this.dispose.bind(this)); //Fall out of screen
      this.updatePosition(new Vector2D(newX, newY));
  },

  collide : function (other) {
    if (! other.isHero) return;
    other.takeHealing(1);
    $fork(Game.level.removeItem.bind(Game.level).curry(this));
  },

  animate : function () {
    var animation;
    if (this.born) animation = this.standPose;
    else animation = this.birthAnimation;
    animation.call(this);
  },
  standPose : function () {
    this.frame = 0;
    this.sprite.setFrame(3, 0);
  },
  birthAnimation : function () {
    var frames = 4;
    this.frame = (this.frame + 1)%frames;
    this.sprite.setFrame(this.frame, 0);
    if (this.frame == frames-1) this.born = true;
  },

  toString : function () {
    return "[object Item.Mushroom]";
  }

});

Item.Fireflower = $class(Item, {

  initialize : function ($super, options) {
    $extend((options = options || {}), {
      dimension : new Vector2D(24, 42),
      sprite : new Sprite({
        dimension : new Vector2D(48, 48),
        spritemap : "Images/fireflower.png"
      }),
      spriteOffset : new Vector2D(-12, 0)
    });
    $super(options);
  },

  kinematics : function () {
  },

  collide : function (other) {
    if (! other.isHero) return;
    other.powerup = Hero.POWERUP_FIREFLOWER;
    $fork(Game.level.removeItem.bind(Game.level).curry(this));
  },

  animate : function () {
    var animation;
    if (this.born) animation = this.standAnimation;
    else animation = this.birthAnimation;
    animation.call(this);
  },
  standAnimation : function () {
    var slow = 2;
    var frames = 4;
    var offset = 3;
    this.frame = (this.frame + 1)%(slow*frames);
    var frame = this.frame/slow|0;
    this.sprite.setFrame(offset + frame, 0);
  },
  birthAnimation : function () {
    var frames = 4;
    this.frame = (this.frame + 1)%frames;
    this.sprite.setFrame(this.frame, 0);
    if (this.frame == frames-1) this.born = true;
  },

  toString : function () {
    return "[object Item.Fireflower]";
  }

});

Item.Oneup = $class(Item, {

  initialize : function ($super, options) {
    $extend((options = options || {}), {
      dimension : new Vector2D(24, 42),
      acceleration : new Vector2D(1, -1),
      sprite : new Sprite({
        dimension : new Vector2D(48, 48),
        spritemap : "Images/1up.png"
      }),
      spriteOffset : new Vector2D(-12, 0)
    });
    $super(options);
  },

  kinematics : Item.Mushroom.prototype.kinematics,

  animate : function () {
    var animation;
    if (this.born) animation = this.standPose;
    else animation = this.birthAnimation;
    animation.call(this);
  },
  standPose : function () {
    this.frame = 0;
    this.sprite.setFrame(3, 0);
  },
  birthAnimation : function () {
    var frames = 4;
    this.frame = (this.frame + 1)%frames;
    this.sprite.setFrame(this.frame, 0);
    if (this.frame == frames-1) this.born = true;
  },

  toString : function () {
    return "[object Item.Oneup]";
  }

});
