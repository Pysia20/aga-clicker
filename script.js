//player stats
let points = 0
let streak = 0
let clicked = false
let mult = 1
let autoAgas = 0
let unlocked = []
let specialUpgrades = []

//HTML getElements
const pointsOut = document.getElementById("points")
const agaImg = document.getElementById("aga")
const handImg = document.getElementById("hand")
const fire = document.getElementById("fire")
const upgrades = document.querySelector(".upgrades")

//canvas stuff
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const particles = []
const particleImg = new Image()
particleImg.src = "aga.png"

/* pretty sure this is actually unneeded but keeping it for now
class Upgrade {
    constructor(name, cost, click) {
        this.name = name
        this.cost = cost
        this.click = click
    }
}
 */

function addUpgrade(name, cost, img, type, amount) {
    const child = document.createElement("div")
    child.classList.add("upgrade")
    child.setAttribute("onclick", type + "(" + cost + ", " + amount + ", this)")

    const info = document.createElement("div")
    info.classList.add("info")

    const disImg = document.createElement("img")
    disImg.src = img

    const disName = document.createElement("h3")
    disName.textContent = name

    const  disCost = document.createElement("p")
    disCost.textContent = cost

    child.appendChild(disImg)
    info.appendChild(disName)
    info.appendChild(disCost)
    child.appendChild(info)
    upgrades.appendChild(child)
}

function unlockUpgrades() {
    if (!unlocked.includes(0)) {
        addUpgrade("Markiplier", "10", "hand.svg", "UpMulti", 1)
        addUpgrade("Hand", "10", "hand.svg", "AddClicker", 1)
        addUpgrade("Particles", "10", "hammer.svg", "unlockSpecial", "'particles'")
        addUpgrade("Aganimation", "10", "hammer.svg", "unlockSpecial", "'aganimation'")
        addUpgrade("Streak", "10", "hammer.svg", "unlockSpecial", "'streak'")
        unlocked.push(0)
    }
    if (points > 100 && !unlocked.includes(1)) {
        addUpgrade("test", "2", "hand.svg", "UpMulti", 1)
        unlocked.push(1)
    }
    if (points > 200 && !unlocked.includes(2)) {
        addUpgrade("test2", "2", "hand.svg","UpMulti", 10)
        unlocked.push(2)
    }
    if (points > 300 && !unlocked.includes(3)) {
        addUpgrade("test", "2", "hand.svg","AddClicker", 10)
        unlocked.push(3)
    }
}

function refreshPoints(amount) {
    points += amount
    pointsOut.innerText = points
    unlockUpgrades()
    if (amount > 0) {
        animateAga(amount)
        spawnParticles(amount)
        streak += 1
        clicked = true
    }
}

function aga() {
    refreshPoints(mult)
}

function animateAga(amount) {
    if (specialUpgrades.includes("aganimation")) {
        agaImg.animate([
                {transform: 'scale(1)'},
                {transform: 'scale(' + (1 + Math.sqrt(amount) / 10) + ') rotate(' + (amount) + 'deg)'},
                {transform: 'scale(1)'}
            ], {
                duration: 150,
                iterations: 1,
                easing: 'linear'
            }
        )

        console.log(1 + Math.sqrt(amount) / 10)
    }
}

function spawnParticles(amount) {
    if (specialUpgrades.includes("particles")) {
        addParticles(amount)
        console.log("test")
    }
}

function UpMulti(cost, amount, object) {
    if (cost <= points) {
        points -= cost
        mult += amount
        object.remove()
        refreshPoints(0)
    }
}

function AddClicker(cost, amount, object) {
    if (cost <= points) {
        if (autoAgas === 0) {
            const temp = document.querySelectorAll(".hand.hidden")
            temp[0].classList.remove("hidden")
        }
        points -= cost
        autoAgas += amount
        object.remove()
        refreshPoints(0)
    }
}

function unlockSpecial(cost, what, object) {
    if (cost <= points) {
        points -= cost
        specialUpgrades.push(what)
        console.log(what)
        object.remove()
        refreshPoints(0)
    }
}

function autoClick() {
    handImg.animate([
            {transform: 'translateX(-8rem)'},
            {transform: 'translateX(-4rem)'},
            {transform: 'translateX(-8rem)'}
        ], {
            duration: 150,
            iterations: 1,
            easing: 'linear'
        }
    )
    refreshPoints(autoAgas)
}
setInterval(autoClick, 1000)

function updateStreak() {
    if (clicked === false) {
        streak = 0
    }
    if (specialUpgrades.includes("streak")) {
        fire.style.width = streak + "rem"
        console.log(fire.style.width)
    }
    clicked = false
}
setInterval(updateStreak, 200)


//canvas stuff
class Particle {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2.5;
        const  angle = (Math.random() * 30 + 75) * (Math.PI / 180)
        const  speed = Math.random() * 3 + 10
        this.vx = Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1)
        this.vy = -Math.sin(angle) * speed
        this.size = Math.random() * 10 + 20
        this.opacity = 1
    }

    update() {
        this.vy += 0.2
        this.x += this.vx
        this.y += this.vy
        if ((this.y > canvas.height / 2) && this.opacity > 0.025) {
            this.opacity -= 0.025
        }
    }

    draw() {
        ctx.globalAlpha = this.opacity
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
        ctx.save()
        const p = particles[i]
        p.update()
        p.draw()
        ctx.restore()

        if (p.y > canvas.height + 50) {
            particles.splice(i, 1)
        }
    }
    requestAnimationFrame(updateParticles)
}
updateParticles()
