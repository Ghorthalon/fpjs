'use strict';
sono.panner.defaults = {
	panningModel: 'HRTF',
	distanceModel: 'linear',
	refDistance: 1,
	maxDistance: 50,
	rolloffFactor: 1,
	coneInnerAngle: 360,
	coneOuterAngle: 0,
	coneOuterGain: 0
};
class SoundSource {
	constructor(file, enable3d = true) {
		if (isElectron == false) {

			this.howl = sono.create('../sounds/' + file);
		} else {
			this.howl = sono.create('sounds/' + file);

		}

		this.muffled = 0;
		if (enable3d) {
			this.pan = this.howl.effects.add(sono.panner());
			this.enable3d = true;
		} // end if
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.filename = file;
		this.type = Types.SOUNDSOURCE;
		this.wasPlaying = 0;

	}
	play() {
		if (distance(this.x, this.z, localPlayer.x, localPlayer.z) < Config.MAXRANGE) {
			this.howl.seek(0);
			this.howl.play();

		}

		this.wasPlaying = 1;
	}
	pos(x, y, z) {
		if (this.enable3d) {
			this.pan.setPosition(x, y, z);
		}

		this.x = x;
		this.y = y;
		this.z = z;
	} // end pos

	update() {

		if (this.howl.ended && !this.howl.loop) {
			this.stop();
		}
		if (distance(this.x, this.z, localPlayer.x, localPlayer.z) > Config.MAXRANGE && this.howl.playing) {
			this.howl.stop();
		}
		if (distance(this.x, this.z, localPlayer.x, localPlayer.z) < Config.MAXRANGE && this.wasPlaying == 1 && !this.howl.playing) {
			this.howl.play();

		}


	} // end update()

	stop() {
		this.howl.stop();
		this.wasPlaying = 0;
	}

	loop(loop) {
		this.howl.loop = loop;
	}

	pause() {
		this.howl.pause();
	}
	state() {
		return this.howl.progress;

	}

	playing() {
		return this.howl.playing;
	}


	unload() {
		this.howl.destroy();
		return false;
	}

	muffle() {

		if (this.muffled == 0) {

			this.muffled = this.howl.effects.add(sono.lowpass());
		} // end if
	}

	unMuffle() {
		if (this.muffled != 0) {
			this.howl.effects.remove(this.muffled);
			this.muffled = 0;
		} // end if


	}


	set3D(enable3d) {
		if (enable3d == true && this.enable3d == false) {
			this.pan = this.howl.effects.add(sono.panner());
			this.enable3d = true;
		} else if (enable3d == false && this.enable3d == true) {
			this.howl.effects.remove(this.pan);
			this.enable3d = false;
		} // end if

	} // end 3d


}
