"use strict";




quickSound = new QuickSound(256);
class World {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.areas = new Array();
		this.sources = new Array();
		this.platforms = new Array();
		this.areaEffectHandler = new AreaEffectHandler();
		this.gameObjects = new Array();
		this.camera = new Camera();
		this.camera.followPlayer = false;
		this.wallRadar = new WallRadar(this.camera, walls);
	} // end constructor
	addAreaEffect(x, y, z, width, height, depth, name) {
		var effect = new AreaEffect(x, y, z, width, height, depth, name, 1, name);

		this.areaEffectHandler.addEffect(effect);
	} // end addEffect

	addSpawnPoint(x, y, z, name) {
		console.log("Adding spawnpoint");
		this.gameObjects.push(new SpawnPoint(x, y, z, name));
	}


	addPlatform(x, y, z, width, height, depth, type) {

		this.gameObjects.push(new Platform(x, y, z, width, height, depth, type));
	} // end addPlatform
	addSource(x, y, z, file) {
		var tempSource = new SoundSource(file);
		tempSource.pos(x, y, z);
		tempSource.x = x;
		tempSource.y = y;
		tempSource.z = z;
		this.gameObjects.push(tempSource);
	} // end addSource
	addGameObject(gameObject) {

		this.gameObjects.push(gameObject);

	} // end addGameObject

	addDoor(x, y, z, width, height, depth, type) {
		console.log(x + " , " + y + " , " + z + " , " + width + " , " + height + " , " + depth + " , " + type);
		this.gameObjects.push(new Door(x, y, z, width, height, depth, type));
	} // end addDoor
	addWall(x, y, z, width, height, depth) {
		this.gameObjects.push(new Wall(x, y, z, width, height, depth));
	} // end addWall
	getSpawnPointName(id) {
		spawnPoints = this.gatherSpawnPoints();
		speech.speak("Total " + spawnPoints.length);




		return spawnPoints[id].name;


	}

	gatherRemotePlayers() {
		remotePlayers = new Array();
		for (var i = 0; i < this.gameObjects.length; i++) {
			if (this.gameObjects[i].type == Types.REMOTEPLAYER) {
				remotePlayers.push(this.gameObjects[i]);
			}
		}
		return remotePlayers;
	}

	gatherSpawnPoints() {
		spawnPoints = [];
		for (var i = 0; i < this.gameObjects.length; i++) {
			if (this.gameObjects[i].type == Types.SPAWNPOINT) {

				spawnPoints.push(this.gameObjects[i]);
			}
		}
		return spawnPoints;
	}

	spawnPlayer(player) {
		spawnPoints = this.gatherSpawnPoints();
		var toSpawn = 0;
		console.log("Spawning at " + toSpawn);
		player.x = spawnPoints[toSpawn].x;
		player.y = spawnPoints[toSpawn].y;
		player.z = spawnPoints[toSpawn].z;
		speech.speak("Spawning at " + spawnPoints[toSpawn].name);
		if (player.isLocal == false) {
			quickSound.play("player/spawn.ogg", player.x, player.y, player.z);

		} else {
			quickSound.playMono("player/spawn.ogg");
			this.camera.followPlayer = true;
			setupKeys();
		}

	}


	playSources() {


		this.gameObjects.forEach(function (source) {
			if (source.type == Types.SOUNDSOURCE) {
				source.play();
				source.loop(true);
			} // end if

		}); // end forEach
	} // end playSources()

	update() {
		totalFrames++;

		tempPlayer = findPlayerByID(localPlayer.id);
		if (this.camera.followPlayer) {
			this.camera.x = tempPlayer.x;
			this.camera.y = tempPlayer.y + tempPlayer.posHead;
			this.camera.z = tempPlayer.z;
			this.camera.theta = tempPlayer.theta;
		}
		for (var i = 0; i < this.gameObjects.length; i++) {
			if (this.gameObjects[i].toDestroy != true) {


				this.gameObjects[i].update();
			} else {
				this.gameObjects.splice(i, 1);


			} // end if
		} // end forEach



		collidableObjects = this.gatherCollidableObjects();
		walls = this.gatherWalls();
		this.checkCollisions();
		this.handleAcoustics();
		this.areaEffectHandler.update();





		quickSound.update();
		sono.panner.setListenerPosition(this.camera.x, this.camera.y, this.camera.z);
		sono.panner.setListenerOrientation(Math.cos(this.camera.theta), 0, Math.sin(this.camera.theta), 0, 1, 0);
		this.handlePlayerRadar();

		// this.countWalls(0, 0, 10, -10);
	} // end update()


	checkCollisions() {




		for (var i = 0; i < collidableObjects.length; i++) {
			for (var j = 0; j < collidableObjects.length; j++) {
				if (i != j) {
					/*
					if (distance3D(
					(collidableObjects[i].x+(collidableObjects[i].width/2)),
					(collidableObjects[i].y+(collidableObjects[i].height/2)),
					(collidableObjects[i].z+(collidableObjects[i].depth/2)),
					(collidableObjects[j].x+(collidableObjects[j].width/2)),
					(collidableObjects[j].y+(collidableObjects[j].height/2)),
					(collidableObjects[j].z+(collidableObjects[j].depth/2))) < 
					(collidableObjects[j].width/2)) {
					*/
					if (isCollide3D(collidableObjects[i], collidableObjects[j])) {



						collidableObjects[i].onCollision(collidableObjects[j]);
						collidableObjects[j].onCollision(collidableObjects[i]);
					} // end if
				} // end if

			} // end for
		} // end for
	} // end checkCollisions

	gatherCollidableObjects() {

		var tempObjects = new Array();
		for (var i = 0; i < this.gameObjects.length; i++) {


			if (this.gameObjects[i].collidable == true) {



				tempObjects.push(this.gameObjects[i]);
			} // end if
		} // end for
		return tempObjects;
	} // end gatherCollidableObjects

	gatherWalls() {
		var foundWalls = new Array();

		for (var i = 0; i < this.gameObjects.length; i++) {


			if (this.gameObjects[i].type == Types.WALL) {


				foundWalls.push(this.gameObjects[i]);
			} // end if
			if ((this.gameObjects[i].type == Types.DOOR && this.gameObjects[i].open == false)) {

				foundWalls.push(this.gameObjects[i]);
			}

		} // end for

		return foundWalls;
	} // end gatherCollidableObjects

	oldcountWalls(x1, y1, x2, y2) {
		tempObjects = this.gatherWalls();

		var ray = new Ray();
		ray.x = x1;
		ray.z = y1;
		ray.y = localPlayer.y;
		ray.theta = calculateAngle(ray.x, ray.z, x2, y2);
		var reached = false;
		var foundWalls = 0;
		for (var i = 0; i < Config.MAXRANGE; i++) {
			ray.theta = calculateAngle(ray.x, ray.z, x2, y2);
			ray.x += Math.cos(ray.theta);
			ray.z += Math.sin(ray.theta);
			// if (ray.x > x2) ray.x--;
			// if (ray.x < x2) ray.x++;
			// if (ray.z > y2) ray.z--;
			// if (ray.z < y2) ray.z++;
			// ray.x = x1 + (x2 - x1) * i / Config.MAXCRANGE;
			// ray.z = y1 + (y2 - y1) * i / Config.MAXRANGE;

			for (var l = 0; l < walls.length; l++) {


				if (isCollide3D(ray, walls[l])) {
					if (tempObjects[l].type == Types.DOOR) {

					}

					foundWalls++;

				}
			} // end for
			var tempObj = {
				x: x2,
				y: y2,
				width: 1,
				height: 1
			}

			if (isCollide(ray, tempObj)) {
				reached = true;

				break;
			} // end for

		} // end for




		if (reached == true) {

		}
		return foundWalls;
	} // end for


	countWalls(x1, y1, x2, y2) {
		tempObjects = this.gatherWalls();

		var wtemp = 0
		var wtempa = 0
		var wtempb = 0
		var wtempc = 0
		var tempzx = 0
		x1 = parseInt(x1);
		x2 = parseInt(x2);
		y1 = parseInt(y1);
		y2 = parseInt(y2);
		var reached = false;
		var foundWalls = 0;
		var ray = new Ray();
		for (var i = 0; i < Config.MAXRANGE; i++) {

			if (Math.abs(x1 - x2) < 1 && Math.abs(y1 - y2) < 1) { x1 = x2; y1 = y2; return wtemp; }
			wtempa = x2 - x1;
			wtempb = y2 - y1;
			if (wtempa + wtempb == 0) { return wtemp; }
			wtempc = 1 / (wtempa + wtempb)

			if (x1 > x2) { x1 = x1 - (wtempc * wtempa); }
			if (x1 < x2) { x1 = x1 + (wtempc * wtempa); }
			if (y1 > y2) { y1 = y1 - (wtempc * wtempb); }
			if (y1 < y2) { y1 = y1 + (wtempc * wtempb); }
			ray.x = x1;
			ray.z = y1;

			for (var j = 0; j < walls.length; j++) {


				if (distance(ray.x, ray.z, walls[j].x, walls[j].z) < 100) {

					if (!isCollide(ray, localPlayer)) {
						foundWalls++;
					}
				} // end if
			} // end for
			if (parseInt(ray.x) == parseInt(x2) && parseInt(ray.z) == parseInt(y2)) {
				reached = true;

				break;
			} // end for

		} // end for


		if (reached == true) {

		}


		return foundWalls;
	} // end for





	handleAcoustics() {

		for (var i = 0; i < quickSound.DSources.length; i++) {
			if ("undefined" != typeof quickSound.DSources[i]) {
				if (distance3D(quickSound.DSources[i].x, quickSound.DSources[i].y, quickSound.DSources[i].z, localPlayer.x, localPlayer.y, localPlayer.z) < 50) {

					var countedWalls = this.oldcountWalls(localPlayer.x, localPlayer.z, quickSound.DSources[i].x, quickSound.DSources[i].z);

					if (countedWalls > 1) {


						quickSound.DSources[i].muffle();
					} else {
						quickSound.DSources[i].unMuffle();
					} // end if

				} // end if
			} // end if

		} // end for

		for (var k = 0; k < this.gameObjects.length; k++) {
			if (this.gameObjects[k].type != Types.LOCALPLAYER && this.gameObjects[k].type != Types.WALL) {
				if ("undefined" != typeof this.gameObjects[k].muffle && "undefined" != typeof this.gameObjects[k].x) {
					if (distance(this.gameObjects[k].x, this.gameObjects[k].z, localPlayer.x, localPlayer.z) < 50) {
						debugstring = calculateAngle(localPlayer.x, localPlayer.z, this.gameObjects[k].x, this.gameObjects[k].z);
						var countedWalls = this.oldcountWalls(localPlayer.x, localPlayer.z, this.gameObjects[k].x, this.gameObjects[k].z);

						if (countedWalls > 0) {


							this.gameObjects[k].muffle();

						} else {
							this.gameObjects[k].unMuffle();

						} // end if
					} // end if
				} // end if
			} // end if

		} // end for





	} // end handleAcoustics

	getLocalPlayerSlot(id) {
		for (var i = 0; i < this.gameObjects.length; i++) {
			if (this.gameObjects[i].type == Types.LOCALPLAYER && this.gameObjects[i].id == id) {
				return i;
			}
		}
	}

	localPlayerDie() {
		removeKeys();
		socket.emit("getSpawnPoints");
	}



	handlePlayerRadar() {
		if (totalFrames % 30 == 0) {


			remotePlayers = this.gatherRemotePlayers();

			for (var i = 0; i < remotePlayers.length; i++) {
				if (distance(localPlayer.x, localPlayer.z, remotePlayers[i].x, remotePlayers[i].z) < 10) {
					if (parseInt(calculateAngle(localPlayer.x, localPlayer.z, remotePlayers[i].x, remotePlayers[i].z)) == parseInt(localPlayer.theta)) {
						quickSound.play("UI/radar/pingEnemy.ogg", remotePlayers[i].x, remotePlayers[i].y + remotePlayers[i].posHead, remotePlayers[i].z);
					}

				}

			}

		}

	}




} // end class
