/**
 * Logo painter program.
 * There are various "ships" and one canvas
 */

require('enable-mobile');
const spiral = require('spiral-2d/archimedean');
const Panel = require('settings-panel');
const extend = require('just-extend');
const isMobile = require('is-mobile')();

let canvas = document.body.appendChild(document.createElement('canvas'));

canvas.width = window.innerWidth - (isMobile ? 0 : 320);
canvas.height = window.innerHeight - 20;
canvas.style.cssText = `
	position: absolute;
	top: 0;
	left: 0;
	display: block;
	max-width: 100vw - 320px;
	min-width: 320px;
`;

let cx = canvas.width / 2;
let cy = canvas.height / 2;

let context = canvas.getContext('2d');


let state = {
	angle: [0, Math.PI * 17],
	step: Math.PI / 128,
	color: 'black',
	frequency: 8,
	lineWidth: 13,
	modWidth: 0,
	modWidthF: 1/3,
	modAmp: 0,
	modAmpF: 1/3,
	intensity: 0.02
}

function render (opts) {
	state = extend(state, opts);
	let angles = state.angle;
	let step = state.step;
	let frequency = state.frequency;
	let lineWidth = state.lineWidth;
	let modWidth = state.modWidth;
	let modWidthF = state.modWidthF;
	let modAmp = state.modAmp;
	let modAmpF = state.modAmpF;
	let intensity = state.intensity;

	context.lineJoin = 'round';
	context.lineCap = 'round';

	let lastX, lastY;

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.strokeStyle = state.color;

	for (let angle = angles[0]; angle <= angles[1]; angle+=step) {
		context.beginPath();
		context.moveTo(lastX, lastY);

		context.lineWidth = (lineWidth + modWidth*Math.sin(angle * modWidthF + Math.PI*1.666));
		let r = -Math.PI * (angle + tri(angle * frequency)*angle*intensity  ) + modAmp*Math.sin(angle*modAmpF);

		let x = cx + -r * Math.cos(angle);
		let y = cy + r * Math.sin(angle);
	    context.lineTo(x, y);
	    if (lastY != null) {
			context.stroke();
			context.closePath();
	    }

		lastX = x; lastY = y;
	}
}

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




let ghIcon = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="784" height="1024" viewBox="0 0 784 1024"><path d="M4.168 480.005q0 107.053 52.114 194.314 52.114 90.085 141.399 141.799t194.314 51.714q105.441 0 195.126-51.714 89.685-52.114 141.199-141.599t51.514-194.514q0-106.652-51.714-195.126-52.114-89.685-141.599-141.199t-194.514-51.514q-107.053 0-194.314 52.114-90.085 52.114-141.799 141.399t-51.714 194.314zM68.802 480.005q0-64.634 25.451-124.832t69.482-103.828q44.031-44.031 103.828-69.282t124.432-25.251 124.832 25.251 104.229 69.282q43.631 43.631 68.882 103.828t25.251 124.832q0 69.482-28.487 132.504t-79.989 108.876-117.76 66.458v-113.924q0-42.419-34.747-66.257 85.238-7.672 124.632-43.23t39.383-112.712q0-59.786-36.759-100.593 7.272-21.815 7.272-42.018 0-29.899-13.732-54.939-27.063 0-48.478 8.884t-52.515 30.699q-37.571-8.484-77.565-8.484-45.654 0-85.238 9.295-30.299-22.216-52.314-31.311t-49.891-9.084q-13.332 25.451-13.332 54.939 0 21.004 6.871 42.419-36.759 39.594-36.759 100.192 0 77.165 39.183 112.312t125.644 43.23q-23.027 15.355-31.911 44.843-19.792 6.871-41.207 6.871-16.156 0-27.875-7.272-3.636-2.024-6.66-4.236t-6.26-5.448-5.248-5.048-5.248-6.26-4.236-5.659-4.848-6.46-4.236-5.659q-18.991-25.051-45.243-25.051-14.143 0-14.143 6.060 0 2.424 6.871 8.083 12.931 11.308 13.732 12.12 9.696 7.672 10.908 9.696 11.719 14.544 17.779 31.911 22.627 50.502 77.565 50.502 8.884 0 34.747-4.036v85.649q-66.257-20.603-117.76-66.458t-79.989-108.876-28.487-132.504z"></path></svg>`;

let panel = Panel([
	{id: 'angle',
		label: 'Angle',
		type: 'interval',
		min: 0, max: Math.PI * 50,
		step: 0.1,
		value: state.angle,
		change: v => {
			render({
				angle: v
			})
		}
	},
	{id: 'frequency',
		label: 'Frequency',
		type: 'range',
		step: .01,
		min: 0,
		max: 100,
		value: state.frequency,
		change: v => render({frequency: v})
	},
	{id: 'lineWidth',
		label: 'Line width',
		type: 'range',
		value: state.lineWidth,
		change: v => render({lineWidth: v})
	},
	{id: 'intensity',
		label: 'Intensity',
		type: 'range',
		value: state.intensity,
		min: 0.001,
		max: .5,
		log: true,
		change: v => render({intensity: v})
	},
	{id: 'color',
		label: 'Color',
		type: 'color',
		value: 'black',
		change: v => {
			render({color: v})
		}
	},
	{id: 'step',
		label: 'Step',
		type: 'range',
		min: Math.PI / 256,
		max: Math.PI / 2,
		step: 0.01,
		value: state.step,
		change: v => {
			render({
				step: v
			})
		}
	},
	{type: 'raw', content: 'Modulate width'},
	{id: 'modWidth',
		label: 'Range',
		type: 'range',
		min: 0,
		max: 13,
		step: 0.05,
		value: state.modWidth,
		change: v => render({modWidth: v})
	},
	{id: 'modWidthF',
		label: 'Frequency',
		type: 'range',
		step: .01,
		min: 0,
		max: 10,
		value: state.modWidthF,
		change: v => render({modWidthF: v})
	},
	{type: 'raw', content: 'Modulate amplitude'},
	{id: 'modAmp',
		label: 'Range',
		type: 'range',
		min: 0,
		max: 13,
		step: 0.05,
		value: state.modAmp,
		change: v => render({modAmp: v})
	},
	{id: 'modAmpF',
		label: 'Frequency',
		type: 'range',
		step: .01,
		min: 0,
		max: 10,
		value: state.modAmpF,
		change: v => render({modAmpF: v})
	}
], {
	title: `<a href="https://github.com/mircamtl/logo">Mirca logo generator <span style="position: absolute; opacity: 1; margin-top: .12em; margin-left: .4em; width: .9em; height: .9em;">${ghIcon}</span></a></a>`,
	theme: require('settings-panel/theme/flat'),
	css: `
		:host {
			position: absolute;
			top: 0;
			right: 0px;
			padding-right: 30px;
			width: 320px;
			overflow: hidden;
			background: rgba(255,255,255,.9);
		}
	`
});

