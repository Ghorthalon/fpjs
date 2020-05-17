'use strict';
class WorldReader {
	constructor(toLoad) {
		this.sources = toLoad.sources;
		this.platforms = toLoad.platforms;
		this.doors = toLoad.doors;
		this.walls = toLoad.walls;
		this.spawnPoints = toLoad.spawnPoints;
		this.areaEffects = toLoad.areaEffects;
	} // end constructor

	loadMap() {
		if (this.sources != undefined) {
			this.sources.forEach(function (source) {
				world.addSource(source.x, source.y, source.z, "ambience/" + source.type + ".ogg");
			}); // end sources
		}
		if (this.platforms == undefined) {
			speech.speak("Map error. Need at least one platform");
			return false;
		}

		this.platforms.forEach(function (platform) {
			world.addPlatform(platform.x, platform.y, platform.z, platform.width, platform.height, platform.depth, platform.type);
		}); // end platforms
		if (this.spawnPoints == undefined) {
			speech.speak("Map error. Must have at least one spawn point");
			return false;
		}
		if (this.doors != undefined) {
			this.doors.forEach(function (door) {

				world.addDoor(door.x, door.y, door.z, door.width, door.height, door.depth, door.type);
			}); // end doors
		}
		if (this.walls != undefined) {
			this.walls.forEach(function (wall) {
				world.addWall(wall.x, wall.y, wall.z, wall.width, wall.height, wall.depth);
			}); // end forEach
		}


		this.spawnPoints.forEach(function (spawnPoint) {
			world.addSpawnPoint(spawnPoint.x, spawnPoint.y, spawnPoint.z, spawnPoint.name);
		}); // end sources
		if (this.areaEffects != undefined) {
			this.areaEffects.forEach(function (areaEffect) {
				world.addAreaEffect(areaEffect.x, areaEffect.y, areaEffect.z, areaEffect.width, areaEffect.height, areaEffect.depth, areaEffect.name);
			}); // end sources
		}
		world.playSources();
		return true;
	} // end loadMap
} // end class