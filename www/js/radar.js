class Radar {
	constructor(world) {
		this.world = world;

		this.ray = new Ray;
		this.updateTime = 30;
		this.frame = 0;
		this.range = 10;
	}
	update() {


		this.frame++;
		if (this.frame % this.updateTime == 0) {

			/* 
			remotePlayers = this.world.gatherRemotePlayers();
			this.ray.theta = world.camera.theta;
			for (var i=0;i<this.range;i++) {
				this.ray.x += Math.cos(this.ray.theta);
				this.ray.z += Math.sin(this.ray.theta);
				for (var j=0;j<remotePlayers.length;j++) {
					if (isCollide3D(this.ray, remotePlayers[j])) {
						debugsound.play();
					}
				}
				
			}
			*/
		}


	}


}
