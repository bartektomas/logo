/**
 * Logo painter program.
 * There are various "ships" and one canvas
 */

let spiral = require('spiral-2d/archimedean');
require('enable-mobile');

let canvas = document.body.appendChild(document.createElement('canvas'));

canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;

let cx = canvas.width / 2;
let cy = canvas.height / 2;

let context = canvas.getContext('2d');


context.lineJoin = 'round';
context.lineCap = 'round';
context.lineWidth = 8;

let lastX = cx, lastY = cy;



for (let angle = Math.PI * .0; angle <= Math.PI * 17; angle+=Math.PI/64) {
	context.beginPath();
	context.moveTo(lastX, lastY);

	context.lineWidth = (13 + 0*Math.sin(angle/3 + Math.PI*1.666));
	let r = -Math.PI * (angle + tri(angle * 8) * angle * .02 ) + 0*Math.sin(angle/3);

	let x = cx + -r * Math.cos(angle);
	let y = cy + r * Math.sin(angle);
    context.lineTo(x, y);
	context.stroke();
	context.closePath();

	lastX = x; lastY = y;
}

// context.strokeStyle = 'red';


//approx triangle by sines
function tri (angle) {
	return 3 * (
		Math.sin(angle)
		- 1*Math.sin(3*angle)/9
		+ 1*Math.sin(5*angle)/25
		- 1*Math.sin(7*angle)/49
		+ 1*Math.sin(9*angle)/81
	) / Math.PI*Math.PI;
}
