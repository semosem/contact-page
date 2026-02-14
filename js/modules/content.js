const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const HIGHLIGHT_LEVELS = [
  [],
  // Level 1: core stack
  ["react", "vue", "node", "angular", "typescript", "javascript", "js"],
  // Level 2: reliability + common concerns
  [
    "react",
    "vue",
    "node",
    "angular",
    "typescript",
    "javascript",
    "js",
    "bug",
    "bugs",
    "reliable",
    "maintainable",
    "clean",
  ],
  // Level 3: performance + delivery nouns
  [
    "react",
    "vue",
    "node",
    "angular",
    "typescript",
    "javascript",
    "js",
    "bug",
    "bugs",
    "performance",
    "frontend",
    "fullstack",
    "architecture",
    "features",
    "tests",
  ],
  // Level 4: shipping + product context
  [
    "react",
    "vue",
    "node",
    "angular",
    "typescript",
    "javascript",
    "js",
    "bug",
    "bugs",
    "performance",
    "production",
    "ship",
    "shipped",
    "deliver",
    "delivery",
    "release",
    "founders",
    "teams",
    "mvp",
    "apps",
  ],
  // Level 5: tools + collaboration + domains
  [
    "react",
    "vue",
    "node",
    "angular",
    "typescript",
    "javascript",
    "js",
    "redux",
    "graphql",
    "docker",
    "google",
    "cloud",
    "azure",
    "bug",
    "bugs",
    "performance",
    "production",
    "ship",
    "shipped",
    "deliver",
    "delivery",
    "release",
    "collaboration",
    "team",
    "teams",
    "construction",
    "video",
    "machinery",
  ],
];

const buildHighlightedText = (text, level) => {
  if (level <= 0) return escapeHtml(text);
  const words = HIGHLIGHT_LEVELS[Math.min(level, HIGHLIGHT_LEVELS.length - 1)];
  if (!words.length) return escapeHtml(text);
  const pattern = new RegExp(`\\b(${words.map(escapeRegExp).join("|")})\\b`, "gi");
  return escapeHtml(text).replace(pattern, '<span class="hl">$1</span>');
};

export const createContentController = ({
  dom,
  resumeContent,
  sliderMax,
  sliderStep,
  prefersReducedMotion,
}) => {
  const rootStyle = document.documentElement.style;
  const smallScreenQuery = window.matchMedia(
    "(max-width: 900px), (max-height: 700px)",
  );
  const state = {
    intensity: 0,
    easedIntensity: 0,
    glitchStrength: 0.1,
  };

  // When we go idle, remove any GIF-backed DOM elements immediately.
  const cleanupIdleEffects = () => {
    if (!document.body.classList.contains("is-idle")) return;
    dom.resume?.querySelectorAll?.(".call-fire")?.forEach?.((n) => n.remove());
    document
      .querySelectorAll("#gif-container img.gif")
      .forEach((n) => n.remove());
  };

  const idleObserver = new MutationObserver(cleanupIdleEffects);
  idleObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  const setBodyShake = (enabled) => {
    // Keep shaking as a "near the end" effect only.
    document.body.classList.toggle("shake", enabled);
    document.body.style.animationDuration = enabled
      ? `${clamp(0.6 - state.easedIntensity * 0.4, 0.18, 0.6)}s`
      : "";
  };

  const update = (value) => {
    state.intensity = clamp(value / sliderMax, 0, 1);
    state.easedIntensity = Math.pow(state.intensity, 1.35);

    const isHard = value >= 70;
    const isFirm = value >= 30 && value < 70;
    const isSoft = value < 30;
    const tierLabel = isHard ? "HARD" : isFirm ? "FIRM" : "SOFT";
    document.body.dataset.tier = tierLabel.toLowerCase();

    const stepIndex = Math.floor(value / sliderStep);
    const index = Math.min(resumeContent.length - 1, stepIndex);

    const isMax = value === sliderMax;
    const isSmallScreen = smallScreenQuery.matches;

    const lastIndex = resumeContent.length - 1;
    const isCtaStep = index === lastIndex;

    // Big CTA: last step on all screen sizes (style adapts via CSS).
    const showCallNow = isCtaStep;

    // Mid CTA: show a CTA button under the text from ~65% intensity upward (until the final CTA step).
    const CTA_TEXT = "Book a 15-min call → https://calendly.com/dwell-sem";

    // Mid CTA: show the CTA button only when the current resume line is the CTA text.
    const showMidCta = (resumeContent[index] ?? "") === CTA_TEXT;

    const resumeText = showCallNow
      ? "Book a 15-min call → https://calendly.com/dwell-sem"
      : (resumeContent[index] ?? "undefined");

    if (showCallNow) {
      const isIdle = document.body.classList.contains("is-idle");
      dom.resume.dataset.hl = "0";
      dom.resume.innerHTML = `
        <a
          class="cta-button cta-button--big cta-button--max"
          href="https://calendly.com/dwell-sem"
          target="_blank"
          rel="noreferrer"
        >
          <span class="cta-kicker">UNLOCK</span>
          <span class="cta-main">15-min call</span>
        </a>
        ${isIdle ? "" : '<span class="call-fire" aria-hidden="true"></span>'}
      `;
    } else {
      const highlightLevel = Math.min(5, Math.floor(state.intensity * 6));
      dom.resume.dataset.hl = String(highlightLevel);

      const textHtml = buildHighlightedText(resumeText, highlightLevel);
      const ctaHtml = showMidCta
        ? `
          <div class="cta-inline">
            <a
              class="cta-button cta-button--small"
              href="https://calendly.com/dwell-sem"
              target="_blank"
              rel="noreferrer"
            >
              Book a 15-min call <span aria-hidden="true">→</span>
            </a>
          </div>
        `
        : "";

      dom.resume.innerHTML = `${textHtml}${ctaHtml}`;
    }

    dom.resume.dataset.text = resumeText;
    dom.resume.classList.toggle("call-flash", showCallNow);
    dom.resume.classList.toggle("cta-centered", showCallNow || showMidCta);

    // If we enter idle after rendering, ensure any fire GIF element is removed from the DOM.
    if (document.body.classList.contains("is-idle")) {
      dom.resume
        .querySelectorAll(".call-fire")
        .forEach((node) => node.remove());
    }

    // Only shake/rotate at true max intensity.
    // (CTA step may be at max depending on slider settings, but keep the behaviors explicit.)

    const hue = 115 + state.intensity * 50;
    if (dom.title) {
      dom.title.style.textShadow = `0 0 ${10 + state.easedIntensity * 22}px #0f0`;
    }

    dom.background.style.opacity = 0.35 + state.intensity * 0.4;
    dom.background.style.background = `radial-gradient(ellipse at center, hsl(${hue}, 100%, 45%) 0%, #000 70%)`;

    // Keep the CTA step stable (no shifting letter-spacing/filters/transforms).
    if (showCallNow) {
      dom.resume.style.letterSpacing = "";
      dom.resume.style.textShadow = "";
      dom.resume.style.filter = "";
      dom.resume.style.textTransform = "none";
    } else {
      // Clamp letter-spacing to avoid line-wrap reflow/jitter (e.g. last word popping to next line).
      dom.resume.style.letterSpacing = `${clamp(
        0.22 + state.easedIntensity * 0.45,
        0.22,
        0.75,
      )}px`;
      dom.resume.style.textShadow = `0 0 ${8 + state.easedIntensity * 18}px rgba(0, 255, 106, ${
        0.45 + state.easedIntensity * 0.35
      })`;
      dom.resume.style.filter = `drop-shadow(0 0 ${
        6 + state.easedIntensity * 12
      }px rgba(0, 255, 106, ${0.3 + state.easedIntensity * 0.4}))`;
      dom.resume.style.textTransform = isHard ? "uppercase" : "none";
    }

    // Shake only at the very end, and never while idle.
    const isIdle = document.body.classList.contains("is-idle");
    setBodyShake(isMax && !prefersReducedMotion && !isIdle);

    // Rotation is a "max intensity" effect, but don't rotate the centered CTA modal
    // (rotation animation uses transform and would override the centering translate).
    const shouldRotate = isMax && !prefersReducedMotion && !showCallNow;
    dom.resume.classList.toggle("rotate", shouldRotate);
    dom.resume.style.animationDuration = shouldRotate
      ? `${clamp(140 - state.easedIntensity * 80, 40, 140)}s`
      : "";

    const fillColor = isHard ? "#ff4d4d" : isFirm ? "#ffe066" : "#00ff6a";
    const sliderPct = (value / sliderMax) * 100;
    dom.slider.style.background = `linear-gradient(90deg, ${fillColor} 0%, ${fillColor} ${sliderPct}%, rgba(0, 255, 106, 0.45) ${sliderPct}%, rgba(0, 255, 106, 0.45) 100%)`;

    if (dom.sliderSignal) {
      dom.sliderSignal.textContent = `${Math.round(state.intensity * 100)}%`;
    }
    if (dom.sliderMode) {
      dom.sliderMode.textContent = tierLabel;
    }
    if (dom.sliderHud) {
      dom.sliderHud.style.setProperty("--hud-color", fillColor);
    }

    if (dom.glitchGrid) {
      dom.glitchGrid.classList.toggle("is-active", isHard);
    }

    rootStyle.setProperty(
      "--scanline-opacity",
      String(0.12 + state.easedIntensity * 0.28),
    );
    rootStyle.setProperty(
      "--matrix-opacity",
      String(0.45 + state.easedIntensity * 0.45),
    );
    rootStyle.setProperty("--perf-boost", String(state.easedIntensity));
    rootStyle.setProperty("--perf-scale", "1");

    state.glitchStrength = 0.08 + state.easedIntensity * 0.25;

    if (value === sliderMax) {
      // Disabled: no body shaking.
      document.body.style.animation = "";
      dom.resume.style.fontSize = "2em";
      dom.resume.style.color = "#ff4d4d";
      dom.resume.style.textShadow = "0 0 10px #fff";
      dom.resume.style.filter = "";
    } else {
      document.body.style.animation = "";
      dom.resume.style.fontSize = "";
      dom.resume.style.color = "";
      dom.resume.style.textShadow = "";
      dom.resume.style.filter = "";
    }

    return {
      intensity: state.intensity,
      easedIntensity: state.easedIntensity,
      isHard,
      isFirm,
      isSoft,
      tierLabel,
      isMax,
    };
  };;

  const getGlitchStrength = () => state.glitchStrength;

  return { update, getGlitchStrength };
};;;
