const battleBackgroundImg = new Image()
battleBackgroundImg.src = './Images/battleBackground.png'
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImg
})

const draggleImg = new Image()
draggleImg.src = './Images/draggleSprite.png'
const draggle = new Sprite({
    position: {
        x: 800,
        y: 100
    },
    image: draggleImg,
    frames: {
        max: 4,
        hold: 60
    },
    animate: true,
    isEnemy: true,
    name: 'Draggle'
})

const embyImg = new Image()
embyImg.src = './Images/embySprite.png'
const emby = new Sprite({
    position: {
        x: 280,
        y: 325
    },
    image: embyImg,
    frames: {
        max: 4,
        hold: 60
    },
    animate: true,
    name: 'Emby'
})

const renderedSprites = [draggle, emby]
function animateBattle(){
    window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    renderedSprites.forEach(sprite => {
        sprite.draw()
    })
}

animateBattle()

const queue = []

// Our event listeners for our buttons (attacks) 
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        emby.attack({ 
            attack: selectedAttack,
            recipient: draggle,
            renderedSprites
        })
        queue.push(() => {
            draggle.attack({ 
                attack: attacks.Tackle,
                recipient: emby,
                renderedSprites
            })
        })

        queue.push(() => {
            draggle.attack({ 
                attack: attacks.Fireball,
                recipient: emby,
                renderedSprites
            })
        })
    })
})

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'
})