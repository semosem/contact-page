const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const createContentController = ({
  dom,
  resumeContent,
  sliderMax,
  sliderStep,
  prefersReducedMotion,
}) => {
  const rootStyle = document.documentElement.style;
  const state = {
    intensity: 0,
    easedIntensity: 0,
    glitchStrength: 0.1,
  };

  const setBodyShake = (enabled) => {
    document.body.classList.toggle("shake", enabled);
    document.body.style.animationDuration = enabled
      ? `${clamp(0.6 - state.easedIntensity * 0.4, 0.18, 0.6)}s`
      : "";
  };

  const update = (value) => {
    state.intensity = clamp(value / sliderMax, 0, 1);
    state.easedIntensity = Math.pow(state.intensity, 1.35);

    const isHard = value >= 70;
    const isFirm = value >= 30 && value < 70;
    const isSoft = value < 30;
    const tierLabel = isHard ? "HARD" : isFirm ? "FIRM" : "SOFT";
    document.body.dataset.tier = tierLabel.toLowerCase();

    const stepIndex = Math.floor(value / sliderStep);
    const index =
      value === sliderMax
        ? resumeContent.length
        : Math.min(resumeContent.length - 1, stepIndex);

    const isMax = value === sliderMax;
    const resumeText = isMax
      ? "CALL NOW!"
      : resumeContent[index] ?? "undefined";

    if (isMax) {
      dom.resume.innerHTML = `<span class="call-text">${resumeText}</span><span class="call-fire" aria-hidden="true"></span>`;
    } else {
      dom.resume.textContent = resumeText;
    }

    dom.resume.dataset.text = resumeText;
    dom.resume.classList.toggle("call-flash", isMax);

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
    dom.resume.style.textTransform = isHard ? "uppercase" : "none";

    setBodyShake(isHard && !prefersReducedMotion);

    const shouldRotate = isHard && !prefersReducedMotion;
    dom.resume.classList.toggle("rotate", shouldRotate);
    dom.resume.style.animationDuration = shouldRotate
      ? `${clamp(140 - state.easedIntensity * 80, 40, 140)}s`
      : "";

    const fillColor = isHard ? "#ff4d4d" : isFirm ? "#ffe066" : "#00ff6a";
    dom.slider.style.background = `linear-gradient(90deg, ${fillColor} 0%, ${fillColor} ${value}%, rgba(0, 255, 106, 0.45) ${value}%, rgba(0, 255, 106, 0.45) 100%)`;

    if (dom.sliderSignal) {
      dom.sliderSignal.textContent = `${Math.round(state.intensity * 100)}%`;
    }
    if (dom.sliderMode) {
      dom.sliderMode.textContent = tierLabel;
    }
    if (dom.sliderHud) {
      dom.sliderHud.style.setProperty("--hud-color", fillColor);
    }

    if (dom.glitchGrid) {
      dom.glitchGrid.classList.toggle("is-active", isHard);
    }

    rootStyle.setProperty(
      "--scanline-opacity",
      String(0.12 + state.easedIntensity * 0.28)
    );
    rootStyle.setProperty(
      "--matrix-opacity",
      String(0.45 + state.easedIntensity * 0.45)
    );
    rootStyle.setProperty("--perf-boost", String(state.easedIntensity));
    rootStyle.setProperty("--perf-scale", String(1 + state.easedIntensity * 0.22));

    state.glitchStrength = 0.08 + state.easedIntensity * 0.25;

    if (value === sliderMax) {
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

    return {
      intensity: state.intensity,
      easedIntensity: state.easedIntensity,
      isHard,
      isFirm,
      isSoft,
      tierLabel,
      isMax,
    };
  };

  const getGlitchStrength = () => state.glitchStrength;

  return { update, getGlitchStrength };
};
