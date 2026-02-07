const soundButton = document.getElementById("soundButton");
const slider = document.getElementById("slider");
const resumeElement = document.getElementById("resume");
const backgroundElement = document.getElementById("background");
const gifContainer = document.getElementById("gif-container");
const cvIcon = document.getElementById("cv-icon");
const cvDropdown = document.getElementById("cv-dropdown");
const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");
const titleElement = document.querySelector("h1");

let isPlaying = false;

const audio = new Audio("./mixkit-double-little-bird-chirp-21.wav");
audio.loop = true;

const resumeContent = [
  "Extensive expertise in diverse, team-oriented software engineering projects",
  "In-depth understanding of ReactJS, VueJS, NodeJS, and Angular, with a track record of developing robust applications in each.",
  "Complimented for my git commits being precise and well-documented, ensuring easy collaboration and maintenance.",
  "Expert at identifying and fixing bugs, with a proactive approach to problem-solving.",
  "Strong grasp of Component-based UIs, HTML DOM tree, render tree, and critical rendering path, ensuring optimal performance and user experience.",
  "8+ years of proven experience in building TypeScript and JavaScript web services and web development. Successfully led projects that improved system efficiency by 30%.",
  "Fast and efficient coding skills, consistently delivering high-quality work ahead of deadlines.",
  "My code is optimized for performance, resulting in fast and reliable applications.",
];

const gifs = [
  "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif",
  "https://media.giphy.com/media/ukMiDlCmdv2og/giphy.gif",
  "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
  "https://media.giphy.com/media/l3q2zbskZp2j8wniE/giphy.gif",
  "https://media.giphy.com/media/BmmfETghGOPrW/giphy.gif",
  "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif",
  "https://media.giphy.com/media/3o7btNa0RUYa5E7iiQ/giphy.gif",
  "https://media.giphy.com/media/WFZvB7VIXBgiz3oDXE/giphy.gif",
  "https://media.giphy.com/media/3ornk57KwDXf81rjWM/giphy.gif",
  "https://media.giphy.com/media/3o7qE1YN7aBOFPRw8E/giphy.gif",
];

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function clampIndex(value, length) {
  return Math.max(0, Math.min(length - 1, value));
}

function setSoundButtonState(playing) {
  soundButton.textContent = playing ? "🔇" : "🐦🌿";
  soundButton.setAttribute("aria-pressed", String(playing));
  soundButton.setAttribute(
    "aria-label",
    playing ? "Mute ambient birds" : "Play ambient birds"
  );
}

function playBirdSound() {
  audio.play().catch((e) => {
    console.error("Error playing audio:", e);
    alert(
      "There was an error playing the audio. Please check your browser settings or try again."
    );
  });
}

function stopSound() {
  audio.pause();
}

function toggleSound() {
  if (isPlaying) {
    stopSound();
    isPlaying = false;
  } else {
    playBirdSound();
    isPlaying = true;
  }
  setSoundButtonState(isPlaying);
}

soundButton.addEventListener("click", toggleSound);
setSoundButtonState(isPlaying);

function updateContent() {
  const value = parseInt(slider.value, 10);
  const index = clampIndex(
    Math.floor(value / (100 / resumeContent.length)),
    resumeContent.length
  );

  resumeElement.textContent = resumeContent[index];

  const hue = 115 + (value / 100) * 50;
  if (titleElement) {
    titleElement.style.textShadow = `0 0 ${value / 2}px #0f0`;
  }
  backgroundElement.style.opacity = 0.35 + (value / 100) * 0.4;
  backgroundElement.style.background = `radial-gradient(ellipse at center, hsl(${hue}, 100%, 45%) 0%, #000 70%)`;

  if (value > 50) {
    document.body.classList.add("shake");
    resumeElement.classList.add("rotate");
    slider.style.background = "linear-gradient(90deg, #00ff6a, #ff0, #f00)";
  } else {
    document.body.classList.remove("shake");
    resumeElement.classList.remove("rotate");
    slider.style.background = "linear-gradient(90deg, #00ff6a, #00ffa8)";
  }

  updateGifs(value);

  if (value === 100) {
    document.body.style.animation = prefersReducedMotion
      ? ""
      : "shake 0.1s infinite";
    resumeElement.style.fontSize = "2em";
    resumeElement.style.color = "#ff4d4d";
    resumeElement.style.textShadow = "0 0 10px #fff";
  } else {
    document.body.style.animation = "";
    resumeElement.style.fontSize = "";
    resumeElement.style.color = "";
    resumeElement.style.textShadow = "";
  }
}

function updateGifs(value) {
  const numGifs = Math.floor(value / 10);
  gifContainer.innerHTML = "";

  for (let i = 0; i < numGifs; i++) {
    const gif = document.createElement("img");
    gif.src = gifs[i % gifs.length];
    gif.className = "gif";
    gif.style.left = `${Math.random() * 90}%`;
    gif.style.top = `${Math.random() * 90}%`;
    gif.style.width = `${250 + Math.random() * 100}px`;
    gif.style.height = "auto";
    gif.style.opacity = Math.min(1, value / 50);
    gifContainer.appendChild(gif);
  }
}

slider.addEventListener("input", updateContent);

document.addEventListener("keydown", (e) => {
  const isTyping = document.activeElement === terminalInput;

  if (!isTyping && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
    const delta = e.key === "ArrowRight" ? 10 : -10;
    const next = Math.max(0, Math.min(100, parseInt(slider.value, 10) + delta));
    slider.value = next;
    updateContent();
  }

  if (!isTyping && (e.key === "c" || e.key === "C")) {
    toggleCvDropdown();
  }

  if (isTyping) return;

  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      activateEasterEgg();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

const canvas = document.getElementById("matrix-rain");
const ctx = canvas.getContext("2d");
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const fontSize = 12;
let drops = [];

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const columns = Math.floor(window.innerWidth / fontSize);
  drops = Array(columns).fill(1);
}

function drawMatrixRain() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  ctx.fillStyle = "#00ff6a";
  ctx.font = `${fontSize}px \"Share Tech Mono\", monospace`;

  for (let i = 0; i < drops.length; i++) {
    const text = characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > window.innerHeight && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
drawMatrixRain();

if (!prefersReducedMotion) {
  setInterval(drawMatrixRain, 33);
}

function toggleCvDropdown() {
  const isOpen = cvDropdown.classList.contains("active");
  cvDropdown.classList.toggle("active", !isOpen);
  cvIcon.setAttribute("aria-expanded", String(!isOpen));

  if (!isOpen) {
    const listItems = cvDropdown.querySelectorAll("li");
    listItems.forEach((item, index) => {
      setTimeout(() => animateMatrix(item), index * 500);
    });
  }
}

cvIcon.addEventListener("click", toggleCvDropdown);

function animateMatrix(element) {
  const originalText = element.dataset.originalText || element.innerText;
  element.dataset.originalText = originalText;
  element.innerText = "";
  let i = 0;

  function addChar() {
    if (i < originalText.length) {
      element.innerText += originalText.charAt(i);
      i++;
      setTimeout(addChar, 50);
    }
  }

  addChar();
}

document.addEventListener("click", (event) => {
  if (!cvIcon.contains(event.target) && !cvDropdown.contains(event.target)) {
    cvDropdown.classList.remove("active");
    cvIcon.setAttribute("aria-expanded", "false");
  }
});

cvIcon.addEventListener("mouseover", () => {
  cvIcon.querySelector("svg").style.fill = "#00ff6a";
  cvIcon.style.transform = "scale(1.1)";
  cvIcon.style.transition = "all 0.3s ease";
});

cvIcon.addEventListener("mouseout", () => {
  cvIcon.querySelector("svg").style.fill = "#00ff6a";
  cvIcon.style.transform = "scale(1)";
});

function pulseCVIcon() {
  cvIcon.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.05)" },
      { transform: "scale(1)" },
    ],
    {
      duration: 2000,
      iterations: Infinity,
    }
  );
}

if (!prefersReducedMotion) {
  pulseCVIcon();
}

function glitchEffect() {
  if (!titleElement) return;

  const glitchText = titleElement.innerText;
  let glitchedText = "";

  for (let i = 0; i < glitchText.length; i++) {
    if (Math.random() > 0.9) {
      glitchedText += String.fromCharCode(33 + Math.floor(Math.random() * 94));
    } else {
      glitchedText += glitchText[i];
    }
  }

  titleElement.innerText = glitchedText;

  setTimeout(() => {
    titleElement.innerText = glitchText;
  }, 100);
}

if (!prefersReducedMotion) {
  setInterval(glitchEffect, 3000);
}

let konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
let konamiIndex = 0;

function activateEasterEgg() {
  const easterEggText = "YOU'VE UNLOCKED THE MATRIX!";
  const easterEggElement = document.createElement("div");
  easterEggElement.style.position = "fixed";
  easterEggElement.style.top = "50%";
  easterEggElement.style.left = "50%";
  easterEggElement.style.transform = "translate(-50%, -50%)";
  easterEggElement.style.fontSize = "3em";
  easterEggElement.style.color = "#00ff6a";
  easterEggElement.style.textShadow = "0 0 10px #00ff6a";
  easterEggElement.style.zIndex = "9999";

  document.body.appendChild(easterEggElement);

  let i = 0;
  const intervalId = setInterval(() => {
    if (i < easterEggText.length) {
      easterEggElement.textContent += easterEggText[i];
      i++;
    } else {
      clearInterval(intervalId);
      setTimeout(() => {
        document.body.removeChild(easterEggElement);
      }, 3000);
    }
  }, 100);
}

function appendTerminalLine(text, className, preformatted = false) {
  const line = document.createElement("div");
  if (className) line.className = className;
  if (preformatted) line.style.whiteSpace = "pre-wrap";
  line.textContent = text;
  terminalOutput.appendChild(line);
}

function appendPromptLine(text) {
  const line = document.createElement("div");
  const prompt = document.createElement("span");
  prompt.className = "prompt";
  prompt.textContent = "$";
  line.appendChild(prompt);
  line.append(` ${text}`);
  terminalOutput.appendChild(line);
}

terminalInput.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  const command = terminalInput.value.trim();
  if (!command) return;

  appendPromptLine(command);

  const normalized = command.toLowerCase();
  switch (normalized) {
    case "help":
      appendTerminalLine(
        "Available commands: help, skills, quote, projects, contact, clear",
        "terminal-line"
      );
      break;
    case "skills":
      appendTerminalLine(
        "Skills: JavaScript, TypeScript, React, Vue.js, Node.js, Angular, HTML5, CSS3, Git, RESTful APIs, GraphQL",
        "terminal-line"
      );
      break;
    case "quote":
      appendTerminalLine(
        "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
        "terminal-line"
      );
      break;
    case "projects":
      appendTerminalLine("https://github.com/semosem", "terminal-line");
      break;
    case "contact":
      appendTerminalLine("Contact: dwell.sem@gmail.com", "terminal-line");
      break;
    case "clear":
      terminalOutput.replaceChildren();
      terminalInput.value = "";
      return;
    default:
      appendTerminalLine(
        "Command not recognized. Type 'help' for available commands.",
        "terminal-line"
      );
  }

  terminalInput.value = "";
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
});

const skillPills = document.querySelectorAll(".skill-pill");
skillPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    const skill = pill.textContent;
    const details = `[INFO] Analyzing Skill: ${skill}\n============================\nExperience Level: Strong`;

    appendTerminalLine(`skill --explore ${skill}`, "terminal-line");
    appendTerminalLine(details, "terminal-info", true);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  });
});

updateContent();
