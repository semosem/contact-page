const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const createGifLayer = ({ container, gifs, maxGifs }) => {
  if (!container) return null;
  const gifPool = [];
  let lastShuffle = 0;

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

  const update = ({ intensity, easedIntensity }) => {
    if (intensity < 0.6) {
      hideAll();
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

  return { update, hideAll };
};
