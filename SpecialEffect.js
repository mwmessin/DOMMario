var SpecialEffect = $class({

  initialize: function (sprite) {
    var sprite = this.sprite = new Sprite(sprite);
    sprite.element.setStyle({zIndex: 2});
    Animation.register(this);
  },

  toString : function () {
    return "[object SpecialEffect]";
  },

  dispose : function ($super) {
    Animation.unregister(this);
    this.sprite.dispose();
  }

});


$extend(SpecialEffect, {

  BrickBreakage : $class(SpecialEffect, {

    initialize : function ($super, options) {
      $extend((options = options || {}), {
        position : (options.center || new Vector2D()).minus(new Vector2D(32, 32)),
        spritemap : "Images/brickBreak.png",
        dimension : new Vector2D(64, 64)
      });
      $super(options)
    },

    animate : function () {
      var frames = 5;
      this.frame += 1;
      if (this.frame < frames) this.sprite.setFrame(this.frame, 0);
      else $fork(this.dispose.bind(this));
    }

  }),
  
  Flare : $class(SpecialEffect, {

    initialize : function ($super, options) {
      $extend((options = options || {}), {
        position : (options.center || new Vector2D()).minus(new Vector2D(16, 16)),
        spritemap : "Images/flare.png",
        dimension : new Vector2D(32, 32)
      });
      $super(options)
    },

    animate : function () {
      var frames = 5;
      this.frame += 1;
      if (this.frame < frames) this.sprite.setFrame(this.frame, 0);
      else $fork(this.dispose.bind(this));
    }

  })

});
