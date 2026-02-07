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

  const setIntensity = ({ easedIntensity, rainSpeed, trailAlpha }) => {
    state.easedIntensity = easedIntensity;
    state.rainSpeed = rainSpeed;
    state.trailAlpha = trailAlpha;
  };

  const draw = () => {
    ctx.fillStyle = `rgba(0, 0, 0, ${state.trailAlpha})`;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.fillStyle = "#00ff6a";
    ctx.font = `${settings.matrixFontSize}px "Share Tech Mono", monospace`;

    for (let i = 0; i < state.drops.length; i += 1) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillText(text, i * settings.matrixFontSize, state.drops[i] * settings.matrixFontSize);

      if (
        state.drops[i] * settings.matrixFontSize > window.innerHeight &&
        Math.random() > 0.985 - state.easedIntensity * 0.02
      ) {
        state.drops[i] = 0;
      }
      state.drops[i] += state.rainSpeed;
    }
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

  const glitch = () => {
    const originalText = title.innerText;
    let glitchedText = "";

    for (let i = 0; i < originalText.length; i += 1) {
      if (Math.random() < getStrength()) {
        glitchedText += String.fromCharCode(33 + Math.floor(Math.random() * 94));
      } else {
        glitchedText += originalText[i];
      }
    }

    title.innerText = glitchedText;
    setTimeout(() => {
      title.innerText = originalText;
    }, 100);
  };

  const intervalId = window.setInterval(glitch, interval);

  return () => window.clearInterval(intervalId);
};
