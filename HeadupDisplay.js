var HeadupDisplay = $class({

	initialize : function () {
		var lifemeter = this.lifemeter = new Element("div");
		lifemeter.setStyle({
			position: "absolute",
			width: "128px",
			height: "128px",
			top: "5%",
			left: "5%",
			background: "url('Images/life.png')"
		});
		$body.appendChild(this.lifemeter);
	},

	dispose: function () {
		$body.removeChild(this.lifemeter);
		this.lifemeter = null;
	},

	setLife: function (life, maxLife) {
		if (life == 0) {
			this.lifemeter.setStyle({backgroundPosition: "0px 0px"});
		} else {
			var left = 0;
			var top = 0;
			switch (maxLife) {
				case 2:
					top = -128;
					break;
				case 3:
					top = -2*128;
					break;
			}
			switch (life) {
				case 1:
					left = 0;
					break;
				case 2:
					left = -128;
					break;
				case 3:
					left = -2*128;
					break;
			}
			this.lifemeter.setStyle({backgroundPosition: left + "px " + top + "px"});
		}
	}
  
});
