import { SETTINGS, RESUME_CONTENT, GIFS, KONAMI_CODE, MATRIX_CHARS } from "./data.js";
import { createMatrixRain, startTitleGlitch } from "./matrix.js";
import { initUI } from "./ui.js";

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

  const matrix = createMatrixRain({
    canvas: dom.canvas,
    chars: MATRIX_CHARS,
    settings: tunedSettings,
    prefersReducedMotion,
  });

  if (!matrix) {
    console.warn("Matrix animation disabled");
  } else {
    const ui = initUI({
      dom,
      settings: tunedSettings,
      resumeContent: RESUME_CONTENT,
      gifs: GIFS,
      konamiCode: KONAMI_CODE,
      prefersReducedMotion,
      matrix,
    });

    ui.init();
    matrix.start();

    startTitleGlitch({
      title: dom.title,
      prefersReducedMotion,
      interval: SETTINGS.glitchInterval,
      getStrength: ui.getGlitchStrength,
    });
  }
}
