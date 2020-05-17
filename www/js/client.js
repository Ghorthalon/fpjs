'use strict';





function connect(url = "", name = "WTF", voice = 1) {
	socket = io();
	console.log("I have voice " + localPlayer.voice);
	socket.emit("getPlayer", { "name": name, "voice": voice });

	setupSocketEvents();

} // end connect()


function syncLocalPlayer() {
	var tempPlayer = findPlayerByID(localPlayer.id);

	if (tempPlayer) {
		var temp = {
			x: tempPlayer.x,
			y: tempPlayer.y,
			z: tempPlayer.z,
			theta: tempPlayer.theta,
			moving: tempPlayer.moving,
			stepDirection: tempPlayer.stepDirection,
			id: tempPlayer.id,
			shooting: tempPlayer.shooting,
			speed: tempPlayer.speed,



		} // end tempPlayer
		socket.emit('sync', temp);
	} // end if

} // end sync

function setupSocketEvents() {
	socket.on("systemMessage", function (message) {
		quickSound.playMono("ui/system.ogg");
		speech.speak(message);
	});

	socket.on("playSound", function (soundDetail) {
		console.log("Supposed to play sound");
		quickSound.play(soundDetail.file, soundDetail.x, soundDetail.y, soundDetail.z);
	});

	socket.on("spawnPoints", function (points) {
		speech.speak("I have " + points.length + " spawnpoints");
		var pointNames = new Array();
		for (var i = 0; i < points.length; i++) {
			pointNames.push(world.getSpawnPointName(points[i]));

		} // end for
		var spawnPointsItem = new SelectorItem(0, "Spawn point", [pointNames]);
		var spawnPointsMenu = new Menu("Prespawn Menu", [spawnPointsItem]);
		spawnPointsMenu.run(function (event) {
			socket.emit("spawn", { "id": localPlayer.id, "position": points[event.items[0].value] });
			world.spawnPlayer(findPlayerByID(localPlayer.id), event.items[0].value);
			spawnPointsMenu.destroy();
			setupKeys();
		}); // end menuEvent


	}); // end spawnPoints

	socket.on("mapData", function (mapData) {
		var worldReader = new WorldReader(mapData);
		worldReader.loadMap();

		world.addGameObject(localPlayer);
		socket.emit("joinGame", localPlayer.id);
		setInterval(syncLocalPlayer, 30);
		// world.spawnPlayer(findPlayerByID(localPlayer.id), 0);
		socket.emit("getSpawnPoints");
		ready = 1;
	}); // end mapData


	socket.on("yourPlayer", function (player) {
		localPlayer = new Player(true);
		localPlayer.id = player.id;
		localPlayer.health = player.health;
		localPlayer.active = player.active;
		localPlayer.inventory = player.inventory;
		localPlayer.kills = player.kills;
		localPlayer.team = player.team;
		localPlayer.voice = player.voice;
		localPlayer.runningSpeed = player.runningSpeed;
		localPlayer.walkingSpeed = player.walkingSpeed;
		localPlayer.instanceWeapon = player.instanceWeapon;
		localPlayer.equipWeapon(player.instanceWeapon);
		speech.speak("Got ID " + localPlayer.id);
		socket.emit("getMap");

	}); // end yourPlayer

	socket.on('sync', function (player) {

		if (player.id != localPlayer.id) {

			var found = 0;

			for (var i = 0; i < world.gameObjects.length; i++) {
				if (world.gameObjects[i].type == Types.REMOTEPLAYER && world.gameObjects[i].id == player.id) {
					found = 1;

					world.gameObjects[i].x = player.x;
					world.gameObjects[i].y = player.y;
					world.gameObjects[i].z = player.z;
					world.gameObjects[i].theta = player.theta;
					if (player.moving == 1 && world.gameObjects[i].moving == 0) {


						world.gameObjects[i].moveForward();
					} else if (world.gameObjects[i].moving == 1 && player.moving == 0) {
						world.gameObjects[i].stopMoving();

					} // end if
					world.gameObjects[i].moving = player.moving;
					world.gameObjects[i].health = player.health;
					world.gameObjects[i].active = player.active;
					world.gameObjects[i].stepDirection = player.stepDirection;
					world.gameObjects[i].speed = player.speed;
					world.gameObjects[i].id = player.id;
				} // end if
			}

			if (found == 0 && player.id != localPlayer.id) {
				var addPlayer = new Player(false);
				addPlayer.x = player.x;
				addPlayer.y = player.y;
				addPlayer.z = player.z;
				addPlayer.health = player.health;
				addPlayer.moving = player.moving;
				addPlayer.theta = player.theta;
				addPlayer.id = player.id;
				addPlayer.voice = player.voice;
				addPlayer.active = player.active;
				addPlayer.instanceWeapon = player.instanceWeapon;
				addPlayer.equipWeapon(player.instanceWeapon);


				console.log("Added a player" + addPlayer.voice);
				world.addGameObject(addPlayer);
			} // end if

		} else {
			var slot = world.getLocalPlayerSlot(localPlayer.id);
			// world.gameObjects[slot].hurt(30000);

			world.gameObjects[slot].health = player.health;
			if (world.gameObjects[slot].active != player.active) {
				world.gameObjects[slot].hurt(30000);
			}

			world.gameObjects[slot].active = player.active;

		} // end if


	}); // end on



	socket.on("jump", function (id) {
		findPlayerByID(id).jump();

	}); // end on

	socket.on("startShooting", function (id) {

		findPlayerByID(id).startShooting();

	}); // end on
	socket.on("stopShooting", function (id) {
		findPlayerByID(id).weapon.stopShooting();
	}); // end on
	socket.on("startRunning", function (id) {

		findPlayerByID(id).startRunning();

	}); // end on
	socket.on("stopRunning", function (id) {
		findPlayerByID(id).stopRunning();
	}); // end on

	socket.on("spawn", function (point) {

		world.spawnPlayer(findPlayerByID(point.id), point.position);

	}); // end on

	socket.on('startMoving', function (id) {
		findPlayerByID(id).moveForward();

	}); // end on

	socket.on('stopMoving', function (id) {
		findPlayerByID(id).stopMoving();
	}); // end on
	socket.on('terminate', function (id) {
		findPlayerByID(id).toDestroy = true;
	}); // end on
}




function findPlayerByID(id) {

	for (var i = 0; i < world.gameObjects.length; i++) {
		if (world.gameObjects[i].id == id) {

			return world.gameObjects[i];
		} // end if
	} // end for

} // end function