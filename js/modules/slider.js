const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const createSliderController = ({
  slider,
  sliderMax,
  sliderStep,
  konamiCode,
  isTyping,
  onToggleCV,
  onKonami,
  onChange,
}) => {
  if (!slider) return null;

  let konamiIndex = 0;

  const emit = (value) => {
    if (typeof onChange === "function") onChange(value);
  };

  const setValue = (value) => {
    const next = clamp(value, 0, sliderMax);
    slider.value = String(next);
    emit(next);
  };

  const handleInput = () => {
    emit(Number(slider.value));
  };

  const handleKonami = (key) => {
    if (!konamiCode || !konamiCode.length) return;
    if (key === konamiCode[konamiIndex]) {
      konamiIndex += 1;
      if (konamiIndex === konamiCode.length) {
        konamiIndex = 0;
        if (typeof onKonami === "function") onKonami();
      }
    } else {
      konamiIndex = 0;
    }
  };

  const handleKeydown = (event) => {
    const typing = typeof isTyping === "function" && isTyping();

    if (!typing && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
      const delta = event.key === "ArrowRight" ? sliderStep : -sliderStep;
      setValue(Number(slider.value) + delta);
    }

    if (!typing && (event.key === "c" || event.key === "C")) {
      if (typeof onToggleCV === "function") onToggleCV();
    }

    if (!typing) {
      handleKonami(event.key);
    }
  };

  const init = () => {
    slider.addEventListener("input", handleInput);
    document.addEventListener("keydown", handleKeydown);
  };

  const destroy = () => {
    slider.removeEventListener("input", handleInput);
    document.removeEventListener("keydown", handleKeydown);
  };

  return { init, destroy, setValue };
};
