// =====================
// CURSOR VARITA MÁGICA
// =====================
const wand = document.getElementById("wand-cursor");

document.addEventListener("mousemove", (e) => {
  wand.style.left = e.clientX + "px";
  wand.style.top = e.clientY + "px";

  // Crear chispas
  const sparkle = document.createElement("div");
  sparkle.className = "sparkle";
  sparkle.style.left = e.clientX + "px";
  sparkle.style.top = e.clientY + "px";
  document.body.appendChild(sparkle);

  // Eliminar chispa tras animación
  setTimeout(() => sparkle.remove(), 800);
});

// =====================
// SECCIONES TIPO PESTAÑA
// =====================
function mostrarSeccion(id){
  const secciones = document.querySelectorAll('.seccion');
  secciones.forEach(sec => sec.classList.remove('visible'));

  const activa = document.getElementById(id);
  if(activa) activa.classList.add('visible');

  if(id === "juego") initPong();
}

// =====================
// JUEGO PING PONG
// =====================
let pongIniciado = false;

function initPong() {
  if(pongIniciado) return;
  pongIniciado = true;

  const canvas = document.getElementById("pongCanvas");
  const ctx = canvas.getContext("2d");

  const paddleWidth = 10, paddleHeight = 100;
  let leftY = canvas.height/2 - paddleHeight/2;
  let rightY = canvas.height/2 - paddleHeight/2;
  let ballX = canvas.width/2, ballY = canvas.height/2;
  let ballRadius = 10;
  let ballSpeedX = 4, ballSpeedY = 4;

  let leftScore = 0;
  let rightScore = 0;
  const winningScore = 5;

  let keys = {};
  let gameOver = false;

  document.addEventListener('keydown', e => keys[e.key] = true);
  document.addEventListener('keyup', e => keys[e.key] = false);

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Paletas
    ctx.fillStyle = "white";
    ctx.fillRect(10,leftY,paddleWidth,paddleHeight);
    ctx.fillRect(canvas.width - 20,rightY,paddleWidth,paddleHeight);

    // Pelota
    ctx.beginPath();
    ctx.arc(ballX,ballY,ballRadius,0,Math.PI*2);
    ctx.fillStyle="white";
    ctx.fill();
    ctx.closePath();

    // Marcador
    ctx.font = "30px Arial";
    ctx.fillText(leftScore, canvas.width/4, 50);
    ctx.fillText(rightScore, canvas.width*3/4, 50);

    if(gameOver){
      ctx.fillStyle = "gold";
      ctx.font = "40px Arial";
      const winner = leftScore === winningScore ? "Jugador Izquierda" : "Jugador Derecha";
      ctx.fillText(winner + " GANA!", canvas.width/2 - 120, canvas.height/2);
      return;
    }

    // Movimiento pelota
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Rebotes
    if(ballY + ballRadius > canvas.height || ballY - ballRadius < 0){
      ballSpeedY = -ballSpeedY;
    }

    if(ballX - ballRadius < 20 && ballY > leftY && ballY < leftY + paddleHeight) ballSpeedX = -ballSpeedX;
    if(ballX + ballRadius > canvas.width - 20 && ballY > rightY && ballY < rightY + paddleHeight) ballSpeedX = -ballSpeedX;

    // Puntos
    if(ballX < 0){
      rightScore++;
      resetBall();
    }
    if(ballX > canvas.width){
      leftScore++;
      resetBall();
    }

    // Ganador
    if(leftScore === winningScore || rightScore === winningScore){
      gameOver = true;
    }

    // Movimiento paletas
    if(keys['w'] && leftY > 0) leftY -= 6;
    if(keys['s'] && leftY < canvas.height - paddleHeight) leftY += 6;
    if(keys['ArrowUp'] && rightY > 0) rightY -= 6;
    if(keys['ArrowDown'] && rightY < canvas.height - paddleHeight) rightY += 6;

    requestAnimationFrame(draw);
  }

  function resetBall(){
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
  }

  draw();
}
