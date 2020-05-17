'use strict';

function isCollide(a, b) {
	return !(((a.z + a.depth) < (b.z)) || (a.z > (b.z + b.depth)) || ((a.x + a.width) < b.x) || (a.x > (b.x + b.width)));
}

function isCollide3D(a, b) {
	return (a.x <= (b.x + b.width) && (a.x + a.width) >= b.x) && (a.y <= (b.y + b.height) && (a.y + a.height) >= b.y) && (a.z <= (b.z + b.depth) && (a.z + a.depth) >= b.z);
}




function calculateAngle(x1, y1, x2, y2) {
	var angle = Math.atan2(y2 - y1, x2 - x1);
	if (angle < 0) {
		angle += 2 * Math.PI;
	}
	return angle;
}

function distance3D(x1, y1, z1, x2, y2, z2) {
	return Math.sqrt((x2 - x1) * (x2 - x1) +
		(y2 - y1) * (y2 - y1) +
		(z2 - z1) * (z2 - z1));
}

function distance(jx, jy, kx, ky) {

	return Math.sqrt(((jx - kx) * (jx - kx)) + ((jy - ky)) * (jy - ky))
}

function randomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}




module.exports.randomInt = randomInt;
module.exports.distance3D = distance3D;