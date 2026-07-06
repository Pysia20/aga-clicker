//player stats
let points = 0
let streak = 0
let clicked = false
let mult = 1
let fingerPower = 0
let hammerPower = 0
let hammerTime = true
let unlocked = []
let specialUpgrades = []

//HTML getElements
const pointsOut = document.getElementById("points")
const agaImg = document.getElementById("aga")
const handImg = document.getElementById("hand")
const hammerImg = document.getElementById("hammer")
const fire = document.getElementById("fire")
const upgrades = document.querySelector(".upgrades")

//canvas stuff
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const particles = []
const particleImg = new Image()
particleImg.src = "Assets/aga.png"


function addUpgrade(name, cost, img, type, amount) {
    const child = document.createElement("div")
    child.classList.add("upgrade")
    child.setAttribute("onclick", type + "(" + cost + ", " + amount + ", this)")

    const info = document.createElement("div")
    info.classList.add("info")

    const disImg = document.createElement("img")
    disImg.src = "Assets/" + img

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
        addUpgrade("Markiplier", "10", "handIcon.svg", "UpMulti", 1)
        addUpgrade("Hand", "10", "handIcon.svg", "AddClicker", 1)
        addUpgrade("Particles", "10", "hammerIcon.svg", "unlockSpecial", "'particles'")
        addUpgrade("Aganimation", "10", "hammerIcon.svg", "unlockSpecial", "'aganimation'")
        addUpgrade("Streak", "10", "hammerIcon.svg", "unlockSpecial", "'streak'")
        addUpgrade("Hammer", "10", "hammerIcon.svg", "AddHammer", 10)
        addUpgrade("Hammer", "10", "hammerIcon.svg", "unlockSpecial", "'autoHammer'")
        unlocked.push(0)
    }
    if (points > 100 && !unlocked.includes(1)) {
        addUpgrade("test", "2", "handIcon.svg", "UpMulti", 1)
        unlocked.push(1)
    }
    if (points > 200 && !unlocked.includes(2)) {
        addUpgrade("test2", "2", "handIcon.svg","UpMulti", 10)
        unlocked.push(2)
    }
    if (points > 300 && !unlocked.includes(3)) {
        addUpgrade("test", "2", "handIcon.svg","AddClicker", 10)
        unlocked.push(3)
    }
}

function refreshPoints(amount) {
    points += amount
    pointsOut.innerText = points
    unlockUpgrades()
    updateStreak()
    if (amount > 0) {
        spawnParticles(amount)
    }
}

function aga() {
    let amount = Math.ceil(mult * (streak / 50))
    if (amount < mult) {
        amount = mult
    }
    clicked = true
    refreshPoints(amount)
    animateAga(amount)
}

function animateAga(amount) {
    if (specialUpgrades.includes("aganimation")) {
        let rotateAmount = amount
        if ((Math.random() * 2) > 1) {
            rotateAmount = rotateAmount * -1
        }
        agaImg.animate([
                {transform: 'scale(1)'},
                {transform: 'scale(' + (1 + Math.sqrt(amount) / 10) + ') rotate(' + (rotateAmount) + 'deg)'},
                {transform: 'scale(1)'}
            ], {
                duration: 150,
                iterations: 1,
                easing: 'linear'
            }
        )
    }
}

function spawnParticles(amount) {
    if (specialUpgrades.includes("particles")) {
        addParticles(amount)
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
        if (fingerPower === 0) {
            const temp = document.querySelectorAll(".hand.hidden")
            temp[0].classList.remove("hidden")
        }
        points -= cost
        fingerPower += amount
        object.remove()
        refreshPoints(0)
    }
}

function AddHammer(cost, amount, object) {
    if (cost <= points) {
        if (hammerPower === 0) {
            const temp = document.querySelectorAll(".hammer.hidden")
            temp[0].classList.remove("hidden")
        }
        points -= cost
        hammerPower += amount
        object.remove()
        refreshPoints(0)
    }
}

function HammerAga() {
    if (hammerTime) {
        hammerImg.animate([
                {transform: 'rotate(0deg) translateX(0) translateY(0)', offset: '0'},
                {transform: 'rotate(-90deg) translateX(-36%) translateY(-30%)', offset: '0.3'},
                {transform: 'rotate(-90deg) translateX(-36%) translateY(-30%)', offset: '0.5'},
                {transform: 'rotate(0deg) translateX(0) translateY(0)', offset: '1'}
            ], {
                duration: 500,
                iterations: 1,
                easing: 'cubic-bezier(0.25, 0.89, 0.55, 1.08)'
            }
        )
        agaImg.animate([
                {transform: 'scaleY(100%) translateY(0)', offset: '0'},
                {transform: 'scaleY(100%) translateY(0)', offset: '0.2'},
                {transform: 'scaleY(50%) translateY(45%)', offset: '0.3'},
                {transform: 'scaleY(100%) translateY(0)', offset: '1'}
            ], {
                duration: 750,
                iterations: 1,
                easing: 'cubic-bezier(0.25, 0.89, 0.55, 1.08)'
            }
        )

        hammerTime = false
        refreshPoints(hammerPower)
        HammerCooldown()
    }
}

function unlockSpecial(cost, what, object) {
    if (cost <= points) {
        points -= cost
        specialUpgrades.push(what)
        object.remove()
        refreshPoints(0)
    }
}

function autoClick() {
    handImg.animate([
            {transform: 'translateX(-4rem)'},
            {transform: 'translateX(1rem)'},
            {transform: 'translateX(-4rem)'}
        ], {
            duration: 150,
            iterations: 1,
            easing: 'linear'
        }
    )
    refreshPoints(fingerPower)
}
setInterval(autoClick, 1000)

function HammerCooldown() {
    setTimeout(() => {
        hammerTime = true
        if (specialUpgrades.includes("autoHammer")) {
            HammerAga()
        }
    }, 5000)
}

function updateStreak() {
    if (specialUpgrades.includes("streak")) {
        if (clicked === false) {
            streak = 0
        } else if (streak < 100) {
            streak++
        }

        fire.style.width = streak/1.5 + "rem"
        if (streak > 25) {
            agaImg.style.filter = "saturate(" + streak / 4 + ")"
        } else {
            agaImg.style.filter = ""
        }
    }
}

function breakStreak() {
    clicked = false
}
setInterval(breakStreak, 200)

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
