'use strict'
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function setCanvasSize(hieght, width) {
    gCanvas.height = hieght
    gCanvas.width = width
}

//Handle the listeners
function addListeners() {
    addMouseListeners()
    addTouchListeners()
    // Listen for resize ev 
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
    })
}

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchend', onUp)
}


function setLineDrag(isDrag) {
    var meme = getMeme()
    var curMeme = meme.lines.find(meme => {
        return meme.isDrag
    })
    if (curMeme) curMeme.isDrag = isDrag
    var curMemeScale = meme.lines.find(meme => {
        return meme.isScaled
    })
    if (curMemeScale) curMemeScale.isScaled = false
}


function moveShape(meme, x, y) {
    meme.pos.x = x
    meme.pos.y = y
    renderCanvas()
}


function getEvPos(ev) {

    //Gets the offset pos , the default pos
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    // Check if its a touch ev
    if (gTouchEvs.includes(ev.type)) {
        //soo we will not trigger the mouse ev
        ev.preventDefault()
        //Gets the first touch point
        ev = ev.changedTouches[0]
        //Calc the right pos according to the touch screen
        let canvasSize = canvas.getBoundingClientRect();
        pos = {
            x: ev.pageX - canvasSize.left,
            y: ev.pageY - canvasSize.top
        }
    }
    return pos
}





function setTextinput(meme, elTxtInput) {
    elTxtInput.value = meme.txt

}


function getSelectedMeme() {
    let meme = getMeme()
    return meme.lines.find((meme) => meme.isSelected)
}


function drawText(meme) {
    gCtx.beginPath()

    var x = meme.pos.x
    var y = meme.pos.y
    gCtx.lineWidth = 0.3

    var txt = meme.txt
    var txtHeight = meme.size
    gCtx.fillStyle = meme.color
    gCtx.font = `${meme.size}px ${meme.font}`
    var txtWidth = gCtx.measureText(txt).width
    var txtHeight = parseInt(gCtx.font)
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = meme.stroke
    gCtx.fillStyle = meme.color
    gCtx.fillText(txt, x, y)//Draws (fills) a given text at the given (x, y) position.
    gCtx.strokeText(txt, x, y)//Draws (strokes) a given text at the given (x, y) position.

    var fillRect = false
    // meme.pos.x = x - txtWidth / 2
    // meme.pos.y = y - txtHeight
    meme.pos.width = txtWidth
    meme.pos.height = txtHeight



}


function setSquareAroundElement(meme) {
    let elSquareAround = document.querySelector('.square-around-element')
    if (!meme.isSelected) {
        elSquareAround.style.visibility = 'hidden'
        return
    }
    if (meme.txt.length === 0) {
        elSquareAround.style.visibility = 'hidden'
        return
    }

    document.getElementById("input-txt-selected").focus()


    elSquareAround.style.visibility = 'visible'
    elSquareAround.style.fontFamily = meme.font
    elSquareAround.style.fontSize = `${meme.size}px`
    elSquareAround.style.position = 'absolute'
    elSquareAround.style.top = `${meme.pos.y - meme.pos.height}px`
    elSquareAround.style.left = `${meme.pos.x - meme.pos.width / 2}px`
    elSquareAround.style.width = `${meme.pos.width + meme.size}px`
    elSquareAround.style.height = `${meme.pos.height + meme.size / 2}px`
    elSquareAround.style.transform = `translate(${-meme.size / 2}px, 0px)`
}


function hideBorderElement() {
    let elSquareAround = document.querySelector('.square-around-element')
    elSquareAround.style.visibility = 'hidden'

}


function setNewElementLine(txt, size, stroke) {
    let meme = getMeme()
    let newline = {

        txt,
        size: size,
        align: 'left',
        color: '#f6efef',
        pos: { x: gCanvas.width / 2, y: gCanvas.height / 2 },
        isDrag: false,
        isSelected: true,
        font: 'impact',
        stroke
    }

    meme.lines.push(newline)
    return meme.lines[meme.lines.length - 1]
}


function resizeCanvas() {
    let { offsetWidth, offsetHeight } = getOffsetSize()
    let windowWidth = window.innerWidth
    if(windowWidth === 1100) tabTogalText()
    var elContainer = document.querySelector('.main-meme')
    if (offsetWidth / offsetHeight <= 1) {
        gCanvas.width = offsetWidth - 100
        gCanvas.height = gCanvas.width

    } else {
        gCanvas.width = offsetHeight - 100
        gCanvas.height = gCanvas.width
    }

}


function calcAspectRatio(hieghtImg, widthImg) {
    let userPageWidth = document.body.clientWidth
    let userPageHieght = document.body.clientWidth
    if (userPageWidth >= 2140) userPageWidth = 2100
    let widthAspect = userPageWidth / 2 / widthImg
    let heightAspect = widthAspect
    return ({ widthAspect, heightAspect })

}


function updateTopEditPanel(selectedMeme) {
    let elFontSizeSelector = document.querySelector('.font-size-selector')
    elFontSizeSelector.value = selectedMeme.size
}


function getOffsetSize() {
    var elContainer = document.querySelector('.main-meme')
    let offsetHeight = elContainer.offsetHeight
    let offsetWidth = elContainer.offsetWidth

    return ({ offsetWidth, offsetHeight })


}

function resizeDrageElement(meme, dx, dy) {
    if (dx <= meme.pos.x + meme.pos.width / 2) {
        meme.size -= 1
    }
    else {
        meme.size += 1
    }
    setSquareAroundElement(meme)
    updateTopEditPanel(meme)

    // console.log(meme, dx)
    // const pos = getEvPos(ev)

    // const dx = pos.x
    // const dy = pos.y

    // console.log(dx, dy)
}