export const createCvDropdown = ({ icon, dropdown, prefersReducedMotion }) => {
  if (!icon || !dropdown) return null;

  const toggle = () => {
    const isOpen = dropdown.classList.contains("active");
    dropdown.classList.toggle("active", !isOpen);
    icon.setAttribute("aria-expanded", String(!isOpen));

    if (!isOpen) {
      dropdown.querySelectorAll("li").forEach((item, index) => {
        setTimeout(() => animateMatrix(item), index * 500);
      });
    }
  };

  const animateMatrix = (element) => {
    const originalText = element.dataset.originalText || element.innerText;
    element.dataset.originalText = originalText;
    element.innerText = "";
    let i = 0;

    const addChar = () => {
      if (i < originalText.length) {
        element.innerText += originalText.charAt(i);
        i += 1;
        setTimeout(addChar, 50);
      }
    };

    addChar();
  };

  const pulseIcon = () => {
    icon.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.05)" },
        { transform: "scale(1)" },
      ],
      {
        duration: 2000,
        iterations: Infinity,
      }
    );
  };

  const init = () => {
    icon.addEventListener("click", toggle);
    icon.addEventListener("mouseover", () => {
      const svg = icon.querySelector("svg");
      if (svg) svg.style.fill = "#00ff6a";
      icon.style.transform = "scale(1.1)";
      icon.style.transition = "all 0.3s ease";
    });
    icon.addEventListener("mouseout", () => {
      const svg = icon.querySelector("svg");
      if (svg) svg.style.fill = "#00ff6a";
      icon.style.transform = "scale(1)";
    });

    document.addEventListener("click", (event) => {
      if (!icon.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove("active");
        icon.setAttribute("aria-expanded", "false");
      }
    });

    if (!prefersReducedMotion) {
      pulseIcon();
    }
  };

  return { init, toggle };
};
