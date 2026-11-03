let apiUrl = null
let thisDifficulty = ""
switch (getCurrentDifficulty()) {
    case "easy":
        thisDifficulty = "easy"
        apiUrl = "https://opentdb.com/api.php?amount=1&type=multiple&difficulty=easy"
        break;
    case "medium":
        thisDifficulty = "medium"
        apiUrl = "https://opentdb.com/api.php?amount=1&type=multiple&difficulty=medium"
        break;
    case "hard":
        thisDifficulty = "hard"
        apiUrl = "https://opentdb.com/api.php?amount=1&type=multiple&difficulty=hard"
        break;
    default:
        apiUrl = "https://opentdb.com/api.php?amount=1&type=multiple"
      
  }







let myBlue = "#0099b4"
let myRed = "#990023"
let myGreen = "#009b02"
let score = 0
const resetCSSButton = document.querySelector("#resetCSSButton")
const body = document.querySelector("body")
const inputColor = document.querySelector("#inputColor")
const scoreP = document.querySelector("#score")
const maxScoreP = document.querySelector("#maxScore")
const endGameButton = document.querySelector("#endGameButton")
const restartGameButton = document.querySelector("#restartGameButton")
const questionP = document.querySelector("#question")
const option1 = document.querySelector("#option1")
const option2 = document.querySelector("#option2")
const option3 = document.querySelector("#option3")
const option4 = document.querySelector("#option4")
const nextQuestionButton = document.querySelector("#nextQuestionButton")
let arrayOptions = [option1, option2, option3, option4]
let question = ""
let trueAnswer = ""
let falseAnswer1 = ""
let falseAnswer2 = ""
let falseAnswer3 = ""
let buttonsWorking = true
let lastRequestTime = 0
let trueOptionButton
let falseOptionButton1
let falseOptionButton2
let falseOptionButton3
let falseOptionButtons
let allOptionButtons
function getMaxScore(){
    let maxScore = 0
    let savedMaxScore = localStorage.getItem('maxScore')
    if (savedMaxScore !== null) {
        maxScore = parseInt(savedMaxScore, 10)
    }

    return maxScore
    
}

function getCurrentDifficulty() {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    return params.get('difficulty') || '';
}

function resetCSS(array){
    // resetuje css vsech elementu v poli
    array.forEach(function(item){
        item.style = ""
})}

function setButtonColor(button, myColor){
    // nastavi css mych buttonu na barvu
    button.style.borderColor = myColor
   
}



// tlacitko, ktere vraci zpatky domu
endGameButton.addEventListener("click", function(){
    window.location = "index.html"
})

restartGameButton.addEventListener("click", function() {
    const currentTime = new Date().getTime();
    const timeSinceLastRequest = currentTime - lastRequestTime;
    if (timeSinceLastRequest < 5000) {
        const timeToWait = 5000 - timeSinceLastRequest;
        console.log(`Waiting ${timeToWait}ms to comply with API rate limits before restarting.`);
        setTimeout(() => {
            window.location = `trivia.html?difficulty=${thisDifficulty}`;
        }, timeToWait);
    } else {
        window.location = `trivia.html?difficulty=${thisDifficulty}`;
    }
});

// zde měním barvu pozadí barevným inputem
inputColor.addEventListener("input", function(){
    body.style.backgroundColor = inputColor.value
})

// zde tlačítko pro reset barevného inputu

resetCSSButton.addEventListener("click", function(){
    body.style = ""
    inputColor.value = "#111422"
})



  


function decodeHtml(html) {
    // funkce na odstraneni nejakych random ass html znaku z API
    let tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate random number between 0 and i (inclusive)
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements at indices i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function generateRandomOrder() {
    // dostanu cisla 0-3 v nahodnem poradi
    const numbers = [0, 1, 2, 3];
    return shuffleArray(numbers);
}




async function startGame(){
    getMaxScore()
    score = 0
    maxScoreP.textContent = `BEST SCORE: ${getMaxScore()}`
    await nextQuestion()
    nextQuestionButton.addEventListener("click", function(){
        nextQuestion()
    })
}






async function nextQuestion(){
    try{

        // v teto casti mam poresene, aby requesty byly max co 5 sekund (api povoluje proste 1 za 5s)
        const currentTime = new Date().getTime()
        const timeSinceLastRequest = currentTime - lastRequestTime
        if (timeSinceLastRequest < 5000) {
            const timeToWait = 5000 - timeSinceLastRequest
            await new Promise(resolve => setTimeout(resolve, timeToWait))
        }
        let response = await fetch(apiUrl)
        lastRequestTime = new Date().getTime()
        //




            // ZDE PRACUJU


            // funkce musi z nejakeho duvodu byt uvnitre te next question funkce, jinak to nema pristup, nikdo se me neptejte proc
        function handleButtons() {
            // vyhodnocuje spravne a spatne odpovedi 

            if(this === trueOptionButton){
                if (buttonsWorking === true) {
                    buttonsWorking = false
                    score += 1
                    if (score > getMaxScore()) {
                        localStorage.setItem('maxScore', score)
                    }
                    setButtonColor(this, myGreen)
                    maxScoreP.textContent = `BEST SCORE: ${getMaxScore()}`
                    scoreP.textContent = `SCORE: ${score}`
                 
                    nextQuestionButton.classList.remove("disabled")
                }
                
            }

            else if(falseOptionButtons.includes(this)){
                if (buttonsWorking === true) {
                            buttonsWorking = false
                            setButtonColor(this, myRed)
                            setButtonColor(trueOptionButton, myGreen)
                            nextQuestionButton.classList.add("disabled")
                        }
                    
            }

        }
        

    

            buttonsWorking = true
            nextQuestionButton.classList.add("disabled")
            let data = await response.json()
            let triviaQuestionesFull = data.results

       
        

            // dávám do polí jednotlivé otazky a odpovedi
            question = decodeHtml(triviaQuestionesFull[0].question)
            trueAnswer = decodeHtml(triviaQuestionesFull[0].correct_answer)
            falseAnswer1 = decodeHtml(triviaQuestionesFull[0].incorrect_answers[0])
            falseAnswer2 = decodeHtml(triviaQuestionesFull[0].incorrect_answers[1])
            falseAnswer3 = decodeHtml(triviaQuestionesFull[0].incorrect_answers[2])
            //

            // zde vytvářím náhodné pořadí otázek, aby správná odpověď nebyly porad na stejnem miste
            let order = generateRandomOrder()
            
            questionP.textContent = question
            trueOptionButton = arrayOptions[order[0]]
            falseOptionButton1 = arrayOptions[order[1]]
            falseOptionButton2 = arrayOptions[order[2]]
            falseOptionButton3 = arrayOptions[order[3]]
            falseOptionButtons = [falseOptionButton1,falseOptionButton2,falseOptionButton3]
            allOptionButtons = [falseOptionButton1,falseOptionButton2,falseOptionButton3,trueOptionButton]

        
            
            trueOptionButton.textContent = trueAnswer
            falseOptionButton1.textContent = falseAnswer1
            falseOptionButton2.textContent = falseAnswer2
            falseOptionButton3.textContent = falseAnswer3
            //

    

   
            

            // tady jenom zapinam buttony NIC VÍC 
            trueOptionButton.classList.remove("disabled")
            falseOptionButtons.forEach(function(oneButton){
                oneButton.classList.remove("disabled")
            })
            //
           

            // zde jsem odebral vsem buttonum event listenery, aby nedelaly bordel
            allOptionButtons.forEach(function(oneButton){
                oneButton.removeEventListener("click", handleButtons)
            })
            allOptionButtons.forEach(function(oneButton){
                oneButton.addEventListener("click", handleButtons)
            })
            //



            resetCSS(allOptionButtons)
            

            console.log(`correct answer is ${trueAnswer}`)

    } 
        // ZDE UŽ NE
    catch(error){
        console.error("Failed to fetch data:", error)
    }
}



startGame()
