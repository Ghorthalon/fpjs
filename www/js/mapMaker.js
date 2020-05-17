var isElectron = false;
var useWebTTS = false;
class Platform {
	constructor(x, y, z, width, height, depth, type) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.type = type;
		this.sound = new SoundSource("physics/land/" + this.type + ".ogg");
	} // end constructor
} // end class

class Door {
	constructor(x, y, z, width, height, depth, type) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.type = type;
		this.sound = new SoundSource("physics/door/" + this.type + "/loop.ogg");
		this.sound.loop(true);
		this.sound.pos(x + (width / 2), y + (height / 2), z + (depth / 2));
		this.sound.play();
	} // end constructor
} // end class

class Wall {
	constructor(x, y, z, width, height, depth) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.width = width;
		this.height = height;
		this.depth = depth;

		this.sound = new SoundSource("physics/collisions/hit_wall.ogg");
	} // end constructor
} // end class
class Source {
	constructor(x, y, z, type) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.width = 1;
		this.height = 1;
		this.depth = 1;
		this.type = type;
		this.sound = new SoundSource("ambience/" + this.type + ".ogg");
		this.sound.loop(true);
		this.sound.pos(x, y, z);
		this.sound.play();
	} // end const
} // end class

class AreaEffect {
	constructor(x, y, z, width, height, depth, name, type) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.name = name;
		this.type = type;
	}
}
class SpawnPoint {
	constructor(x, y, z, name) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.name = name;
		this.sound = new SoundSource("player/duck.ogg");
	}
}



var platformIterator = 0;
var wallIterator = 0;
var doorIterator = 0;
var sourceIterator = 0;
var spawnPointIterator = 0;
var areaEffectIterator = 0;
var platforms = new Array();
var sources = new Array();
var doors = new Array();
var walls = new Array();
var spawnPoints = new Array();
var areaEffects = new Array();
var selection = {
	x: 0,
	y: 0,
	z: 0,
	width: 0,
	height: 0,
	depth: 0
}


var cursor = {
	x: 0,
	y: 0,
	z: 0,
	stepsize: 1,
	width: 1,
	height: 1,
	depth: 1
}


var speech = new TTS();


function testThings() {
	speech.speak("Loaded map maker");
	$(document).keydown(function (event) {
		switch (event.which) {
			case KeyEvent.DOM_VK_0:
				enterSelection();
				break;

			case KeyEvent.DOM_VK_DELETE:
				removeItemAtCursor();
				break;
			case KeyEvent.DOM_VK_O:
				advancePlatform();
				break;
			case KeyEvent.DOM_VK_E:
				advanceDoor();
				break;
			case KeyEvent.DOM_VK_X:
				advanceSource();
				break;
			case KeyEvent.DOM_VK_Q:
				advanceWall();
				break;
			case KeyEvent.DOM_VK_V:
				moveX();
				break;
			case KeyEvent.DOM_VK_B:
				moveY();
				break;
			case KeyEvent.DOM_VK_N:
				moveZ();
				break;

			case KeyEvent.DOM_VK_C:
				speech.speak("Coordinates: " + cursor.x + ", " + cursor.y + ", " + cursor.z);
				break;
			case KeyEvent.DOM_VK_1:
				selection.x = cursor.x;
				speech.speak("Set X1 at " + cursor.x);
				break;
			case KeyEvent.DOM_VK_2:
				selection.width = cursor.x - selection.x;
				speech.speak("Set width to  " + selection.width);
				break;
			case KeyEvent.DOM_VK_3:
				selection.z = cursor.z;
				speech.speak("Set Z1 at " + cursor.z);
				break;
			case KeyEvent.DOM_VK_4:
				selection.depth = cursor.z - selection.z;
				speech.speak("Set depth to  " + selection.depth);
				break;
			case KeyEvent.DOM_VK_5:
				selection.y = cursor.y;
				speech.speak("Set y1 at " + cursor.y);
				break;
			case KeyEvent.DOM_VK_6:
				selection.height = cursor.y - selection.y;
				speech.speak("Set height  to  " + selection.height);
				break;
			case KeyEvent.DOM_VK_UP:
				moveBackward();
				break;
			case KeyEvent.DOM_VK_DOWN:
				moveForward();
				break;
			case KeyEvent.DOM_VK_LEFT:
				moveLeft();
				break;
			case KeyEvent.DOM_VK_RIGHT:
				moveRight();
				break;
			case KeyEvent.DOM_VK_A:
				moveUpward();
				break;
			case KeyEvent.DOM_VK_Z:
				moveDownward();
				break;
			case KeyEvent.DOM_VK_P:
				insertPlatform();
				break;
			case KeyEvent.DOM_VK_S:
				insertSource();
				break;
			case KeyEvent.DOM_VK_W:
				insertWall();
				break;
			case KeyEvent.DOM_VK_D:
				insertDoor();
				break;
			case KeyEvent.DOM_VK_U:
				insertAreaEffect();
				break;
			case KeyEvent.DOM_VK_T:
				insertSpawnPoint();
				break;
			case KeyEvent.DOM_VK_I:
				advanceAreaEffect();
				break;
			case KeyEvent.DOM_VK_R:
				advanceSpawnPoint();
				break;
			case KeyEvent.DOM_VK_RETURN:
				saveMap();
				break;
			case KeyEvent.DOM_VK_TAB:
				loadMap();
				break;

		} // end switch

	}); // end keydown
}


function moveForward() {
	cursor.z += cursor.stepsize;
	checkMove();
}

function moveBackward() {
	cursor.z -= cursor.stepsize;
	checkMove();
}

function moveLeft() {
	cursor.x -= cursor.stepsize;
	checkMove();
} // end moveLeft

function moveRight() {
	cursor.x += cursor.stepsize;
	checkMove();
}

function moveUpward() {
	cursor.y += cursor.stepsize;
	checkMove();
}
function moveDownward() {
	cursor.y -= cursor.stepsize;
	checkMove();
}


function insertPlatform() {

	speech.speak("type");
	var type = prompt("type");
	platforms.push(new Platform(selection.x, selection.y, selection.z, selection.width, selection.height, selection.depth, type));
	speech.speak("insert platform from " + selection.x + ", " + selection.y + ", " + selection.z + ", to " + (1 * selection.x + selection.width) + ", " + (1 * selection.y + selection.height) + ", " + (1 * selection.z + selection.depth));
}

function insertAreaEffect() {

	speech.speak("type");
	var type = prompt("type");
	speech.speak("name");
	var name = prompt("name");
	areaEffects.push(new AreaEffect(selection.x, selection.y, selection.z, selection.width, selection.height, selection.depth, type, name));
	speech.speak("insert platform from " + selection.x + ", " + selection.y + ", " + selection.z + ", to " + (1 * selection.x + selection.width) + ", " + (1 * selection.y + selection.height) + ", " + (1 * selection.z + selection.depth));
}


function insertWall() {
	walls.push(new Wall(selection.x, selection.y, selection.z, selection.width, selection.height, selection.depth));
	speech.speak("Insert wall from " + selection.x + ", " + selection.y + ", " + selection.z + ", to " + (1 * selection.x + selection.width) + ", " + (1 * selection.y + selection.height) + ", " + (1 * selection.z + selection.depth));
}

function insertSource() {
	name = prompt("Type");
	sources.push(new Source(cursor.x, cursor.y, cursor.z, name));
	speech.speak("Insert source");
}
function insertSpawnPoint() {
	name = prompt("Name");
	spawnPoints.push(new SpawnPoint(cursor.x, cursor.y, cursor.z, name));
	speech.speak("Insert spawnpoint");
}
function insertDoor() {

	var type = prompt("type");
	doors.push(new Door(selection.x, selection.y, selection.z, selection.width, selection.height, selection.depth, type));
	speech.speak("Insert door from " + selection.x + ", " + selection.y + ", " + selection.z + ", to " + (1 * selection.x + selection.width) + ", " + (1 * selection.y + selection.height) + ", " + (1 * selection.z + selection.depth));
}

function loadMap() {
	speech.speak("Loading");
	sono.destroyAll();
	walls = [];
	platforms = [];
	doors = [];
	sources = [];
	var spawnPoints = [];
	var areaEffects = [];

	var mapToLoad = JSON.parse(document.getElementById("loadmap").value);
	mapToLoad.platforms.forEach(function (platform) {
		platforms.push(new Platform(platform.x, platform.y, platform.z, platform.width, platform.height, platform.depth, platform.type));
	}); // end platform
	mapToLoad.walls.forEach(function (platform) {
		walls.push(new Wall(platform.x, platform.y, platform.z, platform.width, platform.height, platform.depth));
	}); // end platform
	mapToLoad.doors.forEach(function (platform) {
		doors.push(new Door(platform.x, platform.y, platform.z, platform.width, platform.height, platform.depth, platform.type));
	}); // end platform
	mapToLoad.sources.forEach(function (platform) {
		sources.push(new Source(platform.x, platform.y, platform.z, platform.type));
	}); // end platform
	mapToLoad.spawnPoints.forEach(function (platform) {
		spawnPoints.push(new SpawnPoint(platform.x, platform.y, platform.z, platform.type));
	}); // end platform
	mapToLoad.areaEffects.forEach(function (platform) {
		areaEffects.push(new AreaEffect(platform.x, platform.y, platform.z, platform.width, platform.height, platform.depth, platform.type, platform.name));
	}); // end platform
	speech.speak("loaded");
}

function saveMap() {
	var mapToSave = {
		sources: [],
		walls: [],
		platforms: [],
		doors: [],
		areaEffects: [],
		spawnPoints: []
	}
	platforms.forEach(function (platform) {
		var pushPlatform = {
			x: platform.x,
			y: platform.y,
			z: platform.z,
			width: platform.width,
			height: platform.height,
			depth: platform.depth,
			type: platform.type
		} // end obj
		mapToSave.platforms.push(pushPlatform);
	}); // forEach
	areaEffects.forEach(function (platform) {
		var pushPlatform = {
			x: platform.x,
			y: platform.y,
			z: platform.z,
			width: platform.width,
			height: platform.height,
			depth: platform.depth,
			type: platform.type,
			name: platform.name
		} // end obj
		mapToSave.areaEffects.push(pushPlatform);
	}); // forEach
	walls.forEach(function (platform) {
		var pushPlatform = {
			x: platform.x,
			y: platform.y,
			z: platform.z,
			width: platform.width,
			height: platform.height,
			depth: platform.depth,

		} // end obj
		mapToSave.walls.push(pushPlatform);
	}); // forEach
	doors.forEach(function (platform) {
		var pushPlatform = {
			x: platform.x,
			y: platform.y,
			z: platform.z,
			width: platform.width,
			height: platform.height,
			depth: platform.depth,
			type: platform.type
		} // end obj
		mapToSave.doors.push(pushPlatform);
	}); // forEach
	sources.forEach(function (platform) {
		var pushPlatform = {
			x: platform.x,
			y: platform.y,
			z: platform.z,

			type: platform.type
		} // end obj
		mapToSave.sources.push(pushPlatform);
	}); // forEach
	spawnPoints.forEach(function (platform) {
		var pushPlatform = {
			x: platform.x,
			y: platform.y,
			z: platform.z,

			type: platform.type,
			name: platform.name
		} // end obj
		mapToSave.spawnPoints.push(pushPlatform);
	}); // forEach
	document.getElementById("savemap").value = JSON.stringify(mapToSave);

	speech.speak("Save map");
}

function checkMove() {
	for (var i = 0; i < platforms.length; i++) {
		if (isCollide3D(cursor, platforms[i])) {
			platforms[i].sound.pos(cursor.x, cursor.y, cursor.z);
			platforms[i].sound.howl.seek(0);
			platforms[i].sound.play();
		} // end if

	} // end for
	for (var i = 0; i < walls.length; i++) {
		if (isCollide3D(cursor, walls[i])) {
			walls[i].sound.pos(cursor.x, cursor.y, cursor.z);
			walls[i].sound.play();
		} // end if
	} // end for

	for (var i = 0; i < spawnPoints.length; i++) {
		if (cursor.x == spawnPoints[i].x && cursor.y == spawnPoints[i].y && cursor.z == spawnPoints[i].z) {
			spawnPoints[i].sound.play();
		}
	}

	for (var i = 0; i < areaEffects.length; i++) {
		if (isCollide3D(cursor, areaEffects[i])) {
			speech.speak(areaEffects[i].name);
		}
	}

	sono.panner.setListenerPosition(cursor.x, cursor.y, cursor.z);
} // end function

function moveX() {
	var x = prompt("Enter X");
	cursor.x = parseInt(x);
	checkMove();
} // end function

function moveY() {
	var y = prompt("Enter y:");
	cursor.y = parseInt(y);
	checkMove();
}


function moveZ() {
	var z = prompt("Enter Z");
	cursor.z = parseInt(z);
	checkMove();
}

function advanceSpawnPoint() {
	cursor.x = spawnPoints[spawnPointIterator].x;
	cursor.y = spawnPoints[spawnPointIterator].y;
	cursor.z = spawnPoints[spawnPointIterator].z;
	speech.speak("spawn point  " + spawnPointIterator + ". Moved to " + cursor.x + ", " + cursor.y + ", " + cursor.z);
	checkMove();
	spawnPointIterator++;
	if (spawnPointIterator >= spawnPoints.length) {
		spawnPointIterator = 0;
	}
}

function advanceAreaEffect() {
	cursor.x = areaEffects[areaEffectIterator].x;
	cursor.y = areaEffects[areaEffectIterator].y;
	cursor.z = areaEffects[areaEffectIterator].z;
	speech.speak("area effect " + areaEffectIterator + ". Moved to " + cursor.x + ", " + cursor.y + ", " + cursor.z);
	checkMove();
	areaEffectIterator++;
	if (areaEffectIterator >= areaEffects.length) {
		areaEffectIterator = 0;
	}
}

function advancePlatform() {
	cursor.x = platforms[platformIterator].x;
	cursor.y = platforms[platformIterator].y;
	cursor.z = platforms[platformIterator].z;
	speech.speak("Platform " + platformIterator + ". Moved to " + cursor.x + ", " + cursor.y + ", " + cursor.z);
	checkMove();
	platformIterator++;
	if (platformIterator >= platforms.length) {
		platformIterator = 0;
	}

}



function advanceSource() {
	cursor.x = sources[sourceIterator].x;
	cursor.y = sources[sourceIterator].y;
	cursor.z = sources[sourceIterator].z;
	speech.speak("Source " + sourceIterator + ". Moved to " + cursor.x + ", " + cursor.y + ", " + cursor.z);
	checkMove();
	sourceIterator++;
	if (sourceIterator >= sources.length) {
		sourceIterator = 0;
	}

}


function advanceWall() {
	cursor.x = walls[wallIterator].x;
	cursor.y = walls[wallIterator].y;
	cursor.z = walls[wallIterator].z;
	speech.speak("Wall " + wallIterator + ". Moved to " + cursor.x + ", " + cursor.y + ", " + cursor.z);
	checkMove();
	wallIterator++;
	if (wallIterator >= walls.length) {
		wallIterator = 0;
	}

}


function advanceDoor() {
	cursor.x = doors[doorIterator].x;
	cursor.y = doors[doorIterator].y;
	cursor.z = doors[doorIterator].z;
	speech.speak("Door " + doorIterator + ". Moved to " + cursor.x + ", " + cursor.y + ", " + cursor.z);
	checkMove();
	doorIterator++;
	if (doorIterator >= doors.length) {
		doorIterator = 0;
	}

}

function removeItemAtCursor() {
	for (var i = 0; i < walls.length; i++) {
		if (isCollide3D(walls[i], cursor)) {
			speech.speak("Removing wall at " + walls[i].x + ", " + walls[i].y + ", " + walls[i].z);
			walls.splice(i, 1);
		} // end if
	} // end for
	for (var i = 0; i < platforms.length; i++) {
		if (isCollide3D(platforms[i], cursor)) {
			speech.speak("Removing platform at " + walls[i].x + ", " + walls[i].y + ", " + walls[i].z);
			platforms.splice(i, 1);
		} // end if
	} // end for

	for (var i = 0; i < sources.length; i++) {
		if (isCollide3D(sources[i], cursor)) {
			speech.speak("Removing source at " + sources[i].x + ", " + sources[i].y + ", " + sources[i].z);
			sources[i].sound.stop();
			sources.splice(i, 1);

		} // end if
	} // end for
	for (var i = 0; i < doors.length; i++) {
		if (isCollide3D(doors[i], cursor)) {
			speech.speak("Removing door at " + doors[i].x + ", " + doors[i].y + ", " + doors[i].z);
			doors[i].sound.stop();
			doors.splice(i, 1);

		} // end if
	} // end for
	for (var i = 0; i < areaEffects.length; i++) {
		if (isCollide3D(areaEffects[i], cursor)) {
			speech.speak("Removing door at " + areaEffects[i].x + ", " + areaEffects[i].y + ", " + areaEffects[i].z);
			doors[i].sound.stop();
			doors.splice(i, 1);

		} // end if
	} // end for

}


function enterSelection() {
	speech.speak("From X");
	var x = prompt("X:");
	speech.speak("To X:");
	var width = prompt("Width");
	speech.speak("Z");
	var z = prompt("Z:");
	speech.speak("Depth");
	var depth = prompt("Depth");
	speech.speak("Y");
	var y = prompt("Y:");
	speech.speak("Height");
	var height = prompt("Height");
	selection.x = parseInt(x);
	selection.width = parseInt(width);
	selection.y = parseInt(y);
	selection.height = parseInt(height);
	selection.z = parseInt(z);
	selection.depth = parseInt(depth);
	speech.speak("Selected from " + selection.x + ", " + selection.y + ", " + selection.z + ", to " + (1 * selection.x + selection.width) + ", " + (1 * selection.y + selection.height) + ", " + (1 * selection.z + selection.depth));
}



function isCollide3D(a, b) {
	return (a.x < (b.x + b.width) && (a.x + a.width) > b.x) && (a.y < (b.y + b.height) && (a.y + a.height) > b.y) && (a.z < (b.z + b.depth) && (a.z + a.depth) > b.z);
}