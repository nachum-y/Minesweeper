'use-strict'
document.addEventListener('contextmenu', event => event.preventDefault())

var rowSize = 8
var columnSize = 10
var gSound = true
const EMPTY = ''
const FLAG = '🚩'
const FLAGSOUND = new Audio('sound/sounds_flag.wav')
const UNFLAGSOUND = new Audio('sound/sounds_unflag.wav')
const CLICKSOUND = new Audio('sound/sounds_click.wav')
const EXPLOSIONSOUND = new Audio('sound/explosion.mp3')
const GAMEOVERSOUND = new Audio('sound/sounds_gameOver.wav')
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

const LEVELONE = { i: 4, j: 4, MINES: 2, level: 'LEVEL ⭐️' }
const LEVELTWO = { i: 8, j: 8, MINES: 12, level: 'LEVEL ⭐️⭐️' }
const LEVELTHREE = { i: 12, j: 12, MINES: 30, level: 'LEVEL ⭐️⭐️⭐️' }

var firstClick = true
var gLevel
var gFlags
var gNumberColor = '#9381ff'
var gCurrCell
var gMinePositions
var gLives
var gSafeclick
var gSafeActive = false
var gIsHint = false

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

// const elLevel = document.querySelector()

gLevel = LEVELTWO

function init() {
    gSafeclick = 3
    gLives = 3
    safeclickLeft.innerText = gSafeclick
    countB1 = 1
    countB2 = 1
    countB3 = 1

    clearGame()
    gGame.isOn = true

    elCurrLevel.innerText = gLevel.level

    gFlags = gLevel.MINES
    gElFlags.innerText = gFlags + FLAG


    gBoard = buildBoard()
    printMat(gBoard, '.game-container')


}






function printMat(mat, selector) {
    var strHTML = '<table class="table-game" border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j].print
            if (mat[i][j].mine) mat[i][j].status = TILESTATUSES.mine
            var className = (i + j) % 2 === 0 ? 'even' : 'odd'
            strHTML += `<td onmousedown="cellClicked(this,event,${i},${j})" data-i=${i} data-j=${j} data-clickable="true" data-status="${mat[i][j].status}" class="clickable-location ${className}"> ${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    var elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}




function cellClicked(cell, ev, idxI, idxJ) {
    if (!gGame.isOn) {
        return
    }


    gCurrCell = cell


    if (ev.buttons === 2) {
        if (cell.dataset.status === TILESTATUSES.flaged) {
            console.log(1)
            cell.dataset.cell = TILESTATUSES.hiden
            gBoard[idxI][idxJ].status = TILESTATUSES.hiden
            cell.innerHTML = `<img class="flag flag-hide" src="img/red-flag.gif" alt="close">`
            gFlags++
            gElFlags.innerText = gFlags + FLAG
            if (gSound) UNFLAGSOUND.play()
        } else if (gFlags !== 0) {
            if (gSound) FLAGSOUND.play()
            cell.innerHTML = `<img class="flag" src="img/red-flag.gif" alt="close">`
            cell.dataset.status = TILESTATUSES.flaged
            gBoard[idxI][idxJ].status = TILESTATUSES.flaged
            gFlags--
            gElFlags.innerText = gFlags + FLAG

        }
    } else {
        if (firstClick) {
            start()
            firstClick = false
        }
        if (gIsHint) {
            revealHint(idxI, idxJ)
            return
        }
        if (gSound) CLICKSOUND.play()
        if (cell.dataset.status === TILESTATUSES.mine) {
            if (gSound) EXPLOSIONSOUND.play()
            checkLose()
            cell.innerHTML = `<img class="mine" src="img/explosion.gif" alt="close">`
            cell.style.backgroundColor = 'beige'
        } else {
            // cell.dataset.status = TILESTATUSES.number
            // var number = ''
            // number = countBoombAround(gBoard, idxI, idxJ).length > 0 ? countBoombAround(gBoard, idxI, idxJ).length : ''
            revealTile(idxI, idxJ)

            if (checkWin()) {
                console.log('win')
                elWinLoseTitle.innerText = 'YOU WIN'
                gGame.isOn = false
                modalTimeOutInterval = setTimeout(function () {
                    window.open("#open-modal-win-lose", '_self')
                }, 1000)

                pause()

            }
        }

    }
}



function mouseClicked(event) {
    if (event.buttons === 2) {

    }

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


function checkWin() {
    var count = 0
    for (var i = 0; i < gLevel.i; i++) {
        for (j = 0; j < gLevel.j; j++) {

            if (!gBoard[i][j].mine && (gBoard[i][j].status === TILESTATUSES.hiden || gBoard[i][j].status === TILESTATUSES.flaged)) count++

        }
    }
    return count === 0
}


function checkLose() {
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



function revealMines() {
    var mines = []
    for (var i = 0; i < gMinePositions.length; i++) {
        var idxI = gMinePositions[i].i
        var idxJ = gMinePositions[i].j
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

// function revealMineTransitionsWin(elTds) {
//     if (elTds.length === 0) return
//     explosionInterval = setTimeout(function () {
//         if (gSound) EXPLOSIONSOUND.play()
//         elTds[0].style.backgroundColor = 'beige'
//         elTds[0].innerHTML = `<img class="mine" src="/img/explosion.gif" alt="close">`
//         revealMineTransitions(elTds.slice(1))
//     }, 150)

// }


function revealTile(idxI, idxJ) {
    cell = gBoard[idxI][idxJ]
    console.log(cell)
    if (cell.status !== TILESTATUSES.hiden) return
    if (cell.mine) return
    cell.status = TILESTATUSES.number
    var elTd = document.querySelector(`[data-i="${idxI}"][data-j="${idxJ}"]`)

    var mines = countBoombAround(gBoard, idxI, idxJ)
    var listTile = countTileAround(gBoard, idxI, idxJ)
    var minesAround = mines.length

    elTd.dataset.status = TILESTATUSES.number
    elTd.innerText = minesAround > 0 ? minesAround : ''
    colorNumbers(minesAround)
    elTd.style.color = gNumberColor


    if (minesAround === 0) {
        for (var i = 0; i < listTile.length; i++) {
            revealTile(listTile[i].i, listTile[i].j)
        }
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



function hintClick(el, bulb) {

    var bulbClick = `<lottie-player src="https://assets8.lottiefiles.com/packages/lf20_9Rpr7C.json"  background="transparent"  speed="2"  style="width: 80px; height: 80px;"    autoplay></lottie-player>`
    switch (bulb) {
        case 1:
            if (countB1 === 0) return
            gIsHint = true
            countB1--
            el.innerHTML = bulbClick
            break
        case 2:
            if (countB2 === 0) return
            gIsHint = true
            countB2--
            el.innerHTML = bulbClick
            break
        case 3:
            if (countB3 === 0) return
            gIsHint = true
            countB3--
            el.innerHTML = bulbClick
            break
        default:

            break
    }

}





function clearGame() {

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
    var pos = drawNum(emptycells)
    safeclickrevealTile(pos.i, pos.j)


    // var elTd = document.querySelector(`[data-i="${pos.i}"][data-j="${pos.j}"]`)
    // gSafeclick = true
}

function safeclickrevealTile(idxI, idxJ) {

    if (gBoard[idxI][idxJ].mine) {
        console.log('mines')
        cell.status = TILESTATUSES.mine
        return
    } else {
        if (gSafeclick === 0) return
        gSafeActive = true
        if (gSafeActive) safeclickSpan.innerText = 'ACTIVE'
        gSafeclick--
        safeclickLeft.innerText = gSafeclick
        gBoard[idxI][idxJ].status = TILESTATUSES.number
        // cell.status = TILESTATUSES.number
        var elTd = document.querySelector(`[data-i="${idxI}"][data-j="${idxJ}"]`)
        elTd.dataset.status = TILESTATUSES.number
        var mines = countBoombAround(gBoard, idxI, idxJ)
        var minesAround = mines.length
        // var listTile = countTileAround(gBoard, idxI, idxJ)
        // console.log(listTile)
        elTd.innerText = minesAround > 0 ? minesAround : ''
        colorNumbers(minesAround)
        elTd.style.color = gNumberColor
        // console.log(cell)
    }
    safeclickTimeOut = setTimeout(function () {
        gBoard[idxI][idxJ].status = TILESTATUSES.hiden
        elTd.dataset.status = TILESTATUSES.hiden
        elTd.innerText = ''
        gSafeActive = false
        if (!gSafeActive) safeclickSpan.innerText = ''
    }, 1000)
}


function revealHint(idxI, idxJ) {
    // console.log('hint')
    tiles = countTileAroundAll(idxI, idxJ)
    // console.log(tiles[i].i, tiles[i].j)
    var tiles
    // console.log(tiles)

    for (var i = 0; i < tiles.length; i++) {
        var elTd = document.querySelector(`[data-i="${tiles[i].i}"][data-j="${tiles[i].j}"]`)
        if (gBoard[tiles[i].i][tiles[i].j].mine) {
            elTd.innerHTML = `<img class="mine" src="img/explosion.gif" alt="close">`
        } else {
            gBoard[tiles[i].i][tiles[i].j].status = TILESTATUSES.number
            // cell.status = TILESTATUSES.number
            elTd.dataset.status = TILESTATUSES.number
            var mines = countBoombAround(gBoard, tiles[i].i, tiles[i].j)
            var minesAround = mines.length
            // var listTile = countTileAround(gBoard, tiles[i].i, tiles[i].j)
            // console.log(listTile)
            elTd.innerText = minesAround > 0 ? minesAround : ''
            colorNumbers(minesAround)
            elTd.style.color = gNumberColor
            // console.log(cell)
        }


    }

    hintTimeOut = setTimeout(function () {

        hideHint(idxI, idxJ)

    }, 1000)
    gIsHint = false
}

function hideHint(idxI, idxJ) {
    tiles = countTileAroundAll(idxI, idxJ)
    var tiles
    for (var i = 0; i < tiles.length; i++) {
        var elTd = document.querySelector(`[data-i="${tiles[i].i}"][data-j="${tiles[i].j}"]`)
        if (gBoard[tiles[i].i][tiles[i].j].mine) {
            elTd.innerHTML = ''
        } else {
            gBoard[tiles[i].i][tiles[i].j].status = TILESTATUSES.hiden
            elTd.dataset.status = TILESTATUSES.hiden
            var mines = countBoombAround(gBoard, tiles[i].i, tiles[i].j)
            var minesAround = mines.length
            // var listTile = countTileAround(gBoard, tiles[i].i, tiles[i].j)
            // console.log(listTile)
            elTd.innerText = ''

        }

    }
}
var score = {
    time: 30
}


function localStorageScore(currTime) {
    // if (currTime < score.time) {
    // }
    localStorage.setItem('bestScore', score)
    console.log(localStorage);
}