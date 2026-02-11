const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const createAmbientLayer = ({ container, maxShards = 6 }) => {
  if (!container) return null;
  const shardPool = [];
  let lastShuffle = 0;

  const randomizeShard = (shard, initial = false) => {
    const isLine = Math.random() > 0.55;
    const width = isLine ? 3 + Math.random() * 5 : 40 + Math.random() * 120;
    const height = isLine ? 80 + Math.random() * 180 : 18 + Math.random() * 60;
    const left = Math.random() * 90;
    const top = Math.random() * 85;
    const blur = isLine ? 6 + Math.random() * 10 : 10 + Math.random() * 16;
    const rot = `${(Math.random() * 20 - 10).toFixed(2)}deg`;
    const dx = `${(Math.random() * 80 - 40).toFixed(2)}px`;
    const dy = `${(-40 - Math.random() * 120).toFixed(2)}px`;
    const opacity = (0.15 + Math.random() * 0.45).toFixed(2);
    const duration = `${(6 + Math.random() * 8).toFixed(2)}s`;
    const delay = `${(-Math.random() * 8).toFixed(2)}s`;

    shard.style.left = `${left}%`;
    shard.style.top = `${top}%`;
    shard.style.width = `${width}px`;
    shard.style.height = `${height}px`;
    shard.style.setProperty("--spark-rot", rot);
    shard.style.setProperty("--spark-dx", dx);
    shard.style.setProperty("--spark-dy", dy);
    shard.style.setProperty("--spark-blur", `${blur}px`);
    shard.style.setProperty("--spark-opacity", opacity);
    shard.style.animationDuration = duration;
    shard.style.animationDelay = delay;
    shard.classList.toggle("is-line", isLine);

    if (initial) {
      shard.style.opacity = "0";
    }
  };

  const ensurePool = () => {
    if (shardPool.length) return;
    for (let i = 0; i < maxShards; i += 1) {
      const shard = document.createElement("div");
      shard.className = "ambient-shard";
      container.appendChild(shard);
      shardPool.push(shard);
      randomizeShard(shard, true);
    }
  };

  const removeAll = () => {
    shardPool.forEach((shard) => shard.remove());
    shardPool.length = 0;
  };

  const update = ({ intensity, easedIntensity }) => {
    if (intensity < 0.6) {
      removeAll();
      return;
    }

    ensurePool();

    const targetCount = Math.max(
      1,
      Math.round(Math.pow(clamp(intensity, 0, 1), 1.4) * maxShards)
    );
    const opacity = Math.min(1, 0.2 + intensity * 0.7);
    const scale = 0.85 + easedIntensity * 0.3;

    shardPool.forEach((shard, index) => {
      if (index < targetCount) {
        shard.style.opacity = String(opacity);
        shard.style.setProperty("--spark-scale", scale.toFixed(2));
      } else {
        shard.style.opacity = "0";
      }
    });

    if (intensity > 0.7 && targetCount > 0) {
      const now = performance.now();
      if (now - lastShuffle > 2500) {
        const pick = Math.floor(Math.random() * targetCount);
        const shard = shardPool[pick];
        if (shard) randomizeShard(shard);
        lastShuffle = now;
      }
    }
  };

  return { update, removeAll };
};
