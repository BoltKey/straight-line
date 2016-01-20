var canvas;
var ctx;
var grid;
var mouseDown;
var lastmd;
var currlvl;
var sounds = {};
function main() {
	canvas = $("#canvas")[0];
	ctx = canvas.getContext('2d');
	ctx.textAlign = "center";
	newLevel(0);
	draw();
	createMenu();
	//sounds
	sounds.move = [];
	sounds.undo = [];
	for (var i = 0; i < 5; ++i) {
		sounds.move.push(new Audio("sounds/turn.wav"));
		sounds.undo.push(new Audio("sounds/undo.wav"));
	}
	sounds.solved = new Audio("sounds/solved.wav");
	
	//mouse
	var offset = $("#canvas").offset();
	$(document).mousemove(function(e){
    divPos = {
        x: e.pageX - offset.top,
        y: e.pageY - offset.left
		}
	})
	lastDivPos = {x: 0, y: 0};
	lastmd = 0;
	mouseDown = false;
	document.body.onmousedown = function() { 
		mouseDown = true;
		click();
	}
	document.body.onmouseup = function() { 
		mouseDown = false;
	}
	document.onmousemove = function() { if(mouseDown) { drag() } };
}
function newLevel(id) {
	var temp = JSON.parse(JSON.stringify(levelData[id]));
	grid = new Grid(10, 10, Math.min(600 / temp.y, 600 / temp.x), temp.y, temp.x, temp.goals);
	draw();
	currlvl = id;
}
function victory() {
	$("#levelButton" + currlvl).removeClass("button-primary");
	$("#levelButton" + currlvl).addClass("button-action");
}
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	grid.draw();
}
function getColorScale(scale) {
	t = Math.floor(scale * 255);
	green = (t >= 128 ? 255 : t * 2);
	red = (t < 128 ? 255 : 2 * (255 - t));
	if (red < 0) red = 0;
	if (red > 255) red = 255;
	return "rgb(" + red + "," + green + ",0)";
}
function createMenu() {
	var i;
	for (i = 0; i < levelData.length; ++i) {
		var a = $("<button id='levelButton" + i + "' type='button' class='button button-primary button-medium button-box' onclick='newLevel(" + i + ")'>" + i + "</button>")
		a.css("position", "fixed");
		a.css("left", 640 + 50 * (i % 5));
		a.css("top", 20 + 50 * Math.floor(i / 5));
		a.css("width", 40);
		$("body").append(a);
	}
	for (var i = 3; i <= 20; i += 1) {
		var a = $("<button id='randomButton" + i + "' type='button' class='button button-primary button-medium button-box' onclick='randomLevel(" + i + ")'>R" + i + "</button>")
		a.css("position", "fixed");
		a.css("left", 640 + 50 * (i % 5));
		a.css("top", 300 + 50 * Math.floor(i / 5));
		a.css("width", 40);
		$("body").append(a);
	}
	$("#randomButton3").removeClass("button-primary");
	$("#randomButton3").addClass("button-highlight");
	$("#randomButton7").removeClass("button-primary");
	$("#randomButton7").addClass("button-highlight");
	$("#randomButton8").removeClass("button-primary");
	$("#randomButton8").addClass("button-highlight");
	$("#randomButton11").removeClass("button-primary");
	$("#randomButton11").addClass("button-highlight");
	$("#randomButton12").removeClass("button-primary");
	$("#randomButton12").addClass("button-highlight");
	$("#randomButton15").removeClass("button-primary");
	$("#randomButton15").addClass("button-highlight");
	$("#randomButton16").removeClass("button-primary");
	$("#randomButton16").addClass("button-highlight");
	$("#randomButton19").removeClass("button-primary");
	$("#randomButton19").addClass("button-highlight");
	
}