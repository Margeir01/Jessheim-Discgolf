console.log("JS is loaded");

document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".mobile-nav");

  // bare hvis nav faktisk finnes
  if (nav) {
    nav.classList.remove("open");
  }


      const gameEl = document.getElementById("runner-game");
  if (gameEl) {
    console.log("Runner game found, starting…");

    const player = document.getElementById("runner-player");
    const obstacle = document.getElementById("runner-obstacle");
    const msg = document.getElementById("runner-message");
    const restartBtn = document.getElementById("runner-restart");

    if (!player || !obstacle || !msg || !restartBtn) {
      console.warn("Runner elements mangler, sjekk ID-ene i 404.html");
      return;
    }

    let isJumping = false;
    let isGameOver = false;
    let score = 0;
    let intervalId = null;

    const baseSpeed = 1.3;   // startfart (sekunder per loop)
    const minSpeed  = 0.6;   // maks vanskelig (lavest verdi = raskest)
    let currentSpeed = baseSpeed;
    let hasScoredForThisObstacle = false;

    function setupObstacle() {
      hasScoredForThisObstacle = false;

      // tilfeldig høyde på hinder: 30–70 px
      const randomHeight = 30 + Math.random() * 40;
      obstacle.style.height = randomHeight + "px";

      // restart animasjon + sett fart
      obstacle.classList.remove("runner-moving");
      void obstacle.offsetWidth; // reset animasjon
      obstacle.style.animationDuration = currentSpeed + "s";
      obstacle.classList.add("runner-moving");
    }

    function startGame() {
      isGameOver = false;
      score = 0;
      currentSpeed = baseSpeed;
      msg.textContent = "Hopp over hindrene – trykk SPACE, ↑ eller klikk.";
      player.classList.remove("runner-jumping");

      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(gameLoop, 30);

      setupObstacle();
    }

    function endGame() {
      isGameOver = true;
      obstacle.classList.remove("runner-moving");
      if (intervalId) clearInterval(intervalId);
      msg.textContent = `Game over! Score: ${score}`;
    }

    function jump() {
      if (isJumping || isGameOver) return;
      isJumping = true;
      player.classList.add("runner-jumping");
      setTimeout(() => {
        player.classList.remove("runner-jumping");
        isJumping = false;
      }, 450);
    }

    function gameLoop() {
      const playerRect   = player.getBoundingClientRect();
      const obstacleRect = obstacle.getBoundingClientRect();
      const gameRect     = gameEl.getBoundingClientRect();

      // enkel kollisjons-sjekk
      const overlapX =
        obstacleRect.left < playerRect.right &&
        obstacleRect.right > playerRect.left;

      const overlapY =
        obstacleRect.bottom > playerRect.top &&
        obstacleRect.top < playerRect.bottom;

      if (overlapX && overlapY) {
        endGame();
        return;
      }

      // SCORE: kun én gang per hinder
      if (
        !hasScoredForThisObstacle &&
        obstacleRect.right < playerRect.left &&
        !isGameOver
      ) {
        hasScoredForThisObstacle = true;
        score += 1;
        msg.textContent = `Score: ${score}`;

        // øk vanskelighetsgrad: kortere varighet = raskere hinder
        currentSpeed = Math.max(minSpeed, baseSpeed - score * 0.01);
      }

      // når hinderet er gått godt ut av bildet til venstre → nytt hinder
      if (obstacleRect.right < gameRect.left - 60 && !isGameOver) {
        setupObstacle();
      }
    }

    // kontroller
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (isGameOver) {
          startGame();
        } else {
          jump();
        }
      }
    });

    gameEl.addEventListener("click", () => {
      if (isGameOver) {
        startGame();
      } else {
        jump();
      }
    });

    restartBtn.addEventListener("click", () => {
      startGame();
    });

    // auto-start når 404 lastes
    startGame();
  }



    const here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".mobile-nav .nav-link").forEach(a => {
        const href = a.getAttribute("href");
        if (href === here) a.classList.add("active");
    });

    burger.addEventListener("click", () => {
        console.log("burger klikket");
        nav.classList.toggle("open");
        burger.classList.toggle("active");
    });
});

// Tema: last lagret valg, ellers følg system
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light' || savedTheme === 'dark') {
  root.setAttribute('data-theme', savedTheme);
}

// Toggle-knapp
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    // hvis manuelt satt → bytt
    if (current === 'dark') {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      themeBtn.textContent = '🌙 Tema';
    } else if (current === 'light') {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeBtn.textContent = '☀️ Tema';
    } else {
      // ikke manuelt satt enda: finn systemets og sett motsatt
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const next = prefersDark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      themeBtn.textContent = next === 'dark' ? '☀️ Tema' : '🌙 Tema';
    }
  });

  // Sett riktig ikon ved load
  const effective = root.getAttribute('data-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  themeBtn.textContent = effective === 'dark' ? '☀️ Tema' : '🌙 Tema';
}
