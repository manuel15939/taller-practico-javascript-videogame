const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
let canvasSize;
let elementSize;

const playerPosition ={
    x : undefined,
    y : undefined,
}

// Espera a que cargue el contenido html de la pagina antes de lanzar la funcion
window.addEventListener('load',setCanvasSize);
window.addEventListener('resize',setCanvasSize);
window.addEventListener('keydown', moveByKey)

function startGame(){
    console.log({canvasSize, elementSize});
    game.font = elementSize +'px Verdana';
    //alinea el objeto o texto a la izquierda o derecha 
    game.textAlign = 'end';
    
     // se crea una variable donde se extrae el primer mapa del arreglo maps
    const map = maps[0];
    //Agarramos el mapa del array de mapas y le quitamos los espacios en blanco al inicio y al final
    //con trim y luego con split creamos un arreglo donde el inicio y el final de cada elemento se
    //marca por los saltos de linea '\n'
    const mapRows = map.trim().split('\n');
    //Del array resultante usamos map para recorrer cada uno de sus elementos (rows) limpiando los
    //espacios en blanco con trim y luego separandolos por "filas" con split
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    console.log({map,mapRows, mapRowCols});
    // lispiamos todo el canvas para luego volver a renderizar 
    game.clearRect(0,0, canvasSize, canvasSize)


     // for (let row = 1; row <= 10; row++) {
     //     for (let col = 1; col <= 10 ; col++) {
     //         //dibuja una cadena de texto en las coordenadas especificadas .fill(caracter,x,y)
     //         game.fillText(emojis[mapRowCols[row-1][col-1]], (elementSize*col) ,(elementSize*row) ); 
     // }
     // }


     //Recorremos con for each el array bidimensional a partir del string del map y recibimos dos parametros su valor y su indice
    mapRowCols.forEach((row, rowI) => {
        //Recorremos las filas iterando sobre cada columna y recibimos su valor y su indice
        row.forEach((col,colI) => {
            //Declaramos que valor tendra el emoji en esa columna
            emoji = emojis[col];
             //Definimos el posicionamiento que tendra en horizontal y vertical esa columna al 
             //alinearse en el canvas (ej: elementsSize vale 60 el elemento se insertara en el 
             //medio que seria 30)
            const posX = (elementSize*(colI+1))+10;
            const posY = (elementSize*(rowI+1))-5;
             //Llenamos en nuestro canvas con cada iteracion
            game.fillText(emoji,posX,posY);
            //Solo le damos coordenadas a la posicion del jugador si aun no fueron dadas (si no fue
            //definida en x no hace falta verificar que no haya sido definida en y ya que siempre 
            //se definen las dos)
            if (col =='O'){
                //preguntamos si ninguno de estos elementos tiene algo adentro
                if(!playerPosition.x && !playerPosition.y){
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                    console.log({playerPosition});
                }
            }
        });
        
    });

    movePlayer();
}

function setCanvasSize (){
   // con este condicional se le da las dimensiones al mapa para que siempre sea cuadrado
    if (window.innerWidth < window.innerHeight){
        canvasSize = window.innerWidth * 0.8
    }else{
        canvasSize = window.innerHeight * 0.8
    }

    //Dependiendo del tamaño de la pantalla, va a colocar el tamaño cuadrado del canvas
    //Al dividir entre 10 y luego aproximar el valor a un entero garantiza que el canvas 
    //será un entero múltiplo de 10. Finalmente se multiplica la expresión por 10 para 
    //obtener el dato real del canvas

    // se introducen las dimensiones del canvas 
    canvas.setAttribute('width',  canvasSize);
    canvas.setAttribute('height', canvasSize);
    // sele da dimensiones al los objetos dentro del mapa
    elementSize = (canvasSize/10)-2;
    startGame()
}

function movePlayer (){
    game.fillText(emojis['PLAYER'], playerPosition.x,playerPosition.y)
}

function clearmap(){
    game.clearRect(0,0, canvasSize, canvasSize)
}

function moverArriba(){
    console.log('moverarriba');
    playerPosition.y -= elementSize 
    startGame();

}
function moverAbajo(){
    console.log('moverabajo');
    playerPosition.y += elementSize 
    startGame();
}
function moverDerecha(){
    console.log('moverderecha');
    playerPosition.x += elementSize 
    startGame();
}
function moverIzquierda(){
    console.log('moverizquierda');
    playerPosition.x -= elementSize 
    startGame();
}


function moveByKey(event){
    switch (event.key) {
        case 'ArrowUp':
            moverArriba()
            break
        case 'ArrowDown':
            moverAbajo()
            break
        case 'ArrowRight':
            moverDerecha()
            break
        case 'ArrowLeft':
            moverIzquierda()
            break
    
        default:
            break
    }

}