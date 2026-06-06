const tracksModal = document.getElementById("tracksModal");
const openTracksButton = document.getElementById("openTracksModal");
const selectionCountdown = document.getElementById("selectionCountdown");
const tipsRoller = document.getElementById("tipsRoller");
const rankingPreviewList = document.getElementById("rankingPreviewList");
const signalRift = document.getElementById("signalRift");
const openSignalRiftButton = document.getElementById("openSignalRift");
const finalArtFrame = document.querySelector(".final-art-frame");
const finalSignalSection = document.getElementById("finalSignal");
const signalGatePanel = document.querySelector(".signal-gate-panel");
const signalGateStatus = document.getElementById("signalGateStatus");
const resetSignalGateButton = document.getElementById("resetSignalGate");
const openRetryPuzzleButton = document.getElementById("openRetryPuzzle");
const retryPuzzle = document.getElementById("retryPuzzle");
const retryPuzzleStatus = document.getElementById("retryPuzzleStatus");
const retryPulseButtons = document.querySelectorAll("[data-retry-pulse]");
const retryPulseSlots = document.querySelectorAll("[data-retry-slot]");
const phasePlateRift = document.getElementById("phasePlateRift");
const openPhasePlateButton = document.getElementById("openPhasePlate");
const dateRift = document.getElementById("dateRift");
const settlementRift = document.getElementById("settlementRift");
const openSettlementPlateButtons = document.querySelectorAll("[data-open-settlement-plate]");
const artistGatePuzzle = document.getElementById("artistGatePuzzle");
const artistGateStatus = document.getElementById("artistGateStatus");
const artistPulseButtons = document.querySelectorAll("[data-artist-pulse]");
const artistPulseSlots = document.querySelectorAll("[data-artist-slot]");
const fragmentRift = document.getElementById("fragmentRift");
const openFragmentRiftButton = document.getElementById("openFragmentRift");
const fragmentTwoRift = document.getElementById("fragmentTwoRift");
const openFragmentTwoRiftButton = document.getElementById("openFragmentTwoRift");
const fragmentAnswerForm = document.getElementById("fragmentAnswerForm");
const fragmentAnswerInput = document.getElementById("fragmentAnswerInput");
const fragmentAnswerSubmit = document.getElementById("fragmentAnswerSubmit");
const fragmentAnswerStatus = document.getElementById("fragmentAnswerStatus");
const fragmentResult = document.getElementById("fragmentResult");
const fragmentTwoAnswerForm = document.getElementById("fragmentTwoAnswerForm");
const fragmentTwoAnswerInput = document.getElementById("fragmentTwoAnswerInput");
const fragmentTwoAnswerSubmit = document.getElementById("fragmentTwoAnswerSubmit");
const fragmentTwoAnswerStatus = document.getElementById("fragmentTwoAnswerStatus");
const fragmentTwoResult = document.getElementById("fragmentTwoResult");
const modalCloseTargets = document.querySelectorAll("[data-close-tracks-modal]");
const signalRiftCloseTargets = document.querySelectorAll("[data-close-signal-rift]");
const fragmentRiftCloseTargets = document.querySelectorAll("[data-close-fragment-rift]");
const fragmentTwoRiftCloseTargets = document.querySelectorAll("[data-close-fragment-two-rift]");
const phasePlateCloseTargets = document.querySelectorAll("[data-close-phase-plate]");
const settlementRiftCloseTargets = document.querySelectorAll("[data-close-settlement-rift]");
const dateRiftCloseTargets = document.querySelectorAll("[data-close-date-rift]");
const signalGateButtons = document.querySelectorAll("[data-signal-key]");
const signalGateDots = document.querySelectorAll("[data-gate-dot]");

let modalCloseTimer = null;
let signalRiftCloseTimer = null;
let fragmentRiftCloseTimer = null;
let fragmentTwoRiftCloseTimer = null;
let phasePlateCloseTimer = null;
let settlementRiftCloseTimer = null;
let dateRiftCloseTimer = null;
let lastFocusedElement = null;
let signalRiftLastFocusedElement = null;
let fragmentRiftLastFocusedElement = null;
let fragmentTwoRiftLastFocusedElement = null;
let phasePlateLastFocusedElement = null;
let settlementRiftLastFocusedElement = null;
let dateRiftLastFocusedElement = null;
let tips = Array.isArray(window.PLC_TIPS) && window.PLC_TIPS.length > 0
  ? window.PLC_TIPS
  : ["咕咕咕！"];
let tipIndex = 0;
const signalGateSequence = ["07", "11", "87"];
const signalGateStorageKey = "plc.event.signalGate.v1";
const signalGateCacheVersion = "2026-06-13";
const retryPuzzleSequence = ["green", "cyan", "pink", "white", "yellow", "violet"];
const artistGateSequence = ["status", "date", "track", "file"];
const retryPulseLabels = {
  cyan: "冷光",
  pink: "粉噪",
  yellow: "闪核",
  green: "绿漂",
  white: "白门",
  violet: "余影"
};
const artistPulseLabels = {
  status: "同步失败",
  date: "6.06",
  track: "AT",
  file: "A1Z26",
  score: "1000000",
  rank: "φ"
};
const signalRetryStorageKey = "plc.event.signalRetry.v1";
const signalRetryCacheVersion = "2026-06-13-shard-01-hard-v2";
const fragmentAnswerStorageKey = "plc.event.fragment01.v1";
const fragmentAnswerCacheVersion = "2026-06-13-fragment-01-hard-v2";
const artistGateStorageKey = "plc.event.artistGate.v1";
const artistGateCacheVersion = "2026-06-13-fragment-02-result-v2";
const fragmentTwoAnswerStorageKey = "plc.event.fragment02.v1";
const fragmentTwoAnswerCacheVersion = "2026-06-13-fragment-02-result-artist-v2";
let signalGateInput = [];
let signalGateLocked = false;
let retryPuzzleInput = [];
let retryPuzzleLocked = false;
let artistGateInput = [];
let artistGateLocked = false;
let fragmentTwoWrongCount = 0;

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

function openPhasePlateRift() {
  if (!phasePlateRift) {
    return;
  }

  clearTimeout(phasePlateCloseTimer);
  phasePlateLastFocusedElement = document.activeElement;

  phasePlateRift.classList.remove("is-closing");
  phasePlateRift.classList.add("is-open");
  phasePlateRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const closeButton = phasePlateRift.querySelector(".signal-rift-close");
  if (closeButton) {
    closeButton.focus();
  }
}

function closePhasePlateRift() {
  if (!phasePlateRift || !phasePlateRift.classList.contains("is-open")) {
    return;
  }

  phasePlateRift.classList.add("is-closing");
  phasePlateRift.classList.remove("is-open");
  phasePlateRift.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  phasePlateCloseTimer = setTimeout(() => {
    phasePlateRift.classList.remove("is-closing");

    if (
      phasePlateLastFocusedElement &&
      typeof phasePlateLastFocusedElement.focus === "function"
    ) {
      phasePlateLastFocusedElement.focus();
    }
  }, 340);
}

function openSettlementRift() {
  if (!settlementRift) {
    return;
  }

  clearTimeout(settlementRiftCloseTimer);
  settlementRiftLastFocusedElement = document.activeElement;

  settlementRift.classList.remove("is-closing");
  settlementRift.classList.add("is-open");
  settlementRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const closeButton = settlementRift.querySelector(".signal-rift-close");
  if (closeButton) {
    closeButton.focus();
  }
}

function closeSettlementRift() {
  if (!settlementRift || !settlementRift.classList.contains("is-open")) {
    return;
  }

  settlementRift.classList.add("is-closing");
  settlementRift.classList.remove("is-open");
  settlementRift.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  settlementRiftCloseTimer = setTimeout(() => {
    settlementRift.classList.remove("is-closing");

    if (
      settlementRiftLastFocusedElement &&
      typeof settlementRiftLastFocusedElement.focus === "function"
    ) {
      settlementRiftLastFocusedElement.focus();
    }
  }, 340);
}

function openDateRift() {
  if (!dateRift) {
    return;
  }

  clearTimeout(dateRiftCloseTimer);
  dateRiftLastFocusedElement = document.activeElement;

  dateRift.classList.remove("is-closing");
  dateRift.classList.add("is-open");
  dateRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const closeButton = dateRift.querySelector(".signal-rift-close");
  if (closeButton) {
    closeButton.focus();
  }
}

function closeDateRift() {
  if (!dateRift || !dateRift.classList.contains("is-open")) {
    return;
  }

  dateRift.classList.add("is-closing");
  dateRift.classList.remove("is-open");
  dateRift.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  dateRiftCloseTimer = setTimeout(() => {
    dateRift.classList.remove("is-closing");

    if (
      dateRiftLastFocusedElement &&
      typeof dateRiftLastFocusedElement.focus === "function"
    ) {
      dateRiftLastFocusedElement.focus();
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
  return readStoredValue(signalGateStorageKey);
}

function readStoredValue(key) {
  try {
    if (typeof window.localStorage !== "undefined") {
      return window.localStorage.getItem(key);
    }
  } catch (error) {
  }

  try {
    const cookiePrefix = `${encodeURIComponent(key)}=`;
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
  writeStoredValue(signalGateStorageKey, value);
}

function writeStoredValue(key, value) {
  try {
    if (typeof window.localStorage !== "undefined") {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch (error) {
  }

  try {
    document.cookie = [
      `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
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

function readSignalRetryCache() {
  try {
    const cachedValue = readStoredValue(signalRetryStorageKey);
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === signalRetryCacheVersion &&
      payload?.unlocked === true &&
      Array.isArray(payload?.sequence) &&
      payload.sequence.join("/") === retryPuzzleSequence.join("/");

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function writeSignalRetryCache() {
  try {
    writeStoredValue(signalRetryStorageKey, JSON.stringify({
      version: signalRetryCacheVersion,
      unlocked: true,
      sequence: retryPuzzleSequence,
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
  }
}

function readFragmentAnswerCache() {
  try {
    const cachedValue = readStoredValue(fragmentAnswerStorageKey);
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === fragmentAnswerCacheVersion &&
      payload?.solved === true &&
      payload?.result === "BPM 182";

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function writeFragmentAnswerCache() {
  try {
    writeStoredValue(fragmentAnswerStorageKey, JSON.stringify({
      version: fragmentAnswerCacheVersion,
      solved: true,
      result: "BPM 182",
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
  }
}

function readArtistGateCache() {
  try {
    const cachedValue = readStoredValue(artistGateStorageKey);
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === artistGateCacheVersion &&
      payload?.unlocked === true &&
      Array.isArray(payload?.sequence) &&
      payload.sequence.join("/") === artistGateSequence.join("/");

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function writeArtistGateCache() {
  try {
    writeStoredValue(artistGateStorageKey, JSON.stringify({
      version: artistGateCacheVersion,
      unlocked: true,
      sequence: artistGateSequence,
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
  }
}

function readFragmentTwoAnswerCache() {
  try {
    const cachedValue = readStoredValue(fragmentTwoAnswerStorageKey);
    if (!cachedValue) {
      return null;
    }

    const payload = JSON.parse(cachedValue);
    const isValid =
      payload?.version === fragmentTwoAnswerCacheVersion &&
      payload?.solved === true &&
      payload?.result === "Artist：Essbee";

    return isValid ? payload : null;
  } catch (error) {
    return null;
  }
}

function writeFragmentTwoAnswerCache() {
  try {
    writeStoredValue(fragmentTwoAnswerStorageKey, JSON.stringify({
      version: fragmentTwoAnswerCacheVersion,
      solved: true,
      result: "Artist：Essbee",
      completedAt: new Date().toISOString()
    }));
  } catch (error) {
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

function updateRetryPulseSlots(state = "input") {
  retryPulseSlots.forEach((slot, index) => {
    const value = retryPuzzleInput[index];
    slot.textContent = value ? retryPulseLabels[value] : "--";
    slot.classList.toggle("is-active", Boolean(value));
    slot.classList.toggle("is-failed", state === "failed");
    slot.classList.toggle("is-complete", state === "complete");
  });
}

function updateArtistPulseSlots(state = "input") {
  artistPulseSlots.forEach((slot, index) => {
    const value = artistGateInput[index];
    slot.textContent = value ? artistPulseLabels[value] : "--";
    slot.classList.toggle("is-active", Boolean(value));
    slot.classList.toggle("is-failed", state === "failed");
    slot.classList.toggle("is-complete", state === "complete");
  });
}

function openRetryPuzzle() {
  if (openRetryPuzzleButton?.classList.contains("is-stage-two-ready")) {
    openArtistGatePuzzle();
    return;
  }

  if (!retryPuzzle || retryPuzzleLocked) {
    return;
  }

  retryPuzzle.classList.remove("is-failed", "is-resolving");
  retryPuzzle.classList.add("is-open");
  retryPuzzle.setAttribute("aria-hidden", "false");

  if (retryPuzzleStatus) {
    retryPuzzleStatus.textContent = "读取笔记：残片 -> 日期 -> 白门 -> 偏移 -> 失同步。按钮小字是门牌，按钮颜色是最终输入。";
    retryPuzzleStatus.classList.remove("is-failed", "is-complete");
  }
}

function revealArtistGateRetryEntry() {
  if (!openRetryPuzzleButton) {
    return;
  }

  openRetryPuzzleButton.disabled = false;
  openRetryPuzzleButton.classList.remove("is-resolved", "is-date-ready");
  openRetryPuzzleButton.classList.add("is-stage-two-ready");
  openRetryPuzzleButton.setAttribute("aria-label", "打开 Phigros 结算图校准");

  retryPuzzle?.classList.remove("is-open", "is-failed", "is-resolving");
  retryPuzzle?.setAttribute("aria-hidden", "true");

  const buttonText = openRetryPuzzleButton.querySelector("span");
  if (buttonText) {
    buttonText.textContent = "结算页失焦，点击重采样";
  }
}

function openArtistGatePuzzle() {
  if (!artistGatePuzzle || artistGateLocked) {
    return;
  }

  retryPuzzle?.classList.remove("is-open", "is-failed", "is-resolving");
  retryPuzzle?.setAttribute("aria-hidden", "true");

  artistGatePuzzle.classList.remove("is-failed", "is-resolving");
  artistGatePuzzle.classList.add("is-open");
  artistGatePuzzle.setAttribute("aria-hidden", "false");

  if (artistGateStatus) {
    artistGateStatus.textContent = "TRACE WAITING // 4 KEYS";
    artistGateStatus.classList.remove("is-failed", "is-complete");
  }
}

function resetArtistGatePuzzle() {
  artistGateInput = [];
  artistGateLocked = false;
  artistGatePuzzle?.classList.remove("is-failed", "is-resolving");

  artistPulseButtons.forEach((button) => {
    button.classList.remove("is-used", "is-rejected", "is-accepted");
    button.disabled = false;
  });

  updateArtistPulseSlots();
}

function revealShardTwo({ fromCache = false } = {}) {
  artistGateInput = [...artistGateSequence];
  artistGateLocked = true;

  finalSignalSection?.classList.add("is-fractured", "is-shard-two-open");
  finalArtFrame?.classList.toggle("is-fracturing", !fromCache);

  if (!fromCache && finalArtFrame) {
    setTimeout(() => {
      finalArtFrame.classList.remove("is-fracturing");
    }, 1320);
  }

  artistGatePuzzle?.classList.remove("is-failed", "is-resolving");
  artistGatePuzzle?.classList.add("is-open", "is-complete");
  artistGatePuzzle?.setAttribute("aria-hidden", "false");

  artistPulseButtons.forEach((button) => {
    const isSequencePulse = artistGateSequence.includes(button.dataset.artistPulse);
    button.classList.toggle("is-used", isSequencePulse);
    button.classList.toggle("is-accepted", isSequencePulse);
    button.classList.remove("is-rejected");
    button.disabled = true;
  });

  updateArtistPulseSlots("complete");

  if (openRetryPuzzleButton) {
    openRetryPuzzleButton.classList.add("is-resolved");
    openRetryPuzzleButton.classList.remove("is-stage-two-ready", "is-date-ready");
    openRetryPuzzleButton.disabled = true;
    const buttonText = openRetryPuzzleButton.querySelector("span");
    if (buttonText) {
      buttonText.textContent = "读取完成，第二片在线";
    }
  }

  if (artistGateStatus) {
    artistGateStatus.textContent = fromCache
      ? "TRACE RESTORED // FRAGMENT 02"
      : "TRACE ACCEPTED // FRAGMENT 02";
    artistGateStatus.classList.remove("is-failed");
    artistGateStatus.classList.add("is-complete");
  }

  if (openFragmentTwoRiftButton) {
    openFragmentTwoRiftButton.disabled = false;
  }
}

function solveArtistGatePuzzle() {
  artistGateLocked = true;
  artistGatePuzzle?.classList.add("is-resolving");

  if (artistGateStatus) {
    artistGateStatus.textContent = "TRACE LOCKED // UNFOLDING";
    artistGateStatus.classList.remove("is-failed");
    artistGateStatus.classList.add("is-complete");
  }

  artistPulseButtons.forEach((button) => {
    if (button.classList.contains("is-used")) {
      button.classList.add("is-accepted");
    }
    button.disabled = true;
  });

  updateArtistPulseSlots("complete");
  scrollFinalArtIntoView();

  setTimeout(() => {
    writeArtistGateCache();
    revealShardTwo();
  }, 1080);
}

function failArtistGatePuzzle() {
  artistGateLocked = true;
  artistGatePuzzle?.classList.add("is-failed");

  if (artistGateStatus) {
    artistGateStatus.textContent = "TRACE REJECTED";
    artistGateStatus.classList.remove("is-complete");
    artistGateStatus.classList.add("is-failed");
  }

  artistPulseButtons.forEach((button) => {
    if (button.classList.contains("is-used")) {
      button.classList.add("is-rejected");
    }
    button.disabled = true;
  });

  updateArtistPulseSlots("failed");

  setTimeout(() => {
    resetArtistGatePuzzle();
    artistGatePuzzle?.classList.add("is-open");
    artistGatePuzzle?.setAttribute("aria-hidden", "false");

    if (artistGateStatus) {
      artistGateStatus.textContent = "TRACE WAITING // 4 KEYS";
    }
  }, 1120);
}

function handleArtistPulseInput(button) {
  if (artistGateLocked || button.disabled) {
    return;
  }

  openArtistGatePuzzle();

  const value = button.dataset.artistPulse;
  artistGateInput.push(value);
  button.classList.add("is-used");
  button.disabled = true;
  updateArtistPulseSlots();

  if (artistGateInput.length === artistGateSequence.length) {
    if (artistGateInput.every((value, index) => value === artistGateSequence[index])) {
      solveArtistGatePuzzle();
    } else {
      failArtistGatePuzzle();
    }
  }
}

function resetRetryPuzzle() {
  retryPuzzleInput = [];
  retryPuzzleLocked = false;
  retryPuzzle?.classList.remove("is-failed", "is-resolving");

  retryPulseButtons.forEach((button) => {
    button.classList.remove("is-used", "is-rejected", "is-accepted");
    button.disabled = false;
  });

  updateRetryPulseSlots();
}

function revealShardOne({ fromCache = false } = {}) {
  retryPuzzleInput = [...retryPuzzleSequence];
  retryPuzzleLocked = true;

  finalSignalSection?.classList.add("is-fractured", "is-shard-one-open");
  finalArtFrame?.classList.add("is-fractured");
  finalArtFrame?.classList.toggle("is-fracturing", !fromCache);

  if (!fromCache && finalArtFrame) {
    setTimeout(() => {
      finalArtFrame.classList.remove("is-fracturing");
    }, 1320);
  }

  retryPuzzle?.classList.remove("is-failed", "is-resolving");
  retryPuzzle?.classList.add("is-open", "is-complete");
  retryPuzzle?.setAttribute("aria-hidden", "false");

  retryPulseButtons.forEach((button) => {
    const isSequencePulse = retryPuzzleSequence.includes(button.dataset.retryPulse);
    button.classList.toggle("is-used", isSequencePulse);
    button.classList.toggle("is-accepted", isSequencePulse);
    button.classList.remove("is-rejected");
    button.disabled = true;
  });

  updateRetryPulseSlots("complete");

  if (openRetryPuzzleButton) {
    openRetryPuzzleButton.classList.add("is-resolved");
    openRetryPuzzleButton.disabled = true;
    const buttonText = openRetryPuzzleButton.querySelector("span");
    if (buttonText) {
      buttonText.textContent = "读取完成，裂片在线";
    }
  }

  if (retryPuzzleStatus) {
    retryPuzzleStatus.textContent = fromCache
      ? "裂解记录已恢复：右上残片保持在线。"
      : "裂解完成：右上残片已暴露。";
    retryPuzzleStatus.classList.remove("is-failed");
    retryPuzzleStatus.classList.add("is-complete");
  }

  if (openFragmentRiftButton) {
    openFragmentRiftButton.disabled = false;
  }
}

function solveRetryPuzzle() {
  retryPuzzleLocked = true;
  retryPuzzle?.classList.add("is-resolving");

  if (retryPuzzleStatus) {
    retryPuzzleStatus.textContent = "六相位门牌锁定：玻璃层正在断裂。";
    retryPuzzleStatus.classList.remove("is-failed");
    retryPuzzleStatus.classList.add("is-complete");
  }

  retryPulseButtons.forEach((button) => {
    if (button.classList.contains("is-used")) {
      button.classList.add("is-accepted");
    }
    button.disabled = true;
  });

  updateRetryPulseSlots("complete");
  scrollFinalArtIntoView();

  setTimeout(() => {
    writeSignalRetryCache();
    revealShardOne();
  }, 1080);
}

function scrollFinalArtIntoView() {
  const target = finalArtFrame?.closest(".final-art-stage") || finalArtFrame || finalSignalSection;
  if (!target) {
    return;
  }

  target.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function failRetryPuzzle() {
  retryPuzzleLocked = true;
  retryPuzzle?.classList.add("is-failed");

  if (retryPuzzleStatus) {
    retryPuzzleStatus.textContent = "重试失败：错误脉冲被红线回收。";
    retryPuzzleStatus.classList.remove("is-complete");
    retryPuzzleStatus.classList.add("is-failed");
  }

  retryPulseButtons.forEach((button) => {
    if (button.classList.contains("is-used")) {
      button.classList.add("is-rejected");
    }
    button.disabled = true;
  });

  updateRetryPulseSlots("failed");

  setTimeout(() => {
    resetRetryPuzzle();
    retryPuzzle?.classList.add("is-open");
    retryPuzzle?.setAttribute("aria-hidden", "false");

    if (retryPuzzleStatus) {
      retryPuzzleStatus.textContent = "读取笔记：残片 -> 日期 -> 白门 -> 偏移 -> 失同步。按钮小字是门牌，按钮颜色是最终输入。";
    }
  }, 1120);
}

function handleRetryPulseInput(button) {
  if (retryPuzzleLocked || button.disabled) {
    return;
  }

  openRetryPuzzle();

  const value = button.dataset.retryPulse;
  retryPuzzleInput.push(value);
  button.classList.add("is-used");
  button.disabled = true;
  updateRetryPulseSlots();

  if (retryPuzzleInput.length === retryPuzzleSequence.length) {
    if (retryPuzzleInput.every((value, index) => value === retryPuzzleSequence[index])) {
      solveRetryPuzzle();
    } else {
      failRetryPuzzle();
    }
  }
}

function revealFragmentAnswer({ fromCache = false } = {}) {
  fragmentRift?.classList.add("is-fragment-solved");

  if (fragmentResult) {
    fragmentResult.textContent = "BPM 182";
    fragmentResult.setAttribute("aria-hidden", "false");
  }

  if (fragmentAnswerInput) {
    fragmentAnswerInput.value = "182";
    fragmentAnswerInput.disabled = true;
  }

  if (fragmentAnswerSubmit) {
    fragmentAnswerSubmit.disabled = true;
  }

  if (fragmentAnswerStatus) {
    fragmentAnswerStatus.textContent = fromCache
      ? "TRACE RESTORED // RESULT LOCKED"
      : "TRACE ACCEPTED // RESULT UNSEALED";
    fragmentAnswerStatus.classList.remove("is-failed");
    fragmentAnswerStatus.classList.add("is-complete");
  }

  revealArtistGateRetryEntry();
}

function openFragmentRift() {
  if (!fragmentRift || openFragmentRiftButton?.disabled) {
    return;
  }

  clearTimeout(fragmentRiftCloseTimer);
  fragmentRiftLastFocusedElement = document.activeElement;

  fragmentRift.classList.remove("is-closing", "is-failed");
  fragmentRift.classList.add("is-open");
  fragmentRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (readFragmentAnswerCache()) {
    revealFragmentAnswer({
      fromCache: true
    });
  }

  const focusTarget = fragmentAnswerInput?.disabled
    ? fragmentRift.querySelector(".signal-rift-close")
    : fragmentAnswerInput;

  if (focusTarget && typeof focusTarget.focus === "function") {
    focusTarget.focus();
  }
}

function closeFragmentRift() {
  if (!fragmentRift || !fragmentRift.classList.contains("is-open")) {
    return;
  }

  fragmentRift.classList.add("is-closing");
  fragmentRift.classList.remove("is-open");
  fragmentRift.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  fragmentRiftCloseTimer = setTimeout(() => {
    fragmentRift.classList.remove("is-closing", "is-failed");

    if (
      fragmentRiftLastFocusedElement &&
      typeof fragmentRiftLastFocusedElement.focus === "function"
    ) {
      fragmentRiftLastFocusedElement.focus();
    }
  }, 340);
}

function handleFragmentAnswerSubmit(event) {
  event?.preventDefault();

  const answer = fragmentAnswerInput?.value.trim();
  if (answer === "182") {
    writeFragmentAnswerCache();
    revealFragmentAnswer();
    return;
  }

  fragmentRift?.classList.remove("is-failed");
  fragmentRift?.offsetHeight;
  fragmentRift?.classList.add("is-open", "is-failed");
  fragmentRift?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (fragmentAnswerStatus) {
    fragmentAnswerStatus.textContent = "TRACE REJECTED // SUM OUT OF RANGE";
    fragmentAnswerStatus.classList.remove("is-complete");
    fragmentAnswerStatus.classList.add("is-failed");
  }
}

function revealFragmentTwoAnswer({ fromCache = false } = {}) {
  fragmentTwoRift?.classList.add("is-fragment-solved");

  if (fragmentTwoResult) {
    fragmentTwoResult.textContent = "Artist：Essbee";
    fragmentTwoResult.setAttribute("aria-hidden", "false");
  }

  if (fragmentTwoAnswerInput) {
    fragmentTwoAnswerInput.value = "Essbee";
    fragmentTwoAnswerInput.disabled = true;
  }

  if (fragmentTwoAnswerSubmit) {
    fragmentTwoAnswerSubmit.disabled = true;
  }

  if (fragmentTwoAnswerStatus) {
    fragmentTwoAnswerStatus.textContent = fromCache
      ? "TRACE RESTORED // CREDIT LOCKED"
      : "TRACE ACCEPTED // CREDIT UNSEALED";
    fragmentTwoAnswerStatus.classList.remove("is-failed");
    fragmentTwoAnswerStatus.classList.add("is-complete");
  }

  revealNextDateEntry();
}

function revealNextDateEntry() {
  if (!openRetryPuzzleButton) {
    return;
  }

  openRetryPuzzleButton.disabled = false;
  openRetryPuzzleButton.classList.remove("is-resolved", "is-stage-two-ready", "is-date-ready");
  openRetryPuzzleButton.classList.add("is-date-ready");
  openRetryPuzzleButton.setAttribute("aria-label", "打开 06-07 坐标");

  const buttonText = openRetryPuzzleButton.querySelector("span");
  if (buttonText) {
    buttonText.textContent = "06-07";
  }
}

function openFragmentTwoRift() {
  if (!fragmentTwoRift || openFragmentTwoRiftButton?.disabled) {
    return;
  }

  clearTimeout(fragmentTwoRiftCloseTimer);
  fragmentTwoRiftLastFocusedElement = document.activeElement;

  fragmentTwoRift.classList.remove("is-closing", "is-failed");
  fragmentTwoRift.classList.add("is-open");
  fragmentTwoRift.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (readFragmentTwoAnswerCache()) {
    revealFragmentTwoAnswer({
      fromCache: true
    });
  }

  const focusTarget = fragmentTwoAnswerInput?.disabled
    ? fragmentTwoRift.querySelector(".signal-rift-close")
    : fragmentTwoAnswerInput;

  if (focusTarget && typeof focusTarget.focus === "function") {
    focusTarget.focus();
  }
}

function closeFragmentTwoRift() {
  if (!fragmentTwoRift || !fragmentTwoRift.classList.contains("is-open")) {
    return;
  }

  fragmentTwoRift.classList.add("is-closing");
  fragmentTwoRift.classList.remove("is-open");
  fragmentTwoRift.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  fragmentTwoRiftCloseTimer = setTimeout(() => {
    fragmentTwoRift.classList.remove("is-closing", "is-failed");

    if (
      fragmentTwoRiftLastFocusedElement &&
      typeof fragmentTwoRiftLastFocusedElement.focus === "function"
    ) {
      fragmentTwoRiftLastFocusedElement.focus();
    }
  }, 340);
}

function normalizeFragmentTwoAnswer(value = "") {
  return value
    .trim()
    .toLowerCase()
    .replace(/^artist\s*[:：]\s*/, "")
    .replace(/[^a-z]/g, "");
}

function handleFragmentTwoAnswerSubmit(event) {
  event?.preventDefault();

  const answer = normalizeFragmentTwoAnswer(fragmentTwoAnswerInput?.value);
  if (answer === "essbee") {
    writeFragmentTwoAnswerCache();
    revealFragmentTwoAnswer();
    return;
  }

  fragmentTwoWrongCount += 1;

  fragmentTwoRift?.classList.remove("is-failed");
  fragmentTwoRift?.offsetHeight;
  fragmentTwoRift?.classList.add("is-open", "is-failed");
  fragmentTwoRift?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (fragmentTwoWrongCount >= 3) {
    writeFragmentTwoAnswerCache();
    revealFragmentTwoAnswer();
    return;
  }

  if (fragmentTwoAnswerStatus) {
    fragmentTwoAnswerStatus.textContent = "TRACE REJECTED // CREDIT FIELD MISMATCH";
    fragmentTwoAnswerStatus.classList.remove("is-complete");
    fragmentTwoAnswerStatus.classList.add("is-failed");
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

  if (readSignalRetryCache()) {
    revealShardOne({
      fromCache: true
    });
  }
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

if (openRetryPuzzleButton) {
  openRetryPuzzleButton.addEventListener("click", openRetryPuzzle);
}

if (openPhasePlateButton) {
  openPhasePlateButton.addEventListener("click", openPhasePlateRift);
}

openSettlementPlateButtons.forEach((button) => {
  button.addEventListener("click", openSettlementRift);
});

retryPulseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleRetryPulseInput(button);
  });
});

artistPulseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleArtistPulseInput(button);
  });
});

if (openFragmentRiftButton) {
  openFragmentRiftButton.addEventListener("click", openFragmentRift);
}

if (openFragmentTwoRiftButton) {
  openFragmentTwoRiftButton.addEventListener("click", openFragmentTwoRift);
}

if (fragmentAnswerForm) {
  fragmentAnswerForm.addEventListener("submit", handleFragmentAnswerSubmit);
}

if (fragmentAnswerSubmit) {
  fragmentAnswerSubmit.addEventListener("click", handleFragmentAnswerSubmit);
}

if (fragmentAnswerInput) {
  fragmentAnswerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleFragmentAnswerSubmit(event);
    }
  });
}

if (fragmentTwoAnswerForm) {
  fragmentTwoAnswerForm.addEventListener("submit", handleFragmentTwoAnswerSubmit);
}

if (fragmentTwoAnswerSubmit) {
  fragmentTwoAnswerSubmit.addEventListener("click", handleFragmentTwoAnswerSubmit);
}

if (fragmentTwoAnswerInput) {
  fragmentTwoAnswerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleFragmentTwoAnswerSubmit(event);
    }
  });
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

fragmentRiftCloseTargets.forEach((target) => {
  target.addEventListener("click", closeFragmentRift);
});

fragmentTwoRiftCloseTargets.forEach((target) => {
  target.addEventListener("click", closeFragmentTwoRift);
});

phasePlateCloseTargets.forEach((target) => {
  target.addEventListener("click", closePhasePlateRift);
});

settlementRiftCloseTargets.forEach((target) => {
  target.addEventListener("click", closeSettlementRift);
});

dateRiftCloseTargets.forEach((target) => {
  target.addEventListener("click", closeDateRift);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDateRift();
    closeSettlementRift();
    closePhasePlateRift();
    closeFragmentTwoRift();
    closeFragmentRift();
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

if (readFragmentAnswerCache()) {
  revealFragmentAnswer({
    fromCache: true
  });
}

if (readArtistGateCache()) {
  revealShardTwo({
    fromCache: true
  });
}

if (readFragmentTwoAnswerCache()) {
  revealFragmentTwoAnswer({
    fromCache: true
  });
}

loadTips();
setInterval(showNextTip, 5000);

loadRankingPreview();
