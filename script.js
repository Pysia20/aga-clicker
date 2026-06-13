let points = 0
let mult = 1
const pointsOut = document.getElementById('points')
const agaImg = document.getElementById('aga')

function refreshPoints(amount) {
    points += amount
    pointsOut.innerText = points
    if (amount > 0) {
        agaImg.animate([
                {transform: 'scale(1)'},
                {transform: 'scale(' + (1 + amount / 10) + ') rotate(' + (8 + amount / 10) + 'deg)'},
                {transform: 'scale(1)'}
            ], {
                duration: 150,
                iterations: 1,
                easing: 'linear'
            }
        )
    }
}

function aga() {
    refreshPoints(1 * mult)
}

function UpMulti(cost, amount, object) {
    if (cost <= points) {
        points -= cost
        mult += amount
        object.remove()
        refreshPoints(0)
    }
}
