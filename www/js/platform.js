'use strict';
class Platform extends GameObject {
	constructor(x, y, z, width, height, depth, type) {
		super();
		this.x = x;
		this.y = y;
		this.z = z;
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.collidable = true;
		this.type = Types.PLATFORM;
		this.surface = type;
	} // end constructor

	onCollision(collider) {
		if (collider.type != Types.WALL && collider.type != Types.PLATFORM && collider.type != Types.DOOR) {
			if (collider.ySpeed < -0.05) {
				if (collider.isLocal == false) {
					collider.soundPool.play("physics/land/" + this.surface + ".ogg", 0, 0, 0);
				} else {
					quickSound.playMono("physics/land/" + this.surface + ".ogg");
				}
				collider.onPlatform = true;


			}

			if (collider.ySpeed > -0.05 && collider.ySpeed < 0) {

				if (collider.moving == 1) {
					if (collider.frame % collider.stepSoundSpeed == 0) {

						if (collider.isLocal == false) {
							collider.soundPool.play("steps/" + this.surface + "/" + randomInt(1, 12) + ".ogg", 0, 0, 0);
						} else {
							quickSound.playMono("steps/" + this.surface + "/" + randomInt(1, 12) + ".ogg");
						} // end if
					} // end if
				} // end if
			} // end if

			collider.y = this.y + this.height;
			collider.ySpeed = 0;


			// quickSound.play(collider.x, collider.y, collider.z, "physics/collisions/hit_wall.ogg");
		}


	}


} // end class