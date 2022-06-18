'use strict'

function renderImagesGallery() {
    var images = getImages()
    var strHtmls = images.map((image) =>
        `<article class="cat-${(image.category).toLowerCase()} meme-gallery">
        <img onclick="onMemeGalleryClick(${image.id})" class="image-gallery"src="${image.src}" alt="">
        <span>${image.category}</span>
    </article>`
    )

    strHtmls.unshift(`
    <div class="main-img-gallery main-layout">`
    )
    document.querySelector('.main-content').innerHTML = strHtmls.join('')
    setActiveSideBar('gellery-page')
}





function getImgById(id) {
    return gImages.find(img => +img.id === id)
}

function onSetFilterByTxt(input) {
    console.log(input)
    setImagesFillter(input)
    renderImagesGallery()

}


function enlargeSearchKey(el){
    let compStyles = window.getComputedStyle(el);
    console.log(compStyles.fontSize);
    setSearchKeyWord(el.innerText)
    if (parseInt(compStyles.fontSize) > 35) return  
    el.style.fontSize = parseInt(compStyles.fontSize)+1+'px'
}