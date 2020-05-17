class SoundManagerItem {
	constructor() {
		this.sono = 0;
		this.filename = 0;
	}
}

class SoundManager {
	constructor() {
		this.sounds = [];
	}
	load(filename) {
		var found = 0;
		for (var i = 0; i < this.sounds.length; i++) {
			if (this.sounds[i].filename == filename) {
				return sono.utils.cloneBuffer(this.sounds[i].sono);
				found = 1;
			}
		}
		if (found == 0) {
			return sono.create(filename);
		}
	}

}
