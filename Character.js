var Character = $class(Body, {

  initialize : function ($super, options) {
    $extend((options = options || {}), {
      acceleration : $clone(Physics.GRAVITY)
    });
    $super(options);
    this.orientation = options.orientation || new Vector2D(1, 0);
    this.maxLife = options.maxLife || 2;
    this.life = options.life || 1;

  },

  dispose : function ($super) {

    $super();
  },

  toString : function () {
    return "[object Character]";
  },

  stop : function () {
    this.velocity.x = 0;
    this.acceleration.x = 0;
  },

  goRight : function () {
    this.orientation.x = 1;
    this.acceleration.x = 1;
  },

  goLeft : function () {
    this.orientation.x = -1;
    this.acceleration.x = -1;
  },

  jump : function () {
    this.velocity.y = this.ducking ? 10 : 15;
    this.falling = true;
    this.jumping = true;
  },

  duck : function () {
    this.ducking = true;
    this.dimension.y = 24;
  },

  unduck : function () {
    this.ducking = false;
    this.dimension.y = 42;
  },

  takeDamage : function (damage) {
    this.life -= damage;
    if (this.life <= 0) this.die();
  },

  takeHealing : function (healing) {
    this.life += healing;
    if (this.life > this.maxLife) this.life = this.maxLife;
  },

  die : function () {
    this.dead = true;
    this.frame = 0;
  }

});
