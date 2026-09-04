//audio sound needs toggle

export const createMatrixAudio = ({ button }) => {
  let audioContext = null;
  let isPlaying = false;
  let userMuted = false;

  const restartHireMeRig = () => {
    const rig = document.getElementById("hireme-rig");
    if (!rig) return;
    rig.style.animation = "none";
    rig.offsetHeight;
    rig.style.animation = "";
  };

  const setButtonState = (playing) => {
    if (!button) return;
    button.textContent = playing ? "🔇" : "🔊";
    button.setAttribute("aria-pressed", String(playing));
    button.setAttribute(
      "aria-label",
      playing ? "Mute matrix hum" : "Play matrix hum"
    );
    button.classList.toggle("is-audio-on", playing);
    document.body.classList.toggle("hireme-active", playing);
    if (playing) restartHireMeRig();
  };

  const startMatrixHum = () => {
    if (audioContext) return audioContext;

    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const master = audioContext.createGain();
    master.gain.value = 0.05;

    const oscLow = audioContext.createOscillator();
    oscLow.type = "sawtooth";
    oscLow.frequency.value = 42;

    const oscHigh = audioContext.createOscillator();
    oscHigh.type = "triangle";
    oscHigh.frequency.value = 84;

    const filter = audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 620;
    filter.Q.value = 0.7;

    const lfo = audioContext.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.2;

    const lfoGain = audioContext.createGain();
    lfoGain.gain.value = 220;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    oscLow.connect(filter);
    oscHigh.connect(filter);
    filter.connect(master);
    master.connect(audioContext.destination);

    oscLow.start();
    oscHigh.start();
    lfo.start();

    return audioContext;
  };

  const syncWithContext = () => {
    if (!audioContext) return;
    const running = audioContext.state === "running";
    if (running !== isPlaying) {
      isPlaying = running;
      setButtonState(running);
    }
  };

  const toggle = () => {
    const context = startMatrixHum();
    if (!context) return;

    const resumeContext = () =>
      context.resume().then(() => {
        isPlaying = true;
        userMuted = false;
        setButtonState(true);
      });

    if (context.state === "running") {
      context.suspend().then(() => {
        isPlaying = false;
        userMuted = true;
        setButtonState(false);
      });
    } else {
      resumeContext();
    }
  };

  const ensureContext = () => startMatrixHum();

  const updateAuto = (sliderValue, userInitiated = false) => {
    if (!audioContext && userInitiated && sliderValue >= 70 && !userMuted) {
      ensureContext();
    }
    if (!audioContext) return;
    const shouldPlay = sliderValue >= 70;
    const shouldStop = sliderValue <= 60;

    if (shouldPlay && !userMuted) {
      if (audioContext.state !== "running") {
        audioContext.resume().then(() => {
          isPlaying = true;
          setButtonState(true);
        });
      }
    } else if (shouldStop) {
      if (audioContext.state === "running") {
        audioContext.suspend().then(() => {
          isPlaying = false;
          setButtonState(false);
        });
      }
    }
  };

  const stop = (setMuted = false) => {
    if (!audioContext) {
      if (setMuted) userMuted = true;
      setButtonState(false);
      return;
    }
    if (setMuted) userMuted = true;
    if (audioContext.state === "running") {
      audioContext.suspend().then(() => {
        isPlaying = false;
        setButtonState(false);
      });
    } else {
      isPlaying = false;
      setButtonState(false);
    }
  };

  const init = () => {
    if (!button) return;
    setButtonState(isPlaying);
    button.title = "Toggle matrix hum";
    button.addEventListener("click", toggle);

    // Track recent user interaction so we don't kill audio mid-interaction.
    let lastInteractionAt = Date.now();
    const markInteraction = () => {
      lastInteractionAt = Date.now();
    };

    // Capture common interaction signals.
    ["pointerdown", "mousemove", "keydown", "touchstart", "wheel"].forEach((evt) => {
      window.addEventListener(evt, markInteraction, { passive: true });
    });

    // Turn audio off when tab becomes hidden.
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop(false);
    });
    window.addEventListener("blur", () => stop(false));

    // Turn audio off when idle *and* the user is not actively interacting.
    const idleObserver = new MutationObserver(() => {
      const idle = document.body.classList.contains("is-idle");
      if (!idle) return;
      const msSinceInteraction = Date.now() - lastInteractionAt;
      if (msSinceInteraction > 1500) stop(false);
    });
    idleObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
  };

  return { init, toggle, updateAuto, syncWithContext, ensureContext, stop };
};
