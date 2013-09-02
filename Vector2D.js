
var Vector2D = $class({

	initialize: function () {
		switch (arguments.length) {
			case 1:
				this.x = arguments[0].x;
				this.y = arguments[0].y;
				break;
			case 2:
				this.x = arguments[0];
				this.y = arguments[1];
				break;
			default:
				this.x = 0;
				this.y = 0;
		}
	},

	toString: function () {
		return "[object Vector2D]";
	},

	length: function () {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	},

	plus: function (another) {
		this.x += another.x;
		this.y += another.y;
		return this;
	},

	minus: function (another) {
		this.x -= another.x;
		this.y -= another.y;
		return this;
	},

	distance: function (another) {
		var dx = this.x - another.x;
		var dy = this.y - another.y;
		return Math.sqrt(dx*dx + dy*dy);
	},

	scale: function (scalar) {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	},

	dot: function (another) {
		return this.x * another.x + this.y * another.y;
	},

	rotate: function (radians) {
		var sinr = Math.sin(radians);
		var cosr = Math.cos(radians);
		this.x = this.x * cosr + this.y *-sinr;
		this.y = this.x * sinr + this.y * cosr;
		return this;
	}

});

$extend(Vector2D, {

  plus: function (v1, v2) {
    return new Vector2D(v1.x + v2.x, v1.y + v2.y);
  },

  minus: function (v1, v2) {
    return new Vector2D(v1.x - v2.x, v1.y - v2.y);
  }

});
