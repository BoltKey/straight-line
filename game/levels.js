var levelData = [
	// 3
	{x: 3, y: 2, goals: [[2, 0], [0, 0], [2, 1]]}, 
	// 4
	{x: 2, y: 5, goals: [[1,4],[0,3],[0,0],[1,3]]},
	// 5
	{x: 5, y: 3, goals: [[0, 0], [2, 0], [4, 1], [1, 2], [3, 1]]},
	{x: 5, y: 3, goals: [[0, 0], [0, 2], [1, 0], [2, 1], [4, 0]]},
	// 6
	{x: 3, y: 7, goals: [[2,6],[1,5],[0,5],[2,3],[0,0],[1,3]]},
	// 7
	{x: 4, y: 7, goals: [[1, 0], [0, 1], [0, 4], [0, 6], [2, 5], [1, 2], [1, 1]]},
	
	{x: 4, y: 7, goals: [[1, 6], [0, 5], [1, 3], [0, 0], [2, 1], [2, 3], [1, 5]]},
	{x: 4, y: 7, goals: [[0, 4], [1, 3], [0, 1], [3, 0], [2, 2], [3, 5], [0, 5]]},
	// 8
	{x: 6, y: 6, goals: [[0,1],[1,0],[4,0],[3,1],[4,3],[2,5],[1,5],[2,2]]},
	{x: 6, y: 6, goals: [[3,1],[1,1],[2,3],[3,4],[4,2],[3,5],[0,1],[4,1]]},
	{x: 6, y: 6, goals: [[2,0],[0,0],[1,2],[2,3],[2,4],[3,5],[5,2],[2,1]]},
	{x: 6, y: 6, goals: [[2,0],[3,1],[3,2],[1,4],[0,0],[1,5],[3,4],[3,0]]},
	
	//9
	{x: 5, y: 9, goals: [[2,8],[4,8],[3,6],[3,4],[1,7],[1,5],[0,3],[4,1],[4,0]]},
	{x: 5, y: 9, goals: [[1,1],[0,0],[3,0],[2,1],[3,3],[4,4],[4,7],[1,6],[0,2]]},
	{x: 5, y: 9, goals: [[4,8],[2,8],[2,5],[3,6],[4,4],[1,3],[0,7],[1,0],[4,2]]},
	//10
	{x: 5, y: 11, goals: [[4,10],[4,8],[3,6],[1,8],[3,9],[0,8],[4,5],[1,4],[4,2],[4,0]]},
	{x: 5, y: 11, goals: [[4,8],[4,10],[1,10],[0,7],[0,2],[2,2],[3,0],[3,4],[2,8],[3,9]]},
	//11
	{x: 6, y: 11, goals: [[0,3],[0,1],[1,1],[2,2],[5,0],[5,2],[5,7],[3,9],[1,8],[2,5],[0,4]]},
	{x: 6, y: 11, goals: [[1,2],[2,3],[3,1],[5,1],[5,4],[1,4],[2,6],[5,7],[5,10],[0,7],[1,1]]},
	{x: 6, y: 11, goals: [[0,8],[0,6],[0,3],[2,1],[0,0],[5,1],[4,3],[1,8],[4,4],[3,9],[0,9]]},
	//12
	{x: 6, y: 13, goals: [[3,8],[4,9],[5,9],[5,11],[3,10],[0,11],[2,8],[2,6],[1,0],[4,1],[1,3],[3,7]]},
	{x: 6, y: 13, goals: [[0,5],[1,4],[0,2],[1,1],[3,0],[5,0],[4,6],[3,9],[2,9],[3,12],[2,6],[0,6]]},
	{x: 6, y: 13, goals: [[4,7],[2,7],[1,7],[2,10],[4,9],[4,11],[1,11],[0,6],[2,1],[3,2],[3,5],[4,8]]},
	//13
	{x: 7, y: 13, goals: [[3,9],[2,10],[2,11],[4,11],[0,12],[0,8],[4,7],[5,12],[4,6],[0,2],[2,1],[5,2],[6,4]]},
	//14
	{x: 7, y: 15, goals: [[2,14],[4,14],[6,13],[6,11],[3,13],[1,13],[0,11],[5,10],[2,8],[0,2],[4,1],[2,7],[6,4],[2,0]]},
	//15
	{x: 12, y: 10, goals: [[3, 9], [1, 9], [1, 8], [1, 6], [0, 4], [1, 1],
	[3, 0], [4, 1], [9, 1], [11, 3], [8, 7], [7, 8], [3, 7], [8, 4], [4, 5]]},
	{x: 10, y: 12, goals:[[7,2],[5,2],[7,1],[9,3],[7,0],[3,0],[0,2],[2,6],[0,11],[4,7],[7,7],[5,11],[9,6],[3,4],[7,3]]},
	{x: 10, y: 12, goals:[[8,10],[7,11],[6,9],[3,8],[5,9],[1,11],[0,9],[3,4],[0,2],[3,1],[9,2],[8,3],[2,6],[6,6],[8,11]]},
	//16
	{x: 8, y: 17, goals:[[7,5],[6,6],[7,8],[7,10],[3,11],[7,11],[7,16],[3,16],[2,14],[0,12],[2,11],[4,7],[4,6],[6,2],[0,7],[7,0]]},
	// 17
	{x: 9, y: 17, goals:[[8,16],[7,15],[8,13],[5,14],[8,12],[5,11],[1,14],[5,16],[1,13],[1,11],[0,7],[0,5],[3,1],[2,8],[7,2],[8,9],[0,0]]},
	// 19
	{x: 10, y: 19, goals: [[9,18],[9,16],[7,15],[8,14],[7,12],[8,11],[9,7],[7,5],[7,2],[8,1],[1,1],[5,5],[1,10],[3,6],[7,9],[5,15],[4,17],[2,13],[2,0]]},
	// 20
	{x: 14, y: 15, goals:[[5,6],[6,7],[4,8],[6,10],[2,11],[2,13],[6,12],[7,9],[10,7],[10,11],[9,13],[13,13],[3,14],[0,5],[3,9],[4,2],[6,1],[9,2],[7,5],[6,6]]}

]