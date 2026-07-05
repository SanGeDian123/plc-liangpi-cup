(function () {
  const canvas = document.getElementById("particles");

  if (!canvas) {
    return;
  }

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");

  if (prefersReducedMotion?.matches) {
    canvas.hidden = true;
    return;
  }

  const ctx = canvas.getContext("2d", {
    alpha: true
  });
  const particles = [];
  const isCoarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches;
  let animationFrame = 0;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;

  function getParticleCount() {
    if (window.innerWidth <= 520 || isCoarsePointer) {
      return 28;
    }

    if (window.innerWidth <= 900) {
      return 44;
    }

    return 64;
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.38 + 0.12
    };
  }

  function resizeCanvas() {
    width = Math.max(1, window.innerWidth);
    height = Math.max(1, window.innerHeight);
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const targetCount = getParticleCount();

    while (particles.length < targetCount) {
      particles.push(createParticle());
    }

    particles.length = targetCount;
  }

  function draw() {
    animationFrame = 0;

    if (document.hidden) {
      return;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(100,180,255,.5)";

    particles.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fill();

      particle.y -= particle.speed;

      if (particle.y < -particle.r) {
        particle.y = height + particle.r;
        particle.x = Math.random() * width;
      }
    });

    animationFrame = window.requestAnimationFrame(draw);
  }

  function start() {
    if (!animationFrame && !document.hidden) {
      animationFrame = window.requestAnimationFrame(draw);
    }
  }

  function stop() {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  }

  resizeCanvas();
  start();

  window.addEventListener("resize", () => {
    resizeCanvas();
    start();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });
})();
