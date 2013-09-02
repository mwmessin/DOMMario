var Projectile = $class(Body, {

	initialize : function ($super, options) {
		options = options || {};
		$extend(options, {
			acceleration : new Vector2D(Physics.GRAVITY)
		});
		$super(options);
	},

	toString : function () {
		return "[object Projectile]";
	},

	animate : function () {  },

	kinematics : function () {  },

	collision : function () {  },

	dispose : function ($super) {
		$super();
	}

});

Projectile.Coin = $class(Projectile, {

  initialize : function ($super, options) {
    $extend((options = options || {}), {
      dimension : new Vector2D(16, 16),
      sprite : new Sprite({
        dimension : new Vector2D(16, 16),
        spritemap : "Images/coin.png"
      }),
      spriteOffset : new Vector2D(0, 0)
    });
    $super(options);
  },

  animate : function () {
    var animation;
    if (this.velocity.x > 0) animation = this.rollRightAnimation;
    else animation = this.rollLeftAnimation;
    animation.call(this);
  },
  
  rollRightAnimation : function () {
    var frames = 4;
    this.frame = (this.frame + 1)%frames;
    this.sprite.setFrame(this.frame, 1);
  },
  
  rollLeftAnimation : function () {
    var frames = 4;
    this.frame = (this.frame + 1)%frames;
    this.sprite.setFrame(this.frame, 0);
  },

  kinematics : function () {
      var level = Game.level;
      this.velocity.x += this.acceleration.x;
      this.velocity.y += this.acceleration.y;
      this.velocity.y = Math.max(this.velocity.y, -15);
      if (Math.abs(this.velocity.x) < .1) this.velocity.x = 0;

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
          $fork(this.dispose.bind(this));
          return;
        }
      } else if (newX < this.position.x) {
        var wallTop = level.xyBlock({x : newLeft, y : top});
        var wallBottom = level.xyBlock({x : newLeft, y : bottom});
        if ((wallTop && wallTop.solid) || (wallBottom && wallBottom.solid)) {
          $fork(this.dispose.bind(this));
          return;
        }
      }

      if (newY > this.position.y) {
        var ceilingLeft = level.xyBlock({x : left, y : newTop});
        var ceilingRight = level.xyBlock({x : right, y : newTop});
        if ((ceilingLeft && ceilingLeft.solid) || (ceilingRight && ceilingRight.solid)) {
          $fork(this.dispose.bind(this));
          return;
        }
      } else if (newY < this.position.y) {
        var groundLeft = level.xyBlock({x : left, y : newBottom});
        var groundRight = level.xyBlock({x : right, y : newBottom});
        if ((groundLeft && groundLeft.solid) || (groundRight && groundRight.solid)) {
          var ground = groundLeft || groundRight;
          newY = ground.position.y + ground.dimension.y;
          this.velocity.y = Math.min(Math.abs(.99*this.velocity.y), 10);
          if (this.velocity.y < 2) {
            $fork(this.dispose.bind(this));
            return;
          }
        }
      }

      if (bottom < -.5*this.dimension.y) {
        // Fall out of screen
        $fork(this.dispose.bind(this)); 
        return;
      }

      this.updatePosition(new Vector2D(newX, newY));
  },

  collide : function (other) {
    if (other.dead) return;
    if (other.isBadguy) {
      other.velocity.y = 7;
      other.falling = true;
      other.takeDamage(1);
      $fork(this.dispose.bind(this));
    }
  }

});

Projectile.Fireball = $class(Projectile, {

  initialize : function ($super, options) {
    $extend((options = options || {}), {
      dimension : new Vector2D(16, 16),
      sprite : new Sprite({
        dimension : new Vector2D(16, 16),
        spritemap : "Images/fireball.png"
      }),
      spriteOffset : new Vector2D(0, 0)
    });
    $super(options);
  },

  animate : function () {
    var animation;
    if (this.velocity.x > 0) animation = this.rollRightAnimation;
    else animation = this.rollLeftAnimation;
    animation.call(this);
  },
  
  rollRightAnimation : function () {
    var frames = 4;
    this.frame = (this.frame + 1)%frames;
    this.sprite.setFrame(this.frame, 1);
  },
  
  rollLeftAnimation : function () {
    var frames = 4;
    this.frame = (this.frame + 1)%frames;
    this.sprite.setFrame(this.frame, 0);
  },

  kinematics : function () {
      var level = Game.level;
      this.velocity.x += this.acceleration.x;
      this.velocity.y += this.acceleration.y;
      this.velocity.y = Math.max(this.velocity.y, -15);
      if (Math.abs(this.velocity.x) < .1) this.velocity.x = 0;

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
			new SpecialEffect.Flare({center : this.getCenter()});
          $fork(this.dispose.bind(this));
          return;
        }
      } else if (newX < this.position.x) {
        var wallTop = level.xyBlock({x : newLeft, y : top});
        var wallBottom = level.xyBlock({x : newLeft, y : bottom});
        if ((wallTop && wallTop.solid) || (wallBottom && wallBottom.solid)) {
			new SpecialEffect.Flare({center : this.getCenter()});
          $fork(this.dispose.bind(this));
          return;
        }
      }

      if (newY > this.position.y) {
        var ceilingLeft = level.xyBlock({x : left, y : newTop});
        var ceilingRight = level.xyBlock({x : right, y : newTop});
        if ((ceilingLeft && ceilingLeft.solid) || (ceilingRight && ceilingRight.solid)) {
			new SpecialEffect.Flare({center : this.getCenter()});
          $fork(this.dispose.bind(this));
          return;
        }
      } else if (newY < this.position.y) {
        var groundLeft = level.xyBlock({x : left, y : newBottom});
        var groundRight = level.xyBlock({x : right, y : newBottom});
        if ((groundLeft && groundLeft.solid) || (groundRight && groundRight.solid)) {
          var ground = groundLeft || groundRight;
          newY = ground.position.y + ground.dimension.y;
          this.velocity.y = Math.min(Math.abs(.99*this.velocity.y), 10);
          if (this.velocity.y < 2) {
			new SpecialEffect.Flare({center : this.getCenter()});
            $fork(this.dispose.bind(this));
            return;
          }
        }
      }

      if (bottom < -.5*this.dimension.y) {
        // Fall out of screen
        $fork(this.dispose.bind(this)); 
        return;
      }

      this.updatePosition(new Vector2D(newX, newY));
  },

  collide : function (other) {
    if (other.dead) return;
    if (other.isBadguy) {
      other.velocity.y = 7;
      other.falling = true;
      other.takeDamage(1);
	  Debug.write(this.getCenter())
		new SpecialEffect.Flare({center : this.getCenter()});
      $fork(this.dispose.bind(this));
    }
  }

});

Projectile.Blockwave = $class(Projectile, {

  initialize : function ($super, options) {
    $extend((options = options || {}), {
      dimension : new Vector2D(32, 32),
      sprite : new Sprite({
        dimension : new Vector2D(32, 32),
        spritemap : "Images/NULL.png"
      }),
      spriteOffset : new Vector2D(0, 0)
    });
    $super(options);
  },

  animate : function () {  },

  kinematics : function () {
      $fork(this.dispose.bind(this));
  },

  collide : function (other) {
    if (other.dead) return;
    if (other.isBadguy) {
      other.velocity.y = 7;
      other.falling = true;
      other.takeDamage(1);
    }
    if (other.isItem) {
      other.acceleration.x = -other.acceleration.x;
      other.velocity.x = -other.velocity.x;
    }
    $fork(this.dispose.bind(this));
  }

});