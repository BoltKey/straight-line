function Grid(x, y, w, m, n, goals) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.x = 310 - w * n / 2;
	this.y = 310 - w * m / 2;
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
		this.goals.push(new Goal(goals[i][0], goals[i][1], i + 1));
	}
	this.selectedGoal = 0;
	this.draw = function() {
		ctx.fillStyle = "#bbbbbb";
		for (var i = 0; i < this.tiles.length; ++i) {
			var row = this.tiles[i];
			for (var j = 0; j < row.length; ++j) {
				roundedRect(this.x + j * this.w + 10, this.y + i * this.w + 10, this.w, this.w / 20);
			}
		}
		for (var i = 0; i < this.goals.length; ++i) {
			ctx.font = w * 0.32 + "px Arial";
			this.goals[i].draw(this.x, this.y, this.w);
		}
	}
	this.frame = function() {
		for (i = 0; i < this.goals.length; ++i) {
			this.goals[i].frame();
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

function roundedRect(x, y, w, radius) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.arc(x + w - radius * 2, y + radius, radius, Math.PI * 1.5, 0);
	ctx.arc(x + w - radius * 2, y + w - radius * 2, radius, 0, Math.PI * 0.5);
	ctx.arc(x + radius, y + w - radius * 2, radius, Math.PI * 0.5, Math.PI);
	ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 0.5);
	ctx.fill();
}

function Goal(x, y, num) {
	this.blob = 0;
	this.effect = 0;
	this.maxEffect = 5;
	this.x = x;
	this.y = y;
	this.num = num;
	this.undoTile = [];
	this.path = [];
	// 0 right, 1 down, 2 left, 3 up
	this.frame = function() {
		this.effect -= Math.sign(this.effect);
		--this.blob;
	}
	this.draw = function(x, y, w) {
		var wid = 0.7;
		for (var j = 0; j <= 1; ++j) {
			ctx.beginPath();
			var lastx = x + (this.x - 0.05) * w + (w + 20) * 0.5 ;
			var lasty = y + (this.y - 0.05) * w + (w + 20) * 0.5 ;
			var off = (j - 1) * (w / 20);
			ctx.moveTo(lastx - off, lasty - off);
			var undo = false;
			if (this.effect < 0) {
				undo = true;
				this.path.push(this.undoTile);
				this.effect = - this.effect;
			}
			for (var i = 0; i < this.path.length; ++i) {
				var p = this.path[i];
				var a = undo ? 1 - (this.effect / this.maxEffect) : this.effect / this.maxEffect;
				var e = (i === this.path.length - 1) ? wid * 2 - a : 1;
				lastx += Math.sign(p - 2) * (p % 2) * w * e;
				lasty += Math.sign(p - 1) * ((p + 1) % 2) * w * e;
				
				ctx.lineTo(lastx - off, lasty - off);
			}
			if (undo) {
				this.path.splice(this.path.length - 1, 1);
				this.effect = - this.effect;
			}
			ctx.lineWidth = w * wid;
			if (j === 1) {
				if (this.solved()) {
					ctx.strokeStyle = getColorScale(this.num / grid.goals.length);
					ctx.fillStyle = getColorScale(this.num / grid.goals.length);
					if (this.num === grid.goals.length)
						ctx.fillStyle = "#00ff00";  // last
				}
				else {
					if (grid.selectedGoal === this.num - 1) {
						ctx.fillStyle = "blue";  // selected
						if (this.pathPoints().length > this.num + 1)
							ctx.strokeStyle = "#ff6666";  // too long
						else
							ctx.strokeStyle = "#666666";  // default
					}
					else {
						if (this.pathPoints().length > this.num + 1)
							ctx.strokeStyle = "#ff9999";  // too long
						else
							ctx.strokeStyle = "#999999";  // default
						if (grid.selectedGoal === this.num - 2)
							ctx.fillStyle = "cyan";  // currgoal
						else
							ctx.fillStyle = "#9999ff";  // others
					}
				}
				ctx.stroke();
				roundedRect(x + this.x * w + 10, y + this.y * w + 10, w, w / 20);
				//ctx.stroke();
			}
			else {
				ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
				ctx.stroke();
			}
		}
		
		ctx.fillStyle = "black";
		if (this.path.length > 0 && !this.solved())
			ctx.fillText((Math.max(0, this.path.length) + "/") + this.num, x + ((this.solved() ? this.x : this.ends()[0]) + 0.5) * w, y + (this.ends()[1] + 0.60) * w);
		ctx.fillText(this.num, x + (this.x + 0.5) * w + 10, y + (this.y + 0.60) * w + 10);
	}
	this.addDir = function(num) {
		if (grid.goals.length !== this.num) {
			var nextx = this.ends()[0] + Math.sign(num - 2) * (num % 2);
			var nexty = this.ends()[1] + Math.sign(num - 1) * ((num + 1) % 2);
			if ((($.grep(grid.takenSpots(), function(a) {return a[0] === nextx && a[1] === nexty}).length === 0) ||
				nextx === grid.goals[this.num].x && nexty === grid.goals[this.num].y) &&
				!(this.ends()[0] === grid.goals[this.num].x && this.ends()[1] === grid.goals[this.num].y)) {
				this.path.push(num);
				this.effect = this.maxEffect;
				if (this.solved()) {
					grid.selectedGoal = this.num;
					
					for (var i = 0; i < grid.goals.length; ++i) {
						if (!grid.goals[i].solved()) {
							sounds.solved.play();
							draw();
							return
						}
					}
					victory();
				}
				else
					sounds.move[this.path.length % 5].play();
				draw();
				
			}
		}
		
	}
	
	this.undo = function(sound) {
		this.undoTile = this.path[this.path.length - 1];
		this.path.splice(this.path.length - 1, 1);
		if (typeof(sound) === 'undefined' || sound) {
			sounds.undo[this.path.length % 5].play();
		}
		this.effect = - this.maxEffect;
		
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