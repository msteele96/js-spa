const BASE_URL = "http://localhost:3000"
const HIGHSCORES = `${BASE_URL}/highscores`
let currentUser
let direction
let target
let score
let snake

// class Score {
//     constructor(value, userName) {
//         this.value = value;
//         this.userName = userName;
//     } 
// }

class User {
    constructor(id, name) {
        this.name = name;
        this.id = id;
    }

    _setUser() {
        if (document.querySelector("h4") === null) {
            const name = document.createElement("h4")
            name.setAttribute("style", "text-align: center")
            document.querySelector("div#title-holder").appendChild(name)    
        }
        document.querySelector("h4").textContent = this.name
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadHighScores()
    addListeners()
})

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

const loadHighScores = () => {
    fetch(HIGHSCORES)
    .then(resp => resp.json())
    .then(json => fillHighScoreList(json.data))
    // .then(json => createScoreObjects(json.data))
}

// const createScoreObjects = (scores) => {
//     scores.forEach(score => {
//         a = new Score(score.attributes.value, score.attributes.user.name)
//     });
// }

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

const setName = (e) => {
    e.preventDefault()
    document.querySelector("form.name-field").remove()

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
    .then(json => createUserObject(json))

    document.getElementById("name").addEventListener("click", displayNameField)
}

const createUserObject = (json) => {
    currentUser = new User(json.data.id, json.data.attributes.name)
    currentUser._setUser()
}

const startGame = () => {
    if (currentUser != undefined) {
        snake = {tail:[]}
        score = 0
        direction = "right"

        const head = document.createElement("div")
        head.setAttribute("id", "head")
        head.style.left = "200px"
        head.style.top = "200px"
        document.querySelector("div.game-container").appendChild(head)
        snake.head = head

        originalTail = document.createElement("div")
        originalTail.setAttribute("class", "tail")
        originalTail.style.left = "190px"
        originalTail.style.top = "200px"
        snake.tail.unshift(originalTail)

        document.querySelector("div.game-container").appendChild(snake.tail[0])

        document.getElementById("start").remove()

        if (document.getElementById("current-score") === null) {
            const currentScore = document.createElement("p")
            currentScore.id = "current-score"
            currentScore.style.textAlign = "center"
            document.getElementById("title-holder").appendChild(currentScore)
        }
        document.getElementById("current-score").textContent = `Score: ${score}`


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
        endGame()
    }
}

const hitTail = ()  => {
    const headLeft = snake.head.style.left
    const headTop = snake.head.style.top

    for (const block of snake.tail) {
        if (block.style.left === headLeft && block.style.top === headTop) {
            clearInterval(active)
            endGame()
        }
    }
}

const addLength = () => {
    const newTail = document.createElement("div")
    newTail.setAttribute("class", "tail")
    snake.tail[`${score}`] = newTail
    // no need to appendChild here, next slither() will take care of it
}

const slither = (left, top) => {
    const firstTail = document.createElement("div")
    firstTail.setAttribute("class", "tail")
    document.querySelector("div.game-container").appendChild(firstTail)
    firstTail.style.left = `${left}px`
    firstTail.style.top = `${top}px`
    snake.tail.unshift(firstTail)
    snake.tail[snake.tail.length -1].remove()  
    snake.tail.pop()  
}

const endGame = () => {
    const configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({score: score, user_id: currentUser.id})
    }
    fetch(`${BASE_URL}/scores`, configObj)
    // .then(resp => resp.json())
    // .then(json => console.log(json))
    // .then(loadHighScores())
    setTimeout(loadHighScores, 1000)
    // reload high scores^^

    const board = document.querySelector("div.game-container")
    // clear div.game-container
    board.innerHTML = ""
    // add and wire play again button
    const start = document.createElement("button")
    start.setAttribute("id", "start")
    start.textContent = "Play Again"
    board.appendChild(start)
    start.addEventListener("click", startGame)
    // reinitialize values other than user (done in startGame)
}