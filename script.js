const resumeContent = [
  "Extensive expertise in diverse, team-oriented software engineering projects",
  "In-depth understanding of ReactJS, VueJS, NodeJS, and Angular, with a track record of developing robust applications in each.",
  "Complemeted for my git commits to be precise and well-documented, ensuring easy collaboration and maintenance.",
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

const slider = document.getElementById("slider");
const resumeElement = document.getElementById("resume");
const backgroundElement = document.getElementById("background");
const gifContainer = document.getElementById("gif-container");
const cvIcon = document.getElementById("cv-icon");
const cvDropdown = document.getElementById("cv-dropdown");
const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");

function updateContent() {
  const value = parseInt(slider.value);
  const index = Math.floor(value / 10);

  resumeElement.innerHTML = resumeContent[index];

  const hue = 120 + (value / 100) * 60;
  document.querySelector("h1").style.textShadow = `0 0 ${value / 2}px #0f0`;
  backgroundElement.style.opacity = 0.3 + (value / 100) * 0.4;
  backgroundElement.style.background = `radial-gradient(ellipse at center, hsl(${hue}, 100%, 50%) 0%, #000 70%)`;

  if (value > 50) {
    document.body.classList.add("shake");
    resumeElement.classList.add("rotate");
    slider.style.background = "linear-gradient(90deg, #0f0, #ff0, #f00)";
  } else {
    document.body.classList.remove("shake");
    resumeElement.classList.remove("rotate");
    slider.style.background = "#0f0";
  }

  updateGifs(value);

  if (value === 100) {
    document.body.style.animation = "shake 0.1s infinite";
    resumeElement.style.fontSize = "2em";
    resumeElement.style.color = "red";
    resumeElement.style.textShadow = "0 0 10px #fff";
  } else {
    document.body.style.animation = "";
    resumeElement.style.fontSize = "1.5em";
    resumeElement.style.color = "#0f0";
    resumeElement.style.textShadow = "none";
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
  if (e.key === "ArrowRight") {
    slider.value = Math.min(100, parseInt(slider.value) + 10);
  } else if (e.key === "ArrowLeft") {
    slider.value = Math.max(0, parseInt(slider.value) - 10);
  }
  updateContent();
});

const canvas = document.getElementById("matrix-rain");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const fontSize = 10;
const columns = canvas.width / fontSize;

const drops = [];
for (let i = 0; i < columns; i++) {
  drops[i] = 1;
}

function drawMatrixRain() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0f0";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawMatrixRain, 33);

function toggleCvDropdown() {
  console.log("cv icon clicked", cvDropdown.classList.toggle("active"));

  if (cvDropdown.style.display === "none" || cvDropdown.style.display === "") {
    cvDropdown.style.display = "block";
    const listItems = cvDropdown.querySelectorAll("li");
    listItems.forEach((item, index) => {
      setTimeout(() => animateMatrix(item), index * 500);
    });
  } else {
    cvDropdown.style.display = "none";
  }
}

cvIcon.addEventListener("click", toggleCvDropdown);

function animateMatrix(element) {
  const text = element.innerText;
  element.innerText = "";
  let i = 0;

  function addChar() {
    if (i < text.length) {
      element.innerText += text.charAt(i);
      i++;
      setTimeout(addChar, 50);
    }
  }

  addChar();
}

document.addEventListener("click", (event) => {
  if (!cvIcon.contains(event.target) && !cvDropdown.contains(event.target)) {
    cvDropdown.style.display = "none";
  }
});

cvIcon.addEventListener("mouseover", () => {
  cvIcon.querySelector("svg").style.fill = "#00ff00";
  cvIcon.style.transform = "scale(1.1)";
  cvIcon.style.transition = "all 0.3s ease";
});

cvIcon.addEventListener("mouseout", () => {
  cvIcon.querySelector("svg").style.fill = "#0f0";
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

pulseCVIcon();

updateContent();

////////////////////////////////////////

function glitchEffect() {
  const title = document.querySelector("h1");
  const glitchText = title.innerText;
  let glitchedText = "";

  for (let i = 0; i < glitchText.length; i++) {
    if (Math.random() > 0.9) {
      glitchedText += String.fromCharCode(33 + Math.floor(Math.random() * 94));
    } else {
      glitchedText += glitchText[i];
    }
  }

  title.innerText = glitchedText;

  setTimeout(() => {
    title.innerText = glitchText;
  }, 100);
}

setInterval(glitchEffect, 3000);

document.addEventListener("keydown", (e) => {
  if (e.key === "c" || e.key === "C") {
    toggleCvDropdown();
  }
});

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

document.addEventListener("keydown", (e) => {
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

function activateEasterEgg() {
  const easterEggText = "YOU'VE UNLOCKED THE MATRIX!";
  const easterEggElement = document.createElement("div");
  easterEggElement.style.position = "fixed";
  easterEggElement.style.top = "50%";
  easterEggElement.style.left = "50%";
  easterEggElement.style.transform = "translate(-50%, -50%)";
  easterEggElement.style.fontSize = "3em";
  easterEggElement.style.color = "#00ff00";
  easterEggElement.style.textShadow = "0 0 10px #00ff00";
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

cvIcon.addEventListener("click", toggleCvDropdown);

updateContent();

/////////////////////////////////////////////////

// Terminal functionality
terminalInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const command = terminalInput.value.trim().toLowerCase();
    terminalOutput.innerHTML += `<div><span class="prompt">$</span> ${command}</div>`;

    switch (command) {
      case "help":
        terminalOutput.innerHTML +=
          "<div>Available commands: help, skills, projects, contact, clear</div>";
        break;
      case "skills":
        terminalOutput.innerHTML +=
          "<div>Skills: JavaScript, TypeScript, React, Vue.js, Node.js, Angular, HTML5, CSS3, Git, RESTful APIs, GraphQl</div>";
        break;
      case "projects":
        terminalOutput.innerHTML +=
          "<div>Projects: [Project details coming soon]</div>";
        break;
      case "contact":
        terminalOutput.innerHTML += "<div>Contact: dwell.sem@gmail.com</div>";
        break;
      case "clear":
        terminalOutput.innerHTML = "";
        break;
      default:
        terminalOutput.innerHTML +=
          "<div>Command not recognized. Type 'help' for available commands.</div>";
    }

    terminalInput.value = "";
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
});

// Skill pills interactivity
const skillPills = document.querySelectorAll(".skill-pill");
skillPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    const skill = pill.textContent;
    terminalOutput.innerHTML += `<div><span class="prompt">$</span> skill ${skill}</div>`;
    terminalOutput.innerHTML += `<div>Skill selected: ${skill}</div>`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  });
});
