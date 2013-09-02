
var $class = Class.create;

var $extend = Object.extend;

$extend(Function.prototype, {

	isFunction: true

});

$extend(Number.prototype, {

	isNumber: true

});

$extend(String.prototype, {

	isString: true

});

$extend(Array.prototype, {

	isArray: true,

	remove: function (object) {
		var i = this.indexOf(object)
		if (i > -1) this.splice(i, 1);
	}

});

$extend(Math, {

	clamp: function (min, val, max) {
		return Math.max(min, Math.min(max, val));
	}

});

var $clone = Object.clone;

var $copy = function $copy(object) {
	if (object == null) {
		return null;
	} else if (object.isFunction || object.isNumber || object.isString) {
		return object;
	} else if (object.isArray) {
		var copy = [];
		for (var i = object.length - 1; i >= 0; --i) {
			copy[i] = $copy(object[i]);
		}
		return copy;
	} else {
		var copy = {};
		for (var p in object) {
			copy[p] = $copy(object[p]);
		}
		return copy;
	}
};

var $fork = function (callback) { setTimeout(callback, 0) };

var $time = Date.now || function () { return (new Date()).getTime(); };

var $body = $(document.body);

var Console = {

	initialize: function () {
		var element = this.element = new Element("div");
		element.setStyle({
			position: "absolute",
			left: "0",
			bottom: "0",
			width: "100%",
			height: "100%"
		});
		$body.setStyle({margin: "0", overflow: "hidden"});
		$body.appendChild(element);
	},
	
	getCamera: function () {
		var style = Console.element.style;
		var positionX = parseInt(style.left);
		var positionY = parseInt(style.bottom);
		var dimensionX = Console.element.getWidth();
		var dimensionY = Console.element.getHeight();
		return {
			position: new Vector2D(positionX, positionY),
			dimension: new Vector2D(dimensionX, dimensionY)
		};
	},
	
	setCamera: function (camera) {
		var style = Console.element.style;
		style.left = (camera.position.x | 0) + "px";
		style.bottom = (camera.position.y | 0) + "px";
	}

};

var Debug = {

	initialize: function () {
		var element = this.element = new Element("div");
		element.setStyle({
			position: "fixed",
			width: "100%",
			zIndex: "420",
			visibility: "hidden"
		});
		
		var back = this.back = new Element("div");
		back.setStyle({
			position: "absolute",
			zIndex: "-1",
			width: "100%",
			height: "100%",
			background: "black",
			opacity: 0.50
		});
		element.appendChild(back);
		
		var control = this.control = new Element("div");
		control.setStyle({
			background: "green",
			margin: "20px 20px 0px 20px",
			padding: "2px",
			color: "black",
			height: "20px"
		});
		control.appendChild(document.createTextNode("Debug"));
		element.appendChild(control);
		
		var content = this.content = new Element("div");
		content.setStyle({
		  border: "1px solid green",
		  margin: "0px 20px 20px 20px",
		  color: "green",
		  height: "400px",
		  overflow: "hidden"
		});
		element.appendChild(content);
		
		Console.element.appendChild(element);
	},
	
	write: function (object) {
		this.element.show();
		object = object || "";
		var txt = document.createTextNode(object.toString());
		if (Debug.writes) {
			Debug.writes.last().setStyle({color: "green"});
			if (Debug.writes.length > 19) {
				Debug.content.removeChild(Debug.writes.first());
				Debug.writes.remove(Debug.writes.first());
			}
		} else Debug.writes = [];
		var line = new Element("div")
		line.setStyle({color: "lime"})
		line.appendChild(txt);
		Debug.writes.push(line);
		Debug.content.appendChild(line);
	},

	watch: function (label, object, property) {
		this.element.show();
		if (! this.watched) {
			this.watched = [];
			this.watchUpdate();
		}
		this.watched.push({label: label, object: object, property: property});
	},

	watchUpdate: function () {
		setTimeout(this.watchUpdate.bind(this), 500);
		for (var i = 0, l = this.watched.length; i < l; ++i) {
			var watchData = this.watched[i];
			this.write(watchData.label + ": "+ watchData.object[watchData.property]);
		}
	},

	assert: function (bool) {
		if (! bool) this.write('assert failed!');
	}
	
};
