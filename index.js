//const { types } = require("pg");

//tartgeting the canvas
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

//resizing the canvas
canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70){
    collisionsMap.push(collisions.slice(i, 70 + i))
}

const BattleZonesMap = []
for (let i = 0; i < BattleZonesData.length; i += 70){
    BattleZonesMap.push(BattleZonesData.slice(i, 70 + i))
}

const boundaries = []
const offset = {
    x: -210,
    y: -1000
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
        boundaries.push(
            new Boundary({ 
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            })
        )
    })
})

const BattleZones = []

BattleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
        BattleZones.push(
            new Boundary({ 
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            })
        )
    })
})

console.log(BattleZones);

const image = new Image()
image.src = './Images/Pokemon-town.png'

const foregroundImage = new Image()
foregroundImage.src = './Images/ForeGroundObjects.png'

const playerDownImage = new Image()
playerDownImage.src = './Images/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './Images/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './Images/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './Images/playerRight.png'

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 30
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})
console.log(player)

const background = new Sprite({ 
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({ 
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

//references eventListner 
const keys = {
    w: {
       pressed: false 
    },
    a: {
        pressed: false 
    },
     s: {
        pressed: false 
    },
     d: {
        pressed: false 
    }
}

const movables = [background, ...boundaries, foreground, ...BattleZones]

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x 
        && rectangle1.position.x <= rectangle2.position.x + rectangle2.width 
        && rectangle1.position.y <= rectangle2.position.y + rectangle2.height
        && rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

const battle = {
    initiated: false
}

function animate() {
    const animationId = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
       boundary.draw()
    })
    BattleZones.forEach(BattleZones => {
        BattleZones.draw()
    })
    player.draw()
    foreground.draw()

    let moving = true
    player.animate = false

    if (battle.initiated) return 

    //activate a battle
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < BattleZones.length; i++) {
            const BattleZone = BattleZones[i]
            const overlappingArea = (Math.min(player.position.x + player.width, 
                BattleZone.position.x + BattleZone.width)- 
                Math.max(player.position.x, BattleZone.position.x)) *
            (Math.min(player.position.y + player.height, 
                BattleZone.position.y + BattleZone.height) - 
                Math.max(player.position.y, BattleZone.position.y))
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: BattleZone
                }) && 
                overlappingArea > (player.width * player.height) / 2
                && Math.random() < 0.01
            ) {
            console.log('activate battle')
            //deactivate current animation loop
            window.cancelAnimationFrame(animationId)


            battle.initiated = true
            gsap.to('#overlappingDiv', {
                opacity: 1,
                repeat: 3,
                yoyo: true,
                duration: 0.4,
                onComplete() {
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        duration: 0.4,
                        onComplete(){
                            // activate a new animation loop
                            animateBattle()
                            gsap.to('#overlappingDiv', {
                                opacity: 0,
                                duration: 0.4,
                            })
                        }
                    })
                }
            })
            break
            }
        }
    }


    if (keys.w.pressed && lastkey === 'w') {
        player.animate = true
        player.image = player.sprites.up

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, 
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                })
            ) {
            moving = false
            break
            }
        }

        if (moving)
            movables.forEach(movable => {
                movable.position.y += 3
            })
    } else if (keys.a.pressed && lastkey === 'a') {
        player.animate = true
        player.image = player.sprites.left

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, 
                        position: {
                            x: boundary.position.x + 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
            moving = false
            break
            }
        }
        
        if (moving)
        movables.forEach(movable => {
            movable.position.x += 3
        })
    } else if (keys.s.pressed && lastkey === 's') {
        player.animate = true
        player.image = player.sprites.down

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, 
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 3
                        }
                    }
                })
            ) {
            moving = false
            break
            }
        }
        
        if (moving)
        movables.forEach(movable => {
            movable.position.y -= 3
        })
    } else if (keys.d.pressed && lastkey === 'd') {
        player.animate = true
        player.image = player.sprites.right

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, 
                        position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y
                        }
                    }
                })
            ) {
            moving = false
            break
            }
        }
        
        if (moving)
        movables.forEach(movable => {
            movable.position.x -= 3
        })
    }
}
//animate()

let lastkey = ''
window.addEventListener('keydown', (e) => {
    switch (e.key){
        case 'w':
            keys.w.pressed = true
            lastkey = 'w'
            break

        case 'a':
            keys.a.pressed = true
            lastkey = 'a'
            break

        case 's':
            keys.s.pressed = true
            lastkey = 's'
            break

        case 'd':
            keys.d.pressed = true
            lastkey = 'd'
            break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key){
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})