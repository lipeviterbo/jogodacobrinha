const h1 = document.querySelector('h1');//seleciona o primeiro elemento cuja a tag é h1
const canvas = document.querySelector('canvas');//seleciona o primeiro elemento cuja a tag é canvas
canvas.width = canvas.height =600;
const ctx = canvas.getContext("2d")

// para lembrar como se desenha um retângulo na tela (x, y, width, heigth)
// ctx.fillStyle = "red"
// ctx.fillRect(300,300, 50,50)
const quantidadeDequadradinhosNaHorizontalEVertical = 20;
const size = canvas.width/quantidadeDequadradinhosNaHorizontalEVertical; //tamanho padrão de cada quadradinho

const snake = [
    {x:Math.floor(quantidadeDequadradinhosNaHorizontalEVertical/2)*size, y:Math.floor(quantidadeDequadradinhosNaHorizontalEVertical/2)*size},
    {x:Math.floor(quantidadeDequadradinhosNaHorizontalEVertical/2)*size+size, y:Math.floor(quantidadeDequadradinhosNaHorizontalEVertical/2)*size}
]//array que gera a cobrinha

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

const delayDojogo = 300; // delay que influencia na velocidade do jogo
const gameLoop=()=>{ // função que gera o loop principal do jogo
    
    clearInterval(loopId)// para o loop cujo o IDs foi informado no argumento pela variável loopId
    ctx.clearRect(0,0,canvas.width,canvas.height)//limpa o canvas (onde são desenhados os elementos do jogo)
    drawFood();
    moveSnake();
    drawSnake();
    drawGrid();

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

