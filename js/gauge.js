(() => {
  const target = document.getElementById("perf-gauge");
  if (!target) return;
  target.replaceChildren();
  const canvas = document.createElement("canvas");
  canvas.className = "perf-gauge-canvas";
  target.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const getMetrics = () => window.__perfMetrics || {};

  const drawArc = (cx, cy, radius, value) => {
    const start = Math.PI;
    const end = 0;
    ctx.lineWidth = Math.max(3, radius * 0.12);
    ctx.strokeStyle = "rgba(0, 255, 136, 0.25)";
    ctx.shadowColor = "rgba(0, 255, 136, 0.25)";
    ctx.shadowBlur = radius * 0.25;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, start, end, false);
    ctx.stroke();

    const valueAngle = start + (value / 100) * Math.PI;
    const color = value > 85 ? "#ff4d4d" : value > 65 ? "#ffe066" : "#00ff6a";
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = radius * 0.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, start, valueAngle, false);
    ctx.stroke();

    ctx.shadowBlur = radius * 0.35;
    ctx.strokeStyle = "rgba(240, 255, 245, 0.85)";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(
      cx + Math.cos(valueAngle) * (radius - 2),
      cy + Math.sin(valueAngle) * (radius - 2)
    );
    ctx.stroke();
  };

  const draw = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    ctx.clearRect(0, 0, width, height);
    const metrics = getMetrics();
    const fpsValue = clamp(metrics.fps || 0, 0, 100);
    const frameMs = metrics.frameMs || 16;
    const frameValue = clamp(frameMs * 2, 0, 100);
    const loadValue = clamp(metrics.loadScore || 0, 0, 100);
    const values = [fpsValue, frameValue, loadValue];
    const labels = ["FPS", "FRAME", "LOAD"];

    const colWidth = width / values.length;
    const radius = Math.min(colWidth * 0.32, height * 0.7);
    const baseY = height * 0.86;

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `600 ${Math.max(8, radius * 0.28)}px "Share Tech Mono", monospace`;
    ctx.fillStyle = "rgba(235, 255, 245, 0.85)";
    ctx.shadowColor = "rgba(0, 255, 136, 0.6)";
    ctx.shadowBlur = radius * 0.2;

    values.forEach((value, index) => {
      const cx = colWidth * (index + 0.5);
      drawArc(cx, baseY, radius, value);
      ctx.fillText(labels[index], cx, baseY + radius * 0.18);
    });
  };

  const resize = () => {
    const width = Math.max(220, target.clientWidth);
    const height = Math.round(width * 0.34);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  };

  const update = () => {
    draw();
  };

  resize();
  window.addEventListener("resize", resize);
  setInterval(update, 1500);
})();
