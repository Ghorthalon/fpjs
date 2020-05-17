function handleKeyDown(event) {
	window.onbeforeunload = function () {
		return "Really wanna exit?";
	};

	// event.preventDefault();
	switch (event.which) {
		case KeyEvent.DOM_VK_L:
			speech.speak(debugstring);
			world.addGameObject(new Bullet(23, 8, 31, calculateAngle(23, 31, findPlayerByID(localPlayer.id).x, findPlayerByID(localPlayer.id).z), 0));
			break;
		case KeyEvent.DOM_VK_P:
			world.addGameObject(new Bullet(10, 3, 30, calculateAngle(10, 30, localPlayer.x, localPlayer.z), 420));
			break;
		case KeyEvent.DOM_VK_J:
			world.wallRadar.handleLeftRadar();
			break;
		case KeyEvent.DOM_VK_K:
			world.wallRadar.handleFrontRadar();
			break;
		case KeyEvent.DOM_VK_L:
			world.wallRadar.handleRightRadar();
			break;
		case KeyEvent.DOM_VK_I:
			// speech.speak(process.versions.electron);
			break;

		case KeyEvent.DOM_VK_Q:
			findPlayerByID(localPlayer.id).snapLeft();
			break;
		case KeyEvent.DOM_VK_E:
			findPlayerByID(localPlayer.id).snapRight();
			break;
		case KeyEvent.DOM_VK_O:
			speech.speak(world.gameObjects.length);
			break;
		case KeyEvent.DOM_VK_SPACE:
			findPlayerByID(localPlayer.id).jump(0.5);
			socket.emit('jump', localPlayer.id);
			break;

		case KeyEvent.DOM_VK_SHIFT:
			findPlayerByID(localPlayer.id).startRunning();

			socket.emit("startRunning", localPlayer.id);
			break;
		case KeyEvent.DOM_VK_W:
			findPlayerByID(localPlayer.id).moveForward();

			break;
		case KeyEvent.DOM_VK_D:
			findPlayerByID(localPlayer.id).stepDirection = 0.5 * Math.PI;
			findPlayerByID(localPlayer.id).moveForward();
			break;
		case KeyEvent.DOM_VK_A:
			findPlayerByID(localPlayer.id).stepDirection = 1.5 * Math.PI;
			findPlayerByID(localPlayer.id).moveForward();
			break;
		case KeyEvent.DOM_VK_RIGHT:
			findPlayerByID(localPlayer.id).turning = 1;
			findPlayerByID(localPlayer.id).turnDirection = 0.05;

			break;
		case KeyEvent.DOM_VK_LEFT:
			findPlayerByID(localPlayer.id).turning = 1;
			findPlayerByID(localPlayer.id).turnDirection = -0.05;

			break;
		case KeyEvent.DOM_VK_DOWN:
			findPlayerByID(localPlayer.id).stopMoving();


			break;

		case KeyEvent.DOM_VK_F:
			speech.speak("Direction " + parseInt(findPlayerByID(localPlayer.id).theta) + " x " + parseInt(findPlayerByID(localPlayer.id).x) + " y " + findPlayerByID(localPlayer.id).y + " z " + parseInt(findPlayerByID(localPlayer.id).z));
			break;
		case KeyEvent.DOM_VK_CONTROL:
			findPlayerByID(localPlayer.id).startShooting();
			socket.emit('startShooting', localPlayer.id);
			break;
	} // end switch
} // end keydown

function handleKeyUp(event) {
	switch (event.which) {
		case KeyEvent.DOM_VK_SHIFT:
			findPlayerByID(localPlayer.id).stopRunning();
			socket.emit("stopRunning", localPlayer.id);
			break;
		case KeyEvent.DOM_VK_W:
			findPlayerByID(localPlayer.id).stopMoving();

			break;
		case KeyEvent.DOM_VK_A:
			findPlayerByID(localPlayer.id).stepDirection = 0;
			findPlayerByID(localPlayer.id).stopMoving();
			break;
		case KeyEvent.DOM_VK_D:

			findPlayerByID(localPlayer.id).stepDirection = 0;
			findPlayerByID(localPlayer.id).stopMoving();
			break;
		case KeyEvent.DOM_VK_RIGHT:
			findPlayerByID(localPlayer.id).turning = 0;
			findPlayerByID(localPlayer.id).turnDirection = 0;

			break;
		case KeyEvent.DOM_VK_LEFT:
			findPlayerByID(localPlayer.id).turning = 0;
			findPlayerByID(localPlayer.id).turnDirection = 0;

			break;
		case KeyEvent.DOM_VK_DOWN:
			findPlayerByID(localPlayer.id).stopMoving();

			break;
		case KeyEvent.DOM_VK_CONTROL:
			findPlayerByID(localPlayer.id).weapon.stopShooting();
			socket.emit("stopShooting", localPlayer.id);
			break;
	} // end switch


}
