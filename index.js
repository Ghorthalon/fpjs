var express = require('express');
var app = express();
app.use(express.static(__dirname + '/www'));
var gameserverReq = require("./gameserver");
var playerReq = require("./player");
var socketHolderReq = require("./socketHolder");
var utils = require("./util");

var server = app.listen(process.env.PORT || 3000, function () {
	var port = server.address().port;
	console.log('Server running at port %s', port);
});

var io = require('socket.io')(server)
var fs = require("fs");
var weaponStorage = require('./weapons.json');
var characterStorage = require("./characters.json");
var gameServer = new gameserver(io);
var sockets = new Array();

initialize();

function initialize() {
	gameServer.loadMap("map");
}

io.sockets.on('connection', function (client) {

	client.on("getSpawnPoints", function () {
		console.log("Requesting spawn points");
		client.emit("spawnPoints", gameServer.getSpawnPoints());
	});


	client.on("getPlayer", function (playerClass) {
		var tempPlayer = new player();
		tempPlayer.x = 0;
		tempPlayer.y = 0;
		tempPlayer.z = 0;
		tempPlayer.health = 50;
		tempPlayer.theta = 0;
		tempPlayer.active = false;
		tempPlayer.id = null;
		tempPlayer.shooting = false;
		tempPlayer.connectionID = 0;
		tempPlayer.stepDirection = 0;
		tempPlayer.inventory = [];
		tempPlayer.kills = 0;
		tempPlayer.name = playerClass.name;
		tempPlayer.team = 0;
		tempPlayer.voice = playerClass.voice;

		var weapon = findWeaponByName(characterStorage.characters[playerClass.voice - 1].weaponName);
		tempPlayer.instanceWeapon = weaponStorage.weapons[weapon];
		tempPlayer.weapon = weaponStorage.weapons[weapon];
		console.log("Trying to generate ID for " + tempPlayer.voice);
		var id = utils.randomInt(0, 32767);
		while (findPlayerByID(id) != undefined) {
			var id = utils.randomInt(0, 32767);
		}
		tempPlayer.id = id;
		tempPlayer.walkingSpeed = characterStorage.characters[playerClass.voice - 1].walkingSpeed;
		tempPlayer.runningSpeed = characterStorage.characters[playerClass.voice - 1].runningSpeed;
		gameServer.addPlayer(tempPlayer, 0);
		client.emit("yourPlayer", tempPlayer);
	});
	client.on("getMap", function () {

		client.emit("mapData", gameServer.map);
	});
	client.on("hitPlayer", function (id) {
		gameServer.hitPlayer(id, findPlayerBySocketID(client.id).id);
	});

	client.on('joinGame', function (id) {



		console.log("Player " + id + " joined the game");
		gameServer.findPlayerByID(id).connectionID = client.id;



	}); // end joinGame
	client.on("startShooting", function (id) {

		client.broadcast.emit('startShooting', id);
		gameServer.startShooting(id);
	}); // end on
	client.on("jump", function (id) {

		client.broadcast.emit('jump', id);

	}); // end on
	client.on('leaveGame', function (id) {

		client.broadcast.emit('terminate', id);
	}); // end on
	client.on('startMoving', function (id) {
		client.broadcast.emit('startMoving', id);
		gameServer.startMoving(id);

	}); // end on
	client.on('stopMoving', function (id) {
		client.broadcast.emit('stopMoving', id);
		gameServer.stopMoving(id);

	}); // end on
	client.on('spawn', function (point) {
		gameServer.spawn(point);

		client.broadcast.emit('spawn', { "id": point.id, "position": point.position });
	});
	client.on('sync', function (player) {

		for (var i = 0; i < gameServer.players.length; i++) {
			if (player.id == gameServer.players[i].id) {
				// if (utils.distance3D(gameServer.players[i].x, gameServer.players[i].y, gameServer.players[i].z, player.x, player.y, player.z) < 3) {
				gameServer.players[i].x = player.x;
				gameServer.players[i].y = player.y;
				gameServer.players[i].z = player.z;
				// console.log("Accepted!");
				// }

				gameServer.players[i].moving = player.moving;
				gameServer.players[i].shooting = player.shooting;
				gameServer.players[i].stepDirection = player.stepDirection;
				gameServer.players[i].id = player.id;
				gameServer.players[i].theta = player.theta;
				gameServer.players[i].speed = player.speed;
				if (gameServer.players[i].health < 1) {
					gameServer.players[i].active = false;
				}

				// client.broadcast.emit('sync', gameServer.players[i]);
			} // endif
		} // end for

	}); // end on
	client.on("stopShooting", function (id) {
		client.broadcast.emit("stopShooting", id);
		gameServer.stopShooting(id);

	}); // end on
	client.on("startRunning", function (id) {
		client.broadcast.emit("startRunning", id);


	}); // end on
	client.on("stopRunning", function (id) {
		client.broadcast.emit("stopRunning", id);


	}); // end on
	client.on('disconnect', function (id) {

		var socketSlot = findSocketSlotBySocket(client.id);

		if (socketSlot > -1) {
			var id = gameServer.players[socketSlot].id;
			client.broadcast.emit('terminate', id);

			// gameServer.removePlayer(id);
			gameServer.players.splice(socketSlot, 1);
			console.log("Player " + id + " has disconnected");
		} else {
			console.log("Someone tried to disconnect with undefined socket");

		} // end if

	}); // end on

}); // end connection

setInterval(syncGame, 30);

function syncGame() {

	gameServer.gameMode.update();
	gameServer.players.forEach(function (player) {
		if (player.connectionID != 0) {
			io.sockets.emit('sync', player);
		}

	});
	gameServer.update();
} // end syncGame
function findPlayerByID(id) {

	for (var i = 0; i < gameServer.players.length; i++) {
		if (id == gameServer.players[i].id) {
			return gameServer.players[i];
		} // end if
	} // end for
} // end function
function findPlayerBySocketID(id) {
	for (var i = 0; i < gameServer.players.length; i++) {
		if (gameServer.players[i].connectionID == id) {
			return gameServer.players[i];
		}
	}
}

function findSocketByPlayerID(id) {
	for (var i = 0; i < sockets.length; i++) {
		if (sockets[i].player.id == id) {
			return sockets[i];
		} // end if
	} // end for
} // end function

function findSocketSlotBySocket(id) {

	for (var j = 0; j < gameServer.players.length; j++) {

		if (id == gameServer.players[j].connectionID) {

			console.log("found " + gameServer.players[j].connectionID);
			return j;
		} // end if
	} // end for
	return -1;
} // end function

function showAllID() {
	gameServer.players.forEach(function (player) {
		console.log("Player ID: " + player.connectionID);
	}); // end forEach

} // end function




function findWeaponByName(name) {
	for (var i = 0; i < weaponStorage.weapons.length; i++) {
		if (weaponStorage.weapons[i].name == name) {
			return i;
		}
	}
}
