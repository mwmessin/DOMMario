var Block = $class(Sprite, {

  initialize : function ($super, options) {
    options.dimension = Block.DIMENSION;
    $super(options);
    this.solid = options.pathable || true;
  },

  toString : function () {
    return "[object Block]";
  },

  updatePosition : function () {
    this.updatePositionStyle();
  }

});

$extend(Block, {
  DIMENSION : new Vector2D(32, 32),

  observe : function (block, eventName, handler) {
    block.observe("Block:"+eventName, handler);
  },

  fire : function (block, eventName, memo) {
    block.fire("Block:"+eventName, memo);
  },

  stopObserving : function (block, eventName, handler) {
    block.stopObserving("Block:"+eventName, handler);
  }
});

Block.Box = $class(Block, {

  initialize : function ($super) {
    $super({
      spritemap : "Images/box.png"
    });
  }

});

Block.Dirt = $class(Block, {

  initialize : function ($super) {
    $super({
      spritemap : "Images/dirt.png"
    });
  }

});
Block.DirtLeftWall = $class(Block, {

  initialize : function ($super) {
    $super({
      spritemap : "Images/dirtLeftWall.png"
    });
  }

});
Block.DirtRightWall = $class(Block, {

  initialize : function ($super) {
    $super({
      spritemap : "Images/dirtRightWall.png"
    });
  }

});

Block.DirtToGrass = $class(Block, {

  initialize : function ($super) {
    $super({
      spritemap : "Images/dirtToGrass.png"
    });
  }

});
Block.GrassToDirt = $class(Block, {

  initialize : function ($super) {
    $super({
      spritemap : "Images/grassToDirt.png"
    });
  }

});

Block.Grass = $class(Block, {

  initialize : function ($super) {
    $super({
      spritemap : "Images/grass.png"
    });
  }

});
Block.GrassRightLip = $class(Block, {

  initialize : function ($super) {
    $super({
      spritemap : "Images/grassRightLip.png"
    });
  }

});
Block.GrassLeftLip = $class(Block, {

  initialize : function ($super) {
    $super({
      spritemap : "Images/grassLeftLip.png"
    });
  }

});

Block.Wood = $class(Block, {

  initialize : function ($super) {
    $super({
      spritemap : "Images/wood.png"
    });
  }

});

Block.Brick = $class(Block, {

  initialize : function ($super) {
    $super({
      spritemap : "Images/brick.png"
    });
  },

  onBreak : function () {
    new Projectile.Blockwave({
      position : new Vector2D(this.position.x, this.position.y + this.dimension.y)
    });
    new SpecialEffect.BrickBreakage({
      center : this.getCenter()
    });
    Game.level.removeBlock(this);
  }

});

Block.Prizebox = $class(Block, {

  initialize : function ($super) {
    $super({
      spritemap : "Images/prizebox.png"
    });
    Animation.register(this);
  },

  onBreak : function () {
    new SpecialEffect.BrickBreakage({
      center : this.getCenter()
    });
    Game.level.replaceBlock(this, Block.Box);
  },

  animate : function () {
    var slow = 2;
    var frames = 4;
    this.frame = (this.frame+1)%(slow*frames);
    var frame = this.frame/slow|0;
    this.setFrame(frame, 0);
  },

  dispose : function ($super) {
    Animation.unregister(this);
    $super();
  }

});

Block.Mushroombox = $class(Block.Prizebox, {

  onBreak : function () {
    Game.level.newItem(Item.Mushroom, Vector2D.plus(this.position, {x : 4, y : 32}));
    Game.level.replaceBlock(this, Block.Box);
  }

});

Block.Fireflowerbox = $class(Block.Prizebox, {

  onBreak : function () {
    Game.level.newItem(Item.Fireflower, Vector2D.plus(this.position, {x : 4, y : 32}));
    Game.level.replaceBlock(this, Block.Box);
  }

});

Block.Oneupbox = $class(Block.Prizebox, {

  onBreak : function () {
    Game.level.newItem(Item.Oneup, Vector2D.plus(this.position, {x : 4, y : 32}));
    Game.level.replaceBlock(this, Block.Box);
  }

});