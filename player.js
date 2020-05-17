var weapon = require("./weapon");
player = function () {
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.health = 0;
	this.maxHealth = 100;
	this.theta = 0;
	this.active = false;
	this.id = null;
	this.shooting = false;
	this.connectionID = 0;
	this.stepDirection = 0;
	this.inventory = [];
	this.kills = 0;
	this.name = "Dude";
	this.team = 0;
	this.voice = 0;
	this.weapon = null;

	this.walkingSpeed = 0.025;
	this.runningSpeed = 0.05;
}

player.prototype = {
	addPlayer: function () {
		console.log("yay!");
	}, // end addPlayer
	hurt: function (damage) {
		console.log("Damage: " + damage);
		this.health -= damage;
		console.log("Health: " + this.health);
		if (this.health < 0) {
			this.active = false;
		}
	}

} // end prototype

module.exports.player = player;