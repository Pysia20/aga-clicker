//player stats
let points = 0
let streak = 0
let PILS = 0 // points in last second
let CILS = 0 //clicks in last second
let clicked = false
let mult = 1
let fingerPower = 0
let hammerPower = 0
let hammerTime = true
let pressPower = 0
let pressTime = true
let unlocked = []
let specialUpgrades = []
let unlockedSkins = ["aga.png"]

//HTML getElements
const pointsOut = document.getElementById("points")
const agaImg = document.getElementById("aga")
const handImg = document.getElementById("hand")
const hammerImg = document.getElementById("hammer")
const fire = document.getElementById("fire")
const pressImg = document.getElementById("pressHead")
const PPS = document.getElementById("pps")
const CPS = document.getElementById("cps")
const pressDiv = document.querySelector(".press")
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
        unlocked.push(0)
    }
    if (points > 10 && !unlocked.includes(1)) {
        addUpgrade("More Agas", "25", "upIcon.svg", "UpMulti", 1)
        addUpgrade("SQUISH", "25", "upIcon.svg", "addPress", 100)
        addUpgrade("Stats", "99", "statsIcon.svg", "unlockSpecial", "'stats'")
        addUpgrade("SKIN", "10", "statsIcon.svg", "unlockSkin", "'waga.gif'")
        unlocked.push(1)
    }
    if (points > 50 && !unlocked.includes(2)) {
        addUpgrade("John Hand", "50", "handIcon.svg", "AddClicker", 1)
        addUpgrade("MMore Agas", "100", "upIcon.svg", "UpMulti", 1)
        unlocked.push(2)
    }
    if (points > 99 && !unlocked.includes(3)) {
        addUpgrade("Aganimation", "99", "agaIcon.svg", "unlockSpecial", "'aganimation'")
        addUpgrade("Johner John", "111", "handIcon.svg", "AddClicker", 2)
        unlocked.push(3)
    }
    if (points > 200 && !unlocked.includes(4)) {
        addUpgrade("Aga Mitosis", "200", "agaIcon.svg", "unlockSpecial", "'particles'")
        addUpgrade("Arson", "250", "fireIcon.svg", "unlockSpecial", "'streak'")
        addUpgrade("MORE AGAS", "400", "upIcon.svg", "UpMulti", 2)
        unlocked.push(4)
    }
    if (points > 400 && !unlocked.includes(5)) {
        addUpgrade("Bonk", "500", "hammerIcon.svg", "AddHammer", 50)
        addUpgrade("Johniest John", "700", "handIcon.svg", "AddClicker", 3)
        unlocked.push(5)
    }
    if (points > 600 && !unlocked.includes(6)) {
        addUpgrade("B O N K", "500", "hammerIcon.svg", "AddHammer", 50)
        addUpgrade("Promote John", "1000", "hammerIcon.svg", "unlockSpecial", "'autoHammer'")
        unlocked.push(6)
    }
    if (points > 1000 && !unlocked.includes(7)) {
        addUpgrade("Aga Blessing", "2000", "agaIcon.svg", "UpMulti", 10)
        unlocked.push(7)
    }
    if (points > 5000 && !unlocked.includes(8)) {
        addUpgrade("Test Ur PC", "10000", "hammerIcon.svg", "AddHammer", 69000)
        addUpgrade("Waga", "Priceless", "agaIcon.svg", "UpMulti", 1)
        unlocked.push(8)
    }
}

function unlockSpecial(cost, what, object) {
    if (cost <= points) {
        points -= cost
        specialUpgrades.push(what)
        const temp = document.querySelector("." + what + ".hidden")
        if (temp) {
            temp.classList.remove("hidden")
        }
        object.remove()
        refreshPoints(0)
    }
}

function refreshPoints(amount) {
    points += amount
    pointsOut.innerText = points
    unlockUpgrades()
    updateStreak()
    updateStats(amount, "PPS")
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
    updateStats(1, "CPS")
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

function addPress(cost, amount, object) {
    if (cost <= points) {
        if (pressPower === 0) {
            const temp = document.querySelectorAll(".press.hidden")
            temp[0].classList.remove("hidden")
        }
        points -= cost
        pressPower += amount
        object.remove()
        refreshPoints(0)
    }
}

function pressAga() {
    if (pressTime) {
        const rectPress = pressImg.getBoundingClientRect()
        const rectAga = agaImg.getBoundingClientRect()
        const eyebrowsOffset = rectAga.height * 0.25
        const squishPoint = rectAga.bottom - (rectAga.height / 2)
        const squishDistance = (squishPoint - rectPress.bottom) + eyebrowsOffset
        const touchDistance = (rectAga.top - rectPress.bottom) + eyebrowsOffset
        let fraction = touchDistance / squishDistance
        fraction = Math.min(1, Math.max(0, fraction))
        const touchOffset = 0.4 * fraction
        const untouchOffset = 0.7 + 0.3 * (1 - fraction)

        pressImg.animate([
                {transform: 'translateY(0)', offset: '0'},
                {transform: 'translateY(' + squishDistance + 'px)', offset: '0.4'},
                {transform: 'translateY(' + squishDistance + 'px)', offset: '0.7'},
                {transform: 'translateY(0)', offset: '1'}
            ], {
                duration: 7500,
                iterations: 1,
                easing: 'linear'
            }
        )
        agaImg.style.transformOrigin = "bottom"
        const animation = agaImg.animate([
                {transform: 'scaleY(100%) scaleX(100%)', offset: '0'},
                {transform: 'scaleY(100%) scaleX(100%)', offset: touchOffset},
                {transform: 'scaleY(50%) scaleX(150%)', offset: '0.4'},
                {transform: 'scaleY(50%) scaleX(150%)', offset: '0.7'},
            {transform: 'scaleY(100%) scaleX(100%)', offset: untouchOffset},
                {transform: 'scaleY(100%) scaleX(100%)', offset: '1'}
            ], {
                duration: 7500,
                iterations: 1,
                easing: 'linear'
            }
        )
        animation.onfinish = () => {
            agaImg.style.transformOrigin = "center"
        }

        pressTime = false
        PressCooldown()
        const timeout = 2500 / pressPower
        setTimeout(() => {
            for (let i = 0; i < pressPower; i++) {
                setTimeout(() => {
                    refreshPoints(1)
                }, timeout * i)
            }
        }, 2500)
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

function PressCooldown() {
    setTimeout( () => {
        pressTime = true
    }, 30000)
}

function updateStreak() {
    if (specialUpgrades.includes("streak")) {
        if (clicked === false) {
            streak = 0
        } else if (streak < 100) {
            streak++
        }

        fire.style.width = streak/1.5 + "rem"
        fire.style.filter = "saturate(" + (Math.random() * (108 - 92)  + 92) + "%)"
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

function updateStats(amount, type) {
    if (specialUpgrades.includes("stats")) {
        if (type === "CPS") {
            CILS += amount
            setTimeout(() => {
                CILS -= amount
            }, 1000)
        }
        if (type === "PPS") {
            PILS += amount
            setTimeout(() => {
                PILS -= amount
            }, 1000)
        }
        CPS.innerHTML = "CPS: " + CILS
        PPS.innerHTML = "PPS: " + PILS
    }
}

function unlockSkin(cost, name, object) {
    if (cost <= points) {
        if (unlockedSkins.length === 1) {
            const temp = document.querySelector(".wardrobe.hidden")
            temp.classList.remove("hidden")
        }
        unlockedSkins.push(name)
        agaImg.src = "Assets/" + name
        points -= cost
        object.remove()
        refreshPoints(0)
    }
}

function changeSkin() {
    let currentSkin = agaImg.src.split("/")
    currentSkin = currentSkin[currentSkin.length - 1]
    const currentIndex = unlockedSkins.indexOf(currentSkin)
    agaImg.src = "Assets/" + unlockedSkins[(currentIndex + 1) % (unlockedSkins.length)]
}

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
