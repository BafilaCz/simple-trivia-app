function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const colors = ["#1ccdfc", "#226439", "#ff3", "#7a1ac1", "#121306", "#020655", "#c92508", "#d39cec", "#5bf071", "#cefcf9", "#d2746e", "#b57e03"]
const canvas = document.querySelector("canvas")



canvas.width = window.innerWidth
canvas.height = window.innerHeight
const c = canvas.getContext("2d")


mouse = {
    x: undefined,
    y: undefined,
}


window.addEventListener("mousemove", (e)=>{
    mouse.x = e.x
    mouse.y = e.y
    console.log(mouse.y);
    
})
window.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})
class Circle {

    constructor(x, y, velocityX, velocityY, radius ){
        this.x = x
        this.y = y
        this.velocityX = velocityX
        this.velocityY = velocityY
        this.radius = radius
        this.minRadius = getRandomNumber(minRadius, 20 )
        this.color = colors[getRandomNumber(0, colors.length-1)]

        this.draw = () => {
            c.beginPath()
            c.arc(this.x , this.y, this.radius, 0, Math.PI*2)
            c.strokeStyle = this.color
            c.stroke()
            c.fillStyle = this.color
            c.fill()
        }
        this.update = () => {

            if (this.x + this.radius > innerWidth || this.x - this.radius < 0){
                this.velocityX = -this.velocityX
            }
            if (this.y + this.radius > innerHeight || this.y - this.radius < 0){
                this.velocityY = -this.velocityY
            }

            this.x += this.velocityX
            this.y += this.velocityY

            // interactivity
            if (mouse.x - this.x < 100 && mouse.x - this.x > -100 && mouse.y - this.y < 100 && mouse.y - this.y > -100){
                if(this.radius < maxRadius){

                    this.radius += 2

                }
            
            }

            else if(this.radius > this.minRadius){
                this.radius -= 2
            }

            this.draw()

                }

            }

            
    } 

let minRadius = 5
let maxRadius = 100
let circleArray = []
let circleCount = 100
let minVelocity = 0.5
let maxVelocity = 1.5

// narvu kruhy do pole
for (let i = 0; i < circleCount; i++) {
    const radius = getRandomNumber(minRadius, maxRadius)
    const x = getRandomNumber(radius*2, innerWidth - radius*2)
    const y = getRandomNumber(radius*2, innerHeight - radius*2)
    const velocityX = getRandomNumber(minVelocity, maxVelocity)
    const velocityY = getRandomNumber(minVelocity, maxVelocity)
    circleArray.push(new Circle(x, y, velocityX, velocityY, radius))
    

}








const animate = () =>{

    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    circleArray.forEach((circle)=>{
        circle.update()})
}

animate();