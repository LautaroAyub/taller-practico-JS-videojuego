const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const btnUp= document.querySelector("#up")
const btnDown= document.querySelector("#down")
const btnLeft= document.querySelector("#left")
const btnRight= document.querySelector("#right")
const spanLives= document.querySelector("#lives")
const spanTime = document.querySelector("#time")
const spanRecord= document.querySelector("#record")
const pResol=document.querySelector("#result")
let canvasSize;
let elementsSize;
let level=0;
let lives=3;
let timeStart;
let timeInterval;

const playerPosition={
    x:undefined,
    y:undefined
}
const giftPosition={
    x:undefined,
    y:undefined
}
let positionBombs=[

]

window.addEventListener("load",setCanvasSize) //apenas me cargue el html se iniciara el juego
window.addEventListener("resize",setCanvasSize) // escucha cada resize(cambio de pantalla)





function startGame(){
    game.font=elementsSize-1+"px Verdana";
    game.textAlign="end";
    const map=maps[level];
    if(!map){
        gameWinAndRecordSave()
        return;
    }


    if(!timeStart){
        timeStart=Date.now();
        timeInterval=setInterval(showTime,100)  //ejecuta automaticamente una funcion por milisegundo hasta que se detenga
        showRecord();
    }
    const mapRows=map.trim().split("\n")                                //split separa en un array a cada elemento cuando cumpla la condicion, si no se le envia nada te separa todos los strings--.trim elimina espacions vacios al principio o final
    const mapRowCols = mapRows.map(row=>row.trim().split(""));           //Creamos un array bidimencional para el ciclo for, con las filas que dentro tienen cada columna separada en arrays
//console.log({map,mapRows,mapRowCols});

    showLives()

    positionBombs=[];                                                     //reinicia la posicion de las bombas para que no se acumule en el array por cada movimiento
    game.clearRect(0,0,canvasSize,canvasSize)
   
    mapRowCols.forEach((row,rowI)=>{          
            row.forEach((col,colI)=>{                    
        // console.log({row,rowI,col,colI})             

        const emoji = emojis[col];
        const positionX= elementsSize*(colI+1)  
        const positionY=elementsSize*(rowI+1);

        game.fillText(emoji,positionX,positionY) 
        if (col=="O"){                                   //saco las posiciones de incicio del jugador y se las asigno al objeto
            if(!playerPosition.x && !playerPosition.y){   //esto es para que cuando mueva al jugador o cambie el tamaño de la pantalla no se vuelva a ejecutar la logica de desde donde arranca
            playerPosition.x=positionX;
            playerPosition.y=positionY;
            console.log({playerPosition})
            }
        } else if(col=="I"){
            giftPosition.x=positionX
            giftPosition.y=positionY
        }
    if(col=="X"){
        positionBombs.push({x:positionX, y:positionY })   //crea array con la posiciones de la bomba
    }
        
    })

 })
 /*Recorro con forE a cada fila del array bi.
   Hago otro forE para ahora por cada columna de la fila en la que estoy  
   Entonces row es un array y col es un caracter, para conseguir las posiciones.
    Los metodos como el forE nos permite ver su indice, poniendolo en el segundo parametro de la funcion (colI y rowI)
   Se le pone +1 para que entre en la correcta posicion del canvas(explicado en el ciclo for comentado)/*



// for (let row = 1; row <=10; row++) { //aca arranca en 1 porque si pones 0 la posicion se sale del cuadro
//     for (let col = 1; col <= 10; col++) {
//         game.fillText(emojis[mapRowCols[row-1][col-1]],  //aca se le resta 1 porque arranca en 1, y necesito la posicion tal cual para seleccionar el emoji correspondiente
//             elementsSize* col ,elementsSize * row)
           
//        }  
// }
/*    
    game.fillText(emojis["X"],100,100)
    window.innerHeight
    window.innerWidth
    game.fillRect(0,0,100,100);cre rectangulo
    game.clearRect(0,0,50,50) borra rectangulo
    game.font="25px Verdana";
    game.fillStyle="purple";
    game.textAlign="end"; que texto y en que posicion se coloca
    game.fillText("platzi",50,50)*/
movePlayer()
}
function movePlayer(){
    const huboColisionX= playerPosition.x.toFixed(3)==giftPosition.x.toFixed(3);
    const huboColisionY= playerPosition.y.toFixed(3)==giftPosition.y.toFixed(3);
    const huboColisionConElRegalito= huboColisionX && huboColisionY;
    if(huboColisionConElRegalito){
     levelWin();
    }

    const huboColisionBomba=positionBombs.find(enemy=>{
      const enemyColisionX=  enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
      const enemyColisionY= enemy.y.toFixed(3)==playerPosition.y.toFixed(3);
      return enemyColisionX && enemyColisionY;
    });
     if(huboColisionBomba){
          levelFail()
      }
  
      game.fillText(emojis["PLAYER"],playerPosition.x,playerPosition.y)
    }
function levelWin(){
    alert("pasaste de nivel")
    level++;
    startGame()
}
function gameWinAndRecordSave(){
    alert("Terminaste el juego")
    clearInterval(timeInterval) //esto detiene la ejecucion constante del tiempo

    const recordTime= localStorage.getItem("record_time") //creo variabel en el local storage del navegador
    const playerTime=Date.now()-timeStart;
    if(recordTime){
        if(recordTime>=playerTime){
            localStorage.setItem("record_time",playerTime)  //asi se le asigna el valor a local storage
            pResol.innerHTML="SUPERASTE EL RECORD CULIAWW"
        }else{
            pResol.innerHTML="Lo siento, no superaste el records:(')"
        }
    }else{
        localStorage.setItem("record_time",playerTime) //si se crea el primer records
        pResol.innerHTML="¿Primera vez?, joya ahora intenta superar el record ;)"
    }


}
function levelFail(){
    console.log("Perdiste una vida")
    lives--;
    if(lives<=0){
       level=0
       lives=3;
       timeStart=undefined;
    }
    
    playerPosition.x=undefined;
    playerPosition.y=undefined;
    startGame()

}
function showLives(){
    const heartsArray = Array(lives).fill(emojis["HEART"]) //crea un array con esta variable[1,2,3]
//    console.log(heartsArray)
spanLives.innerHTML="";  //Se limpia y luego se reescribe con el nuevo valor, para que no este siempre agregando infinitamente
heartsArray.forEach(heart=> spanLives.append(heart))
   
}
function showTime(){
    spanTime.innerHTML= Date.now() - timeStart;
}
function showRecord(){
    spanRecord.innerHTML= localStorage.getItem("record_time")
}
function setCanvasSize(){

    if (window.innerHeight > window.innerWidth){ //si el ancho es mas grande que el alto
        canvasSize=window.innerWidth * 0.7;     //que el alto sea del 80%
    }else {
        canvasSize=window.innerHeight*0.7;
    }
    canvas.setAttribute("width",canvasSize)
    canvas.setAttribute("height",canvasSize)
    Number(canvasSize.toFixed(0)); //quitamos los decimales para que no haya errores con los decimales
    
    elementsSize = canvasSize/10;

    playerPosition.x=undefined;
    playerPosition.y=undefined;
    startGame();
    //Esta funcion se pone aca, por la logica de que cuando haya un evento resice tiene que pasar por esta funcion y deberia iniciar o continuar con el juego
}

btnUp.addEventListener("click",moveUp)
btnDown.addEventListener("click",moveDown)
btnLeft.addEventListener("click",moveLeft)
btnRight.addEventListener("click",moveRight)
window.addEventListener("keydown",moveByKeys)  //logica para que detecte las flechas del teclado

function moveByKeys(event){
    if(event.code=="ArrowUp")moveUp();
    else if(event.code=="ArrowDown")moveDown();
    else if(event.code=="ArrowLeft")moveLeft();
    else if(event.code=="ArrowRight")moveRight();
}
function moveUp(){
    if((playerPosition.y-elementsSize)<elementsSize*0.5){
        console.log("OUT")
    }
    else{
        playerPosition.y-=elementsSize;
        startGame();
    }

}
function moveDown(){
    if((playerPosition.y+elementsSize)>canvasSize){
        console.log("fuera del mapa")
    }
    else{
        playerPosition.y+=elementsSize;
        startGame()
    }

}
function moveLeft(){
    if((playerPosition.x-elementsSize)<elementsSize*0.5){
        console.log("fuera del mapa")
    }
    else{
        playerPosition.x-=elementsSize;
        startGame()}
}
function moveRight(){
    if((playerPosition.x+elementsSize)>canvasSize){
        console.log("fuera del mapa")
    }
    else{
         playerPosition.x+=elementsSize;
        startGame()}
   
}