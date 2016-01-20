function randomLevel(maxNum) {
	var x;
	var y;
	var sizes = [[2, 3], [2, 5], [3, 5], [3, 7], [4, 7], [6, 6], [5, 9], [5, 11], [6, 11], [6, 13], [7, 13], [7, 15], [10, 12]];
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
	var vers = [];
	var hors = [];
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
	while(curr < iterations) {
		++curr;
		adjWalls = countAdj(c[0], c[1], hors, vers);
		for (var i = 0; i < 2 - adjWalls; ++i) {
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
			else 
				return randomPath(m, n); // try again
		}
		
		++c[0];
		if (c[0] >= m) {
			++c[1];
			c[0] = 0
		}
	}
	drawPath(hors, vers, canvas.width - 200, canvas.height - 200);
	i = 0;
	while (pathPoints(0, 0, hors, vers).length < m * n && i < 1000) {
		var loop = pathPoints(0, 0, hors, vers);
		for (var j = 0; j < loop.length; ++j) {
			var c = loop[j];
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
				drawPath(hors, vers, canvas.width - 200, canvas.height - 200);
			}
			loop = pathPoints(0, 0, hors, vers);
		}
		++i;
	}
	
	drawPath(hors, vers, canvas.width - 200, canvas.height - 200);
	//return [path];
	return pathPoints(Math.floor(Math.random() * (m - 1)), Math.floor(Math.random() * (n - 1)), hors, vers);
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