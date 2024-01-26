// Import the functions you need from the SDKs you need
//import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
//import { getDatabase, ref, set, push, get, orderByChild} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, set, push, get, orderByChild } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Restante do seu código...


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgvWBDEnhAipsdfMKwAZEctpR4MZLRSJE",
  authDomain: "jogodacobrinha-bc090.firebaseapp.com",
  databaseURL: "https://jogodacobrinha-bc090-default-rtdb.firebaseio.com",
  projectId: "jogodacobrinha-bc090",
  storageBucket: "jogodacobrinha-bc090.appspot.com",
  messagingSenderId: "223152594478",
  appId: "1:223152594478:web:8e1128fbc8596e533f49bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const h4 = document.querySelector('h4');//seleciona o primeiro elemento cuja a tag é h2
const canvas = document.querySelector('canvas');//seleciona o primeiro elemento cuja a tag é canvas
canvas.width = canvas.height =600;
const ctx = canvas.getContext("2d")
const audio = new Audio("./assets/audio.mp3");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play")

const quantidadeDequadradinhosNaHorizontalEVertical = 20;
const size = canvas.width/quantidadeDequadradinhosNaHorizontalEVertical; //tamanho padrão de cada quadradinho

const initialPosition = {x:Math.floor(quantidadeDequadradinhosNaHorizontalEVertical/2)*size, y:Math.floor(quantidadeDequadradinhosNaHorizontalEVertical/2)*size};
let snake = [initialPosition]//array que gera a cobrinha

const incrementScore = ()=>{
    score.innerHTML = +score.innerHTML+10; // o + na frente do score.innerHTML converte o texto e número, serio o mesmo que fazer parseInt(score.innerHTML)
}

const numeroAleatorio = (minimo, maximo)=>{
    return Math.round(Math.random()*(maximo-minimo)+minimo);
}

const randomPosition = ()=>{
    const posicaoSorteada = numeroAleatorio (0,quantidadeDequadradinhosNaHorizontalEVertical-1)*size;// sorteia uma posição que se encaixa direitinho no grid (na grade do jogo)
    return posicaoSorteada;
}

const randomColor = ()=>{
    const red = numeroAleatorio(0,255);
    const green = numeroAleatorio(0,255);
    const blue = numeroAleatorio(0,255);
    return `rgb(${red}, ${green}, ${blue})`
}

//para debug
// const corRGB_sorteada = randomColor();
// h1.style.color = corRGB_sorteada;
// h1.innerHTML=corRGB_sorteada;

const arrayDeCores = ["PowderBlue","Thistle","Lavender","PaleGoldenrod","PeachPuff","Yellow","Gold","Orange","Red","Tomato","Brown","DarkRed","Maroon","DeepPink","Purple","Indigo","GreenYellow","Chartreuse","Green","MediumSpringGreen","Aquamarine","Turquoise","SteelBlue","Blue","DeepSkyBlue","DarkSlateBlue"];

const food = {
    x: randomPosition(),
    y: randomPosition(),
    //color: corRGB_sorteada  // não estamos utilizando a cor sorteada para não correr o risco de termos a mesma cor do fundo do jogo
    color: arrayDeCores[numeroAleatorio (0,arrayDeCores.length-1)] // Math.floor(Math.random() * (arrayDeCores.length-1))] // sorteia uma cor aleatória do array arrayDeCores
}


const drawFood = ()=>{
    const{x,y, color} = food;// isso é o mesmo que fazer: x = food.x, y = food.y e color = food.color

    
    ctx.shadowColor = color; // cor do efeito de brilho
    ctx.shadowBlur = 6;  // isso irá dar um efeito de brilho nos desenhos do ctx
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0; // retira o efeito de brilho dos desenhos do ctx a partir daqui
}

const drawSnake = ()=>{
    ctx.fillStyle = "#ddd";
    
    snake.forEach((position, index)=>{
        if(index==snake.length-1){
            ctx.fillStyle = "white";
        }
        ctx.fillRect(position.x, position.y, size, size);
    });
}

let direction, loopId
const moveSnake = ()=>{         // função responsável por mover a cobrinha
    
    if(!direction) return;      //caso não haja direção, não move
    
    const head = snake.at(-1);  // põe o último elemento do array "snake" na variável "head"
    snake.shift();              //remove o primeiro elemento do array (ou seja, tira o rabo da cobrinha)
    
    
    if(direction=="right"){
        snake.push({x:head.x+size, y:head.y});               // insere um novo elemento no array, ou seja, põe a nova cabeça
    }
    if(direction=="left"){
        snake.push({x:head.x-size, y:head.y});               // insere um novo elemento no array, ou seja, põe a nova cabeça
    }
    if(direction=="down"){
        snake.push({x:head.x, y:head.y+size});               // insere um novo elemento no array, ou seja, põe a nova cabeça
    }
    if(direction=="up"){
        snake.push({x:head.x, y:head.y-size});               // insere um novo elemento no array, ou seja, põe a nova cabeça
    }
}

const drawGrid = ()=>{
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919"
    let i = size;
    for(i=size; i<canvas.width; i=i+size){ 
        // linhas verticais (o x varia e o y fica fixo)
        ctx.beginPath();//vai ser apontar para o início de um novo caminho (ou seja, de uma nova linha)
        ctx.lineTo(i,0); // ponto inicial da linha
        ctx.lineTo(i,canvas.height); // ponto final da linha
        ctx.stroke(); // traça a linha

        // linhas horizontais (o x fica fixo e o y vaira)
        ctx.beginPath();//vai ser apontar para o início de um novo caminho (ou seja, de uma nova linha)
        ctx.lineTo(0,i); // ponto inicial da linha
        ctx.lineTo(canvas.height,i); // ponto final da linha
        ctx.stroke(); // traça a linha

    }
   
}

const checkEat=()=>{
    const head = snake.at(-1);  // põe o último elemento do array "snake" na variável "head"

    if(head.x==food.x && head.y ==food.y){//checa se as coordenadas da cabeça da cobra (head) coincidem com as coordenadas da comida
        snake.push(head);// isere mais um novo elemento no array snake (com as coordenadas da comida)
        incrementScore();
        audio.play();
        // a partir de agora iremos gerar uma nova posição da comida
        let x= randomPosition();
        let y= randomPosition();
        
        while(snake.find((elemento)=>elemento.x==x&&elemento.y==y)){//verifica se as novas coordenadas para a comida coincide com alguma das coordenadas do corpo da cobrinha
            x= randomPosition();
            y= randomPosition();
        }//fica no loop até que seja criada uma comida fora do corpo da cobrinha
        food.x = x;
        food.y = y;
        food.color= arrayDeCores[numeroAleatorio (0,arrayDeCores.length-1)] ;        
    }
}

const checkCollision = ()=>{
    const head = snake.at(-1);  // põe o último elemento do array "snake" na variável "head"
    const limiteHorizontal = canvas.width-size;
    const limiteVertical = canvas.height-size;

    const wallCollision = head.x < 0||head.x>limiteHorizontal||head.y<0||head.y>limiteVertical

    const selfCollision = snake.find((elemento, index)=>{
        return (elemento.x == head.x && elemento.y == head.y && index<snake.length-2);// verifica se há colisão da cabeça da cobra com outra parte do corpo diferente da cabeça
    });

    if(wallCollision||selfCollision){
        gameOver();
    }
    // if(wallCollision) alert("Perdeu! Você bateu a cabeça no muro.");
    // if(selfCollision) alert("Perdeu! Você bateu a cabeça no corpo")
}

const inserirPontosNoFirebase=()=>{
    const database = getDatabase();
    const scoresRef = ref(database, 'pontos'); // 'pontos' é o nome da sua coleção de pontuações

    // Recupera a pontuação final do jogo
    const finalScoreValue = parseInt(finalScore.innerText);

    const momentoAtual = Date.now();
    const dataDoMomentoAtual = new Date(momentoAtual);
    // Adiciona a pontuação ao banco de dados usando push para criar um novo item
    const newScoreRef = push(scoresRef);
    set(newScoreRef, {
        timestamp: momentoAtual, // Adicione um timestamp opcional para ordenar as pontuações
        score: finalScoreValue,
        dataEhora: dataDoMomentoAtual.toString()
    });
    
}

let finalizado = false;// esta variável serve para que o gameOver seja executado somente uma vez a cada partida
const gameOver = () => {
    if(finalizado) return;
    direction = undefined
    finalScore.innerText = score.innerText;

    menu.style.display = "flex"; // faz o menu de game over aparecer
    
    canvas.style.filter = "blur(2px)"; // põe um embaçado na imagem de fundo do jogo
    inserirPontosNoFirebase();
    finalizado = true;
}

const getHighestScore = () => {
    const database = getDatabase();
    const scoresRef = ref(database, 'pontos');

    // Obtenha todos os registros
    get(scoresRef).then((snapshot) => {
        if (snapshot.exists()) {
            const scores = snapshot.val();

            // Converta o objeto de pontuações em um array de objetos
            const scoresArray = Object.keys(scores).map((key) => ({
                key: key,
                score: scores[key].score
            }));

            // Ordena o array de pontuações em ordem decrescente
            scoresArray.sort((a, b) => b.score - a.score);

            // Obtenha a maior pontuação
            const highestScore = scoresArray.length > 0 ? scoresArray[0].score : 0;
            //console.log(highestScore);
            h4.innerHTML = "record: "+highestScore;
            
        }
    }).catch((error) => {
        console.error('Erro ao obter a pontuação mais alta:', error);
    });
};


// Chame a função para obter a pontuação mais alta quando o jogo for iniciado
getHighestScore();//obtem o valor do record atual do jogo
const delayDojogo = 400; // delay que influencia na velocidade do jogo
const gameLoop=()=>{ // função que gera o loop principal do jogo
    
    clearInterval(loopId)// para o loop cujo o IDs foi informado no argumento pela variável loopId
    ctx.clearRect(0,0,canvas.width,canvas.height)//limpa o canvas (onde são desenhados os elementos do jogo)
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setTimeout( ()=>{
        gameLoop();
    },delayDojogo);// chama a própria função a cada vez que se passar 300 milisegundos
}

gameLoop();

document.addEventListener("keydown",({key})=>{ // já recebe a key do envento, ou seja, já recebe a tecla do evento
    //console.log(key);
    if(key=="ArrowRight"&&direction!="left") direction="right";
    if(key=="ArrowLeft"&&direction!="right") direction="left";
    if(key=="ArrowDown"&&direction!="up") direction="down";
    if(key=="ArrowUp"&&direction!="down") direction="up";
});

buttonPlay.addEventListener("click",()=>{
    snake = [initialPosition];// reinicia a cobrinha
    score.innerText = "00";//reinicia a pontuação do jogo (o score)
    menu.style.display = "none";//oculta a tela de menu que aparece no game over
    canvas.style.filter = "none"; //tira o embaçado que aparece no game over
    getHighestScore();//obtem o valor do record atual do jogo
    finalizado = false;

});