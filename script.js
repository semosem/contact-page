(() => {
  const dom = {
    soundButton: document.getElementById("soundButton"),
    slider: document.getElementById("slider"),
    resume: document.getElementById("resume"),
    background: document.getElementById("background"),
    gifContainer: document.getElementById("gif-container"),
    cvIcon: document.getElementById("cv-icon"),
    cvDropdown: document.getElementById("cv-dropdown"),
    terminalInput: document.getElementById("terminal-input"),
    terminalOutput: document.getElementById("terminal-output"),
    canvas: document.getElementById("matrix-rain"),
    title: document.querySelector("h1"),
  };

  const required = [
    "soundButton",
    "slider",
    "resume",
    "background",
    "gifContainer",
    "cvIcon",
    "cvDropdown",
    "terminalInput",
    "terminalOutput",
    "canvas",
  ];

  const missing = required.filter((key) => !dom[key]);
  if (missing.length) {
    console.warn(`Missing required elements: ${missing.join(", ")}`);
    return;
  }

  const ctx = dom.canvas.getContext("2d");
  if (!ctx) {
    console.warn("Canvas context unavailable");
    return;
  }

  const rootStyle = document.documentElement.style;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const SETTINGS = {
    sliderMax: Number(dom.slider.max) || 100,
    sliderStep: 10,
    maxGifs: 18,
    matrixFontSize: 12,
    rainInterval: 33,
    glitchInterval: 3000,
  };

  const MATRIX_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

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

  const KONAMI_CODE = [
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

  const state = {
    isPlaying: false,
    intensity: 0,
    easedIntensity: 0,
    rainSpeed: 1,
    trailAlpha: 0.08,
    glitchStrength: 0.1,
    drops: [],
    konamiIndex: 0,
  };

  const gifPool = [];

  const audio = new Audio("./mixkit-double-little-bird-chirp-21.wav");
  audio.loop = true;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const setSoundButtonState = (playing) => {
    dom.soundButton.textContent = playing ? "🔇" : "🐦🌿";
    dom.soundButton.setAttribute("aria-pressed", String(playing));
    dom.soundButton.setAttribute(
      "aria-label",
      playing ? "Mute ambient birds" : "Play ambient birds"
    );
  };

  const playBirdSound = () => {
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
      alert(
        "There was an error playing the audio. Please check your browser settings or try again."
      );
    });
  };

  const toggleSound = () => {
    state.isPlaying = !state.isPlaying;
    if (state.isPlaying) {
      playBirdSound();
    } else {
      audio.pause();
    }
    setSoundButtonState(state.isPlaying);
  };

  const setBodyShake = (enabled) => {
    document.body.classList.toggle("shake", enabled);
    document.body.style.animationDuration = enabled
      ? `${clamp(0.6 - state.easedIntensity * 0.4, 0.18, 0.6)}s`
      : "";
  };

  const updateContent = () => {
    const value = Number(dom.slider.value);
    state.intensity = clamp(value / SETTINGS.sliderMax, 0, 1);
    state.easedIntensity = Math.pow(state.intensity, 1.35);

    const stepIndex = Math.floor(value / SETTINGS.sliderStep);
    const index =
      value === SETTINGS.sliderMax
        ? resumeContent.length
        : Math.min(resumeContent.length - 1, stepIndex);

    const resumeText = resumeContent[index] ?? "undefined";
    dom.resume.textContent = resumeText;
    dom.resume.dataset.text = resumeText;

    const hue = 115 + state.intensity * 50;
    if (dom.title) {
      dom.title.style.textShadow = `0 0 ${10 + state.easedIntensity * 22}px #0f0`;
    }

    dom.background.style.opacity = 0.35 + state.intensity * 0.4;
    dom.background.style.background = `radial-gradient(ellipse at center, hsl(${hue}, 100%, 45%) 0%, #000 70%)`;
    dom.resume.style.letterSpacing = `${0.2 + state.easedIntensity * 1.1}px`;
    dom.resume.style.textShadow = `0 0 ${8 + state.easedIntensity * 18}px rgba(0, 255, 106, ${
      0.45 + state.easedIntensity * 0.35
    })`;
    dom.resume.style.filter = `drop-shadow(0 0 ${
      6 + state.easedIntensity * 12
    }px rgba(0, 255, 106, ${0.3 + state.easedIntensity * 0.4}))`;
    dom.resume.style.textTransform = value > 80 ? "uppercase" : "none";

    setBodyShake(value > 45 && !prefersReducedMotion);

    const shouldRotate = value > 55 && !prefersReducedMotion;
    dom.resume.classList.toggle("rotate", shouldRotate);
    dom.resume.style.animationDuration = shouldRotate
      ? `${clamp(140 - state.easedIntensity * 80, 40, 140)}s`
      : "";

    const fillColor =
      value > 75 ? "#ff4d4d" : value > 55 ? "#ffe066" : "#00ff6a";
    dom.slider.style.background = `linear-gradient(90deg, ${fillColor} 0%, ${fillColor} ${value}%, rgba(0, 255, 106, 0.2) ${value}%, rgba(0, 255, 106, 0.2) 100%)`;

    rootStyle.setProperty(
      "--scanline-opacity",
      String(0.12 + state.easedIntensity * 0.28)
    );
    rootStyle.setProperty(
      "--matrix-opacity",
      String(0.45 + state.easedIntensity * 0.45)
    );
    dom.canvas.style.opacity = String(0.45 + state.easedIntensity * 0.45);

    state.rainSpeed = 0.6 + state.easedIntensity * 2.2;
    state.trailAlpha = clamp(0.14 - state.easedIntensity * 0.09, 0.04, 0.14);
    state.glitchStrength = 0.08 + state.easedIntensity * 0.25;

    updateGifs();

    if (value === SETTINGS.sliderMax) {
      document.body.style.animation = prefersReducedMotion
        ? ""
        : "shake 0.1s infinite";
      dom.resume.style.fontSize = "2em";
      dom.resume.style.color = "#ff4d4d";
      dom.resume.style.textShadow = "0 0 10px #fff";
      dom.resume.style.filter = "";
    } else {
      document.body.style.animation = "";
      dom.resume.style.fontSize = "";
      dom.resume.style.color = "";
      dom.resume.style.textShadow = "";
      dom.resume.style.filter = "";
    }
  };

  const ensureGifPool = () => {
    if (gifPool.length) return;

    for (let i = 0; i < SETTINGS.maxGifs; i += 1) {
      const gif = document.createElement("img");
      gif.src = gifs[i % gifs.length];
      gif.className = "gif";
      gif.loading = "lazy";
      gif.decoding = "async";
      dom.gifContainer.appendChild(gif);
      gifPool.push(gif);
      randomizeGif(gif, true);
    }
  };

  const updateGifs = () => {
    ensureGifPool();

    const targetCount = Math.round(
      Math.pow(state.intensity, 1.6) * SETTINGS.maxGifs
    );
    const opacity = Math.min(1, 0.15 + state.intensity * 1.2);

    gifPool.forEach((gif, index) => {
      if (index < targetCount) {
        gif.style.opacity = String(opacity);
        gif.style.transform = `scale(${0.85 + state.easedIntensity * 0.4})`;
        if (state.intensity > 0.7 && Math.random() < 0.12) {
          randomizeGif(gif);
        }
      } else {
        gif.style.opacity = "0";
      }
    });
  };

  const randomizeGif = (gif, initial = false) => {
    const size = 200 + Math.random() * 180;
    gif.style.left = `${Math.random() * 90}%`;
    gif.style.top = `${Math.random() * 85}%`;
    gif.style.width = `${size}px`;
    gif.style.height = "auto";
    if (initial) {
      gif.style.transform = "scale(0.9)";
    }
  };

  const handleKeydown = (event) => {
    const isTyping = document.activeElement === dom.terminalInput;

    if (!isTyping && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
      const delta = event.key === "ArrowRight" ? SETTINGS.sliderStep : -SETTINGS.sliderStep;
      const next = clamp(Number(dom.slider.value) + delta, 0, SETTINGS.sliderMax);
      dom.slider.value = String(next);
      updateContent();
    }

    if (!isTyping && (event.key === "c" || event.key === "C")) {
      toggleCvDropdown();
    }

    if (!isTyping) {
      handleKonami(event.key);
    }
  };

  const handleKonami = (key) => {
    if (key === KONAMI_CODE[state.konamiIndex]) {
      state.konamiIndex += 1;
      if (state.konamiIndex === KONAMI_CODE.length) {
        activateEasterEgg();
        state.konamiIndex = 0;
      }
    } else {
      state.konamiIndex = 0;
    }
  };

  const resizeCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    dom.canvas.width = window.innerWidth * dpr;
    dom.canvas.height = window.innerHeight * dpr;
    dom.canvas.style.width = `${window.innerWidth}px`;
    dom.canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const columns = Math.floor(window.innerWidth / SETTINGS.matrixFontSize);
    state.drops = Array(columns).fill(1);
  };

  const drawMatrixRain = () => {
    ctx.fillStyle = `rgba(0, 0, 0, ${state.trailAlpha})`;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.fillStyle = "#00ff6a";
    ctx.font = `${SETTINGS.matrixFontSize}px "Share Tech Mono", monospace`;

    for (let i = 0; i < state.drops.length; i += 1) {
      const text = MATRIX_CHARS.charAt(
        Math.floor(Math.random() * MATRIX_CHARS.length)
      );
      ctx.fillText(text, i * SETTINGS.matrixFontSize, state.drops[i] * SETTINGS.matrixFontSize);

      if (
        state.drops[i] * SETTINGS.matrixFontSize > window.innerHeight &&
        Math.random() > 0.985 - state.easedIntensity * 0.02
      ) {
        state.drops[i] = 0;
      }
      state.drops[i] += state.rainSpeed;
    }
  };

  const toggleCvDropdown = () => {
    const isOpen = dom.cvDropdown.classList.contains("active");
    dom.cvDropdown.classList.toggle("active", !isOpen);
    dom.cvIcon.setAttribute("aria-expanded", String(!isOpen));

    if (!isOpen) {
      dom.cvDropdown.querySelectorAll("li").forEach((item, index) => {
        setTimeout(() => animateMatrix(item), index * 500);
      });
    }
  };

  const animateMatrix = (element) => {
    const originalText = element.dataset.originalText || element.innerText;
    element.dataset.originalText = originalText;
    element.innerText = "";
    let i = 0;

    const addChar = () => {
      if (i < originalText.length) {
        element.innerText += originalText.charAt(i);
        i += 1;
        setTimeout(addChar, 50);
      }
    };

    addChar();
  };

  const pulseCVIcon = () => {
    dom.cvIcon.animate(
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
  };

  const glitchEffect = () => {
    if (!dom.title) return;

    const glitchText = dom.title.innerText;
    let glitchedText = "";

    for (let i = 0; i < glitchText.length; i += 1) {
      if (Math.random() < state.glitchStrength) {
        glitchedText += String.fromCharCode(33 + Math.floor(Math.random() * 94));
      } else {
        glitchedText += glitchText[i];
      }
    }

    dom.title.innerText = glitchedText;
    setTimeout(() => {
      dom.title.innerText = glitchText;
    }, 100);
  };

  const activateEasterEgg = () => {
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
        i += 1;
      } else {
        clearInterval(intervalId);
        setTimeout(() => {
          document.body.removeChild(easterEggElement);
        }, 3000);
      }
    }, 100);
  };

  const appendTerminalLine = (text, className, preformatted = false) => {
    const line = document.createElement("div");
    if (className) line.className = className;
    if (preformatted) line.style.whiteSpace = "pre-wrap";
    line.textContent = text;
    dom.terminalOutput.appendChild(line);
  };

  const appendPromptLine = (text) => {
    const line = document.createElement("div");
    const prompt = document.createElement("span");
    prompt.className = "prompt";
    prompt.textContent = "$";
    line.appendChild(prompt);
    line.append(` ${text}`);
    dom.terminalOutput.appendChild(line);
  };

  const terminalResponses = {
    help: "Available commands: help, skills, quote, projects, contact, clear",
    skills:
      "Skills: JavaScript, TypeScript, React, Vue.js, Node.js, Angular, HTML5, CSS3, Git, RESTful APIs, GraphQL",
    quote:
      "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
    projects: "https://github.com/semosem",
    contact: "Contact: dwell.sem@gmail.com",
  };

  const handleTerminalEnter = (event) => {
    if (event.key !== "Enter") return;

    const command = dom.terminalInput.value.trim();
    if (!command) return;

    appendPromptLine(command);

    const normalized = command.toLowerCase();
    if (normalized === "clear") {
      dom.terminalOutput.replaceChildren();
      dom.terminalInput.value = "";
      return;
    }

    const response = terminalResponses[normalized];
    appendTerminalLine(
      response || "Command not recognized. Type 'help' for available commands.",
      "terminal-line"
    );

    dom.terminalInput.value = "";
    dom.terminalOutput.scrollTop = dom.terminalOutput.scrollHeight;
  };

  const bindSkillPills = () => {
    document.querySelectorAll(".skill-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        const skill = pill.textContent;
        const details = `[INFO] Analyzing Skill: ${skill}\n============================\nExperience Level: Strong`;

        appendTerminalLine(`skill --explore ${skill}`, "terminal-line");
        appendTerminalLine(details, "terminal-info", true);
        dom.terminalOutput.scrollTop = dom.terminalOutput.scrollHeight;
      });
    });
  };

  dom.soundButton.addEventListener("click", toggleSound);
  dom.slider.addEventListener("input", updateContent);
  dom.terminalInput.addEventListener("keydown", handleTerminalEnter);

  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("click", (event) => {
    if (!dom.cvIcon.contains(event.target) && !dom.cvDropdown.contains(event.target)) {
      dom.cvDropdown.classList.remove("active");
      dom.cvIcon.setAttribute("aria-expanded", "false");
    }
  });

  dom.cvIcon.addEventListener("click", toggleCvDropdown);
  dom.cvIcon.addEventListener("mouseover", () => {
    dom.cvIcon.querySelector("svg").style.fill = "#00ff6a";
    dom.cvIcon.style.transform = "scale(1.1)";
    dom.cvIcon.style.transition = "all 0.3s ease";
  });
  dom.cvIcon.addEventListener("mouseout", () => {
    dom.cvIcon.querySelector("svg").style.fill = "#00ff6a";
    dom.cvIcon.style.transform = "scale(1)";
  });

  setSoundButtonState(state.isPlaying);
  bindSkillPills();
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  drawMatrixRain();

  if (!prefersReducedMotion) {
    setInterval(drawMatrixRain, SETTINGS.rainInterval);
    setInterval(glitchEffect, SETTINGS.glitchInterval);
    pulseCVIcon();
  }

  updateContent();
})();
