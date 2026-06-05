const tracksModal = document.getElementById("tracksModal");
const openTracksButton = document.getElementById("openTracksModal");
const selectionCountdown = document.getElementById("selectionCountdown");
const tipsRoller = document.getElementById("tipsRoller");
const rankingPreviewList = document.getElementById("rankingPreviewList");
const signalRift = document.getElementById("signalRift");
const openSignalRiftButton = document.getElementById("openSignalRift");
const finalSignalSection = document.getElementById("finalSignal");
const signalGatePanel = document.querySelector(".signal-gate-panel");
const signalGateStatus = document.getElementById("signalGateStatus");
const resetSignalGateButton = document.getElementById("resetSignalGate");
const modalCloseTargets = document.querySelectorAll("[data-close-tracks-modal]");
const signalRiftCloseTargets = document.querySelectorAll("[data-close-signal-rift]");
const signalGateButtons = document.querySelectorAll("[data-signal-key]");
const signalGateDots = document.querySelectorAll("[data-gate-dot]");

let modalCloseTimer = null;
let signalRiftCloseTimer = null;
let lastFocusedElement = null;
let signalRiftLastFocusedElement = null;
let tips = Array.isArray(window.PLC_TIPS) && window.PLC_TIPS.length > 0
  ? window.PLC_TIPS
  : ["咕咕咕！"];
let tipIndex = 0;
const signalGateSequence = ["07", "11", "87"];
const signalGateStorageKey = "plc.event.signalGate.v1";
const signalGateCacheVersion = "2026-06-13";
let signalGateInput = [];
let signalGateLocked = false;

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

function openSignalRift() {
  if (!signalRift) {
    return;
  }

  clearTimeout(signalRiftCloseTimer);
  signalRiftLastFocusedElement = document.activeElement;

  signalRift.classList.remove("is-closing");
  signalRift.classList.add("is-open");
  signalRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const closeButton = signalRift.querySelector(".signal-rift-close");
  if (closeButton) {
    closeButton.focus();
  }
}

function closeSignalRift() {
  if (!signalRift || !signalRift.classList.contains("is-open")) {
    return;
  }

  signalRift.classList.add("is-closing");
  signalRift.classList.remove("is-open");
  signalRift.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  signalRiftCloseTimer = setTimeout(() => {
    signalRift.classList.remove("is-closing");

    if (
      signalRiftLastFocusedElement &&
      typeof signalRiftLastFocusedElement.focus === "function"
    ) {
      signalRiftLastFocusedElement.focus();
    }
  }, 340);
}

function readSignalGateCache() {
  try {
    const cachedValue = readStoredSignalGateValue();
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === signalGateCacheVersion &&
      payload?.unlocked === true &&
      Array.isArray(payload?.sequence) &&
      payload.sequence.join("/") === signalGateSequence.join("/");

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function readStoredSignalGateValue() {
  try {
    if (typeof window.localStorage !== "undefined") {
      return window.localStorage.getItem(signalGateStorageKey);
    }
  } catch (error) {
  }

  try {
    const cookiePrefix = `${encodeURIComponent(signalGateStorageKey)}=`;
    const cachedCookie = document.cookie
      .split("; ")
      .find((item) => item.startsWith(cookiePrefix));

    return cachedCookie
      ? decodeURIComponent(cachedCookie.slice(cookiePrefix.length))
      : null;
  } catch (error) {
    return null;
  }
}

function writeStoredSignalGateValue(value) {
  try {
    if (typeof window.localStorage !== "undefined") {
      window.localStorage.setItem(signalGateStorageKey, value);
      return;
    }
  } catch (error) {
  }

  try {
    document.cookie = [
      `${encodeURIComponent(signalGateStorageKey)}=${encodeURIComponent(value)}`,
      "max-age=31536000",
      "path=/",
      "SameSite=Lax"
    ].join("; ");
  } catch (error) {
  }
}

function writeSignalGateCache() {
  try {
    writeStoredSignalGateValue(JSON.stringify({
      version: signalGateCacheVersion,
      unlocked: true,
      sequence: signalGateSequence,
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
    // 解密缓存只是体验增强，写入失败时不影响当前解锁。
  }
}

function revealFinalSignal({ animate = true, scroll = true } = {}) {
  if (!finalSignalSection) {
    return;
  }

  finalSignalSection.classList.remove("is-locked");
  finalSignalSection.classList.toggle("is-revealed", animate);
  finalSignalSection.setAttribute("aria-hidden", "false");

  if (scroll) {
    finalSignalSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function updateSignalGateProgress(state = "input") {
  if (signalGateStatus) {
    const inputText = signalGateInput
      .concat(Array(Math.max(signalGateSequence.length - signalGateInput.length, 0)).fill("--"))
      .slice(0, signalGateSequence.length)
      .join(" / ");

    if (state === "failed") {
      signalGateStatus.textContent = "解析失败：噪声矩阵已回卷";
    } else if (state === "complete") {
      signalGateStatus.textContent = "校验通过：频段同步中";
    } else {
      signalGateStatus.textContent = `等待频点输入：${inputText}`;
    }
    signalGateStatus.classList.toggle("is-failed", state === "failed");
    signalGateStatus.classList.toggle("is-complete", state === "complete");
  }

  signalGateDots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index < signalGateInput.length);
    dot.classList.toggle("is-failed", state === "failed");
    dot.classList.toggle("is-complete", state === "complete");
  });
}

function completeSignalGate({ fromCache = false } = {}) {
  signalGateInput = [...signalGateSequence];
  signalGateLocked = true;
  signalGatePanel?.classList.remove("is-failed", "is-resolving");
  signalGatePanel?.classList.add("is-unlocked");

  signalGateButtons.forEach((button) => {
    const isSequenceKey = signalGateSequence.includes(button.dataset.signalKey);
    button.classList.toggle("is-used", isSequenceKey);
    button.classList.toggle("is-accepted", isSequenceKey);
    button.classList.remove("is-rejected");
    button.disabled = true;
  });

  if (resetSignalGateButton) {
    resetSignalGateButton.disabled = true;
  }

  updateSignalGateProgress("complete");

  if (signalGateStatus) {
    signalGateStatus.textContent = fromCache
      ? "握手已恢复：静默频段保持展开"
      : "握手完成：静默频段已展开";
  }

  revealFinalSignal({
    animate: !fromCache,
    scroll: !fromCache
  });
}

function resetSignalGate() {
  signalGateInput = [];
  signalGateLocked = false;
  signalGatePanel?.classList.remove("is-failed", "is-resolving");
  signalGateButtons.forEach((button) => {
    button.classList.remove("is-used", "is-rejected", "is-accepted");
    button.disabled = false;
  });
  updateSignalGateProgress();
}

function unlockSignalGate() {
  signalGatePanel?.classList.add("is-resolving");

  if (signalGateStatus) {
    signalGateStatus.textContent = "校验通过：频段同步中";
    signalGateStatus.classList.remove("is-failed");
    signalGateStatus.classList.add("is-complete");
  }

  signalGateButtons.forEach((button) => {
    if (button.classList.contains("is-used")) {
      button.classList.add("is-accepted");
    }
    button.disabled = true;
  });

  if (resetSignalGateButton) {
    resetSignalGateButton.disabled = true;
  }

  updateSignalGateProgress("complete");

  setTimeout(() => {
    signalGatePanel?.classList.remove("is-resolving");
    writeSignalGateCache();
    completeSignalGate();
  }, 920);
}

function failSignalGate() {
  signalGateLocked = true;
  signalGatePanel?.classList.add("is-failed");

  if (signalGateStatus) {
    signalGateStatus.textContent = "解析失败：噪声矩阵已回卷";
    signalGateStatus.classList.remove("is-complete");
    signalGateStatus.classList.add("is-failed");
  }

  signalGateButtons.forEach((button) => {
    if (button.classList.contains("is-used")) {
      button.classList.add("is-rejected");
    }
    button.disabled = true;
  });

  updateSignalGateProgress("failed");

  setTimeout(() => {
    resetSignalGate();
  }, 1150);
}

function handleSignalGateInput(button) {
  if (signalGateLocked || button.disabled) {
    return;
  }

  const value = button.dataset.signalKey;

  signalGateInput.push(value);
  button.classList.add("is-used");
  button.disabled = true;
  updateSignalGateProgress();

  if (signalGateInput.length === signalGateSequence.length) {
    signalGateLocked = true;

    if (signalGateInput.every((value, index) => value === signalGateSequence[index])) {
      unlockSignalGate();
    } else {
      failSignalGate();
    }
  }
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

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderRankingPreview(players) {
  if (!rankingPreviewList) {
    return;
  }

  if (!Array.isArray(players) || players.length === 0) {
    rankingPreviewList.innerHTML = '<div class="ranking-preview-empty">暂无海选成绩</div>';
    return;
  }

  rankingPreviewList.innerHTML = players.slice(0, 3).map((player, index) => `
    <article class="ranking-preview-item">
      <span class="ranking-preview-rank">#${index + 1}</span>
      <strong class="ranking-preview-name">${escapeHtml(player.nickname)}</strong>
      <span class="ranking-preview-score">${escapeHtml(player.score)}</span>
    </article>
  `).join("");
}

async function loadRankingPreview() {
  if (!rankingPreviewList) {
    return;
  }

  if (window.PLCPlayersCache?.hydrate) {
    window.PLCPlayersCache.hydrate({
      onUpdate: renderRankingPreview,
      onError: () => {
        if (!rankingPreviewList.querySelector(".ranking-preview-item")) {
          rankingPreviewList.innerHTML = '<div class="ranking-preview-empty">排行榜加载失败，请稍后重试</div>';
        }
      }
    });
    return;
  }

  if (typeof API_URL === "undefined") {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/players`);

    if (!response.ok) {
      throw new Error("Ranking request failed");
    }

    renderRankingPreview(await response.json());
  } catch (error) {
    rankingPreviewList.innerHTML = '<div class="ranking-preview-empty">排行榜加载失败，请稍后重试</div>';
  }
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

if (openSignalRiftButton) {
  openSignalRiftButton.addEventListener("click", openSignalRift);
}

signalGateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleSignalGateInput(button);
  });
});

if (resetSignalGateButton) {
  resetSignalGateButton.addEventListener("click", () => {
    if (signalGateStatus) {
      signalGateStatus.classList.remove("is-complete");
    }
    resetSignalGate();
  });
}

modalCloseTargets.forEach((target) => {
  target.addEventListener("click", closeTracksModal);
});

signalRiftCloseTargets.forEach((target) => {
  target.addEventListener("click", closeSignalRift);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSignalRift();
    closeTracksModal();
  }
});

updateSelectionCountdown();
setInterval(updateSelectionCountdown, 1000 * 60);

if (readSignalGateCache()) {
  completeSignalGate({
    fromCache: true
  });
} else {
  updateSignalGateProgress();
}

loadTips();
setInterval(showNextTip, 5000);

loadRankingPreview();
