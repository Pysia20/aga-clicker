let points = 0
let mult = 1
const pointsOut = document.getElementById('points')
const agaImg = document.getElementById('aga')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d")
const particles = []
const particleImg = new Image()
particleImg.src = "aga.png"

function refreshPoints(amount) {
    points += amount
    pointsOut.innerText = points
    if (amount > 0) {
        agaImg.animate([
                {transform: 'scale(1)'},
                {transform: 'scale(' + (1 + amount / 100) + ') rotate(' + (1 + amount / 2) + 'deg)'},
                {transform: 'scale(1)'}
            ], {
                duration: 150,
                iterations: 1,
                easing: 'linear'
            }
        )
        addParticles(amount)
    }
}

function aga() {
    refreshPoints(mult)
}

function UpMulti(cost, amount, object) {
    if (cost <= points) {
        points -= cost
        mult += amount
        object.remove()
        refreshPoints(0)
    }
}

function AddClicker(cost, object) {
    if (cost <= points) {
        points -= cost

        object.remove()
        refreshPoints(0)
    }
}

//canvas stuff
class Particle {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        const  angle = (Math.random() * 30 + 75) * (Math.PI / 180)
        const  speed = Math.random() * 3 + 10
        this.vx = Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1)
        this.vy = -Math.sin(angle) * speed
        this.size = Math.random() * 10 + 20
    }

    update() {
        this.vy += 0.2
        this.x += this.vx
        this.y += this.vy
    }

    draw() {
        ctx.drawImage(particleImg, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size)
    }
}

function setCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}
setCanvas()
window.addEventListener('resize', setCanvas)

function addParticles(num) {
    for (let i = 0; i < num; i++) {
        particles.push(new Particle())
    }
}

function updateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.update()
        p.draw()

        if (p.y > canvas.height + 50) {
            particles.splice(i, 1)
        }
    }
    requestAnimationFrame(updateParticles)
}

updateParticles()
