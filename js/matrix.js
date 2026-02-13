export const createMatrixRain = ({ canvas, chars, settings, prefersReducedMotion }) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.warn("Canvas context unavailable");
    return null;
  }

  const state = {
    drops: [],
    easedIntensity: 0,
    rainSpeed: 1,
    trailAlpha: 0.08,
    brightness: 0.6,
    shadowBlur: 0,
    extraChance: 0,
    density: 1,
    renderWidth: window.innerWidth,
    renderHeight: window.innerHeight,
    fontSize: settings.matrixFontSize,
    scale: settings.matrixScale || 1,
  };

  let intervalId = null;
  let isRunning = false;
  let isVisible = document.visibilityState === "visible";
  let isIdlePaused = false;

  const clearInterval = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const startInterval = () => {
    if (intervalId) return;
    intervalId = window.setInterval(draw, settings.rainInterval);
  };

  const shouldRunInterval = () =>
    isRunning && isVisible && !prefersReducedMotion && !isIdlePaused;

  const syncInterval = () => {
    if (shouldRunInterval()) {
      startInterval();
    } else {
      clearInterval();
    }
  };

  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    const scale = typeof settings.matrixScale === "number" ? settings.matrixScale : 1;
    const renderWidth = window.innerWidth * scale;
    const renderHeight = window.innerHeight * scale;
    const fontSize = settings.matrixFontSize * scale;

    canvas.width = renderWidth * dpr;
    canvas.height = renderHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const columns = Math.max(1, Math.floor(renderWidth / fontSize));
    state.drops = Array(columns).fill(1);
    state.renderWidth = renderWidth;
    state.renderHeight = renderHeight;
    state.fontSize = fontSize;
    state.scale = scale;
  };

  const handleVisibility = () => {
    isVisible = document.visibilityState === "visible";
    syncInterval();
  };

  const setIntensity = ({
    easedIntensity,
    rainSpeed,
    trailAlpha,
    brightness,
    shadowBlur,
    extraChance,
    density,
  }) => {
    state.easedIntensity = easedIntensity;
    state.rainSpeed = rainSpeed;
    state.trailAlpha = trailAlpha;
    if (typeof brightness === "number") state.brightness = brightness;
    if (typeof shadowBlur === "number") state.shadowBlur = shadowBlur;
    if (typeof extraChance === "number") state.extraChance = extraChance;
    if (typeof density === "number") state.density = density;
  };

  const draw = () => {
    ctx.fillStyle = `rgba(0, 0, 0, ${state.trailAlpha})`;
    ctx.fillRect(0, 0, state.renderWidth, state.renderHeight);

    ctx.fillStyle = `rgba(0, 255, 106, ${state.brightness})`;
    ctx.font = `${state.fontSize}px "Share Tech Mono", monospace`;
    ctx.shadowColor = "rgba(0, 255, 106, 0.75)";
    ctx.shadowBlur = state.shadowBlur;

    for (let i = 0; i < state.drops.length; i += 1) {
      if (state.density < 1 && Math.random() > state.density) {
        continue;
      }
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillText(text, i * state.fontSize, state.drops[i] * state.fontSize);

      if (state.extraChance > 0 && Math.random() < state.extraChance) {
        const extraText = chars.charAt(Math.floor(Math.random() * chars.length));
        const offset = Math.random() * state.fontSize * 6;
        ctx.fillText(
          extraText,
          i * state.fontSize,
          state.drops[i] * state.fontSize - offset
        );
      }

      if (
        state.drops[i] * state.fontSize > state.renderHeight &&
        Math.random() > 0.985 - state.easedIntensity * 0.02
      ) {
        state.drops[i] = 0;
      }
      state.drops[i] += state.rainSpeed;
    }

    ctx.shadowBlur = 0;
  };

  const start = () => {
    resize();
    draw();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);

    isRunning = true;
    syncInterval();
  };

  const stop = () => {
    clearInterval();
    isRunning = false;
    document.removeEventListener("visibilitychange", handleVisibility);
    window.removeEventListener("resize", resize);
  };

  const setOpacity = (value) => {
    canvas.style.opacity = String(value);
  };

  const setPaused = (paused) => {
    isIdlePaused = Boolean(paused);
    syncInterval();
    if (!isIdlePaused && shouldRunInterval()) {
      draw();
    }
  };

  return {
    start,
    stop,
    resize,
    draw,
    setIntensity,
    setOpacity,
    setPaused,
  };
};

export const startTitleGlitch = ({ title, prefersReducedMotion, interval, getStrength }) => {
  if (!title || prefersReducedMotion) return null;

  const nameSpan = title.querySelector(".title-name");
  const roleSpan = title.querySelector(".title-role");
  const originalHtml = title.innerHTML;
  const originalName = nameSpan ? nameSpan.textContent : title.textContent || "";
  const originalRole = roleSpan ? roleSpan.textContent : "";

  const glitchText = (text) => {
    let glitchedText = "";
    for (let i = 0; i < text.length; i += 1) {
      if (Math.random() < getStrength()) {
        glitchedText += String.fromCharCode(33 + Math.floor(Math.random() * 94));
      } else {
        glitchedText += text[i];
      }
    }
    return glitchedText;
  };

  const glitch = () => {
    if (document.body.classList.contains("is-idle")) return;
    if (nameSpan && roleSpan) {
      nameSpan.textContent = glitchText(originalName);
      roleSpan.textContent = glitchText(originalRole);
    } else {
      const originalText = title.textContent || "";
      title.textContent = glitchText(originalText);
    }
    setTimeout(() => {
      if (nameSpan && roleSpan) {
        nameSpan.textContent = originalName;
        roleSpan.textContent = originalRole;
      } else {
        title.innerHTML = originalHtml;
      }
    }, 100);
  };

  const intervalId = window.setInterval(glitch, interval);

  return () => window.clearInterval(intervalId);
};
