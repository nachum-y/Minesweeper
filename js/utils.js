'use-strict'


var gTimeSecounds
///////           renderCell                                         ///////
// function renderCell(location, value) {
//     // Select the elCell and set the value
//     var elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
//     elCell.innerHTML = value
// }
////////////////////////////////////////////////////////////////////////////






///////           getRandomIntInclusive                   ///////
function getRandomIntInclusive(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min
}
////////////////////////////////////////////////////////////////

///////           getRandomInt                   ///////

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

////////////////////////////////////////////////////////////////




//                   stopWatch                    //
////////////////////////////////////////////////////
function timeToString(time) {
    let diffInHrs = time / 3600000
    let hh = Math.floor(diffInHrs)

    let diffInMin = (diffInHrs - hh) * 60
    let mm = Math.floor(diffInMin)

    let diffInSec = (diffInMin - mm) * 60
    let ss = Math.floor(diffInSec)

    let diffInMs = (diffInSec - ss) * 1000
    let ms = Math.floor(diffInMs)

    let formattedMM = mm.toString().padStart(2, "0")
    let formattedSS = ss.toString().padStart(3, "0")
    let formattedMS = ms.toString().padStart(2, "0")

    return `${formattedSS}`
}



function print(txt) {
    gTimeSecounds = txt
    elTimer.innerHTML = txt
}


function start() {
    startTime = Date.now() - elapsedTime
    timerInterval = setInterval(function printTime() {
        elapsedTime = Date.now() - startTime
        print(timeToString(elapsedTime))
    }, 1000)
}

function pause() {
    clearInterval(timerInterval)
}

//                 End  stopWatch                    //
//////////////////////////////////////////////////////////////////



//                   stopWatch                    //



// function countBoombAround(mat = gBoard, rowIdx, colIdx) {
//     var mines = []
//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i > gBoard.length - 1) continue
//         // console.log('i:', i)
//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (j < 0 || j > gBoard[0].length - 1) continue
//             if (i === rowIdx && j === colIdx) continue
//             var cell = gBoard[i][j].status
//             if (cell === TILESTATUSES.mine) {
//                 mines.push(gBoard[i][j])
//             }

//         }
//     }
//     return mines
// }


// function countTileAround(mat = gBoard, rowIdx, colIdx) {
//     var tile = []
//     for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
//         if (i < 0 || i > gBoard.length - 1) continue
//         // console.log('i:', i)
//         for (var j = colIdx - 1; j <= colIdx + 1; j++) {
//             if (j < 0 || j > gBoard[0].length - 1) continue
//             if (i === rowIdx && j === colIdx) continue
//             var cell = gBoard[i][j].status
//             if (cell === TILESTATUSES.hiden) {
//                 tile.push(gBoard[i][j])
//             }

//         }
//     }
//     return tile
// }



//////////////////////
function drawNum(gNums) {
    var idx = getRandomInt(0, gNums.length) // use getRandomInt Function
    var num = gNums.splice(idx, 1)[0] // gNums === some array with numbers...
    return num
}

/////////////////////////



function findEmptyPos() {
    var pos = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            if (!cell.isShown && !cell.isMine) {
                pos.push({ i, j })
            }
        }
    }
    return pos
}


function countTileAroundAll(rowIdx, colIdx) {
    var tile = []
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        // console.log('i:', i)
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            var cell = { i: gBoard[i][j].i, j: gBoard[i][j].j }
            tile.push(cell)


        }
    }
    return tile
}