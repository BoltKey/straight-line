var canvas;
var ctx;
var grid;
var mouseDown;
var lastmd;
var currlvl;
var wonLevels = [];
var sounds = {};
var kongregate;
function main() {
	// kong
	kongregateAPI.loadAPI(onComplete);
	function onComplete(){
		kongregate = kongregateAPI.getAPI();
	}
	canvas = $("#canvas")[0];
	ctx = canvas.getContext('2d');
	ctx.textAlign = "center";
	createMenu();
	wonLevels = JSON.parse(localStorage.getItem("wonLevels"));
	if (wonLevels !== null) 
		for (var i = 0; i < wonLevels.length; ++i) {
			$("#levelButton" + wonLevels[i]).removeClass("button-primary button-highlight");
			$("#levelButton" + wonLevels[i]).addClass("button-action");
		}
	else
		wonLevels = [];
	//sounds
	sounds.move = [];
	sounds.undo = [];
	for (var i = 0; i < 5; ++i) {
		sounds.move.push(new Audio("sounds/turn.wav"));
		sounds.undo.push(new Audio("sounds/undo.wav"));
	}
	sounds.solved = new Audio("sounds/solved.wav");
	sounds.victory = new Audio("sounds/victory.wav");
	sounds.victory.volume = 0.5;
	
	//mouse
	var offset = $("#canvas").offset();
	$(document).bind('mousemove', function(e){
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
	
	// touch devices
	$(document).bind('touchstart', function(e) {
		divPos = {
			x: e.pageX - offset.top,
			y: e.pageY - offset.left
		}
		mouseDown = true;
		click();
	});
	$(document).bind('touchmove', function(e){
		e.preventDefault();
		divPos = {
			x: e.originalEvent.touches[0].pageX - offset.top,
			y: e.originalEvent.touches[0].pageY - offset.left
		};
		
		drag();
	});
	document.onmousemove = function() { if(mouseDown) { drag() } };
	newLevel(0);
	draw();
}
function newLevel(id) {
	$(".tut").remove();
	switch(id) {
		case 0:
			var a = $("<div class='tut'><h3>Goal of the game is to create a line going from 1 through all the numbers in ascending order ending in the highest number.<h3></div>");
			a.css("position", "fixed");
			a.css("left", 30);
			a.css("top", 20);
			a.css("width", 500);
			$("body").append(a);
			a = $("<div class='tut'><h3>Drag mouse from a numbered tile to create a line. Start at the '1' tile, go through the '2' tile and end in the '3' tile.<h3></div>");
			a.css("position", "fixed");
			a.css("left", 40);
			a.css("top", 500);
			a.css("width", 500);
			$("body").append(a);
			break;
		case 2:
			var a = $("<div class='tut'><h3>Each line segment has to have the length of the tile it is going from.<h3></div>");
			a.css("position", "fixed");
			a.css("left", 30);
			a.css("top", 20);
			a.css("width", 500);
			$("body").append(a);
			a = $("<div class='tut'><h3>Don't worry, it gets clearer pretty soon.<h3></div>");
			a.css("position", "fixed");
			a.css("left", 40);
			a.css("top", 500);
			a.css("width", 500);
			$("body").append(a);
			break;
	}
	var temp = JSON.parse(JSON.stringify(levelData[id]));
	grid = new Grid(10, 10, Math.min(600 / temp.y, 600 / temp.x), temp.y, temp.x, temp.goals);
	draw();
	$(".level-button").removeClass("button-highlight");
	$("#levelButton" + id).addClass("button-highlight");
	
	currlvl = id;
}
function victory() {
	$("#levelButton" + currlvl).removeClass("button-primary button-highlight");
	$("#levelButton" + currlvl).addClass("button-action");
	if (currlvl > -1) {
		if (wonLevels.indexOf(currlvl) === -1)
			wonLevels.push(currlvl);
		localStorage.setItem("wonLevels", JSON.stringify(wonLevels));
		if (typeof(kongregate) !== 'undefined')
			kongregate.stats.submit("levels", wonLevels.length);
	}
	sounds.victory.play();
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
		var a = $("<button id='levelButton" + i + "' type='button' class='level-button button button-primary button-medium button-box' onclick='newLevel(" + i + ")'>" + i + "</button>")
		a.css("position", "fixed");
		a.css("left", 640 + 40 * (i % 8));
		a.css("top", 80 + 50 * Math.floor(i / 8));
		a.css("width", 30);
		a.css("padding", 2);
		$("body").append(a);
	}
	var a = $("<div><h3>Random level generator<h3></div>");
	a.css("position", "fixed");
	a.css("left", 640);
	a.css("top", 320);
	$("body").append(a);
	a = $("<div><h3>Level selection<h3></div>");
	a.css("position", "fixed");
	a.css("left", 640);
	a.css("top", 30);
	$("body").append(a);
	a = $("<input type='range' min=3 max=22 value=8 id='randomRange' oninput='changeRand()'></input>")
	a.css("position", "fixed");
	a.css("left", 640);
	a.css("top", 370);
	a.css("width", 200);
	$("body").append(a);
	a = $("<div><span id='randomDisplay'>Max number: 8</span><button id='goRandButton' onclick='goRand()' type='button' class='level-button button button-primary button-medium button-box'>Go!</button></div>")
	a.css("position", "fixed");
	a.css("left", 640);
	a.css("top", 400);
	a.css("width", 200);
	$("body").append(a);
}
function changeRand() {
	$("#randomDisplay").html("Max number: " + $("#randomRange").val());
}

function goRand() {
	$(".level-button").removeClass("button-highlight");
	randomLevel($("#randomRange").val());
}
