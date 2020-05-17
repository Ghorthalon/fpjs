'use strict';
class Wall extends GameObject {
	constructor(x, y, z, width, height, depth) {
		super();
		this.x = x;
		this.y = y;
		this.z = z;
		this.width = width;
		this.height = height;
		this.depth = depth;

		this.type = Types.WALL;
		this.collidable = true;
	} // end constructor

	onCollision(collider) {
		if (collider.type != Types.WALL && collider.type != Types.PLATFORM && collider.type != Types.DOOR) {
			if (collider.type == Types.BULLET) {
				quickSound.play("physics/bullets/richo" + randomInt(1, 8) + ".ogg", collider.x, collider.y, collider.z);
			} else {
				quickSound.play("physics/collisions/hit_wall.ogg", collider.x, collider.y, collider.z);
			}
			collider.x -= 1 * Math.cos(collider.theta + collider.stepDirection);
			collider.z -= 1 * Math.sin(collider.theta + collider.stepDirection);
		}


	} // end onCollision()

	hurt(damage) {

	}


} // end class
