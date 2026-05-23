const canvas = document.getElementById("particles");

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];

for(let i=0;i<80;i++){

  particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    r:Math.random()*2,
    speed:Math.random()*0.5+0.2
  });
}

function animate(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  particles.forEach(p=>{

    ctx.beginPath();

    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);

    ctx.fillStyle = "rgba(100,180,255,.6)";

    ctx.fill();

    p.y -= p.speed;

    if(p.y < 0){
      p.y = canvas.height;
    }
  });

  requestAnimationFrame(animate);
}

animate();