var divPos;

function click() {
	for (var i = 0; i < grid.goals.length; ++i) {
		var g = grid.goals[i];
		var near = (Math.abs(grid.goals[grid.selectedGoal].ends()[0] - grid.goals[i].x) === 1) !== 
				(Math.abs(grid.goals[grid.selectedGoal].ends()[1] - grid.goals[i].y) === 1) &&
				(Math.abs(grid.goals[grid.selectedGoal].ends()[0] - grid.goals[i].x) === 0) !== 
				(Math.abs(grid.goals[grid.selectedGoal].ends()[1] - grid.goals[i].y) === 0);
		if (isMouseIn({x: grid.x + g.x * grid.w, y: grid.y + g.y * grid.w, w: grid.w}) && 
			!(  i === grid.selectedGoal + 1 && near)) {
				goalOnclick(i, true);
				return
			}
		var g = grid.goals[i].pathPoints();
		for (var j = 0; j < g.length; ++j) {
			if (isMouseIn({x: grid.x + g[j][0] * grid.w, y: grid.y + g[j][1] * grid.w, w: grid.w}) && !near &&
				!(grid.goals[i].solved() && j === g.length - 1)) {
				for (var k = 0; k < g.length - j; ++k)
					grid.goals[i].undo(false);
				goalOnclick(i, false);
			}
		}
	}
	drag();
}

function goalOnclick(num, start) {
	grid.selectedGoal = num;
	if (start)
		grid.goals[grid.selectedGoal].reset();
	draw();
}

function drag() {
	var gridx = Math.floor((divPos.x - grid.x - 10) / (grid.w));
	var gridy = Math.floor((divPos.y - grid.y - 10) / (grid.w));
	
	if (grid.tiles.length > gridy && gridy >= 0 && grid.tiles[0].length > gridx && gridx >= 0) {
		var g = grid.goals[grid.selectedGoal];
		if (grid.selectedGoal > 0) {
			var p = grid.goals[grid.selectedGoal - 1].pathPoints();
			if (p.length > 1)
				if (gridx === p[p.length - 2][0] && gridy === p[p.length - 2][1]) {
					--grid.selectedGoal;
					grid.goals[grid.selectedGoal].undo();
				}
		}
		var xdiff = gridx - g.ends()[0];
		var ydiff = gridy - g.ends()[1];
		if (xdiff === 0) {
			if (ydiff === 1) {
				if (g.path[g.path.length - 1] === 0)
					g.undo()
				else 
					g.addDir(2)
			}
			else if (ydiff === -1) {
				if (g.path[g.path.length - 1] === 2)
					g.undo()
				else 
					g.addDir(0)
			}
		}
		else if (ydiff === 0) {
			if (xdiff === 1) {
				if (g.path[g.path.length - 1] === 1)
					g.undo()
				else
					g.addDir(3)
			}
			else if (xdiff === -1)
				if (g.path[g.path.length - 1] === 3)
					g.undo()
				else 
					g.addDir(1)
		}
	}
}

function isMouseIn(obj) {
	return (divPos.y > obj.y && 
	divPos.y < obj.y + ((typeof(obj.h) !== "undefined") ? obj.h : obj.w) &&
	divPos.x > obj.x &&
	divPos.x < obj.x + obj.w);
}