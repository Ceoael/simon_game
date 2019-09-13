//Get DOM Elements
const redPad = document.querySelector('.pad.red');
const greenPad = document.querySelector('.pad.green');
const bluePad = document.querySelector('.pad.blue');
const yellowPad = document.querySelector('.pad.yellow');
const currentLevelElement = document.querySelector('.whatLevel p span');
const bestScoreElement = document.querySelector('.bestScore p span');
const startRestartButton = document.querySelector('.controlPanel .startRestart')
const soundButton = document.querySelector('.sound');
const board = document.querySelector('.board');

let moveCombination=[];
let currentLevelValue=1;
let moveNumber = 0;
const colorsPad=['red', 'blue', 'yellow', 'green'];
let soundEnable = true;


//Get random pad
function getNextRandomPad (setOfPads){
    return setOfPads[Math.floor(Math.random() * setOfPads.length)]
}

//Add next value to Array that holds combination of moves
function pushNextMoveToArray(arrayOfMoveCombination, randomColorFunction, colorsArray){
    arrayOfMoveCombination.push(randomColorFunction(colorsArray));
}

function changeDOMElementValue(elementDOM, value){
    elementDOM.textContent = value;
}

function checkIfContinueGame(moveCombinationArray, clickedPad){
    
    displayNextMove(clickedPad);

    const goodMove = moveCombinationArray[moveNumber] === clickedPad;
    if(goodMove)soundEffect('pad',soundEnable);

    if(goodMove && moveNumber+1 >= moveCombinationArray.length){
        moveNumber=0;
        currentLevelValue++;
        changeDOMElementValue(currentLevelElement,currentLevelValue);
        setTimeout(()=>getNextMove(moveCombination), 1000);
        return;
    }
    else if(!goodMove){
        if(localStorage.getItem('record') < currentLevelValue){
            localStorage.setItem('record', currentLevelValue);
            bestScoreElement.textContent = currentLevelValue;
        }
        currentLevelValue=1;
        moveCombination=[]
        changeDOMElementValue(currentLevelElement,currentLevelValue);
        soundEffect('wrong', soundEnable);
        return;
    }
    
    moveNumber++;
}


//-------------------------------------------------------------------
//  DISPLAY AND SOUND FUNCTIONS

//SOUND 
function soundEffect(elementType, isSoundEnabled){
    if(isSoundEnabled){
        switch(elementType){
            case 'pad':
                new Audio('./sounds/padClick.mp3').play();
                break;
            case 'wrong':
                new Audio('./sounds/wrong.mp3').play();
                break;
            default :
                return null;
        }       
    }
}

//Toggle .active class in pad element
function giveActiveClass(elementDOM){
    elementDOM.classList.toggle('active');
    setTimeout(()=>{elementDOM.classList.toggle('active')}, 300);
}

//Show last element in Array of moves combinations
function displayNextMove(pad){
    
    switch(pad){
        case 'red':
            giveActiveClass(redPad);
            break;
        case 'blue':
            giveActiveClass(bluePad);
            break;
        case 'yellow':
            giveActiveClass(yellowPad);
            break;
        case 'green':
            giveActiveClass(greenPad);
            break;
        default:
            return null;
    }
}
//--------------------------------------------------------------------
//GAME LOGIC

function getNextMove(arrayOfMoveCombination){
    pushNextMoveToArray(arrayOfMoveCombination, getNextRandomPad, colorsPad);
    displayNextMove(arrayOfMoveCombination[arrayOfMoveCombination.length-1]);
}

if(localStorage.getItem('record'))
bestScoreElement.textContent = localStorage.getItem('record');

//INITIALISE GAME
//When player click START button
startRestartButton.addEventListener('click', ()=>{
    moveCombination=[];
    setTimeout(()=>getNextMove(moveCombination), 500);
});


//CONTINUE GAME
//When player click Color Pad 
board.addEventListener('click',(event)=>{
    if(moveCombination.length){
        
        checkIfContinueGame(moveCombination, event.target.classList[1])
    }
    
});

//TODO Add Game Over Screen