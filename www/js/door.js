'use strict';
class Door extends GameObject {

	constructor(x, y, z, width, height, depth, type) {
		super();
		this.x = x;
		this.y = y;
		this.z = z;
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.muffled = 0;
		this.material = type;

		this.sndLoop = new SoundSource("physics/door/" + this.material + "/loop.ogg");
		this.sndOpen = new SoundSource("physics/door/" + this.material + "/open.ogg");
		this.sndClose = new SoundSource("physics/door/" + this.material + "/close.ogg");
		this.sndLoop.loop(true);
		this.sndLoop.play();
		this.open = false;
		this.frame = 0;
		this.stayOpen = 500;
		this.type = Types.DOOR;
		this.collidable = true;
	} // end constructor
	onCollision(collider) {
		if (collider.type != Types.WALL && collider.type != Types.PLATFORM && collider.type != Types.DOOR) {
			if (this.open == false) {
				this.sndOpen.play();
				this.open = true;
				this.frame = 0;
			} // end if
		}
	} // end onCollision

	update() {

		this.sndLoop.pos(Number(this.x + (this.width / 2)), Number(this.y + (this.height / 2)), Number(this.z));
		this.sndOpen.pos(Number(this.x + (this.width / 2)), Number(this.y + (this.height / 2)), Number(this.z));
		this.sndClose.pos(Number(this.x + (this.width / 2)), Number(this.y + (this.height / 2)), Number(this.z));
		if (this.open) {
			this.frame++;
			if (this.frame > this.stayOpen) {
				this.open = false;
				this.sndClose.play();

			} // end open
		}
		this.sndLoop.update();
		this.sndOpen.update();
		this.sndClose.update();
	}

	muffle() {
		if (this.muffled == 0) {
			// this.sndOpen.muffle();
			// this.sndClose.muffle();
			// this.sndLoop.muffle();
			this.muffled = 1;
		} // end if
	} // end function
	unMuffle() {
		if (this.muffled != 0) {
			// this.sndOpen.unMuffle();
			// this.sndClose.unMuffle();
			// this.sndLoop.unMuffle();
			this.muffled = 0;
		} // end if
	} // end function

	destroy() {
		this.sndOpen.unload();
		this.sndClose.unload();
		this.sndLoop.destroy();
	} // end destroy

} // end class