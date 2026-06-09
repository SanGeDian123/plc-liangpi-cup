let adminToken = localStorage.getItem("adminToken");
const ADMIN_API_URL =
  window.location.protocol === "file:" ? "http://localhost:3000" : API_URL;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;
const uploaded = { left: null, right: null };
const diffColor = { EZ: "#00c864", HD: "#46B1E1", IN: "#d72b2b", AT: "#555555" };
const bg = new Image();
const canvasFont = '"Phi", "Microsoft YaHei", Arial, sans-serif';

bg.src = new URL("../assets/bp-background.jpg", document.currentScript.src).href;

function $(id) {
  return document.getElementById(id);
}

function showLogin() {
  $("loginPanel").style.display = "grid";
  $("bpPanel").style.display = "none";
}

function showTool() {
  $("loginPanel").style.display = "none";
  $("bpPanel").style.display = "grid";
  draw();
}

async function adminLogin(event) {
  event.preventDefault();

  const password = $("adminPassword").value.trim();
  const msg = $("loginMsg");
  msg.innerText = "";

  if (!password) {
    msg.innerText = "请输入管理员密码";
    return;
  }

  try {
    const res = await fetch(`${ADMIN_API_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    if (!res.ok) {
      msg.innerText = "密码错误，请重试";
      localStorage.removeItem("adminToken");
      adminToken = null;
      return;
    }

    const data = await res.json();
    adminToken = data.token;
    localStorage.setItem("adminToken", adminToken);
    $("adminPassword").value = "";
    showTool();
  } catch (error) {
    msg.innerText = "登录失败，请稍后重试";
  }
}

function logoutAdmin() {
  localStorage.removeItem("adminToken");
  adminToken = null;
  showLogin();
}

function fitText(text, maxWidth, size, font = canvasFont) {
  let currentSize = size;

  do {
    ctx.font = `${currentSize}px ${font}`;
    currentSize -= 1;
  } while (ctx.measureText(text).width > maxWidth && currentSize > 18);

  return currentSize + 1;
}

function drawCover(img, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  if (!img) {
    ctx.fillStyle = "#111";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#444";
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = "#777";
    ctx.font = `34px ${canvasFont}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("导入曲绘", x + w / 2, y + h / 2);
    ctx.restore();
    return;
  }

  const ratio = Math.max(w / img.width, h / img.height);
  const nw = img.width * ratio;
  const nh = img.height * ratio;
  ctx.drawImage(img, x + (w - nw) / 2, y + (h - nh) / 2, nw, nh);
  ctx.restore();
}

function fillCenteredText(text, x, y) {
  const metrics = ctx.measureText(text);
  const offsetY =
    (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;

  ctx.fillText(text, x, y + offsetY);
}

function strokeCenteredText(text, x, y) {
  const metrics = ctx.measureText(text);
  const offsetY =
    (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;

  ctx.strokeText(text, x, y + offsetY);
}

function drawCard(side, data) {
  const isLeft = side === "left";
  const x = isLeft ? 212 : 912;
  const y = 324;
  const artW = 470;
  const artH = 250;
  const headerW = 238;
  const headerH = 56;
  const hx = x + artW - headerW;
  const hy = y - headerH;

  ctx.save();
  ctx.fillStyle = "#ffd400";
  ctx.fillRect(hx, hy, headerW, headerH);
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 2;
  for (let i = -headerH; i < headerW; i += 8) {
    ctx.beginPath();
    ctx.moveTo(hx + i, hy + headerH);
    ctx.lineTo(hx + i + headerH, hy);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.75)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  const playerSize = fitText(data.player, headerW - 22, 44);
  ctx.font = `${playerSize}px ${canvasFont}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  strokeCenteredText(data.player, hx + headerW / 2, hy + headerH / 2);
  fillCenteredText(data.player, hx + headerW / 2, hy + headerH / 2);
  ctx.restore();

  drawCover(data.img, x, y, artW, artH);

  const titleX = x + 140;
  const titleY = y + artH - 70;
  const titleW = artW - 140;
  const titleH = 68;
  ctx.fillStyle = "rgba(238,238,238,.82)";
  ctx.fillRect(titleX, titleY, titleW, titleH);
  ctx.strokeStyle = "rgba(0,0,0,.75)";
  ctx.lineWidth = 2;
  ctx.strokeRect(titleX, titleY, titleW, titleH);
  ctx.fillStyle = "#111";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const songSize = fitText(data.song, titleW - 24, 42);
  ctx.font = `${songSize}px ${canvasFont}`;
  ctx.fillText(data.song, titleX + titleW / 2, titleY + titleH / 2 + 2);

  const diffW = data.diff === "AT" ? 124 : 125;
  const diffH = 56;
  const dx = x + artW - diffW;
  const dy = y + artH;
  ctx.fillStyle = diffColor[data.diff] || "#555";
  ctx.fillRect(dx, dy, diffW, diffH);
  ctx.fillStyle = "white";
  ctx.strokeStyle = "rgba(0,0,0,.55)";
  ctx.lineWidth = 3;
  ctx.font = `46px ${canvasFont}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeText(data.diff, dx + diffW / 2, dy + diffH / 2 + 2);
  ctx.fillText(data.diff, dx + diffW / 2, dy + diffH / 2 + 2);

  if (data.state === "ban") {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.32)";
    ctx.fillRect(x, y, artW, artH + diffH);
    ctx.fillStyle = "rgba(255,215,0,.88)";
    ctx.fillRect(x + 120, y + 90, artW - 240, 62);
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 120, y + 90, artW - 240, 62);
    ctx.fillStyle = "#111";
    ctx.font = `42px ${canvasFont}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("BAN", x + artW / 2, y + 121);
    ctx.restore();
  }
}

function draw() {
  if (!canvas || $("bpPanel").style.display === "none") {
    return;
  }

  ctx.clearRect(0, 0, W, H);

  if (bg.complete && bg.naturalWidth > 0) {
    ctx.drawImage(bg, 0, 0, W, H);
  } else {
    ctx.fillStyle = "#101010";
    ctx.fillRect(0, 0, W, H);
  }

  ctx.save();
  ctx.shadowColor = "rgba(255,255,255,.45)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "white";
  ctx.font = `48px ${canvasFont}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText($("modeTitle").value, W / 2, 110);
  ctx.restore();

  drawCard("left", {
    player: $("leftPlayer").value || "Player 1",
    song: $("leftSong").value || "Song Name",
    diff: $("leftDiff").value,
    state: $("leftState").value,
    img: uploaded.left
  });
  drawCard("right", {
    player: $("rightPlayer").value || "Player 2",
    song: $("rightSong").value || "Song Name",
    diff: $("rightDiff").value,
    state: $("rightState").value,
    img: uploaded.right
  });
}

function loadFile(input, key) {
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  const img = new Image();
  img.onload = () => {
    uploaded[key] = img;
    draw();
  };
  img.src = URL.createObjectURL(file);
}

function exportPng() {
  draw();

  const a = document.createElement("a");
  const name = ($("fileName").value || "PLC_BP_Overview").replace(/[\\/:*?"<>|]/g, "_");
  a.download = `${name}.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
}

[
  "modeTitle",
  "fileName",
  "leftPlayer",
  "leftSong",
  "leftDiff",
  "leftState",
  "rightPlayer",
  "rightSong",
  "rightDiff",
  "rightState"
].forEach((id) => {
  $(id).addEventListener("input", draw);
});

$("loginForm").addEventListener("submit", adminLogin);
$("logoutBtn").addEventListener("click", logoutAdmin);
$("leftArt").addEventListener("change", (event) => loadFile(event.target, "left"));
$("rightArt").addEventListener("change", (event) => loadFile(event.target, "right"));
$("renderBtn").addEventListener("click", draw);
$("exportBtn").addEventListener("click", exportPng);
bg.onload = draw;

if (document.fonts) {
  document.fonts.ready.then(draw);
}

if (adminToken) {
  showTool();
} else {
  showLogin();
}
