const BASE_URL = "http://localhost:3000"
const HIGHSCORES = `${BASE_URL}/highscores`
let currentUserId
let direction = "right"
let target
let score = 0
let snake

document.addEventListener("DOMContentLoaded", () => {
    loadHighScores()
    addListeners()
})

const loadHighScores = () => {
    fetch(HIGHSCORES)
    .then(resp => resp.json())
    .then(json => fillHighScoreList(json.data))
}

const fillHighScoreList = (scores) => {
    const first = document.getElementById("first")
    const second = document.getElementById("second")
    const third = document.getElementById("third")

    first.innerText = `1st ${scores[0].attributes.user.name} ${scores[0].attributes.value}`
    second.innerText = `2nd ${scores[1].attributes.user.name} ${scores[1].attributes.value}`
    third.innerText = `3rd ${scores[2].attributes.user.name} ${scores[2].attributes.value}`
}

const hideRules = () => {
    const rulesText = document.getElementById("rules-text")
    if (rulesText.style.display != "none") {
        rulesText.style.display = "none"
    } else {
        rulesText.style.display = "block"
    }
}

const hideScores = () => {
    const table = document.querySelector("table.high-scores")
    if (table.hidden === false) {
        table.hidden = true
    } else {
        table.hidden = false
    }
}

const displayNameField = () => {
    const nameForm = document.createElement("form")
    const input = document.createElement("input")
    const submit = document.createElement("input")
    nameForm.setAttribute("class", "name-field")
    submit.setAttribute("type", "submit")

    nameForm.appendChild(input)
    input.insertAdjacentElement('afterend', submit)

    nameForm.addEventListener("submit", setName)

    document.querySelector("div.game-container").appendChild(nameForm)

    document.getElementById("name").removeEventListener("click", displayNameField)
}

const addListeners = () => {
    const rulesBtn = document.getElementById("rules")
    const scoresBtn = document.getElementById("scores")
    const startBtn = document.getElementById("start")

    rulesBtn.addEventListener("click", hideRules)
    scoresBtn.addEventListener("click", hideScores)
    startBtn.addEventListener("click", startGame)
    addNameBtnListener()
}

const addNameBtnListener = () => {
    const nameBtn = document.getElementById("name")

    nameBtn.addEventListener("click", displayNameField)
}


const setName = (e) => {
    e.preventDefault()

    const configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({name: e.target.firstChild.value})
    }
    fetch(`${BASE_URL}/users`, configObj)
    .then(res => res.json())
    .then(json => setUser(json))

    document.getElementById("name").addEventListener("click", displayNameField)
}

const setUser = (json) => {
    const name = document.createElement("h4")
    name.setAttribute("style", "text-align: center")
    document.querySelector("div#title-holder").appendChild(name)
    name.textContent = json.data.attributes.name

    currentUserId = json.data.id

    document.querySelector("form.name-field").remove()
}

const startGame = () => {
    if (currentUserId != undefined) {
        snake = document.createElement("div")
        snake.setAttribute("class", "snake")
        snake.setAttribute("id", "head")
        snake.style.left = "200px"
        snake.style.top = "200px"
        document.querySelector("div.game-container").appendChild(snake)
        document.getElementById("start").remove()

        const currentScore = document.createElement("p")
        currentScore.id = "current-score"
        currentScore.textContent = `Score: ${score}`
        currentScore.style.textAlign = "center"
        document.getElementById("title-holder").appendChild(currentScore)

        setInterval(moveSnake, 100)

        document.addEventListener("keydown", changeDirection)

        newBlock()
    } else {
        window.alert("Enter a name to start playing!")
    }
}

const moveSnake = () => {
    const head = document.getElementById("head")

    let leftNumbers = head.style.left.replace("px", "");
    let left = parseInt(leftNumbers, 10);
    
    let topNumbers = head.style.top.replace("px", "");
    let top = parseInt(topNumbers, 10);

    switch (direction) {
        case "right":
            head.style.left = `${left + 10}px`
            break;
        case "left":
            head.style.left = `${left - 10}px`
            break;
        case "up":
            head.style.top = `${top - 10}px`
            break;
        case "down":
            head.style.top = `${top + 10}px`
            break;
    }
}

const changeDirection = (e) => {
    switch (e.key) {
        case "ArrowUp" || "w":
            direction = "up"
            break;
        case "ArrowLeft" || "a":
            direction = "left"
            break;
        case "ArrowDown" || "s":
            direction = "down"
            break;
        case "ArrowRight" || "d":
            direction = "right"
            break;
        default:
            break;
    }
}

const newBlock = () => {
    target = document.createElement("div")
    target.setAttribute("class", "snake")
    target.setAttribute("id", "target")
    document.querySelector("div.game-container").appendChild(target)
    target.style.left = `${Math.floor(Math.random()*40)*10}px`
    target.style.top =`${Math.floor(Math.random()*40)*10}px`
}

const incrementScore = () =>{
    score = ++score
    const scoreElement = document.getElementById("current-score")
    scoreElement.textContent = `Score: ${score}`
}

if (snake.style.left === target.style.left && snake.style.top === target.style.top ) {
    newBlock()
    incrementScore()
}
