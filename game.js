const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
let canvasSize;
let elementSize;

window.addEventListener('load',setCanvasSize);
window.addEventListener('resize',setCanvasSize);

function startGame(){
    console.log({canvasSize, elementSize});
    game.font = elementSize +'px Verdana';
    //alinea el objeto o texto a la izquierda o derecha 
    game.textAlign = 'end';
    // se crea una variable donde se extriga el primer mapa del arreglo maps
    const map = maps[0];
    // se crea una variable que contenga las filas del primer mapa
    //la funcion trim() lispia los espacios enblanco de los string
    // la funcion split le indican al codigo con que caracter o caracters inician y terminael string
    const mapRows = map.trim().split('\n');
    // apartir del la constante limpia de mapRows, se crea otra constante donde separe cada uno de 
    //los caracteres mediante un nuevo arreglo 
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    console.log({map,mapRows, mapRowCols});

    // for (let row = 1; row <= 10; row++) {
    //     for (let col = 1; col <= 10 ; col++) {
    //         //dibuja una cadena de texto en las coordenadas especificadas .fill(caracter,x,y)
    //         game.fillText(emojis[mapRowCols[row-1][col-1]], (elementSize*col) ,(elementSize*row) ); 
    // }
    // }

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col,colI) => {
            emoji = emojis[col];
            const posX = elementSize*(colI+1);
            const posY = elementSize*(rowI+1);
            game.fillText(emoji,posX,posY);
        });
        
    });
}

function setCanvasSize (){
    if (window.innerWidth < window.innerHeight){
        canvasSize = window.innerWidth * 0.8
    }else{
        canvasSize = window.innerHeight * 0.8
    }

    canvas.setAttribute('width',  canvasSize);
    canvas.setAttribute('height', canvasSize);
    elementSize = (canvasSize/10);
    startGame()
}