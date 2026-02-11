const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const createPerfMonitor = ({ prefersReducedMotion, idleTimeoutMs = 8000 }) => {
  const perfElements = {
    fps: document.querySelector('[data-perf="fps"] .perf-value'),
    quality: document.querySelector('[data-perf="quality"] .perf-value'),
    render: document.querySelector('[data-perf="render"] .perf-value'),
    interaction: document.querySelector('[data-perf="interaction"] .perf-value'),
    latency: document.querySelector('[data-perf="latency"] .perf-value'),
  };

  const state = {
    lastFrame: 0,
    frameCount: 0,
    lastFpsUpdate: 0,
    lastLatencyUpdate: 0,
    lastInteraction: performance.now(),
    latencySamples: [],
    idle: false,
  };

  const metrics = {
    fps: 0,
    frameMs: 16,
    loadScore: 0,
    interactionMs: 0,
    renderActive: true,
  };

  const setIdle = (idle) => {
    if (state.idle === idle) return;
    state.idle = idle;
    document.body.classList.toggle("is-idle", idle);
  };

  const getQualityMode = () => {
    if (prefersReducedMotion) return "LOW";
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    if (memory >= 8 && cores >= 8) return "HIGH";
    if (memory >= 4 && cores >= 4) return "MED";
    return "LOW";
  };

  const updateQualityState = () => {
    if (!perfElements.quality) return;
    perfElements.quality.textContent = `AUTO ${getQualityMode()}`;
  };

  const updateRenderState = () => {
    const isVisible = document.visibilityState === "visible";
    metrics.renderActive = isVisible;
    if (perfElements.render) {
      perfElements.render.textContent = isVisible ? "ACTIVE" : "PAUSED";
    }
  };

  const updateInteractionState = (now) => {
    const engaged = now - state.lastInteraction < 2000;
    if (perfElements.interaction) {
      perfElements.interaction.textContent = engaged ? "ENGAGED" : "IDLE";
    }
    metrics.interactionMs = now - state.lastInteraction;
  };

  const updateLatencyState = () => {
    if (!perfElements.latency) return;
    if (!state.latencySamples.length) return;
    const avg =
      state.latencySamples.reduce((sum, val) => sum + val, 0) /
      state.latencySamples.length;
    state.latencySamples = [];
    metrics.frameMs = avg;
    metrics.loadScore = clamp(((avg - 8) / 24) * 100, 0, 100);
    const label = avg < 18 ? "LOW" : avg < 28 ? "MOD" : "HIGH";
    perfElements.latency.textContent = label;
  };

  const updateLoop = (now) => {
    if (!state.lastFrame) {
      state.lastFrame = now;
      state.lastFpsUpdate = now;
      state.lastLatencyUpdate = now;
    }

    state.frameCount += 1;
    const delta = now - state.lastFrame;
    state.lastFrame = now;

    if (delta > 0 && delta < 120) {
      state.latencySamples.push(delta);
    }

    if (now - state.lastFpsUpdate >= 1000) {
      metrics.fps = Math.round(
        (state.frameCount * 1000) / (now - state.lastFpsUpdate)
      );
      if (perfElements.fps) {
      perfElements.fps.textContent = `${metrics.fps}`;
      perfElements.fps.classList.add("perf-value-red");
    }
      state.frameCount = 0;
      state.lastFpsUpdate = now;
    }

    if (now - state.lastLatencyUpdate >= 1000) {
      updateLatencyState();
      state.lastLatencyUpdate = now;
    }

    updateInteractionState(now);
    updateRenderState();

    if (!state.idle && now - state.lastInteraction > idleTimeoutMs) {
      setIdle(true);
    }

    requestAnimationFrame(updateLoop);
  };

  const recordInteraction = () => {
    state.lastInteraction = performance.now();
    if (state.idle) setIdle(false);
  };

  const start = () => {
    updateQualityState();
    updateRenderState();
    document.addEventListener("visibilitychange", updateRenderState);
    requestAnimationFrame(updateLoop);
  };

  const stop = () => {
    document.removeEventListener("visibilitychange", updateRenderState);
  };

  return { start, stop, recordInteraction, getMetrics: () => metrics };
};
