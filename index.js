/**
 * Logo painter program.
 * There are various "ships" and one canvas
 */

var Component = require('gl-component');
var spiral = require('spiral-2d');
var inherits = require('inherits');
var xtend = require('xtend/mutable');


function MIRCA (opts) {
	if (!(this instanceof MIRCA)) return new MIRCA(opts);
}

inherits(MIRCA, Component);

MIRCA.prototype.context = '2d';

MIRCA.prototype.

MIRCA.prototype.draw = function () {
	this.ships.forEach((ship) => {

	});
}
