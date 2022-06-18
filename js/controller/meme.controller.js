'use strict'

function onMemeGalleryClick(memeId) {
    setImgMemeId(memeId)
    renderMeme(memeId)
}

function renderMeme(memeId) {
    const meme = getMeme(memeId)
    var strHtmls = `
    <div class="main-meme">
                <div class="canva-container">
                <div class=canva-selector>
                    <canvas id="canvas" height="500px" width="500px">
                    </canvas>
                    <span class="square-around-element">
                    <span onclick="onResizeElement()" class="resize-element"></span>
                    </span>
                    </div>
                </div>
    
            </div> 
`

    // strHtmls.unshift('<div class="main-img-gallery main-layout">')
    document.querySelector('.main-content').innerHTML = strHtmls
    document.querySelector('.top-nav-edit').innerHTML =
        `
    
    <div class="controller-top-bar">
                <div class="grid-controller">
                    <div class="font-selctor ">
                        <select>
                            <option>Impact</option>
                            <option>No external background image</option>
                            <option>No wrapper</option>
                        </select>
                    </div>
                    <div class="size-selecor">
                        <div onclick="onEnlargeElement(this)" class="btn-controller enlarge-element size-btn"><i
                                class="fa-solid fa-plus"></i></div>
                        <span><input class="font-size-selector" type="number" value="30"></span>
                        <div onclick="onReduceElement(this)" class="btn-controller reduce-element size-btn"><i
                                class="fa-solid fa-minus"></i></div>
                    </div>

                    <div class="element-style-topbar">
                    <div onclick="colorPickerClick()" class="color-picker">
                    <input id="font-color-button" type="color" id="pick-color" name="pick-color" style="opacity:0; position: absolute;width:0;" value="#e66465" oninput="onColorChange(this)">
                    <div class="a-color">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11 2 5.5 16h2.25l1.12-3h6.25l1.12 3h2.25L13 2h-2zm-1.38 9L12 4.67 14.38 11H9.62z" fill="currentColor"></path></svg>
                    </div>
                        <div class="color-picker-under"></div>
                     </div>
                    <div onclick="onTxtStroke()" class="btn-controller txt-stroke"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                        height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" fill-rule="evenodd"
                            d="M7.08 4.72h4.44c2.03 0 3.5.3 4.41.87.92.57 1.37 1.49 1.37 2.75 0 .85-.2 1.55-.6 2.1-.4.54-.93.87-1.6.98v.1c.91.2 1.56.58 1.96 1.13.4.56.6 1.3.6 2.2 0 1.31-.47 2.33-1.4 3.06A6.1 6.1 0 0 1 12.41 19H7.08V4.72zm3.03 5.66h1.75c.82 0 1.42-.13 1.79-.38.36-.26.55-.68.55-1.26 0-.55-.2-.94-.6-1.18a3.86 3.86 0 0 0-1.9-.36h-1.6v3.18zm0 2.4v3.72h1.97c.83 0 1.45-.16 1.84-.48.4-.32.6-.8.6-1.46 0-1.19-.85-1.78-2.54-1.78h-1.87z">
                        </path>
                    </svg></div>
                    </div>
                    <div class="selcet-line-up-down">

                        <div onclick="onlineUpElement(this)" class="btn-controller line-up"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 4c0 .41-.34.75-.75.75H3.75a.75.75 0 0 1 0-1.5h16.5c.41 0 .75.34.75.75zM11 9v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2h1a2 2 0 0 1 2 2zm7 0v4a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2h1a2 2 0 0 1 2 2zM9.5 9a.5.5 0 0 0-.5-.5H8a.5.5 0 0 0-.5.5v9c0 .28.22.5.5.5h1a.5.5 0 0 0 .5-.5V9zm7 0a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v4c0 .28.22.5.5.5h1a.5.5 0 0 0 .5-.5V9z"></path></svg></div>
                        <div onclick="onlineDownElement(this)" class="btn-controller line-down"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 20c0 .41-.34.75-.75.75H3.75a.75.75 0 1 1 0-1.5h16.5c.41 0 .75.34.75.75zM11 6v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h1a2 2 0 0 1 2 2zm7 5v4a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-4c0-1.1.9-2 2-2h1a2 2 0 0 1 2 2zM9.5 6a.5.5 0 0 0-.5-.5H8a.5.5 0 0 0-.5.5v9c0 .28.22.5.5.5h1a.5.5 0 0 0 .5-.5V6zm7 5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v4c0 .28.22.5.5.5h1a.5.5 0 0 0 .5-.5v-4z"></path></svg></div>
                        <div onclick="onlineCenterElement(this)" class="btn-controller line-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 11.25h2V7c0-1.1.9-2 2-2h1a2 2 0 0 1 2 2v4.25h2.25a.75.75 0 1 1 0 1.5H18V17a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-4.25h-2V14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1.25H3.75a.75.75 0 1 1 0-1.5H6V10c0-1.1.9-2 2-2h1a2 2 0 0 1 2 2v1.25zM16.5 7a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v10c0 .28.22.5.5.5h1a.5.5 0 0 0 .5-.5V7zm-7 3a.5.5 0 0 0-.5-.5H8a.5.5 0 0 0-.5.5v4c0 .28.22.5.5.5h1a.5.5 0 0 0 .5-.5v-4z"></path></svg></div>
                    </div>
                    <!-- <div onclick="onAddElement(this)" class="btn-controller add-txt">
                    </div> -->
                    <div class="align-element">
                        <div onclick="onAlignLeftElement(this)" class="btn-controller txt-align-left"><i
                                class="fa-solid fa-align-left"></i></div>
                        <div onclick="onAlignCenterElement(this)" class="btn-controller txt-align-center"><i
                                class="fa-solid fa-align-justify"></i></div>
                        <div onclick="onAlignRightElement(this)" class="btn-controller txt-align-right"><i
                                class="fa-solid fa-align-right"></i></div>
                    </div>
                   
              
                    <div onclick="onRemoveElement(this)" class="btn-controller remove-element"><i
                            class="fa-solid fa-trash-can"></i></div>
                </div>
            </div>
        </div>
    
    
    
    `

    setActiveSideBar('meme-page')
    setCanvas(meme)




}



