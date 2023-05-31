const canvas = document.querySelector('#game');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#mensaje');
const game = canvas.getContext('2d');
let canvasSize;
let elementSize;
let level = 0;
let lives = 3;
let timeStart ;
let timePlayer;
let timeInterval;


const playerPosition ={
    x : undefined,
    y : undefined,
};

const giftPosition = {
    x : undefined,
    y : undefined,
}

let bombas = [];



// Espera a que cargue el contenido html de la pagina antes de lanzar la funcion
window.addEventListener('load',setCanvasSize);
window.addEventListener('resize',setCanvasSize);

function setCanvasSize (){
    // con este condicional se le da las dimensiones al mapa para que siempre sea cuadrado
    if (window.innerHeight > window.innerWidth ){
         canvasSize = Math.trunc(window.innerWidth * 0.8) ;
    }else{
         canvasSize = Math.trunc(window.innerHeight * 0.8) ;
    };

     //Dependiendo del tamaño de la pantalla, va a colocar el tamaño cuadrado del canvas
     //Al dividir entre 10 y luego aproximar el valor a un entero garantiza que el canvas 
     //será un entero múltiplo de 10. Finalmente se multiplica la expresión por 10 para 
     //obtener el dato real del canvas

     // se introducen las dimensiones del canvas 
    canvas.setAttribute('width',  canvasSize);
    canvas.setAttribute('height', canvasSize);
     // sele da dimensiones al los objetos dentro del mapa
    elementSize = canvasSize/10;
    startGame();
}

function startGame(){
    console.log({canvasSize, elementSize});
    // se le da tamaño a los objetos
    game.font = elementSize +'px Verdana';
    //alinea el objeto o texto a la izquierda o derecha 
    game.textAlign = 'end';
    
     // se crea una variable donde se extrae el primer mapa del arreglo maps
    const map = maps[level];
    // se crea una condicion para que cuando no halla mas mapas no se renderize de nuevo y termine 
    // el juego
    if (!map){
        gameWin();
        return;
    }
    // condicional que pregunta si hay algun valor en la variable timeStart 
    if(!timeStart){
        //se asigna el valor del instante en que se inicia el juego
        timeStart = Date.now();
        // se asigna un metodo que ejecuta la funcion showTime cada 100 ms
        timeInterval= setInterval(showTime,100);
        // se llama la funcion 
        showRecord();
    }
    
    showLives();

    //Agarramos el mapa del array de mapas y le quitamos los espacios en blanco al inicio y al final
    //con trim y luego con split creamos un arreglo donde el inicio y el final de cada elemento se
    //marca por los saltos de linea '\n'
    const mapRows = map.trim().split('\n');
    //Del array resultante usamos map para recorrer cada uno de sus elementos (rows) limpiando los
    //espacios en blanco con trim y luego separandolos por "filas" con split
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    console.log({map,mapRows, mapRowCols});
    // reasignamos un array vacio al array que guarda las posiciones de los objetos enemigos
    // ya que siempre que se haga un movimiento duplicara las posiiones de los objetos enemigos
    bombas = [];
    // lispiamos todo el canvas para luego volver a renderizar 
    game.clearRect(0,0, canvasSize, canvasSize);


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
            const posX = elementSize* (colI+1);
            const posY = elementSize* (rowI+1);
            
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
            }// con este condicional guardamos las coordenadas de la meta
            else if (col == 'I'){
                giftPosition.x = posX;
                giftPosition.y = posY;
            } // con este condicional guardamos las cordenadas de los objetos enemigos
            else if (col == 'X'){
                bombas.push({
                    x: posX,
                    y: posY,
                })
            }

            //Llenamos en nuestro canvas con cada iteracion
            game.fillText(emoji,posX,posY);
        });
        
    });

    movePlayer();
}


function movePlayer (){
    // se compara la posicion de la meta en el eje x con la posicion del jugador y devuelve un true
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    // se compara la posicion de la meta en el eje y con la posicion del jugador y devuelve un true
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    // compara si las dos posiciones tanto en x como en y su estado es true
    const giftCollision = giftCollisionX && giftCollisionY;
    // esta condicion se ejecuta si en giftCollisin su estado es true
    if (giftCollision){
        levelWin();
    }
    // se busca si las posiciones de los objetos enemigos coninciden con la posicion del jugador
    const bombasCollision = bombas.find(bomba => {
        // se compara la posicion de los objetos enemiogos en el eje x con la posicion del jugador y devuelve un true
        const bombaCollisionX = bomba.x.toFixed(3) == playerPosition.x.toFixed(3);
        // se compara la posicion de los objetos enemiogos en el eje x con la posicion del jugador y devuelve un true
        const bombaCollisionY = bomba.y.toFixed(3) == playerPosition.y.toFixed(3);
        // se devuelve un true si las dos variables cumplen con ese estado
        return bombaCollisionX && bombaCollisionY
    })
    // esta condicion se ejecuta si en bombasCollision su estado es true
    if (bombasCollision){
        repeatLevel()
    }

    game.fillText(emojis['PLAYER'], playerPosition.x,playerPosition.y)
}
// se crea una funcion que permita subir de nivel y se renderize un nuevo mapa
function levelWin(){
    console.log('Subiste de nivel');
    level++;
    startGame()
}

// funcion que termina el juego
function gameWin(){
    console.log('Ganaste');
    // termina con la ejecucion del setinterval que ejecuta showTime
    clearInterval(timeInterval);
    // se le asigna el valor que esta alojado en record en el local storage
    const recordTime = localStorage.getItem('record');
    // condicional que nos permite validar si hay algo en recordTime
    if(recordTime){
        
        if (recordTime > timePlayer){
            // si cordTiem es mayor a timePlayer se guarda en recor el valor del tiempo del jugador
            // e impreme un mensaje
            localStorage.setItem('record', timePlayer);
            pResult.innerHTML = 'Superaste el record!!'
        }else {
            // si no solo imprime un mensaje
            pResult.innerHTML = 'Lo siento, no supersate el record'
        }
    }else{
        // de no cumplirse con el condicional solo se envia el valor de tiempo que se obtuvo 
        //por primera vez y se imprime un mensaje
        localStorage.setItem('record', timePlayer);

        pResult.innerHTML = 'Primera vez?, intenta superar tu tiempo'
    }
    console.log({recordTime,timePlayer});
}
// funcion que muestra el numero de vidas 
function showLives (){
    // se crea una constante que contenga un array con el numero de vidas que tiene el jugador
    const heartArray = Array(lives).fill(emojis['HEART']);
    console.log(heartArray);
    // se imprime el numero de vidas del jugador 
    spanLives.innerHTML = emojis['HEART'].repeat(lives);
    // for (let i = 0; i < heartArray.length; i++) {
    //     spanLives.innerHTML += heartArray[i]
        
    // }
    
}
// funcion que muestra el tiempo
function showTime(){
    // se le asigna a la variable global el valor del tiempo actual menos el tiempo en el que
    // se inica el juego
    timePlayer = Date.now()-timeStart;
    // se imprime el valor del tiempo en html
    spanTime.innerHTML = timePlayer ;
    
}

function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('record'); 
}

// funcion que nos permite repetir el nivel
function repeatLevel(){
    console.log('chocaste con una bomba');
    //Se rreduce el numero de vidas 
    lives--;
    // este condicional valida si el numero de vidas es menor que 0, para reiniciar al primer nivel
    // y tres vidas mas
    if (lives <= 0){
        level = 0;
        lives = 3;
        timeStart = undefined;
    }
    console.log('vidas'+'='+lives);
    // se coloca undefine para reiniciar la posicion del jugador
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

window.addEventListener('keydown', moveByKey);

function moverArriba(){
    console.log('moverarriba');
    if ((playerPosition.y - elementSize) < elementSize){
        console.log('out');
    }else{
        playerPosition.y -= elementSize 
        startGame();
    }
    

}
function moverAbajo(){
    console.log('moverabajo');
    if ((playerPosition.y + elementSize) > canvasSize){
        console.log('out');
    }else{
        playerPosition.y += elementSize 
        startGame();
    }
}
function moverDerecha(){
    console.log('moverderecha');
    if ((playerPosition.x + elementSize) > canvasSize){
        console.log('out');
    }else{
        playerPosition.x += elementSize
        startGame();
    }
}
function moverIzquierda(){
    if ((playerPosition.x - elementSize) < elementSize){
        console.log('out');
    }else{
        playerPosition.x -= elementSize
        startGame();
    }
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