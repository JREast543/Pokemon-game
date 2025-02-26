class Sprite {
    constructor({ position, velocity, image, frames = { max: 1} }){
        this.position = position
        this.image = image
        this.frames = frames

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
    }

    draw(){
        ctx.drawImage(
            this.image,
            0,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )
    }
}

class Boundary {
    static width = 48
    static height = 48
    constructor({ position }){
        this.position = position
        this.width = 48
        this.height = 48
    }

    draw(){
        ctx.fillStyle = 'rgba(255, 0, 0, 0.0)'
        ctx.fillRect(this.position.x, this.position.y,
        this.width, this.height)
    }
}
