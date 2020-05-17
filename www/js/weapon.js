'use strict';
class Weapon {
	constructor(player, automatic, damage, speed, type) {
		this.player = player;
		this.automatic = automatic;
		this.shooting = false;
		this.frame = 0;
		this.speed = speed;
		this.damage = damage;

		this.sndShot = [];
		this.sndShot[0] = new SoundSource("Weapons/" + type + "/shoot1.ogg");
		this.sndShot[1] = new SoundSource("Weapons/" + type + "/shoot2.ogg");
		this.sndShot[2] = new SoundSource("Weapons/" + type + "/shoot3.ogg");
		this.sndReload = new SoundSource("Weapons/" + type + "/reload.ogg");
		this.sndEmpty = new SoundSource("Weapons/" + type + "/reload.ogg");

		this.muffled = 0;
	} // end constructor

	shoot() {

		if (this.automatic == false) {
			this.update();
		} else {
			this.shooting = true;
			if (this.player.isLocal == true) {
				this.sndShot[0].set3D(false);
				this.sndShot[1].set3D(false);
				this.sndShot[2].set3D(false);
				this.sndReload.set3D(false);
				this.sndEmpty.set3D(false);
			} // end if
		} /// end if 
	} // end shoot()
	update() {


		this.frame--;
		if (this.shooting == true) {
			this.sndShot[0].pos(this.player.x, this.player.y + this.player.posHands, this.player.z);
			this.sndShot[1].pos(this.player.x, this.player.y + this.player.posHands, this.player.z);
			this.sndShot[2].pos(this.player.x, this.player.y + this.player.posHands, this.player.z);
			this.sndReload.pos(this.player.x, this.player.y, this.player.z);
			this.sndEmpty.pos(this.player.x, this.player.y, this.player.z);



			if (this.frame <= 0) {
				this.frame = this.speed;
				var random = randomInt(0, 2);
				this.sndShot[random].howl.seek(0);
				this.sndShot[random].play();

				world.addGameObject(new Bullet(this.player.x + Math.cos(this.player.theta), this.player.posHands, this.player.z + Math.sin(this.player.theta), this.player.theta, this.player.id));
			} // end if
		} // end if
	} // end if

	stopShooting() {
		this.shooting = false;
	} // end stopShooting


	muffle() {
		if (this.muffled == 0) {
			this.muffled = 1;
			this.sndShot[0].muffle();
			this.sndShot[1].muffle();
			this.sndShot[2].muffle();
		} // end if
	} // end function

	unMuffle() {
		if (this.muffled != 0) {
			this.muffled = 0;
			this.sndShot[0].unMuffle();
			this.sndShot[1].unMuffle();
			this.sndShot[2].unMuffle();
		} // end if
	} // end function

} // end class