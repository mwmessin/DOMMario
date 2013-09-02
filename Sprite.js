var Sprite = $class({

	isSprite: true,

	initialize: function (options) {
		var element = this.element = new Element("div");
		this.position = options.position || new Vector2D();
		this.dimension = options.dimension || new Vector2D(32, 32);
		this.spritemap = options.spritemap || "Images/Sprite.png";
		element.setStyle({
			background: "url('" + this.spritemap + "')",
			position: "absolute",
			overflow: "hidden"
		});
		this.updatePositionStyle();
		this.updateDimensionStyle();
		Console.element.appendChild(this.element);
	},

	dispose: function () {
		Console.element.removeChild(this.element);
		this.element = null;
	},

	toString: function () {
		return "[object Sprite]";
	},

	getCenter: function () {
		return $clone(this.position).plus($clone(this.dimension).scale(.5));
	},

	updatePositionStyle: function () {
		var elementStyle = this.element.style;
		elementStyle.left = (this.position.x | 0) + "px";
		elementStyle.bottom = (this.position.y | 0) + "px";
	},

	updateDimensionStyle: function () {
		var elementStyle = this.element.style;
		elementStyle.width = (this.dimension.x | 0) + "px";
		elementStyle.height = (this.dimension.y | 0) + "px";
	},

	setFrame: function (x, y) {
		this.element.style.backgroundPosition = -this.dimension.x * x + "px " + -this.dimension.y * y + "px";
	}

});
