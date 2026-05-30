const tracksModal = document.getElementById("tracksModal");
const openTracksButton = document.getElementById("openTracksModal");
const selectionCountdown = document.getElementById("selectionCountdown");
const tipsRoller = document.getElementById("tipsRoller");
const modalCloseTargets = document.querySelectorAll("[data-close-tracks-modal]");

let modalCloseTimer = null;
let lastFocusedElement = null;
let tips = Array.isArray(window.PLC_TIPS) && window.PLC_TIPS.length > 0
  ? window.PLC_TIPS
  : ["咕咕咕！"];
let tipIndex = 0;

function formatSelectionCountdown() {
  const endTime = new Date(2026, 6, 3, 23, 59, 0);
  const now = new Date();
  const diff = endTime - now;

  if (diff <= 0) {
    return "海选倒计时：已截止";
  }

  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  return `海选倒计时：${days}天${hours}小时`;
}

function updateSelectionCountdown() {
  if (!selectionCountdown) {
    return;
  }

  selectionCountdown.textContent = formatSelectionCountdown();
}

function openTracksModal() {
  if (!tracksModal) {
    return;
  }

  clearTimeout(modalCloseTimer);
  lastFocusedElement = document.activeElement;

  tracksModal.classList.remove("is-closing");
  tracksModal.classList.add("is-open");
  tracksModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  updateSelectionCountdown();

  const closeButton = tracksModal.querySelector(".modal-close");
  if (closeButton) {
    closeButton.focus();
  }
}

function closeTracksModal() {
  if (!tracksModal || !tracksModal.classList.contains("is-open")) {
    return;
  }

  tracksModal.classList.add("is-closing");
  tracksModal.classList.remove("is-open");
  tracksModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  modalCloseTimer = setTimeout(() => {
    tracksModal.classList.remove("is-closing");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }, 560);
}

function parseTipsYaml(source) {
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .map((value) => {
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        return value.slice(1, -1);
      }

      return value;
    })
    .filter(Boolean);
}

function setTip(text) {
  if (!tipsRoller) {
    return;
  }

  tipsRoller.textContent = text;
  tipsRoller.classList.remove("is-switching");
  tipsRoller.style.animation = "none";
  tipsRoller.offsetHeight;
  tipsRoller.style.animation = "";
}

function showNextTip() {
  if (!tipsRoller || tips.length === 0) {
    return;
  }

  tipsRoller.classList.add("is-switching");

  setTimeout(() => {
    tipIndex = (tipIndex + 1) % tips.length;
    setTip(tips[tipIndex]);
  }, 340);
}

async function loadTips() {
  if (!tipsRoller) {
    return;
  }

  if (tips.length > 1) {
    tipIndex = Math.floor(Math.random() * tips.length);
    setTip(tips[tipIndex]);
  }

  try {
    const response = await fetch("./assets/tips.yaml", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Tips request failed");
    }

    const parsedTips = parseTipsYaml(await response.text());

    if (parsedTips.length > 0) {
      tips = parsedTips;
      tipIndex = Math.floor(Math.random() * tips.length);
      setTip(tips[tipIndex]);
    }
  } catch (error) {
    if (tips.length <= 1) {
      setTip(tips[0]);
    }
  }
}

if (openTracksButton) {
  openTracksButton.addEventListener("click", openTracksModal);
}

modalCloseTargets.forEach((target) => {
  target.addEventListener("click", closeTracksModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeTracksModal();
  }
});

updateSelectionCountdown();
setInterval(updateSelectionCountdown, 1000 * 60);

loadTips();
setInterval(showNextTip, 5000);
