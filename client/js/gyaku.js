const unlockScene = document.getElementById("unlockScene");
const coverDownloadTargets = document.querySelectorAll("[data-cover-download]");
const downloadStatus = document.getElementById("downloadStatus");
const lightParticles = document.getElementById("lightParticles");
const openingSequence = document.getElementById("openingSequence");
const motionControl = document.getElementById("motionControl");
const motionControlLabel = document.getElementById("motionControlLabel");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const coarsePointer = window.matchMedia("(pointer: coarse)");
const supportsDeviceOrientation = "DeviceOrientationEvent" in window;
const requiresMotionPermission = supportsDeviceOrientation &&
  typeof DeviceOrientationEvent.requestPermission === "function";

let downloadStatusTimer = null;
let openingAnimationTimer = null;
let pointerFrame = null;
let pointerX = 0;
let pointerY = 0;
let motionFrame = null;
let motionBaseline = null;
let motionListening = false;
let motionX = 0;
let motionY = 0;

const openingAnimationDurationMs = 1850;

function finishOpeningAnimation() {
  window.clearTimeout(openingAnimationTimer);
  openingAnimationTimer = null;
  document.body.classList.remove("is-opening", "is-opening-active");
}

function beginOpeningAnimation({ restart = false } = {}) {
  window.clearTimeout(openingAnimationTimer);

  if (reduceMotion.matches) {
    finishOpeningAnimation();
    return;
  }

  if (restart) {
    document.body.classList.remove("is-opening", "is-opening-active");
    void openingSequence?.offsetWidth;
  }

  document.body.classList.add("is-opening");
  window.requestAnimationFrame(() => {
    document.body.classList.add("is-opening-active");
  });

  openingAnimationTimer = window.setTimeout(
    finishOpeningAnimation,
    openingAnimationDurationMs
  );
}

function handleReducedMotionChange() {
  configureMotionControl();

  if (reduceMotion.matches) {
    finishOpeningAnimation();
  }
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function getScreenOrientationAngle() {
  const screenAngle = Number(window.screen?.orientation?.angle);

  if (Number.isFinite(screenAngle)) {
    return ((screenAngle % 360) + 360) % 360;
  }

  const legacyAngle = Number(window.orientation);
  return Number.isFinite(legacyAngle)
    ? ((legacyAngle % 360) + 360) % 360
    : 0;
}

function normalizeDeviceTilt(betaDelta, gammaDelta, screenAngle = 0) {
  let horizontal = gammaDelta;
  let vertical = betaDelta;

  if (screenAngle === 90) {
    horizontal = betaDelta;
    vertical = -gammaDelta;
  } else if (screenAngle === 270) {
    horizontal = -betaDelta;
    vertical = gammaDelta;
  } else if (screenAngle === 180) {
    horizontal = -gammaDelta;
    vertical = -betaDelta;
  }

  return {
    x: clamp(horizontal / 18, -1, 1),
    y: clamp(vertical / 22, -1, 1)
  };
}

function resetSceneDepth() {
  motionX = 0;
  motionY = 0;
  unlockScene?.style.setProperty("--scene-x", "0px");
  unlockScene?.style.setProperty("--scene-y", "0px");
  unlockScene?.style.setProperty("--particle-x", "0px");
  unlockScene?.style.setProperty("--particle-y", "0px");
}

function setMotionControlState(state, label) {
  if (!motionControl || !motionControlLabel) {
    return;
  }

  motionControl.dataset.state = state;
  motionControlLabel.textContent = label;
  motionControl.setAttribute("aria-pressed", state === "active" ? "true" : "false");
}

function renderMotionDepth() {
  motionFrame = null;

  if (!unlockScene || !motionListening || reduceMotion.matches) {
    return;
  }

  unlockScene.style.setProperty("--scene-x", `${motionX * -10}px`);
  unlockScene.style.setProperty("--scene-y", `${motionY * -7}px`);
  unlockScene.style.setProperty("--particle-x", `${motionX * 7}px`);
  unlockScene.style.setProperty("--particle-y", `${motionY * 5}px`);
}

function handleDeviceOrientation(event) {
  if (
    !motionListening ||
    reduceMotion.matches ||
    !Number.isFinite(event.beta) ||
    !Number.isFinite(event.gamma)
  ) {
    return;
  }

  if (!motionBaseline) {
    motionBaseline = {
      beta: event.beta,
      gamma: event.gamma
    };
    setMotionControlState("active", "MOTION ON");
    return;
  }

  const tilt = normalizeDeviceTilt(
    event.beta - motionBaseline.beta,
    event.gamma - motionBaseline.gamma,
    getScreenOrientationAngle()
  );

  motionX += (tilt.x - motionX) * .18;
  motionY += (tilt.y - motionY) * .18;

  if (!motionFrame) {
    motionFrame = window.requestAnimationFrame(renderMotionDepth);
  }
}

function stopMotionTracking() {
  window.removeEventListener("deviceorientation", handleDeviceOrientation, true);
  motionListening = false;
  motionBaseline = null;

  if (motionFrame) {
    window.cancelAnimationFrame(motionFrame);
    motionFrame = null;
  }

  resetSceneDepth();
  setMotionControlState("idle", requiresMotionPermission ? "ENABLE MOTION" : "MOTION OFF");
}

function startMotionTracking() {
  if (!supportsDeviceOrientation || reduceMotion.matches || motionListening) {
    return;
  }

  motionListening = true;
  motionBaseline = null;
  window.addEventListener("deviceorientation", handleDeviceOrientation, true);
  setMotionControlState("listening", "MOTION READY");
}

async function requestMotionAccess() {
  if (!supportsDeviceOrientation || reduceMotion.matches) {
    return;
  }

  if (motionListening) {
    stopMotionTracking();
    return;
  }

  if (!requiresMotionPermission) {
    startMotionTracking();
    return;
  }

  setMotionControlState("listening", "REQUESTING");

  try {
    const permissionState = await DeviceOrientationEvent.requestPermission();

    if (permissionState === "granted") {
      startMotionTracking();
      return;
    }
  } catch (error) {
    // Permission can only be requested from a direct user gesture.
  }

  setMotionControlState("denied", "MOTION BLOCKED");
}

function configureMotionControl() {
  if (!motionControl) {
    return;
  }

  const isMobileDevice = coarsePointer.matches || navigator.maxTouchPoints > 0;
  motionControl.hidden = !supportsDeviceOrientation || !isMobileDevice || reduceMotion.matches;

  if (motionControl.hidden) {
    stopMotionTracking();
    return;
  }

  if (requiresMotionPermission) {
    setMotionControlState("idle", "ENABLE MOTION");
    return;
  }

  startMotionTracking();
}

function handleScreenOrientationChange() {
  motionBaseline = null;
  resetSceneDepth();
}

function renderPointerDepth() {
  pointerFrame = null;
  unlockScene?.style.setProperty("--scene-x", `${pointerX * -8}px`);
  unlockScene?.style.setProperty("--scene-y", `${pointerY * -5}px`);
}

function handlePointerMove(event) {
  if (!unlockScene || reduceMotion.matches || !finePointer.matches) {
    return;
  }

  pointerX = (event.clientX / window.innerWidth - .5) * 2;
  pointerY = (event.clientY / window.innerHeight - .5) * 2;

  if (!pointerFrame) {
    pointerFrame = window.requestAnimationFrame(renderPointerDepth);
  }
}

function createLightParticles() {
  if (!lightParticles || reduceMotion.matches) {
    return;
  }

  const particleCount = window.innerWidth < 700 ? 18 : 34;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    const seed = (index * 47 + 19) % 101;
    const verticalSeed = (index * 71 + 11) % 97;
    const size = 1 + (index % 3) * .65;

    particle.className = "light-particle";
    particle.style.left = `${seed}%`;
    particle.style.top = `${verticalSeed}%`;
    particle.style.setProperty("--size", `${size}px`);
    particle.style.setProperty("--duration", `${4.8 + (index % 7) * .72}s`);
    particle.style.setProperty("--delay", `${-1 * (index % 9) * .63}s`);
    particle.style.setProperty("--drift", `${(index % 2 ? 1 : -1) * (8 + index % 13)}px`);
    fragment.appendChild(particle);
  }

  lightParticles.replaceChildren(fragment);
}

function showDownloadStatus(event) {
  const activeDownloadTarget = event?.currentTarget;

  if (!activeDownloadTarget || !downloadStatus) {
    return;
  }

  window.clearTimeout(downloadStatusTimer);
  coverDownloadTargets.forEach((target) => target.classList.remove("is-downloading"));
  activeDownloadTarget.classList.add("is-downloading");
  downloadStatus.textContent = "CHART PACKAGE // DOWNLOAD STARTED";
  downloadStatus.classList.add("is-visible");

  downloadStatusTimer = window.setTimeout(() => {
    activeDownloadTarget.classList.remove("is-downloading");
    downloadStatus.classList.remove("is-visible");
  }, 1800);
}

window.addEventListener("pointermove", handlePointerMove, { passive: true });
coverDownloadTargets.forEach((target) => {
  target.addEventListener("click", showDownloadStatus);
});
motionControl?.addEventListener("click", requestMotionAccess);
window.addEventListener("orientationchange", handleScreenOrientationChange);
window.screen?.orientation?.addEventListener?.("change", handleScreenOrientationChange);
reduceMotion.addEventListener?.("change", handleReducedMotionChange);
coarsePointer.addEventListener?.("change", configureMotionControl);

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    beginOpeningAnimation({ restart: true });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    window.location.href = "./event.html#finalSignal";
  }
});

createLightParticles();
configureMotionControl();

if (document.readyState === "complete") {
  beginOpeningAnimation();
} else {
  window.addEventListener("load", () => beginOpeningAnimation(), { once: true });
}
