"use strict";
class ObjectSoundPoolItem {
	constructor(filename, xOffset, yOffset, zOffset) {
		this.source = new SoundSource(filename, true);
		this.xOffset = xOffset;
		this.yOffset = yOffset;
		this.zOffset = zOffset;
		this.filename = filename;
	}
}

class ObjectSoundPool {
	constructor(object, numSounds) {
		this.numSounds = numSounds;
		this.object = object;
		console.log("X: " + this.object.health);
		this.sources = new Array(numSounds);
		this.iterator = 0;
	}
	play(filename, xOffset, yOffset, zOffset) {

		var arraySlot = this.findFreeArraySlot(filename);
		console.log("playing " + arraySlot);
		if (arraySlot == -1) {
			arraySlot = this.iterator;
			this.iterator++;
			if (this.iterator > this.numSounds) {
				this.iterator = 0;
			}
		}
		if (this.sources[arraySlot] == undefined) {
			this.sources[arraySlot] = new ObjectSoundPoolItem(filename, xOffset, yOffset, zOffset);
		}

		this.sources[arraySlot].source.pos(this.object.x, this.object.y, this.object.z);
		this.sources[arraySlot].source.play();
	}
	findFreeArraySlot(filename) {
		var found = false;
		for (var i = 0; i < this.sources.length; i++) {
			if (!this.sources[i]) {
				return i;
			}
			if (this.sources[i].filename == filename && this.sources[i].source.playing() == false) {

				return i;
			}

		}
		return -1;
	}

	update() {

		for (var i = 0; i < this.sources.length; i++) {
			if (this.sources[i] != undefined) {

				this.sources[i].source.pos(this.object.x, this.object.y, this.object.z);
			}
		}

	}

}