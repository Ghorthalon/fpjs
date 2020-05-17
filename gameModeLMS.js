GameModeLMS = function (server) {
	this.server = server;
	this.players = this.server.players;
	this.oldPlayerCount = 0;
}


GameModeLMS.prototype = {
	update: function () {
		if (this.players.length != this.oldPlayerCount) {
			// console.log("Oh god we have someone new!");
		}


	}

}

module.exports.GameMode = GameModeLMS;