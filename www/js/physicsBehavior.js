'use strict';
class PhysicsBehavior {
	constructor(object) {
		this.object = object;
	} // end constructor
	update() {
		this.object.ySpeed -= 0.005;
	} // end update()


}
