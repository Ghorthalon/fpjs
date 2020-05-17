var debugstring = "nothing";
var totalFrames = 0;
var useWebTTS = true;
var isElectron = false;
if (typeof process != "undefined") {
	isElectron = true;
}

var localPlayer = 0;
var socket = 0;
var quickSound = 0;
var collidableObjects = 0;
var walls = 0;
var remotePlayers = null;
var runningMenu = 0;
var tempObjects = new Array();
var spawnPoints = new Array();
