'use strict'

function selectLevel(level) {
    console.log(level)
    switch (level) {
        case 1:
            gLevel = LEVELONE
            init()
            break
        case 2:
            gLevel = LEVELTWO
            init()
            break
        case 3:
            gLevel = LEVELTHREE
            init()
            break
        default:
           
    }
}