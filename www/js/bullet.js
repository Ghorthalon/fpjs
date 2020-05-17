'use strict';
class Bullet extends GameObject {
	constructor(x, y, z, theta, owner) {
		super();

		this.x = x;
		this.y = y;
		this.z = z;
		this.width = 1;
		this.height = 1;
		this.depth = 1;
		this.theta = theta;
		this.sndBullet = new SoundSource("physics/bullets/bullet" + randomInt(1, 5) + ".ogg");
		this.muffled = 0;
		this.sndBullet.play();
		this.lifetime = 60;
		this.frame = 0;
		this.speed = 1;
		this.type = Types.BULLET;
		this.damage = 10;
		this.owner = owner;
		this.collidable = true;
	} // end constructor

	update() {
		this.x += (this.speed * Math.cos(this.theta))
		this.z += (this.speed * Math.sin(this.theta))

		this.frame++;
		if (this.frame > this.lifetime) {
			this.destroy();
			return;
		} // end if
		this.sndBullet.pos(this.x, this.y, this.z);
		this.sndBullet.update();
	} // end update()

	destroy() {
		this.sndBullet.stop();
		this.sndBullet.unload();
		this.toDestroy = true;
		this.x = null;
		this.y = null;
		this.z = null;
	} // end destroy()

	onCollision(collider) {
		if (collider.id != this.owner) {

			if (collider.type == Types.REMOTEPLAYER || collider.type == Types.LOCALPLAYER) {
				if (collider.isLocal == false) {
					quickSound.play("physics/bullets/pImpact" + randomInt(1, 6) + ".ogg", collider.x, collider.posHands, collider.z);
				} else {
					quickSound.playMono("physics/bullets/pImpact" + randomInt(1, 6) + ".ogg");
				}
				collider.hurt(0);
				if (this.owner == localPlayer.id) {

					socket.emit("hitPlayer", collider.id);
				}

			} // end if
			this.destroy();
		}

	} // end onCollision

	muffle() {
		if (this.muffled == 0) {
			this.sndBullet.muffle();
			this.muffled = 1;
			debugsound.play();
		} // end if
	} // end function
	unMuffle() {
		if (this.muffled != 0) {
			// this.sndBullet.unMuffle();
			this.muffled = 0;
		} // end if

	} // end unMuffle




} // end class