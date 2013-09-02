var Body = $class({

  initialize : function (options) {
    this.acceleration = options.acceleration || new Vector2D();
    this.velocity = options.velocity || new Vector2D();
    this.position = options.position || new Vector2D();
    this.dimension = options.dimension || new Vector2D(32, 32);
    this.sprite = options.sprite || new Sprite();
    this.spriteOffset = options.spriteOffset || new Vector2D();
    this.updatePosition();
    Physics.register(this);
    Animation.register(this);
  },

  dispose : function ($super) {
    if (this.disposed) return;
    this.disposed = true;
    Physics.unregister(this);
    Animation.unregister(this);
    this.sprite.dispose();
  },

  getCenter : function () {
    return $clone(this.position).plus($clone(this.dimension).scale(.5));
  },

  updatePosition : function (position) {
    this.position = position || this.position;
    this.sprite.position = $clone(this.position).plus(this.spriteOffset);
    this.sprite.updatePositionStyle();
  }

});
