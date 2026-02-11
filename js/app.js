import { SETTINGS, RESUME_CONTENT, GIFS, KONAMI_CODE, MATRIX_CHARS } from "./data.js";
import { createSliderController } from "./modules/slider.js";
import { createContentController } from "./modules/content.js";
import { createMatrixAudio } from "./modules/audio.js";

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
  sliderSignal: document.querySelector("[data-hud=\"signal\"]"),
  sliderMode: document.querySelector("[data-hud=\"mode\"]"),
  sliderHud: document.getElementById("slider-hud"),
  glitchGrid: document.getElementById("glitch-grid"),
  perfGauge: document.getElementById("perf-gauge"),
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
} else {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const initKeyboardHint = () => {
    const hint = document.getElementById("keyboard-hint");
    if (!hint || prefersReducedMotion) return null;
    if (hint.dataset.split === "true") return { hint };
    const text = hint.textContent || "";
    if (!text.trim()) return null;
    hint.textContent = "";
    hint.classList.add("hint-scatter");
    const fragment = document.createDocumentFragment();
    Array.from(text).forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      if (char === " ") span.classList.add("space");
      fragment.appendChild(span);
    });
    hint.appendChild(fragment);
    hint.dataset.split = "true";
    return { hint };
  };

  const isMobile = window.matchMedia(
    "(max-width: 900px), (max-height: 700px)"
  ).matches;

  if (isMobile) {
    document.body.classList.add("perf-mobile");
  }

  const tunedSettings = isMobile
    ? {
        ...SETTINGS,
        maxGifs: Math.min(8, SETTINGS.maxGifs),
        rainInterval: Math.max(45, SETTINGS.rainInterval),
      }
    : SETTINGS;

  const hintState = initKeyboardHint();
  let hintTimer = null;
  let hintArmed = true;
  const setScatterVars = () => {
    if (!hintState?.hint) return;
    const spans = hintState.hint.querySelectorAll("span");
    spans.forEach((span, index) => {
      const scatterX = (Math.random() * 2 - 1) * 28;
      const scatterY = (Math.random() * 2 - 1) * 16;
      const scatterR = (Math.random() * 2 - 1) * 14;
      span.style.setProperty("--scatter-x", `${scatterX.toFixed(1)}px`);
      span.style.setProperty("--scatter-y", `${scatterY.toFixed(1)}px`);
      span.style.setProperty("--scatter-r", `${scatterR.toFixed(1)}deg`);
      span.style.animationDelay = `${index * 18}ms`;
    });
  };
  const playHintAssemble = () => {
    if (!hintState?.hint) return;
    setScatterVars();
    hintState.hint.classList.remove("hint-animate");
    void hintState.hint.offsetWidth;
    hintState.hint.classList.add("hint-animate");
  };
  const scheduleHint = (delay = 5000) => {
    if (!hintState?.hint) return;
    if (hintTimer) clearTimeout(hintTimer);
    hintTimer = window.setTimeout(() => {
      if (!hintArmed) return;
      playHintAssemble();
      hintArmed = false;
    }, delay);
  };
  const onUserInteraction = () => {
    if (hintTimer) clearTimeout(hintTimer);
    hintArmed = true;
    scheduleHint();
  };
  scheduleHint(900);

  const content = createContentController({
    dom,
    resumeContent: RESUME_CONTENT,
    sliderMax: tunedSettings.sliderMax,
    sliderStep: tunedSettings.sliderStep,
    prefersReducedMotion,
  });

  const audio = createMatrixAudio({ button: dom.soundButton });

  let matrix = null;
  let gifs = null;
  let perf = null;
  let terminal = null;
  let cv = null;
  let applyMatrixIntensity = () => {};
  let lastState = { intensity: 0, easedIntensity: 0 };

  const handleSliderChange = (value, userInitiated = false) => {
    const state = content.update(value);
    lastState = state;
    if (perf) perf.recordInteraction();
    audio.syncWithContext();
    audio.updateAuto(value, userInitiated);
    if (gifs) gifs.update(state);
    applyMatrixIntensity(state.easedIntensity);
    if (userInitiated) onUserInteraction();
  };

  const showEasterEgg = () => {
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

  const slider = createSliderController({
    slider: dom.slider,
    sliderMax: tunedSettings.sliderMax,
    sliderStep: tunedSettings.sliderStep,
    konamiCode: KONAMI_CODE,
    isTyping: () => (terminal ? terminal.isTyping() : false),
    onToggleCV: () => cv?.toggle?.(),
    onKonami: showEasterEgg,
    onChange: (value) => handleSliderChange(value, true),
  });

  if (slider) slider.init();
  audio.init();
  handleSliderChange(Number(dom.slider.value), false);

  const loadEnhancements = async () => {
    const [{ createMatrixRain, startTitleGlitch }, { createGifLayer }] =
      await Promise.all([
        import("./matrix.js"),
        import("./modules/gifs.js"),
      ]);

    const perfModule = await import("./modules/perf.js");
    const gaugeModule = await import("./modules/gauge.js");
    const terminalModule = await import("./modules/terminal.js");
    const cvModule = await import("./modules/cv.js");

    matrix = createMatrixRain({
      canvas: dom.canvas,
      chars: MATRIX_CHARS,
      settings: tunedSettings,
      prefersReducedMotion,
    });

    if (matrix) {
      applyMatrixIntensity = (easedIntensity) => {
        matrix.setOpacity(0.45 + easedIntensity * 0.45);
        matrix.setIntensity({
          easedIntensity,
          rainSpeed: 0.6 + easedIntensity * 2.4,
          trailAlpha: Math.min(0.14, Math.max(0.035, 0.14 - easedIntensity * 0.1)),
          brightness: 0.35 + easedIntensity * 0.65,
          shadowBlur: 2 + easedIntensity * 8,
          extraChance: 0.05 + easedIntensity * 0.35,
          density: Math.min(1, Math.max(0.35, 0.35 + easedIntensity * 0.65)),
        });
      };
      matrix.start();
      applyMatrixIntensity(lastState.easedIntensity);
    }

    startTitleGlitch({
      title: dom.title,
      prefersReducedMotion,
      interval: SETTINGS.glitchInterval,
      getStrength: content.getGlitchStrength,
    });

    gifs = createGifLayer({
      container: dom.gifContainer,
      gifs: GIFS,
      maxGifs: tunedSettings.maxGifs,
    });
    if (gifs) gifs.update(lastState);

    perf = perfModule.createPerfMonitor({
      prefersReducedMotion,
      onIdleChange: (idle) => {
        if (matrix?.setPaused) matrix.setPaused(idle);
      },
    });
    perf.start();
    perf.recordInteraction();

    gaugeModule.initGauge({ container: dom.perfGauge, getMetrics: perf.getMetrics });

    terminal = terminalModule.createTerminal({ dom });
    if (terminal) terminal.init();

    cv = cvModule.createCvDropdown({
      icon: dom.cvIcon,
      dropdown: dom.cvDropdown,
      prefersReducedMotion,
    });
    if (cv) cv.init();
  };

  requestAnimationFrame(() => setTimeout(loadEnhancements, 0));
}
