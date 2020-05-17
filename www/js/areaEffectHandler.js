'use strict';
class AreaEffectHandler {
	constructor() {
		this.active = -1;
		this.currentHandle = 0;
		this.effects = [];
		this.frame = 0;
		this.checkTime = 60;
	} // end constructor

	addEffect(effect) {
		this.effects.push(effect);

	} // end addEffect

	switchEffect(name) {

		if (this.currentHandle != 0) {
			sono.effects.remove(this.currentHandle);
			this.currentHandle = 0;
		} // end if
		var i = this.findEffectByName(name);
		if (this.effects[i]) {
			if (this.effects[i].type == EffectTypes.REVERB) {
				var params = this.effects[i].params;
				this.currentHandle = sono.effects.add(sono.convolver({

					impulse: "../sounds/impulses/" + params

				}));
			} // end if
		} // end if
	} // end switch

	findEffectByName(name) {
		for (var i = 0; i < this.effects.length; i++) {
			if (this.effects[i].name == name) {
				return i;
			} // end if
		} // end for
	} // end function

	update() {
		this.frame++;
		if (this.frame > this.checkTime) {
			this.frame = 0;

			for (var i = 0; i < this.effects.length; i++) {
				if (isCollide3D(this.effects[i], localPlayer)) {

					if (i != this.active) {

						this.active = i;
						this.switchEffect(this.effects[i].name);

					} // end if
				} // end if
			} // end for
		}
	} // end update()


} // end constructor

