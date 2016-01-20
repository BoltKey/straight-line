var finalPath;
var attempts;
function randomLevel(maxNum) {
	$(".random-button").removeClass("button-highlight");
	$("#randomButton" + maxNum).addClass("button-highlight");
	var x;
	var y;
	var sizes = [[2, 3], [2, 5], [3, 5], [3, 7], [4, 7], [6, 6], [5, 9], [5, 11], [6, 11], [6, 13], [7, 13], [7, 15], [10, 12], [8, 17], [9, 17], [9, 19],  [10, 19], [14, 15], [11, 21], [11, 23]];
	x = sizes[maxNum - 3][0];
	y = sizes[maxNum - 3][1];
	var path = randomPath(x, y);
	var goals = [];
	var d = 2;
	var index = 0;
	while (goals.length < maxNum) {
		goals.push(path[index]);
		index += d++;
	}
	grid = new Grid(10, 10, Math.min(600 / y, 600 / x), y, x, goals);
	draw();
}

function randomPath(m, n) {
	++attempts;
	var vers = [];
	var hors = [];
	var start = [Math.floor(Math.random() * m), Math.floor(Math.random() * n)];
	for (var i = 0; i < m + 1; ++i) {
		var col = [];
		for (var j = 0; j < n; ++j) {
			col.push((i === 0 || i === m) ? 1 : 0);
		}
		vers.push(col);
	}
	for (var i = 0; i < n + 1; ++i) {
		var row = [];
		for (var j = 0; j < m; ++j) {
			row.push((i === 0 || i === n ) ? 1 : 0);
		}
		hors.push(row);
	}
	
	var c = [0, 0];
	var adjWalls;
	var iterations = m * n;
	var curr = 0;
	var otherEnd = false;
	while(curr < iterations) {
		++curr;
		adjWalls = countAdj(c[0], c[1], hors, vers);
		for (var i = 0; i < 2 - adjWalls + (c[0] === start[0] && c[1] === start[1]); ++i) {
			var verPoss;
			if (c[0] === m - 1)
				verPoss = false;
			else 
				verPoss = (countAdj(c[0] + 1, c[1], hors, vers) < 2) && vers[c[0] + 1][c[1]] === 0;
			var horPoss;
			if (c[1] === n - 1)
				horPoss = false;
			else
				horPoss = (countAdj(c[0], c[1] + 1, hors, vers) < 2) && hors[c[1] + 1][c[0]] === 0;
			if (verPoss && horPoss) {
				if (Math.random() > 0.5)
					vers[c[0] + 1][c[1]] = 1;
				else 
					hors[c[1] + 1][c[0]] = 1;
			}
			else if (verPoss)
				vers[c[0] + 1][c[1]] = 1;
			else if (horPoss)
				hors[c[1] + 1][c[0]] = 1;
			else if (!otherEnd) {
				if (hors[c[1] + 1][c[0]] === 0)
					hors[c[1] + 1][c[0]] = 1;
				else if (vers[c[0] + 1][c[1]] === 0)
					vers[c[0] + 1][c[1]] = 1;
				otherEnd = true;
			}
			else 
				return randomPath(m, n); // try again
		}
		
		++c[0];
		if (c[0] >= m) {
			++c[1];
			c[0] = 0
		}
	}
	drawPath(hors, vers, canvas.width - 150, canvas.height - 150);
	i = 0;
	var loop = pathPoints(start[0], start[1], hors, vers);
	while (pathPoints(start[0], start[1], hors, vers).length < m * n) {
		loop = pathPoints(start[0], start[1], hors, vers);
		for (var j = 0; j < loop.length; ++j) {
			var c = loop[j];
			start = loop[loop.length - 1];
			if (c[0] !== m - 1 && c[1] !== n - 1) {
				if (vers[c[0] + 1][c[1]] && 
					vers[c[0] + 1][c[1] + 1] && 
					!hors[c[1] + 1][c[0]] && 
					!hors[c[1] + 1][c[0] + 1] &&
					$.grep(loop, function(a){return a[0] === c[0] + 1 && a[1] === c[1]}).length === 0) {
						vers[c[0] + 1][c[1]] = 0;
						vers[c[0] + 1][c[1] + 1] = 0;
						hors[c[1] + 1][c[0]] = 1; 
						hors[c[1] + 1][c[0] + 1] = 1;
				}
				else if (!vers[c[0] + 1][c[1]] && 
					!vers[c[0] + 1][c[1] + 1] && 
					hors[c[1] + 1][c[0]] && 
					hors[c[1] + 1][c[0] + 1] &&
					$.grep(loop, function(a){return a[0] === c[0] && a[1] === c[1] + 1}).length === 0) {
						vers[c[0] + 1][c[1]] = 1;
						vers[c[0] + 1][c[1] + 1] = 1;
						hors[c[1] + 1][c[0]] = 0; 
						hors[c[1] + 1][c[0] + 1] = 0;
				}
			}
			loop = pathPoints(0, 0, hors, vers);
		}
		++i;
		if (i > 50)
			return randomPath(m, n);
	}
	start = loop[loop.length - 1];
	finalPath = pathPoints(start[0], start[1], hors, vers);
	return pathPoints(start[0], start[1], hors, vers);
}

function pathPoints(x, y, hors, vers) {
	var lastc = [];
	var wayPoints = [];
	var c = [x, y];
	do {
		
		if (hors[c[1]][c[0]] === 0 && lastc[1] !== c[1] - 1) {
			lastc[0] = c[0]; 
			lastc[1] = c[1];
			c[1] -= 1;
		}
		else if (hors[c[1] + 1][c[0]] === 0 && lastc[1] !== c[1] + 1) {
			lastc[0] = c[0]; 
			lastc[1] = c[1];
			c[1] += 1;
		}
		else if (vers[c[0]][c[1]] === 0 && lastc[0] !== c[0] - 1) {
			lastc[0] = c[0]; 
			lastc[1] = c[1];
			c[0] -= 1;
		}
		else if (vers[c[0] + 1][c[1]] === 0 && lastc[0] !== c[0] + 1) {
			lastc[0] = c[0]; 
			lastc[1] = c[1];
			c[0] += 1;
		}
		else {
			wayPoints = [[x, y]].concat(wayPoints);
			return wayPoints;
		}
		wayPoints.push([c[0], c[1]]);
	} while (!(c[0] === x && c[1] === y))
	//wayPoints.splice(wayPoints.length - 1, 1);
	return wayPoints;
}
function countAdj(x, y, hors, vers) {
	var adjWalls = 0;
	if (vers[x][y] === 1)
		++adjWalls;
	if (vers[x + 1][y] === 1)
		++adjWalls;
	if (hors[y][x] === 1)
		++adjWalls;
	if (hors[y + 1][x] === 1)
		++adjWalls;
	return adjWalls;
}

function drawPath(vers, hors, x, y) {
	ctx.fillStyle = "black";
	ctx.clearRect(x, y, 200, 200);
	for (var i = 0; i < vers.length; ++i) {
		var col = vers[i];
		for (var j = 0; j < col.length; ++j) {
			if (col[j] === 1)
				ctx.fillRect(x + j * 10, y + i * 10, 10, 1)
		}
	}
	for (var i = 0; i < hors.length; ++i) {
		var row = hors[i];
		for (var j = 0; j < row.length; ++j) {
			if (row[j] === 1)
				ctx.fillRect(x + i * 10, y + j * 10, 1, 10)
		}
	}
}