'use strict'
var gCanvas
var gColor
var gCtx
var gCurrLineIdx
var gImg
var gStartPos

function setCanvas(meme) {
    gCanvas = document.getElementById('canvas')
    gCtx = gCanvas.getContext('2d')
    let windowWidth = window.innerWidth

    if (windowWidth <= 1100 && windowWidth >= 750) tabTogalText()
    if (meme.lines[0].pos.x === -100) {
        var skipLines = true
    }
    const image = getImgById(meme.selectedImgId)
    gImg = new Image()//create a new html img element
    gImg.src = image.src//send a network req to get that image, define the img src
    gImg.onload = () => {
        let { offsetWidth, offsetHeight } = getOffsetSize()
        if ((windowWidth - 380) / offsetHeight <= 1) {

            gCanvas.width = windowWidth - 480
            // gCanvas.width = offsetWidth
            gCanvas.height = gCanvas.width
            console.log(2)
            if ((windowWidth - 380) < 750) {
                gCanvas.width = windowWidth - 100

                gCanvas.height = gCanvas.width
            }

        } else {
            gCanvas.width = offsetHeight - 100
            gCanvas.height = gCanvas.width
            console.log(1)

        }
        setCanvasSize(gCanvas.width, gCanvas.height)
        console.log(meme)
        if (skipLines) {
            meme.lines[0].pos.x = gCanvas.width / 2
            meme.lines[0].pos.y = gCanvas.height / 2
        }
        renderCanvas(gImg)
    }
    addListeners()
}


function renderCanvas(img = gImg) {
    var meme = getMeme()
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    meme.lines.forEach(meme => {
        gCtx.textAlign = 'center'
        drawText(meme)
    })
    gCtx.save()

}









function onDown(ev) {

    const pos = getEvPos(ev)
    var meme = getMeme()
    hideBorderElement()
    meme.lines.forEach(meme => meme.isSelected = false)
    var isDrag = false
    var { isDrag, idLine } = isMouseOnElement(pos)
    if (!isDrag) return
    // document.body.style.cursor = 'text'


}

function onMove(ev) {
    const meme = getMeme()
    var curMeme = meme.lines.find(meme =>
        meme.isDrag === true
    )
    if (!curMeme) return

    const pos = getEvPos(ev)
    const dx = pos.x
    const dy = pos.y
    if (curMeme.isScaled) {
        resizeDrageElement(curMeme, dx, dy)
        renderCanvas()
        return
    }

    if (curMeme) {
        setSquareAroundElement(curMeme)


        moveShape(curMeme, dx, dy)

        var gStartPos = pos
    }
}

function onUp() {
    setLineDrag(false)
    document.body.style.cursor = 'default'
}


function isMouseOnElement({ x, y }) {
    var meme = getMeme()
    var isDrag = false
    var idLine = null

    let elTxtInput = document.querySelector('.input-txt')
    elTxtInput.value = ''
    meme.lines.forEach((meme, idx) => {
        var shapeLeft = meme.pos.x - meme.pos.width / 2
        var shapeRight = shapeLeft + meme.pos.width
        var shapTop = meme.pos.y - meme.pos.height
        var shapBottom = meme.pos.y
        console.log('shapeLeft:', shapeLeft)
        console.log('shapeRight:', shapeRight)
        console.log('shapTop:', shapTop)
        console.log('shapBottom:', shapBottom)
        console.log('x, y:', x, y)
        
        if (x > shapeLeft && x < shapeRight + meme.size / 1.3 && y > shapTop && y < shapBottom + meme.size / 1.3) {
            // meme.isDrag = true
            isDrag = true
            idLine = idx
            meme.isDrag = true
            setSquareAroundElement(meme)
            setTextinput(meme, elTxtInput)
            meme.isSelected = true
            if (shapeRight <= x && shapBottom <= y) {
                meme.isScaled = true
                // resizeDrageElement()
                // elSquareAround.style.top = `${meme.pos.y - meme.pos.height}px`
                // elSquareAround.style.left = `${meme.pos.x - meme.pos.width / 2}px`
                // elSquareAround.style.width = `${meme.pos.width + meme.size}px`
                // elSquareAround.style.height = `${meme.pos.height + meme.size / 2}px`
                // elSquareAround.style.transform = `translate(${-meme.size / 2}px, 0px)`
            }
        }

    })

    return ({ isDrag, idLine })

}



function onTextChange(el) {
    let selectedMeme = getSelectedMeme()
    if (!selectedMeme) return
    selectedMeme.txt = el.value
    setSquareAroundElement(selectedMeme)
    renderCanvas()

}

function onColorChange(el) {
    // el.value = el.color
    let selectedMeme = getSelectedMeme()
    if (!selectedMeme) return
    selectedMeme.color = el.value
    setSquareAroundElement(selectedMeme)
    renderCanvas()
}

function onEnlargeElement(el) {
    let selectedMeme = getSelectedMeme()
    if (!selectedMeme) return
    selectedMeme.size += 1
    updateTopEditPanel(selectedMeme)
    setSquareAroundElement(selectedMeme)
    renderCanvas()

}

function onReduceElement(el) {
    let selectedMeme = getSelectedMeme()
    if (!selectedMeme) return
    if (selectedMeme.size <= 5) return
    selectedMeme.size -= 1
    updateTopEditPanel(selectedMeme)
    setSquareAroundElement(selectedMeme)
    renderCanvas()

}


function onRemoveElement(el) {
    let selectedMeme = getSelectedMeme()
    if (!selectedMeme) return
    selectedMeme.txt = ''
    setSquareAroundElement(selectedMeme)
    renderCanvas()
}


function onlineUpElement(el) {
    let selectedMeme = getSelectedMeme()
    if (!selectedMeme) return
    selectedMeme.pos.y = 0 + selectedMeme.pos.height
    setSquareAroundElement(selectedMeme)
    renderCanvas()

}

function onlineDownElement(el) {
    let selectedMeme = getSelectedMeme()
    if (!selectedMeme) return
    selectedMeme.pos.y = gCanvas.height
    setSquareAroundElement(selectedMeme)
    renderCanvas()

}


function onAlignRightElement(el) {
    let selectedMeme = getSelectedMeme()
    if (!selectedMeme) return
    console.log(selectedMeme)
    selectedMeme.pos.x = gCanvas.width - selectedMeme.pos.width / 2 - selectedMeme.size
    setSquareAroundElement(selectedMeme)
    renderCanvas()
}

function onAlignLeftElement(el) {
    let selectedMeme = getSelectedMeme()
    if (!selectedMeme) return
    selectedMeme.pos.x = 0 + selectedMeme.pos.width / 2 + selectedMeme.size
    setSquareAroundElement(selectedMeme)
    renderCanvas()
}


function onAlignCenterElement(el) {
    let selectedMeme = getSelectedMeme()
    if (!selectedMeme) return
    selectedMeme.pos.x = gCanvas.width / 2 - selectedMeme.pos.width / 2 + selectedMeme.size * 2
    setSquareAroundElement(selectedMeme)
    renderCanvas()
}



function onAddElement(el, size, stroke) {
    let selectedMeme = getSelectedMeme()
    if (selectedMeme) {
        selectedMeme.isSelected = false
        setSquareAroundElement(selectedMeme)
    }

    let txt = el.innerText
    let newLine = setNewElementLine(txt, size, stroke)
    newLine.isSelected = true
    updateTopEditPanel(newLine)
    // setSquareAroundElement(newLine)
    renderCanvas()



}





function onTxtStroke() {
    let selectedMeme = getSelectedMeme()
    if (selectedMeme) {
        selectedMeme.stroke = selectedMeme.stroke === 1 ? 2 : 1
        setSquareAroundElement(selectedMeme)
    }
    renderCanvas()

}