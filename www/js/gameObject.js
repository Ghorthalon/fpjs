'use strict';
class GameObject {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.xAcceleration = 0;
		this.yAcceleration = 0;
		this.zAcceleration = 0;
		this.xVelocity = 0;
		this.yVelocity = 0;
		this.zVelocity = 0;
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.zSpeed = 0;
		this.maxXSpeed = 0.5;
		this.maxYSpeed = 0.5;
		this.maxZSpeed = 0.5;
		this.width = 1;
		this.height = 1;
		this.depth = 1;
		this.theta = 0;
		this.type = 0;
		this.health = 0;
		this.speed = 0;
		this.moving = 0;
		this.toDestroy = false;
		this.collidable = false;
	} // end constructor

	update() {
		if (this.speed != 0) {
			this.moving = 1;
			this.x += (this.speed * Math.cos((this.theta * 3.1415926) / 180))
			this.z += (this.speed * Math.sin((this.theta * 3.1415926) / 180))
		} else {
			this.moving = 0;
		} // end If
	} // end update()
	muffle() {
		return;
	}


	unMuffle() {
		return;

	}


} // end class
