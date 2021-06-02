const BASE_URL = "http://localhost:3000"
const HIGHSCORES = `${BASE_URL}/highscores`
let currentUserId
let direction = "right"
let target
let score = 0
let snake = {tail:[]}

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
    input.focus()

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
    if (document.querySelector("h4") != null) {
        document.querySelector("h4").remove()
    }
    const name = document.createElement("h4")
    name.setAttribute("style", "text-align: center")
    document.querySelector("div#title-holder").appendChild(name)
    name.textContent = json.data.attributes.name

    currentUserId = json.data.id

    document.querySelector("form.name-field").remove()
}

const startGame = () => {
    if (currentUserId != undefined) {
        const head = document.createElement("div")
        head.setAttribute("id", "head")
        head.style.left = "200px"
        head.style.top = "200px"
        document.querySelector("div.game-container").appendChild(head)
        snake.head = head

        // snake.tail[0] = document.createElement("div")
        // snake.tail[0].setAttribute("class", "tail") // PROBLEM when evaluating whether snake hit its own tail
        // snake.tail[0].style.left = "180px"
        // snake.tail[0].style.top = "200px"
        // snake.tail.unshift(snake.tail[0])

        // document.querySelector("div.game-container").appendChild(snake.tail[0])

        document.getElementById("start").remove()

        const currentScore = document.createElement("p")
        currentScore.id = "current-score"
        currentScore.textContent = `Score: ${score}`
        currentScore.style.textAlign = "center"
        document.getElementById("title-holder").appendChild(currentScore)

        active = setInterval(moveSnake, 100)

        document.addEventListener("keydown", changeDirection)

        newBlock()
    } else {
        window.alert("Enter a name to start playing!")
    }
}

const moveSnake = () => {
    let leftNumbers = snake.head.style.left.replace("px", "");
    let left = parseInt(leftNumbers, 10);
    
    let topNumbers = snake.head.style.top.replace("px", "");
    let top = parseInt(topNumbers, 10);

    switch (direction) {
        case "right":
            snake.head.style.left = `${left + 10}px`
            break;
        case "left":
            snake.head.style.left = `${left - 10}px`
            break;
        case "up":
            snake.head.style.top = `${top - 10}px`
            break;
        case "down":
            snake.head.style.top = `${top + 10}px`
            break;
    }
    slither(left, top)
    eatBlock()
    hitWall()
    hitTail()
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
    target.setAttribute("class", "food")
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

const eatBlock = () => {
    const targetLeft = parseInt(target.style.left.replace("px", ""), 10)
    const targetTop =  parseInt(target.style.top.replace("px", ""), 10)

    const snakeLeft = parseInt(snake.head.style.left.replace("px", ""), 10)
    const snakeTop = parseInt(snake.head.style.top.replace("px", ""), 10)

    if (snakeLeft === targetLeft && snakeTop === targetTop) {
        target.remove()
        incrementScore()
        addLength()
        newBlock()
    }
}

const hitWall = () => {
    const snakeLeft = parseInt(snake.head.style.left.replace("px", ""), 10)
    const snakeTop = parseInt(snake.head.style.top.replace("px", ""), 10)

    if (snakeLeft === 400 || snakeLeft === -10 || snakeTop === -10 || snakeTop === 400) {
        clearInterval(active)
        // endGame()
    }
}

const hitTail = ()  => {
    const headLeft = snake.head.style.left
    const headTop = snake.head.style.top

    for (const block of snake.tail) {
        if (block.style.left === headLeft && block.style.top === headTop) {
            clearInterval(active)
            // endGame()
        }
    }
}

const addLength = () => {
    const newTail = document.createElement("div")
    newTail.setAttribute("class", "tail")
    snake.tail[`${score}`] = newTail
    // document.querySelector("div.game-container").appendChild(newTail)
}

const slither = (left, top) => {
    if (snake.tail.length > 0) {
        const firstTail = document.createElement("div")
        firstTail.setAttribute("class", "tail")
        document.querySelector("div.game-container").appendChild(firstTail)
        firstTail.style.left = `${left}px`
        firstTail.style.top = `${top}px`
        snake.tail.unshift(firstTail)
        snake.tail.pop()
        snake.tail[snake.tail.length -1].remove()    
    }
}