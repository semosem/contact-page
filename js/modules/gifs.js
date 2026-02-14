const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const createGifLayer = ({ container, gifs, maxGifs }) => {
  if (!container) return null;
  const gifPool = [];
  let lastShuffle = 0;

  // (idleObserver moved below removeAll)

  const ensurePool = () => {
    if (gifPool.length) return;
    for (let i = 0; i < maxGifs; i += 1) {
      const gif = document.createElement("img");
      gif.src = gifs[i % gifs.length];
      gif.className = "gif";
      gif.loading = "lazy";
      gif.decoding = "async";
      container.appendChild(gif);
      gifPool.push(gif);
      randomizeGif(gif, true);
    }
  };

  const randomizeGif = (gif, initial = false) => {
    const size = 200 + Math.random() * 180;
    gif.style.left = `${Math.random() * 90}%`;
    gif.style.top = `${Math.random() * 85}%`;
    gif.style.width = `${size}px`;
    gif.style.height = "auto";
    if (initial) {
      gif.style.transform = "scale(0.9)";
    }
  };

  const hideAll = () => {
    gifPool.forEach((gif) => {
      gif.style.opacity = "0";
    });
  };

  const removeAll = () => {
    gifPool.forEach((gif) => {
      try {
        gif.remove();
      } catch {
        // ignore
      }
    });
    gifPool.length = 0;
  };

  // Ensure GIF nodes are removed from DOM when page goes idle (even if update() isn't called).
  const idleObserver = new MutationObserver(() => {
    if (document.body.classList.contains("is-idle")) {
      removeAll();
    }
  });
  idleObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  const update = ({ intensity, easedIntensity }) => {
    // Remove GIF nodes entirely while idle or low intensity.
    if (document.body.classList.contains("is-idle") || intensity < 0.6) {
      removeAll();
      return;
    }

    ensurePool();

    const targetCount = Math.round(
      Math.pow(clamp(intensity, 0, 1), 1.6) * maxGifs
    );
    const opacity = Math.min(1, 0.12 + intensity * 0.9);

    gifPool.forEach((gif, index) => {
      if (index < targetCount) {
        gif.style.opacity = String(opacity);
        gif.style.transform = `scale(${0.85 + easedIntensity * 0.4})`;
      } else {
        gif.style.opacity = "0";
      }
    });

    if (intensity > 0.7 && targetCount > 0) {
      const now = performance.now();
      if (now - lastShuffle > 2500) {
        const pick = Math.floor(Math.random() * targetCount);
        const gif = gifPool[pick];
        if (gif) randomizeGif(gif);
        lastShuffle = now;
      }
    }
  };

  const destroy = () => {
    idleObserver.disconnect();
    removeAll();
  };

  return { update, hideAll, removeAll, destroy };
};
