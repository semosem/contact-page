export const createTerminal = ({ dom }) => {
  if (!dom.terminalInput || !dom.terminalOutput) return null;

  let caret = null;
  let measureCtx = null;
  const inputLine = document.getElementById("terminal-input-line");
  const terminal = document.getElementById("terminal");

  const terminalResponses = {
    help: "Available commands: help, skills, quote, projects, contact, clear",
    skills:
      "Skills: JavaScript, TypeScript, React, Vue.js, Node.js, Angular, HTML5, CSS3, Git, RESTful APIs, GraphQL",
    quote:
      "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
    projects: "https://github.com/semosem",
    contact: "Contact: dwell.sem@gmail.com",
  };

  const appendTerminalLine = (text, className, preformatted = false) => {
    const line = document.createElement("div");
    if (className) line.className = className;
    if (preformatted) line.style.whiteSpace = "pre-wrap";
    line.textContent = text;
    dom.terminalOutput.appendChild(line);
  };

  const appendPromptLine = (text) => {
    const line = document.createElement("div");
    const prompt = document.createElement("span");
    prompt.className = "prompt";
    prompt.textContent = "$";
    line.appendChild(prompt);
    line.append(` ${text}`);
    dom.terminalOutput.appendChild(line);
  };

  const handleTerminalEnter = (event) => {
    if (event.key !== "Enter") return;

    const command = dom.terminalInput.value.trim();
    if (!command) return;

    appendPromptLine(command);

    const normalized = command.toLowerCase();
    if (normalized === "clear") {
      dom.terminalOutput.replaceChildren();
      dom.terminalInput.value = "";
      return;
    }

    appendTerminalLine(
      terminalResponses[normalized] ||
        "Command not recognized. Type 'help' for available commands.",
      "terminal-line"
    );

    dom.terminalInput.value = "";
    updateTerminalInputSize();
    updateCaretPosition();
    dom.terminalOutput.scrollTop = dom.terminalOutput.scrollHeight;
  };

  const updateTerminalInputSize = () => {
    const length = dom.terminalInput.value.length;
    dom.terminalInput.setAttribute("size", String(Math.max(1, length + 1)));
  };

  const setupCaret = () => {
    if (!inputLine) return;
    caret = document.getElementById("terminal-caret");
    if (!caret) {
      caret = document.createElement("span");
      caret.id = "terminal-caret";
      caret.setAttribute("aria-hidden", "true");
      inputLine.appendChild(caret);
    }

    const canvas = document.createElement("canvas");
    measureCtx = canvas.getContext("2d");
  };

  const updateCaretVisibility = () => {
    if (!caret) return;
    const isFocused = document.activeElement === dom.terminalInput;
    caret.classList.toggle("is-hidden", !isFocused);
    if (isFocused) {
      updateCaretPosition();
    }
  };

  const updateCaretPosition = () => {
    if (!caret || !measureCtx || !dom.terminalInput) return;

    const input = dom.terminalInput;
    const style = getComputedStyle(input);
    measureCtx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

    const cursorIndex = input.selectionStart || 0;
    const textBefore = input.value.slice(0, cursorIndex);
    const textWidth = measureCtx.measureText(textBefore).width;

    const left = input.offsetLeft + textWidth;
    caret.style.left = `${left}px`;
  };

  const bindSkillPills = () => {
    document.querySelectorAll(".skill-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        const skill = pill.textContent;
        const details = `[INFO] Analyzing Skill: ${skill}\n============================\nExperience Level: Strong`;

        appendTerminalLine(`skill --explore ${skill}`, "terminal-line");
        appendTerminalLine(details, "terminal-info", true);
        dom.terminalOutput.scrollTop = dom.terminalOutput.scrollHeight;
      });
    });
  };

  const init = () => {
    updateTerminalInputSize();
    setupCaret();
    updateCaretPosition();

    dom.terminalInput.addEventListener("keydown", handleTerminalEnter);
    dom.terminalInput.addEventListener("input", updateTerminalInputSize);
    dom.terminalInput.addEventListener("input", updateCaretPosition);
    dom.terminalInput.addEventListener("keyup", updateCaretPosition);
    dom.terminalInput.addEventListener("click", updateCaretPosition);
    dom.terminalInput.addEventListener("focus", updateCaretVisibility);
    dom.terminalInput.addEventListener("blur", updateCaretVisibility);

    if (terminal) {
      terminal.addEventListener("click", (event) => {
        if (event.target === dom.terminalInput) return;
        dom.terminalInput.focus();
        const length = dom.terminalInput.value.length;
        dom.terminalInput.setSelectionRange(length, length);
        updateCaretPosition();
      });
    }

    bindSkillPills();
  };

  return {
    init,
    isTyping: () => document.activeElement === dom.terminalInput,
  };
};
