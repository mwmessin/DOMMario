
var Keyboard = {
	SPACE: 	32,
	LEFT: 	37,
	UP: 	38,
	RIGHT: 	39,
	DOWN: 	40,
	X: 		88,
	Z: 		90,
	F5: 	116,

	observe: function (keyCode, eventName, handler) {
		document.observe("Keyboard:" + keyCode + ":" + eventName, handler);
	},

	fire: function (keyCode, eventName) {
		document.fire("Keyboard:" + keyCode + ":" + eventName);
	},

	stopObserving: function (keyCode, eventName, handler) {
		document.stopObserving("Keyboard:" + keyCode + ":" + eventName, handler);
	},

	onKeydown: function (event) {
		var keyCode = event.keyCode;
		if (keyCode != Keyboard.F5) event.preventDefault();
		if (! Keyboard[keyCode]) {
			Keyboard[keyCode] = true;
			Keyboard.fire(keyCode, "keydown");
		}
	},

	onKeyup: function (event) {
		var keyCode = event.keyCode;
		Keyboard[keyCode] = false;
		Keyboard.fire(keyCode, "keyup");
	},

	dispose: function () {
		document.stopObserving("keydown", Keyboard._keydown);
		document.stopObserving("keyup", Keyboard._keyup);
	}

};

document.observe("keydown", Keyboard._keydown = Keyboard.onKeydown.bindAsEventListener(Keyboard));
document.observe("keyup", Keyboard._keyup = Keyboard.onKeyup.bindAsEventListener(Keyboard));
