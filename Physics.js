var Physics = {
	GRAVITY: new Vector2D(0, -1),

	PROJECTILE_MOTION: function () {
		this.velocity.y += Physics.GRAVITY.y;
		var newX = this.position.x + this.velocity.x;
		var newY = this.position.y + this.velocity.y;
		if (this.position.y < -.5*this.dimension.y) $fork(this.dispose.bind(this)); // Fall out of screen
		else this.updatePosition(new Vector2D(newX, newY));
		this.falling = true;
	},

	objects: [],
	colliders: [],
	period: 30,

	update: function () {
		Physics.timeout = setTimeout(Physics.update, Physics.period);
		var time = $time()
		var dt = Physics.time ? time - Physics.time : 0;
		Physics.time = time;
		for (var i = Physics.objects.length - 1; i >= 0; --i) {
			var object = Physics.objects[i];
			if (object.kinematics.isFunction) object.kinematics(dt);
			if (object.collide.isFunction) Physics.colliders.push(object);
		}
		Physics.collisions();
	},

	collisions: function () {
		var colliders = Physics.colliders;
		while (colliders.length) {
			var object = colliders.pop();
			for (var i = 0, l = colliders.length; i < l; ++i) {
				var other = colliders[i];
				var objectLeft = object.position.x;
				var objectRight = objectLeft + object.dimension.x;
				var objectBottom = object.position.y;
				var objectTop = objectBottom + object.dimension.y;
				var otherLeft = other.position.x;
				var otherRight = otherLeft + other.dimension.x;
				var otherBottom = other.position.y;
				var otherTop = otherBottom + other.dimension.y;
				if (! (objectRight < otherLeft || otherRight < objectLeft) &&
					! (objectTop < otherBottom || otherTop < objectBottom)) {
					object.collide(other);
					other.collide(object);
				}
			}
		}
	},

	register: function (object) {
		Physics.objects.push(object);
		if (Physics.objects.length == 1) Physics.update();
	},

	unregister: function (object) {
		if (Physics.objects.length == 1) clearTimeout(Physics.timeout);
		Physics.objects.remove(object);
	}

};

