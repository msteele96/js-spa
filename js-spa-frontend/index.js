const BASE_URL = "http://localhost:3000"
const HIGHSCORES = `${BASE_URL}/highscores`
let currentUserId
let direction

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
    console.log("setting user")
    const name = document.createElement("h4")
    name.setAttribute("style", "text-align: center")
    document.querySelector("div#title-holder").appendChild(name)
    name.textContent = json.data.attributes.name

    currentUserId = json.data.id

    document.querySelector("form.name-field").remove()
}

const startGame = () => {
    if (currentUserId != undefined) {
        const snake = document.createElement("div")
        snake.setAttribute("class", "snake")
        document.querySelector("div.game-container").appendChild(snake)
    } else {
        window.alert("Enter a name to start playing!")
    }
}