const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
let canvasSize;
let elementSize;

window.addEventListener('load',setCanvasSize);
window.addEventListener('resize',setCanvasSize);

function startGame(){
    console.log({canvasSize, elementSize});
    game.font = elementSize +'px Verdana';
    game.textAlign = 'end';
    for (let i = 1; i <= 10 ; i++) {
        game.fillText(emojis['X'], (canvasSize/10)*i, elementSize );
        
    }
}

function setCanvasSize (){
    if (window.innerWidth < window.innerHeight){
        canvasSize = window.innerWidth * 0.8
    }else{
        canvasSize = window.innerHeight * 0.8
    }

    canvas.setAttribute('width',  canvasSize);
    canvas.setAttribute('height', canvasSize);
    elementSize = canvasSize/13;
    startGame()
}