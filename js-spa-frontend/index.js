const BASE_URL = "http://localhost:3000"
const HIGHSCORES = `${BASE_URL}/highscores`

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

    document.querySelector("div.game-container").appendChild(nameForm)

    submit.addEventListener("submit", setName)
}

const addListeners = () => {
    const nameBtn = document.getElementById("name")
    const rulesBtn = document.getElementById("rules")
    const scoresBtn = document.getElementById("scores")
    const startBtn = document.getElementById("start")

    nameBtn.addEventListener("click", displayNameField)
    rulesBtn.addEventListener("click", hideRules)
    scoresBtn.addEventListener("click", hideScores)
    startBtn.addEventListener("click", () => console.log("started"))
}


const setName = (e) => {
    e.preventDefault()
    const configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({user_id: e.target.dataset.userId})
    }
    fetch(`${BASE_URL}/users`, configObj)
    .then(res => res.json())
    .then(json => console.log(json))
}

const setUser = () => {

}
