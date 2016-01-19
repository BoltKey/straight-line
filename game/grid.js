function Grid(x, y, w, m, n, goals) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.tiles = [];
	for (var i = 0; i < m; ++i) {
		var row = [];
		for (var j = 0; j < n; ++j) {
			row.push(0);
		}
		this.tiles.push(row);
	}
	this.goals = [];
	for (var i = 0; i < goals.length; ++i) {
		this.goals.push(new Goal(...goals[i], i + 1));
	}
	this.selectedGoal = 0;
	this.draw = function() {
		ctx.fillStyle = "#bbbbbb";
		for (var i = 0; i < this.tiles.length; ++i) {
			var row = this.tiles[i];
			for (var j = 0; j < row.length; ++j) {
				ctx.fillRect(this.x + j * this.w, this.y + i * this.w, this.w - 2, this.w - 2);
			}
		}
		for (var i = 0; i < this.goals.length; ++i) {
			ctx.font = w * 0.32 + "px Arial";
			this.goals[i].draw(this.x, this.y, this.w);
		}
	}
	this.reset = function() {
		for (var i = 0; i < this.goals.length; ++i) {
			this.goals[i].reset();
		}
	}
	this.takenSpots = function() {
		var ret = [];
		for (var i = 0; i < this.goals.length; ++i) {
			ret = ret.concat(this.goals[i].pathPoints());
		}
		return ret;
	}
}

function Goal(x, y, num) {
	this.x = x;
	this.y = y;
	this.num = num;
	this.path = [];
	// 0 right, 1 down, 2 left, 3 up
	this.draw = function(x, y, w) {
		
		ctx.beginPath();
		var lastx = x + (this.x + 0.5) * w - 1;
		var lasty = y + (this.y + 0.5) * w - 1;
		ctx.moveTo(lastx, lasty);
		for (var i = 0; i < this.path.length; ++i) {
			var p = this.path[i];
			lastx += Math.sign(p - 2) * (p % 2) * w;
			lasty += Math.sign(p - 1) * ((p + 1) % 2) * w;
			ctx.lineTo(lastx, lasty);
		}
		ctx.lineWidth = w * 0.8;
		if (this.solved()) {
			ctx.strokeStyle = getColorScale(this.num / grid.goals.length);
			ctx.fillStyle = "green";
		}
		else {
			ctx.strokeStyle = "gray";
			if (grid.selectedGoal === this.num - 1)
				ctx.fillStyle = "cyan";
			else if (grid.selectedGoal === this.num - 2)
				ctx.fillStyle = "#00ff00";
			else
				ctx.fillStyle = "blue";
		}
		ctx.stroke();
		ctx.fillRect(x + this.x * w, y + this.y * w, w - 2, w - 2);
		ctx.fillStyle = "black";
		ctx.fillText((this.num === grid.goals.length ? "" : (Math.max(0, this.path.length - 1) + "/")) + this.num, x + (this.x + 0.5) * w, y + (this.y + 0.60) * w);
	}
	this.addDir = function(num) {
		if (grid.goals.length !== this.num) {
			var nextx = this.ends()[0] + Math.sign(num - 2) * (num % 2);
			var nexty = this.ends()[1] + Math.sign(num - 1) * ((num + 1) % 2);
			if ((($.grep(grid.takenSpots(), function(a) {return a[0] === nextx && a[1] === nexty}).length === 0) ||
				nextx === grid.goals[this.num].x && nexty === grid.goals[this.num].y) &&
				!(this.ends()[0] === grid.goals[this.num].x && this.ends()[1] === grid.goals[this.num].y)) {
				this.path.push(num);
				if (this.solved()) {
					grid.selectedGoal = this.num;
					sounds.solved.play();
				}
				else
					sounds.move[this.path.length % 5].play();
				draw();
				
			}
		}
		for (var i = 0; i < grid.goals.length; ++i) {
			if (!grid.goals[i].solved())
				return
		}
		victory();
	}
	
	this.undo = function() {
		this.path.splice(this.path.length - 1, 1);
		sounds.undo[this.path.length % 5].play();
		draw();
	}
	this.ends = function() {
		return this.pathPoints()[this.path.length];
	}
	this.pathPoints = function() {
		var ret = [[this.x, this.y]];
		var currx = this.x;
		var curry = this.y;
		for (var i = 0; i < this.path.length; ++i) {
			var p = this.path[i];
			currx += Math.sign(p - 2) * (p % 2);
			curry += Math.sign(p - 1) * ((p + 1) % 2);
			ret.push([currx, curry])
		}
		return ret;
	}
	this.reset = function() {
		this.path = [];
		draw();
	}
	this.solved = function() {
		if (this.num === grid.goals.length)
			return true;
		var g = grid.goals[this.num];
		return this.path.length === this.num + 1 && this.ends()[0] === g.x && this.ends()[1] === g.y;
	}
}