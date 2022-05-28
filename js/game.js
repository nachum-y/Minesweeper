'use-strict'
document.addEventListener('contextmenu', event => event.preventDefault())

var gSound = true
const EMPTY = ''
const FLAG = '🚩'
const FLAGSOUND = new Audio('sound/sounds_flag.wav')
const UNFLAGSOUND = new Audio('sound/sounds_unflag.wav')
const CLICKSOUND = new Audio('sound/sounds_click.wav')
const EXPLOSIONSOUND = new Audio('sound/explosion.mp3')
const GAMEOVERSOUND = new Audio('sound/sounds_gameOver.wav')

var gGame

var gBoard = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false,
}


var gScore = {
    scoreLevel4: null,
    scoreLevel8: null,
    scoreLevel12: null
}

const LEVELONE = { SIZE: 4, MINES: 2, level: 'LEVEL ⭐️' }
const LEVELTWO = { SIZE: 8, MINES: 12, level: 'LEVEL ⭐️⭐️' }
const LEVELTHREE = { SIZE: 12, MINES: 30, level: 'LEVEL ⭐️⭐️⭐️' }

var gLevel = LEVELTWO
var gPrevBoard
var firstClick = true
var gFlags
var gNumberColor = '#9381ff'
var gCurrCell
var gMinePositions
var gLives
var gSafeclick
var gSafeActive = false
var gIsHint = false
var gPositionsNums
var gMinePoss

var loseTimeOut
var startTime
var timerInterval
var elapsedTime = 0
var explosionInterval
var modalTimeOutInterval
var heartsTimeOut
var safeclickTimeOut
var hintTimeOut
var countB1 = 1
var countB2 = 1
var countB3 = 1

const TILESTATUSES = {
    number: 'number',
    hiden: 'hiden',
    mine: 'mine',
    flaged: 'flaged'
}

const gElFlags = document.querySelector('h2 .flags')
const elBoard = document.querySelector('.game-container')
const elTimer = document.querySelector("#timer-display")
const elCurrLevel = document.querySelector(".curr-level")
const elWinLoseTitle = document.querySelector(".win-lose-title")
const elHearts = document.querySelectorAll(".fa-heart")
const safeclickSpan = document.querySelector('.safeclick-active')
const safeclickLeft = document.querySelector('.safeclick-left')
const elHintsBulb = document.querySelectorAll('.bulbs')
const elWinLoseAnimation = document.querySelector('.win-lose-animation')
const elUndoClick = document.querySelector('.undo-clicks')
const elCurrScore = document.querySelector('.curr-core')
const elBestScore = document.querySelector('.best-score"')

// const elLevel = document.querySelector()


function init() {
    gSafeclick = 3
    gLives = 3
    safeclickLeft.innerText = gSafeclick
    countB1 = 1
    countB2 = 1
    countB3 = 1
    clearGame()

    gFlags = gLevel.MINES
    gElFlags.innerText = gFlags + FLAG

    createArrayOfObjects()

    gMinePoss = getMinespositions()


    elCurrLevel.innerText = gLevel.level



    gGame.isOn = true
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)


}


function buildBoard(SIZE) {
    var board = []
    console.log(gMinePoss)
    for (var i = 0; i < SIZE; i++) {
        board.push([])
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = {
                i,
                j,
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    for (i = 0; i < gMinePoss.length; i++) {
        board[gMinePoss[i].i][gMinePoss[i].j].isMine = true
    }

    return board
}


function setMinesNegsCount(rowIdx, colIdx) {
    var mines = []
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        // console.log('i:', i)
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = gBoard[i][j].isMine
            if (cell) {
                mines.push(gBoard[i][j])
            }

        }
    }
    return mines

}

function renderBoard(board) {
    var strHTML = '<table class="table-game" border="0"><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var className = (i + j) % 2 === 0 ? 'even' : 'odd'
            gBoard[i][j].minesAroundCount = setMinesNegsCount(i, j).length > 0 ? setMinesNegsCount(i, j).length : null
            colorNumbers(gBoard[i][j].minesAroundCount)
            innerHtmlStr = getrendHtml(gBoard[i][j])
            console.log(innerHtmlStr)
            var backgroundClor = gBoard[i][j].isMine ? gBoard[i][j].isShown ? 'beige' : '' : ''

            // strHTML += `<td onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j})" data-i=${i} data-j=${j} data-clickable="false" data-isShown="${board[i][j].isShown}" class="clickable-location ${className}"></td>`
            strHTML += `<td onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j})" style="color:${gNumberColor};background-color:${backgroundClor}" data-i=${i} data-j=${j}  data-isShown="${board[i][j].isShown}" class="clickable-location ${className}">${innerHtmlStr}</td>`
        }
        strHTML += '</tr>'
    }

    strHTML += '</tbody></table>'
    var elContainer = document.querySelector('.game-container')
    elContainer.innerHTML = strHTML

}





function cellClicked(cell, i, j) {

    if (!gGame.isOn) {
        return
    }
    if (gBoard[i][j].isShown) return
    var newmat = copyMat(gBoard)
    gPrevBoard.push(newmat)
    if (gGame.isFirstClick === 0) {
        start()
        gGame.isFirstClick++
    }



    if (gGame.isHint) {
        revealHint(i, j)
        return
    }
    if (gSound) CLICKSOUND.play()
    if (gBoard[i][j].isMine) {
        if (gSound) EXPLOSIONSOUND.play()
        gBoard[i][j].isShown = true
        checkLose()
        cell.innerHTML = `<img class="mine" src="img/explosion.gif" alt="explosion">`
        cell.style.backgroundColor = 'beige'
    }
    else {
        expandShown(i, j)

        if (checkWin()) {
            console.log('win')
            elWinLoseTitle.innerText = 'YOU WIN'
            gGame.isOn = false
            modalTimeOutInterval = setTimeout(function () {
                window.open("#open-modal-win-lose", '_self')
            }, 1000)
            elCurrScore.innerText = gTimeSecounds
            localStorageScore(gTimeSecounds)
            elWinLoseAnimation.innerHTML = `<lottie-player src="https://assets8.lottiefiles.com/packages/lf20_KyIVgm.json" background="transparent"
            speed="1" style="width: 200px; height: 200px; margin: auto;" loop autoplay></lottie-player>`
            pause()

        }
    }



}

function cellMarked(elCell, idxI, idxJ) {

    if (gBoard[idxI][idxJ].isMarked) {
        if (gSound) UNFLAGSOUND.play()
        gFlags++
        gBoard[idxI][idxJ].isMarked = false
        gBoard[idxI][idxJ].isShown = false
        gElFlags.innerText = gFlags + FLAG
        // elCell.classList.add('flag-hide')
        elCell.innerHTML = `<img class="flag flag-hide" src="img/red-flag.gif" alt="close">`
    } else if (gFlags !== 0 && !gBoard[idxI][idxJ].isShown) {
        if (gSound) FLAGSOUND.play()

        elCell.innerHTML = `<img class="flag" src="img/red-flag.gif" alt="close">`
        gFlags--
        gElFlags.innerText = gFlags + FLAG
        gBoard[idxI][idxJ].isMarked = true
        gBoard[idxI][idxJ].isShown = true
    }







}





function checkGameOver() {

}



function expandShown(i, j) {
    cell = gBoard[i][j]
    if (cell.isMine) return
    if (cell.isShown) return
    cell.isShown = true
    renderCell(i, j, cell.minesAroundCount)
    var listTile = countTileAround(i, j)
    if (cell.minesAroundCount === null) {
        for (var i = 0; i < listTile.length; i++) {
            expandShown(listTile[i].i, listTile[i].j)
        }
    }
}

function countTileAround(rowIdx, colIdx) {
    var tile = []
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = gBoard[i][j].isShown

            if (!cell) {
                tile.push(gBoard[i][j])
            }

        }
    }
    return tile
}




function renderCell(i, j, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
    elCell.innerHTML = value


    if (!gBoard[i][j].isMine) {
        elCell.dataset.isshown = true
        elCell.dataset.clickable = false
    }


}




function colorNumbers(x) {
    switch (x) {
        case 1:
            gNumberColor = '#9381ff'
            break
        case 2:
            gNumberColor = '#4361ee'
            break
        case 3:
            gNumberColor = '#7400b8'

            break
        case 4:
            gNumberColor = '#8f2d56'
            break
        default:
    }
}







function getMinespositions() {
    var positions = []
    while (positions.length < gLevel.MINES) {
        var num = drawNum(gPositionsNums)
        var position = {
            i: num.i,
            j: num.j
        }
        positions.push(position)

    }
    return positions
}





function createArrayOfObjects() {
    gPositionsNums = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            gPositionsNums.push({ i, j })
        }
    }
}



function getrendHtml(cell) {
    // console.log(cell.isMine);
    if (cell.isMine && cell.isShown) return `<img class="mine" src="img/explosion.gif" alt="explosion">`
    if (cell.isMarked) return `<img class="flag flag-hide" src="img/red-flag.gif" alt="close">`
    if (cell.isShown) return cell.minesAroundCount > 0 ? cell.minesAroundCount : ''
    return ''

}








function controlVul(el) {

    var sound = 'up'
    sound = el.dataset.sound === 'on' ? 'off' : 'up'
    if (sound === 'off') {
        el.dataset.sound = 'off'
        gSound = false
    } else {
        el.dataset.sound = 'on'
        gSound = true
    }
    el.src = `/img/volume_${sound}_white_24dp.png`
    // if (el.dataset.sound === 'on') {
    //     el.src =`/img/volume_${sound}_white_24dp.png`
    //     console.log(1)
    // }
}



function checkLose() {
    console.log('gMinePoss:', gMinePoss)
    if (gLives > 0) {
        elHearts[gLives - 1].classList.add('heart-remove')
        var elCurrHeart = document.querySelector('.heart-remove')
        heartsTimeOut = setTimeout(function () {
            elCurrHeart.style.opacity = 0
        }, 1500)

        gLives--
        return
    }

    gGame.isOn = false
    elWinLoseTitle.innerText = "YOU LOSE!"
    elWinLoseAnimation.innerHTML = `<lottie-player src="https://assets5.lottiefiles.com/packages/lf20_TunrI5.json" background="transparent"
    speed="1" style="width: 200px; height: 200px; margin: auto;" loop autoplay></lottie-player>`

    modalTimeOutInterval = setTimeout(function () {
        window.open("#open-modal-win-lose", '_self')
    }, 2000)


    pause()
    if (gSound) GAMEOVERSOUND.play()
    loseTimeOut = setTimeout(revealMines, 100)
}





function checkWin() {
    var count = 0
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {

            if (gBoard[i][j].isShown && !gBoard[i][j].isMine) count++


        }
    }
    console.log(count)
    return count + gLevel.MINES >= gLevel.SIZE ** 2
}



function revealMines() {
    var mines = []
    console.log(gMinePoss)
    for (var i = 0; i < gMinePoss.length; i++) {
        var idxI = gMinePoss[i].i
        var idxJ = gMinePoss[i].j
        var elTd = document.querySelector(`[data-i="${idxI}"][data-j="${idxJ}"]`)
        mines.push(elTd)
    }
    revealMineTransitions(mines)
}


function revealMineTransitions(elTds) {
    if (elTds.length === 0) return
    explosionInterval = setTimeout(function () {
        if (gSound) EXPLOSIONSOUND.play()
        elTds[0].style.backgroundColor = 'beige'
        elTds[0].innerHTML = `<img class="mine" src="img/explosion.gif" alt="close">`
        revealMineTransitions(elTds.slice(1))
    }, 150)

}


function hintClick(el, bulb) {

    var bulbClick = `<lottie-player src="https://assets8.lottiefiles.com/packages/lf20_9Rpr7C.json"  background="transparent"  speed="2"  style="width: 80px; height: 80px;"    autoplay></lottie-player>`
    switch (bulb) {
        case 1:
            if (countB1 === 0) return
            gGame.isHint = true
            countB1--
            el.innerHTML = bulbClick
            break
        case 2:
            if (countB2 === 0) return
            gGame.isHint = true
            countB2--
            el.innerHTML = bulbClick
            break
        case 3:
            if (countB3 === 0) return
            gGame.isHint = true
            countB3--
            el.innerHTML = bulbClick
            break
        default:

            break
    }

}













function clearGame() {

    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        isFirstClick: 0,
        hints: 3,
        lives: 3,
        safeclick: 3,
        isSafeClick: false,
        isHint: false
    }
    elUndoClick.innerText = ''
    gPrevBoard = []
    elapsedTime = 0
    clearInterval(timerInterval)
    firstClick = true
    elTimer.innerText = '000'

    for (var i = 0; i < elHearts.length; i++) {
        elHearts[i].classList.remove('heart-remove')
        elHearts[i].style.opacity = '1'
    }

    for (var i = 0; i < elHintsBulb.length; i++) {
        elHintsBulb[i].innerHTML = `<lottie-player src="https://assets7.lottiefiles.com/packages/lf20_vt3bi9gz.json"
        background="transparent" speed="1.5" style="width: 80px; height: 80px;" autoplay>
    </lottie-player>`
    }

}


function safeclick() {
    var emptycells = findEmptyPos()
    if (emptycells.length > 0) {
        var pos = drawNum(emptycells)
        safeclickrevealTile(pos.i, pos.j)
    }

}

function safeclickrevealTile(idxI, idxJ) {
    cell = gBoard[idxI][idxJ]
    if (cell.isMine) {
        console.log('mines')
        return
    } else {
        if (gSafeclick === 0) return
        gSafeActive = true
        if (gSafeActive) safeclickSpan.innerText = 'ACTIVE'
        gSafeclick--
        safeclickLeft.innerText = gSafeclick
        gBoard[idxI][idxJ].isshown = true
        var elTd = document.querySelector(`[data-i="${idxI}"][data-j="${idxJ}"]`)

        renderCell(idxI, idxJ, cell.minesAroundCount)
    }
    safeclickTimeOut = setTimeout(function () {
        elTd.dataset.isshown = false
        elTd.dataset.clickable = true
        elTd.innerText = ''
        gSafeActive = false
        if (!gSafeActive) safeclickSpan.innerText = ''
    }, 1000)
}


function revealHint(idxI, idxJ) {
    tiles = countTileAroundAll(idxI, idxJ)

    for (var i = 0; i < tiles.length; i++) {
        cell = gBoard[tiles[i].i][tiles[i].j]

        var elTd = document.querySelector(`[data-i="${tiles[i].i}"][data-j="${tiles[i].j}"]`)
        if (cell.isMine) {
            elTd.innerHTML = `<img class="mine" src="img/explosion.gif" alt="close">`
        } else {
            if (cell.isShown) continue
            renderCell(cell.i, cell.j, cell.minesAroundCount)

        }


    }

    hintTimeOut = setTimeout(function () {

        hideHint(idxI, idxJ)

    }, 1000)

    gGame.isHint = false

}

function hideHint(idxI, idxJ) {
    console.log('hide')
    tiles = countTileAroundAll(idxI, idxJ)
    for (var i = 0; i < tiles.length; i++) {
        cell = gBoard[tiles[i].i][tiles[i].j]
        var elTd = document.querySelector(`[data-i="${tiles[i].i}"][data-j="${tiles[i].j}"]`)

        if (cell.isMine) {
            console.log(i)
            elTd.innerHTML = ''
        } else {
            if (cell.isShown) continue
            renderCell(cell.i, cell.j, '')
            elTd.dataset.clickable = true
            elTd.dataset.isshown = false
            console.log(elTd)

        }


    }
}



function undoBtn() {
    if (gPrevBoard.length > 0) {
        elUndoClick.innerText = `${gPrevBoard.length - 1} more clicks left`

        gBoard = gPrevBoard.pop()
        renderBoard(gBoard)
        console.log('undo')
    } else {
        elUndoClick.innerText = ''
    }
}






function copyMat(mat) {
    var c = []
    var newMat = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        newMat[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            var o = {}

            for (var key in mat[i][j]) {
                var v = mat[i][j]
                var k = key
                o[k] = v[key]
            }

            // console.log(o)
            newMat[i][j] = o
        }
    }
    return newMat

}





function localStorageScore(Time) {
    if (localStorage.getItem('bestScoreLevelONE')) {
        console.log('ok!')

    }
    // var score = localStorage.getItem('bestScoreLevelONE')
    // console.log(txtt)
    switch (gLevel.SIZE) {
        case 4:
            if (!localStorage.getItem('bestScoreLevelONE')) {
                localStorage.setItem('bestScoreLevelONE', Time)
            } else {
                if (localStorage.getItem('bestScoreLevelONE') > Time) localStorage.setItem('bestScoreLevelONE', Time)
            }

            break
        case 8:
            console.log(8)
            break
        case 12:
            console.log(12)
            break
        default:
            break
    }



    // if(localStorage.getItem('bestScore')){
    //     console.log('ok');
    //     localStorage.setItem('bestScore', score.time)
    // }
}