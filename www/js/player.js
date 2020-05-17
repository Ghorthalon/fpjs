'use strict';
class Player extends GameObject {
	constructor(isLocal) {
		super();
		this.width = 2;
		this.height = 2;
		this.depth = 2;
		this.sndStep = new SoundSource("steps/dirt.ogg");
		this.sndStep.loop(true);
		this.sndStep.howl.playbackRate = 1.3;
		this.sndShoot = new SoundSource("Weapons/gun.ogg");
		this.sndHurt = new SoundSource("player/hurt.ogg");
		this.sndSpawn = new SoundSource("player/unduck.ogg");
		this.sndDie = new SoundSource("player/die.ogg");
		this.posHead = this.y + 2;
		this.posHands = this.x + 1;
		this.posFeet = this.x + 0;
		this.muffled = 0;
		this.frame = 0;
		this.active = false;
		this.id = null;
		this.isLocal = isLocal;
		this.oldIsLocal = isLocal;
		this.health = 50;
		this.instanceWeapon = null;
		this.weapon = null;

		this.turning = false;
		this.turnDirection = 0;
		this.stepDirection = 0;
		this.toDestroy = false;
		this.radar = 0;
		if (this.isLocal) {
			this.sndHurt.set3D(false);
			this.sndDie.set3D(false);
			this.type = Types.LOCALPLAYER;
			this.radar = new Radar(this);
		} else {
			this.type = Types.REMOTEPLAYER;
		} // end if
		this.collidable = true;
		this.physicsBehavior = new PhysicsBehavior(this);
		this.maxXSpeed = 0.1;
		this.maxYSpeed = 0.1;
		this.maxZSpeed = 0.1;
		this.walkingSpeed = 0.05;
		this.runningSpeed = 0.09;
		this.stepSoundSpeed = 20;
		this.onPlatform = false;
		this.team = 0;
		this.name = "NoName";
		this.voice = 2;
		this.speed = 0.05;
		this.stepSoundSpeed = 30;
		this.soundPool = new ObjectSoundPool(this, 16);
	}
	update() {



		if (this.active == true) {
			this.checkHealth();
			this.checkPlatform();


			this.weapon.update();
			this.checkRotation();
			this.physicsBehavior.update();
			this.checkMovement();
			this.checkBodyParts();
			this.soundPool.update();
		} // end if






		if (this.moving == 1) {
			this.frame++;

		} // endif

	} // end update()

	turnRight(degrees) {
		if (this.active) {
			this.theta += degrees;
			if (this.theta > 2 * Math.PI) {
				this.theta -= 0;
			}
		}

	} // end turnRight
	turnLeft(degrees) {
		if (this.active) {
			this.theta -= degrees;
			if (this.theta < 0) {
				this.theta += 2 * Math.PI;
			} // end if
		}

	} // end turnLeft()
	moveForward() {
		if (this.active == true) {
			if (this.moving == 0) {

				this.moving = 1;
			} // end if
		}

	} // end moveForward
	stopMoving() {
		if (this.active) {


			this.moving = 0;
		}
	} // end stopMoving

	startShooting() {
		//this.sndShoot.play();
		// world.addGameObject(new Bullet(this.x, this.y, this.theta, this.owner));
		if (this.active && this.weapon != undefined) {
			this.weapon.shoot();
		}

	} // end if

	hurt(amount) {
		if (this.active) {
			this.health -= amount;
			if (this.health < 1) {
				if (this.isLocal == false) {
					this.soundPool.play("player/voice/" + this.voice + "/die" + randomInt(1, 2) + ".ogg", 0, this.posHead - this.y, 0);
				} else {
					quickSound.playMono("player/voice/" + this.voice + "/die" + randomInt(1, 2) + ".ogg");
					world.localPlayerDie();
				}

				this.active = false;
				this.stopMoving();
				return;
			} // end if
			if (this.isLocal == false) {
				this.soundPool.play("player/voice/" + this.voice + "/hurt" + randomInt(1, 5) + ".ogg", 0, this.posHead - this.y, 0);
			} else {
				quickSound.playMono("player/voice/" + this.voice + "/hurt" + randomInt(1, 5) + ".ogg");
			}
		}
	} // end hurt()

	rotate(direction) {
		if (this.active) {
			this.theta += direction;
			if (this.theta < 0) {
				this.theta = 2 * Math.PI;
			} // end if
			if (this.theta > 2 * Math.PI) {
				this.theta = 0;
			} // end
		}
	} // end rotate

	onCollision(collider) {

	} // end onCollision
	muffle() {
		if (this.muffled == 0) {
			this.muffled = 1;
			this.sndStep.muffle();
			this.sndShoot.muffle();
			this.sndHurt.muffle();
			this.sndSpawn.muffle();
			this.sndDie.muffle();
			this.weapon.muffle();
		} // end if

	}

	unMuffle() {
		if (this.muffled != 0) {
			this.muffled = 0;
			this.sndStep.unMuffle();
			this.sndShoot.unMuffle();
			this.sndHurt.unMuffle();
			this.sndSpawn.unMuffle();
			this.sndDie.unMuffle();
			this.weapon.unMuffle();
		} // end if
	} // end function

	jump(force) {
		if (this.active) {
			if (this.onPlatform == true) {
				this.ySpeed += 0.25;
				if (this.isLocal == false) {
					this.soundPool.play("player/unduck.ogg", 0, 0, 0);
				} else {
					quickSound.playMono("player/unduck.ogg");
				}

			} // end if
		}
	} // end jump
	startRunning() {
		// if (this.moving) {
		this.speed = this.runningSpeed;
		this.stepSoundSpeed = 20;
		// }

	}

	stopRunning() {
		// if (this.moving) {

		this.speed = this.walkingSpeed;
		this.stepSoundSpeed = 30;
		// }

	}

	setHealth(health) {
		if (this.active) {
			if (health < 0) {
				this.hurt(1000);
				return;
			}
			this.health = health;
		}
	}

	checkHealth() {
		if (this.health < 1) {
			this.hurt(30000);
		}
	}


	checkPlatform() {
		if (this.ySpeed != 0) {
			this.onPlatform = false;
		} // end if
	} // end checkPlatform

	checkRotation() {
		if (this.turning == true) {
			this.rotate(this.turnDirection);
		} // end if
	} // end checkTurning

	checkMovement() {
		if (this.moving == 1) {


			this.x += (this.speed * Math.cos(this.theta + this.stepDirection))
			this.z += (this.speed * Math.sin(this.theta + this.stepDirection))


		} else {
			this.frame = 0;
		} // end If
		this.y += this.ySpeed;
	} // end checkMovement

	checkBodyParts() {
		this.posHead = this.y + 2;
		this.posHands = this.y + 1;
		this.posFeet = this.y;
	}
	equipWeapon(weapon) {
		this.instanceWeapon = weapon;
		console.log("Equipped weapon damage: " + this.instanceWeapon.damage);
		this.weapon = new Weapon(this, this.instanceWeapon.automatic, this.instanceWeapon.damage, this.instanceWeapon.speed, this.instanceWeapon.name);
	}

	snapRight() {
		if (this.theta >= 0 && this.theta <= 0.5 * Math.PI) {
			this.theta = 0.5 * Math.PI;
		}
		if (this.theta > 0.5 * Math.PI && this.theta <= Math.PI) {
			this.theta = Math.PI;
		}
		if (this.theta > Math.PI && this.theta <= 1.5 * Math.PI) {
			this.theta = 1.5 * Math.PI;
		}
		if (this.theta > 1.5 * Math.PI) {
			this.theta = 0;
		}

	}

	snapLeft() {
		if (this.theta >= 0 && this.theta < 0.5 * Math.PI) {
			this.theta = 0;
		}
		if (this.theta >= 1.5 * Math.PI && this.theta <= 2 * Math.PI) {
			this.theta = 1.5 * Math.PI;
		}
		if (this.theta <= Math.PI && this.theta > 0.5 * Math.PI) {
			this.theta = 0.5 * Math.PI;
		}
		if (this.theta <= 1.5 * Math.PI && this.theta > Math.PI) {
			this.theta = Math.PI;
		}
	}

}



