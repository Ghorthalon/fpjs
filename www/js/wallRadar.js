class WallRadar {
	constructor(camera, walls) {
		this.player = camera;
		this.walls = walls;
		this.ray = new Ray();
		this.speed = 20;
		this.lastLeftRadar = 0;
		this.lastFrontRadar = 0;
		this.lastRightRadar = 0;
		this.frame = 0;
		this.range = 20;
	}

	update() {
		this.frame++;
		if (this.frame == this.speed) {
			this.handleLeftRadar();


		} // end speed
		if (this.frame == this.speed * 2) {
			this.handleFrontRadar();
		}
		if (this.frame == this.speed * 3) {
			this.handleRightRadar();
			this.frame = 0;

		}
	}
	handleLeftRadar() {
		this.launchRadar(this.player.theta + 1.5 * Math.PI);
	}
	handleFrontRadar() {
		this.launchRadar(this.player.theta);
	}
	handleRightRadar() {
		this.launchRadar(this.player.theta + 0.5 * Math.PI);
	}
	launchRadar(direction) {
		this.ray.x = this.player.x;
		this.ray.y = this.player.y;
		this.ray.z = this.player.z;

		this.ray.theta = direction;
		console.log("Launching from " + this.ray.x + ", " + this.ray.z + ", at " + this.ray.theta);
		var found = 0;
		for (var i = 0; i < this.range; i++) {
			this.ray.x += Number(Math.cos(this.ray.theta));
			this.ray.z += Number(Math.sin(this.ray.theta));
			console.log(this.ray.x + ", " + this.ray.z);
			for (var j = 0; j < walls.length; j++) {
				if (isCollide3D(this.ray, walls[j])) {

					found = 1;

					speech.speak("Wall left in " + i);
					this.lastLeftRadar = 1;
					quickSound.play("UI/radar/wall.ogg", this.ray.x, this.ray.y, this.ray.z);

				}
			} // end j
		} // end i
		if (found == 0) {
			this.lastLeftRadar = 0;
			speech.speak("Nothing in " + this.range);
			quickSound.play("UI/radar/free.ogg", this.player.x + Math.cos(this.ray.theta), this.player.y, this.player.z + Math.sin(this.player.theta));
		}

	}


}