var Animation = {
	objects: [],
	period: 80,

	update: function () {
		Animation.timeout = setTimeout(Animation.update, Animation.period);
		for (var i = Animation.objects.length - 1; i >= 0; --i) {
			var object = Animation.objects[i];
			if (object.animate.isFunction) object.animate();
		}
	},

	register: function (object) {
		Animation.objects.push(object);
		object.frame = 0;
		if (Animation.objects.length == 1) Animation.update();
	},

	unregister: function (object) {
		if (Animation.objects.length == 1) clearTimeout(Animation.timeout);
		Animation.objects.remove(object);
	}

};
