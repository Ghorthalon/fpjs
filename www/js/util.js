'use strict';
function isCollidePointWithRect(point, rect) {
	return (point.x >= rect.x && point.x <= rect.x + rect.width) && (point.z >= rect.z && point.z <= rect.z + rect.depth);
}


function isCollide(a, b) {
	return !(((a.z + a.depth) <= (b.z)) || (a.z >= (b.z + b.depth)) || ((a.x + a.width) <= b.x) || (a.x >= (b.x + b.width)));
	// return !(r1.x>r2.x+r2.width || r1.x+r1.width<r2.x || r1.z>r2.z+r2.depth || r1.z+r1.depth<r2.z);
}
function isCollideShort(a, b) {
	return !(((a.z + a.depth) < (b.z)) || (a.z > (b.z + b.depth)) || ((a.x + a.width) < b.x) || (a.x > (b.x + b.width)));
}
function isCollide3D(a, b) {
	return (a.x <= (b.x + b.width) && (a.x + a.width) >= b.x) && (a.y <= (b.y + b.height) && (a.y + a.height) >= b.y) && (a.z <= (b.z + b.depth) && (a.z + a.depth) >= b.z);
}
function oldcalculateAngle(x1, y1, x2, y2) {
	var dot = x1 * x2 + y1 * y2
	var det = x1 * y2 - y1 * x2
	var angle = Math.atan2(dot, det)
	return angle;
}
function calculateAngle(x1, y1, x2, y2) {
	// var angle = Math.atan2((y2-y1), (x2-x1));
	// return angle;

	return Math.atan2((y2 - y1), (x2 - x1));
}


function calculateAngleNope(x1, y1, x2, y2) {
	if ((x2 > x1)) {
		//above 0 to 180 degrees
		return (Math.atan2((y2 - y1), (x2 - x1)));
	} else if ((x2 < x1)) {
		//above 180 degrees to 360/0
		return (Math.atan2((y2 - y1), (x1 - x2)));
	}//End if

}



function distance3D(x1, y1, z1, x2, y2, z2) {
	return Math.sqrt((x2 - x1) * (x2 - x1) +
		(y2 - y1) * (y2 - y1) +
		(z2 - z1) * (z2 - z1));
}

function distance(jx, jy, kx, ky) {
	//return Math.hypot(jx-kx, jy-ky)
	return Math.sqrt(((jx - kx) * (jx - kx)) + ((jy - ky)) * (jy - ky))
}

function randomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

Array.min = function (array) {
	return Math.min.apply(Math, array);
};


