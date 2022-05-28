'use strict'
var pr

// function buildBoard() {
//     gMinePositions = getMinespositions()
//     var board = []
//     for (var i = 0; i < gLevel.i; i++) {
//         board.push([])
//         // board[i] = []
//         for (var j = 0; j < gLevel.j; j++) {
//             var tile = {
//                 i,
//                 j,
//                 mine: gMinePositions.some(p => matchPosition(p, { i, j })),
//                 print: '',
//                 status: 'hiden'
//             }
//             board[i][j] = tile
//         }
//     }
//     return board
// }





// function getMinespositions() {
//     var positions = []
//     while (positions.length < gLevel.MINES) {
//         var position = {
//             i: getRandomInt(0, gLevel.i),
//             j: getRandomInt(0, gLevel.j)
//         }
//         if (!positions.some(p => matchPosition(p, position))) {
//             positions.push(position)
//         }
//     }
//     return positions
// }

// function matchPosition(pos1, pos2) {

//     return pos1.i === pos2.i && pos1.j === pos2.j
// }


