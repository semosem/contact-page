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
  };

  let intervalId = null;

  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const columns = Math.floor(window.innerWidth / settings.matrixFontSize);
    state.drops = Array(columns).fill(1);
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
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.fillStyle = `rgba(0, 255, 106, ${state.brightness})`;
    ctx.font = `${settings.matrixFontSize}px "Share Tech Mono", monospace`;
    ctx.shadowColor = "rgba(0, 255, 106, 0.75)";
    ctx.shadowBlur = state.shadowBlur;

    for (let i = 0; i < state.drops.length; i += 1) {
      if (state.density < 1 && Math.random() > state.density) {
        continue;
      }
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillText(text, i * settings.matrixFontSize, state.drops[i] * settings.matrixFontSize);

      if (state.extraChance > 0 && Math.random() < state.extraChance) {
        const extraText = chars.charAt(Math.floor(Math.random() * chars.length));
        const offset = Math.random() * settings.matrixFontSize * 6;
        ctx.fillText(
          extraText,
          i * settings.matrixFontSize,
          state.drops[i] * settings.matrixFontSize - offset
        );
      }

      if (
        state.drops[i] * settings.matrixFontSize > window.innerHeight &&
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

    if (!prefersReducedMotion) {
      intervalId = window.setInterval(draw, settings.rainInterval);
    }
  };

  const stop = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const setOpacity = (value) => {
    canvas.style.opacity = String(value);
  };

  return {
    start,
    stop,
    resize,
    draw,
    setIntensity,
    setOpacity,
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
