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

  const matrix = createMatrixRain({
    canvas: dom.canvas,
    chars: MATRIX_CHARS,
    settings: SETTINGS,
    prefersReducedMotion,
  });

  if (!matrix) {
    console.warn("Matrix animation disabled");
  } else {
    const ui = initUI({
      dom,
      settings: SETTINGS,
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
