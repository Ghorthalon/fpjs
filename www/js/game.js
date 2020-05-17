'use strict';
var ready = 0;
var debugsound = new SoundSource("click.wav");
var speech = new TTS();
var tempPlayer = 0;

var world = new World();








$(document).ready(function () {
	speech.speak("this is a test");






	writeConfig();
	readConfig();

	mainMenu();



}); // end ready
function setupKeys() {
	$(document).keydown(handleKeyDown);
	$(document).keyup(handleKeyUp);
}

function removeKeys() {
	$(document).off("keydown");
	$(document).off("keyup");
}



function gameLoop() {
	window.requestAnimationFrame(gameLoop);

	// if (ready) {
	tempPlayer = findPlayerByID(localPlayer.id);




	var t0 = performance.now();
	world.update();

	var t1 = performance.now();
	// if (t1-t0 > 1) debugsound.play();
	// }


}

function findPlayerByID(id) {

	for (var i = 0; i < world.gameObjects.length; i++) {
		if (world.gameObjects[i].id == id) {

			return world.gameObjects[i];
		} // end if
	} // end for

} // end function

function writeConfig() {
	if (window.localStorage != undefined) {
		localStorage.options = "Eyyyy";
	}

}
function readConfig() {
	if (window.localStorage != undefined) {
		if (localStorage.options) {
			console.log(localStorage.options);
		}
	}

}

