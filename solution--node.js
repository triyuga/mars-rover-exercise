const cmd = 
`5 5
1 2 N
LMLMLMLMM`

const cmdLines = cmd.split('\n')

const gridSize = {
	x: cmdLines[0].split(' ')[0],
	y: cmdLines[0].split(' ')[1],
}

// Store for rover position states.
const roverPositions = [
	cmdLines[1],
];

const moveCmds = cmdLines[2].split('');

// Execute move commands.
moveCmds.forEach(cmd => {
	console.log('running move cmd:', cmd);
	const lastPos = roverPositions[roverPositions.length - 1];
	console.log('lastPos:', lastPos);

	const newPos = move(cmd, lastPos)
	roverPositions.push(newPos);
	
	console.log('newPos:', newPos);
});

console.log('=================');
console.log('FINAL POS:', roverPositions[roverPositions.length - 1]);

/**
 * Helper functions.
 */

/**
 * Takes a single movement command and current position, and returns new position.
 * @param {String} cmd - can be L (turn left), R (turn right), M (move 1 unit in direction facing)
 * @param {String} posStr - x, y, dir (N,E,S,W) coords, as space separated string.
 * @returns {String} - New x, y, dir (N,E,S,W) coords, as space separated string.
 */
function move(cmd, posStr) {
	const pos = posStrToObj(posStr);
	const dirs = ['N', 'E', 'S', 'W'];

	switch (cmd) {
		case 'L':
			pos.dir = (arrayFlip(dirs)[pos.dir]-1 >= 0) ? dirs[arrayFlip(dirs)[pos.dir]-1] : dirs[3];
			break;
		case 'R':
			pos.dir = (arrayFlip(dirs)[pos.dir]+1 <= 3) ? dirs[arrayFlip(dirs)[pos.dir]+1] : dirs[0];
			break;
		case 'M':
			switch (pos.dir) {
				case 'N':
				 	pos.y = (pos.y + 1 <= gridSize.y) ? pos.y + 1 : pos.y;
					break; 
				case 'E':
					pos.x = (pos.x + 1 <= gridSize.x) ? pos.x + 1 : pos.x;
					break;
				case 'S':
					pos.y = (pos.y - 1 >= 0) ? pos.y - 1 : pos.y;
					break; 
				case 'W':
					pos.x = (pos.x - 1 >= 0) ? pos.x - 1 : pos.x;
					break;  
			}
			break;
	}

	return posObjToStr(pos);
}

function posStrToObj(posStr) {
	const parts = posStr.split(' ');
	return {
		x: parseInt(parts[0]),
		y: parseInt(parts[1]),
		dir: parts[2],
	}
}

function posObjToStr(posObj) {
	return `${posObj.x} ${posObj.y} ${posObj.dir}`;
}

// From: https://stackoverflow.com/questions/1159277/array-flip-in-javascript
function arrayFlip(trans) {
    var key, tmp_ar = {};
    for ( key in trans ) {
        if ( trans.hasOwnProperty( key ) ) {
            tmp_ar[trans[key]] = key;
        }
    }
    return tmp_ar;
}
