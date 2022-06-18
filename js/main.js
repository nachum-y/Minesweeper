'use strict'

function init() {
    _createImages()
    renderImagesGallery()
}



function onLangBtnClick() {
    console.log(1)

}


function colorPickerClick() {
    let color = document.getElementById("font-color-button").click()
    console.log(color)
}


function setActiveSideBar(page) {
    let elSideBar = document.querySelector('.sidebar-nav')
    let elHeroContent = document.querySelector('.hero-content')
    let elMainContainer = document.querySelector('.main-container')
    let elTopNavEdit = document.querySelector('.top-nav-edit')

    if (page === 'gellery-page') {
        elSideBar.querySelector('.sidebar-navigation-content').classList.add('hide')
        elSideBar.querySelector('.active').classList.remove('active')
        elSideBar.querySelector('.all-memes-tab').classList.add('active')
        elSideBar.classList.add('nav-home-page')
        elMainContainer.classList.add('close')
        elHeroContent.classList.remove('hide')
        elTopNavEdit.classList.add('hide')
        elSideBar.querySelector('.sidebar-navigation-content').classList.remove('minimize-side-bar')
        elMainContainer.classList.remove('minimize-side-bar')
        

    }
    if (page === 'meme-page') {
        elSideBar.querySelector('.sidebar-navigation-content').classList.remove('hide')
        elSideBar.querySelector('.active').classList.remove('active')
        elSideBar.querySelector('.meme-page-tab').classList.add('active')
        elHeroContent.classList.add('hide')
        elMainContainer.classList.remove('close')
        elTopNavEdit.classList.remove('hide')
        elMainContainer.classList.remove('minimize-side-bar')
        elSideBar.classList.remove('nav-home-page')
        

    }
}



function tabTogalText(el) {
    // Minimize
    let elSideBarContent = document.querySelector('.sidebar-navigation-content')
    let elMainContainer = document.querySelector('.main-container')
    elSideBarContent.classList.toggle('minimize-side-bar')
    elMainContainer.classList.toggle('minimize-side-bar')
    console.log(elSideBarContent)


}