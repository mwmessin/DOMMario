var Level = $class({

  initialize : function (options) {
    this.background = options.background || "black";
    this.blocksData = options.blocksData || [];
    this.badguysData = options.badguysData || [];
    this.heroData = options.heroData || { position : new Vector2D() };
    this.blocks = new Array(options.blocksData.length);
    for (var i = 0, l = options.blocksData.length; i < l; i++) {
      this.blocks[i] = new Array(options.blocksData[i].length);
    }
    this.badguys = [];
    this.items = [];
    this.hero = null;
  },

  load : function () {
    // HUD
    this.hud = new HeadupDisplay();
    this.hud.setLife(1, 2);

    // Background
    document.body.setStyle({background : this.background});

    // Blocks
    for (var i = 0, l = this.blocks.length; i < l; i++) {
      for (var j = 0, height = this.blocks[i].length; j < height; j++) {
        this.newBlock(this.blocksData[i][j], i, j);
      }
    }

    // Badguys
    for (var i = 0, l = this.badguysData.length; i < l; i++) {
      var badguyData = this.badguysData[i];
      this.newBadguy(badguyData.badguyClass, badguyData.position);
    }

    // Items

    // Hero
    this.hero = new Hero.Mario($copy(this.heroData));
  },

  unload : function () {
    // HUD
    this.hud.dispose();

    // Blocks
    for (var i = 0, l = this.blocks.length; i < l; i++) {
      for (var j = 0, height = this.blocks[i].length; j < height; j++) {
        this.removeBlock(this.blocks[i][j]);
      }
    }

    // Badguys
    while (this.badguys.length) {
      this.removeBadguy(this.badguys[0]);
    }

    // Items
    while (this.items.length) {
      this.removeItem(this.items[0]);
    }

    // Hero
    this.hero.dispose();
  },

  newBlock : function (blockClass, i, j) {
    if (! blockClass) return;
    var block = new blockClass();
    block.location = {i : i, j : j};
    block.position = new Vector2D(Block.DIMENSION.x * i, Block.DIMENSION.y * j);
    block.updatePosition();
    this.blocks[i][j] = block;
  },

  removeBlock : function (block) {
    if (! block) return;
    this.blocks[block.location.i][block.location.j] = null;
    block.location = null;
    block.dispose();
  },

  replaceBlock : function (block, blockData) {
    var location = block.location;
    block.dispose();
    this.newBlock(blockData, location.i, location.j);
  },

  xyBlock : function (options) {
    var x = options.x/Block.DIMENSION.x|0;
    var y = options.y/Block.DIMENSION.y|0;
    if (x < 0 || x >= this.blocks.length || y < 0 || y >= this.blocks[0].length) {
      return null;
    }
    return this.blocks[x][y];
  },

  newBadguy : function (badguyClass, position) {
    if (badguyClass == null) return;
    this.badguys.push(new badguyClass({ position : position }));
  },

  removeBadguy : function (badguy) {
    if (badguy == null) return;
    this.badguys.remove(badguy);
    badguy.dispose();
  },

  newItem : function (itemClass, position) {
    if (itemClass == null) return;
    this.items.push(new itemClass({ position : position }));
  },

  removeItem : function (item) {
    if (item == null) return;
    this.items.remove(item);
    item.dispose();
  }

});
