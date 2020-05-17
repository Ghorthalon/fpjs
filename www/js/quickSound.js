'use strict';
class QuickSound {
	constructor(numSounds) {
		this.maxSounds = numSounds;
		this.DSources = new Array(numSounds);
		this.monoSources = new Array(numSounds);
		this.keepAliveTimers = new Array(numSounds);
		this.monoKeepAliveTimers = new Array(numSounds);
		this.reuseSources = true;
		// for (var i=0;i<numSounds;i++) {
		// this.keepAliveTimers[i] = -1;
		// this.monoKeepAliveTimers[i] = -1;
		// }

		this.keepAlive = 100;
		this.player = null;
	} // end constructor

	addPlayer(player) {
		this.player = player;
	}

	play(filename, x, y, z) {
		/*
		Honestly, I need to vent. The webaudio API, when a sound has been loaded previously and had different coordinates than the ones passed here would crossfade the sounds between their old point and the new one. I mean, sure, this makes position changes smoothe, even if the position changes weren't smoothe already. But here I need to change them immediately, not slide them over time, which means I have to simply reload the sound and pass it new coordinates instead of re-using sounds previously loaded. Fucking hell, why can't this be changed? Also i can't keep loading and unloading sounds. This is a web environment. Holy crap.
		*/
		var arraySlot = this.findFree3DArraySlot(filename);
		if (this.DSources[arraySlot] == undefined) {
			this.DSources[arraySlot] = new SoundSource(filename);
		}


		if (this.DSources[arraySlot].playing() == true) {
			debugsound.play();
		}

		this.DSources[arraySlot].pos(x, y, z);
		this.DSources[arraySlot].play();


	} // end play


	playMono(filename) {
		var arraySlot = this.findFreeMonoArraySlot(filename);
		if (this.monoSources[arraySlot] == undefined) {
			this.monoSources[arraySlot] = new SoundSource(filename, false);

		} // end if 
		this.monoSources[arraySlot].pos(localPlayer.x, localPlayer.y, localPlayer.z);
		this.monoSources[arraySlot].play();


	} // end play
	findFree3DArraySlot(filename) {
		var found = 0;
		var foundSlot = 0;
		for (var i = 0; i < this.DSources.length; i++) {
			if (!this.DSources[i]) {
				return i;
			}


			if (this.DSources[i].playing() == false && this.DSources[i].filename == filename) {
				if (this.reuseSources == true)

					return i;
			} // end if

		} // end for
		return 0;
	} // end findFreeArraySlot

	findFreeMonoArraySlot(filename) {
		var found = 0;
		for (var i = 0; i < this.monoSources.length; i++) {
			if (!this.monoSources[i]) {
				return i;
			}


			if (this.monoSources[i].playing() == false && this.monoSources[i].filename == filename) {

				return i;
			} // end if

		} // end for
		return 0;
	} // end findFreeArraySlot
	update() {


		for (var i = 0; i < this.DSources.length; i++) {
			if (this.DSources[i] != undefined) {


				if (this.DSources[i].playing() == false) {

					this.keepAliveTimers[i]++;

					if (this.keepAliveTimers[i] > this.keepAlive) {
						this.DSources[i].unload();
						// this.DSources[i] = null;
						debugsound.play();
						this.keepAliveTimers[i] = -1;
					} // end if

				} // end if
			}
		} // end for


		for (var i = 0; i < this.monoSources.length; i++) {
			if (this.monoSources[i] != undefined) {
				if (this.monoSources[i].playing() == false) {
					this.monoKeepAliveTimers[i]++;

					if (this.monoKeepAliveTimers[i] > this.keepAlive) {
						this.monoSources[i].unload();

						debugsound.play();
						this.monoKeepAliveTimers[i] = -1;
					} // end if

				} // end if
			}
		} // end for

	} // end update
} // end class