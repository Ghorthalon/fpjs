var fs = require("fs");
var gamemode = require("./gameModeLMS");
var utils = require('./util');
var index = require("./index");
var killMessages = require("./killMessages.json");

gameserver = function (sockets) {
	this.players = new Array();
	this.gameMode = new gamemode.GameMode(this);
	this.map = 0;
	this.io = sockets;
} // end constructor

gameserver.prototype = {
	addPlayer: function (player, id) {

		player.connectionID = id;
		this.players.push(player);
	}, // end addPlayer
	findPlayerByID: function (id) {
		var found = 0;
		for (var i = 0; i < this.players.length; i++) {
			if (id == this.players[i].id) {
				return this.players[i];
			} // end if
		} // end for
		return -1;
	}, // end function
	removePlayer: function (id) {
		for (var i = 0; i < this.players; i++) {
			if (this.players[i].id == id) {
				this.players.splice(i, 1);
			} // end if
		} // end for
	}, // end function
	loadMap: function (name) {
		this.map = JSON.parse(fs.readFileSync("map.json", "utf8"));
	},
	getSpawnPoints: function () {
		var points = new Array();
		if (this.map.spawnPoints.length > 3) {
			for (var i = 0; i < 3; i++) {
				points.push(utils.randomInt(0, this.map.spawnPoints.length - 1));
			} // end for
		} else {
			for (var i = 0; i < this.map.spawnPoints.length; i++) {
				points.push(i);
			}
		}
		return points;
	},
	hitPlayer: function (id, originalid) {
		console.log(id + " hit " + originalid);
		var player = this.findPlayerByID(id);
		var originPlayer = this.findPlayerByID(originalid);
		if (player.active == true && originPlayer.active == true) {
			player.hurt(originPlayer.weapon.damage);
			if (player.health < 1) {
				console.log("Player died, what a shame!");
				this.io.sockets.emit("playSound", { "file": "ui/deathquotes/" + utils.randomInt(1, 55) + ".ogg", "x": originPlayer.x, "y": originPlayer.y + 2, "z": originPlayer.z });
				originPlayer.kills++;
				this.sendRandomKillMessage(player.name, originPlayer.name);
			}
		}


	},
	update: function () {

	},
	startShooting(id) {
		var player = this.findPlayerByID(id);
		if (player != -1 && player.active == true) {
			player.shooting = 1;
		}
	},
	stopShooting(id) {
		var player = this.findPlayerByID(id);
		if (player != -1) {
			player.shooting = 0;
		}
	},
	startMoving(id) {
		var player = this.findPlayerByID(id);
		if (player != -1 && player.active == true) {
			player.moving = 1;
		}
	},
	stopMoving(id) {
		var player = this.findPlayerByID(id);
		if (player != -1 && player.active == true) {
			player.moving = 0;
		}
	},
	spawn(point) {
		var player = this.findPlayerByID(point.id);
		if (player != -1) {
			player.active = true;
			player.health = player.maxHealth;
		}
	},

	stopAllPlayers() {
		for (var i = 0; i < this.players.length; i++) {
			this.players[i].active = false;
		}
	},
	startAllPlayers() {
		for (var i = 0; i < this.players.length; i++) {
			this.players[i].active = true;
		}
	},


	sendRandomKillMessage(player, originPlayer) {
		this.io.sockets.emit("systemMessage", player + " ate " + originPlayer + "'s broomstick");
	}

} // end prototype

module.exports.gameserver = gameserver;
module.exports.gameserver.loadMap = gameserver.loadMap;