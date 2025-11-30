const settingPanel = document.getElementById("panel");
const cogWheel = document.getElementById("cog");
const X = document.getElementById("closer");
const modeButton = document.getElementById("mode-button");
const musicButton = document.getElementById("music-button");
const body = document.body;
const main = document.querySelectorAll('main')[0];
const labels = document.querySelectorAll('label');
let currentMode = localStorage.getItem("mode") || "white";
const georgianBox = document.getElementById("georgian-words");
const russianBox = document.getElementById("russian-words");
const inputs = document.querySelectorAll('input');
const form = document.querySelectorAll('form')[0];
let words = {};
const shuffleDiv = document.getElementById("shuffled-questions");
const shuffleButton = document.getElementById("shuffler");
const shuffleForm = document.getElementById("shuffled-form");
const results = document.getElementById("result");
let saveGeorgian = "";
let saveRussian = "";

function openSettingsPanel() {
    settingPanel.style.display = "block";
    settingPanel.style.position = "fixed";
};




function switchModes() {
    if (currentMode == "white") {
        currentMode = "black";
        body.style.backgroundColor = "black";
        labels.forEach((l)=> l.style.color = "white");
        modeButton.textContent = "Turn on light mode";
        localStorage.setItem("mode","black");
    }
    else {
        currentMode = "white";
        body.style.backgroundColor = "white";
        labels.forEach((l)=> l.style.color = "black");
        modeButton.textContent = "Turn on dark mode";
        localStorage.setItem("mode","white");
    }
}

let music = new Audio("music2.mp3");
let running = false;

function playMusic() {

    if (!running) {
        running = true;
        music.play();
        musicButton.textContent = "Turn off the music";
    } 
    else {
        running = false;
        music.pause();
        music.currentTime = 0; // stops completely
        musicButton.textContent = "Turn on some music";
    }

}

function websiteBackgroundColor() {
    body.style.backgroundColor = currentMode;
    if (currentMode == "white") {
        labels.forEach((l)=> l.style.color = "black");
    }
    else {
        labels.forEach((l)=> l.style.color = "white");
    }
}


function addWords(e) {
    e.preventDefault();

    // Add words first
    georgianBox.innerHTML += `<p>${inputs[0].value}</p>`;
    saveGeorgian = georgianBox.innerHTML
    russianBox.innerHTML += `<p>${inputs[1].value}</p>`;
    saveRussian = russianBox.innerHTML

    // Save in object
    words[inputs[0].value] = inputs[1].value;
    console.log(words);

   
    // Clear inputs
}

let shuffled = {}

function askQuestions() {

    const entries = Object.entries(words);
    let entriesLength = entries.length;
    // Shuffle
    for (let i = entries.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [entries[i], entries[j]] = [entries[j], entries[i]];
    }
    shuffled = Object.fromEntries(entries);
    georgianBox.innerHTML = ""
    russianBox.innerHTML = ""
    shuffleForm.innerHTML = ""
    results.innerHTML = ""
    results.style.display = "none"
    // Iterate over the shuffled entries
    let index = -1
    for (const [geo, rus] of entries) {
        index++;
        shuffleForm.innerHTML += `<p style = "color: ${currentMode == "white" ? "black":"white"}">how do you say ${geo} in russian?</p>
        <input type="text" required>`
        if (index === entriesLength - 1) {
            shuffleForm.innerHTML+=`<input type="submit">`
        }
    }
    // Display the question
    // shuffleDiv.innerHTML = `<p>${geo}</p>`;
}

function checkAnswers(e) {
    e.preventDefault();
    const inputs2 = shuffleForm.querySelectorAll('input[type="text"]'); // get all text inputs
    let answers = []
    // let keys = Object.values(shuffled)
    inputs2.forEach(input => {
        answers.push(input.value) // this is what the user typed
});
    loopIndex = 0
    shuffleForm.innerHTML = ""
    results.style.display = "flex"
    results.classList.add("results")
    results.innerHTML = `<h2>Results</h2>`
    for (const key in shuffled){
        if (shuffled[key] === answers[loopIndex] ){
            results.innerHTML += `
                <p>${key}: <span style="color:yellow;">correct</span> -> ${shuffled[key]}</p>
            `
        }
        else {
            results.innerHTML += `<p>${key}: <span style="color:red;">wrong</span> -> ${shuffled[key]}</p>`
        }
        loopIndex++
    }
    russianBox.innerHTML = saveRussian
    georgianBox.innerHTML = saveGeorgian
}



shuffleForm.addEventListener('submit',checkAnswers)
shuffleButton.addEventListener('click',askQuestions)
form.addEventListener('submit',addWords);
modeButton.addEventListener('click',switchModes);
musicButton.addEventListener('click',() => playMusic());
X.addEventListener('click',() => settingPanel.style.display = "none");
cogWheel.addEventListener('click', openSettingsPanel);
document.addEventListener('DOMContentLoaded',websiteBackgroundColor);

