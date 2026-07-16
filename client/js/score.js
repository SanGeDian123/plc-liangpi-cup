const configuredApiBase = typeof API_URL === "string" ? API_URL : "";

const authTabs = document.querySelectorAll("[data-auth-mode]");
const authPanes = document.querySelectorAll("[data-auth-pane]");
const sessionTokenInput = document.getElementById("sessionToken");
const platformNameInput = document.getElementById("platformName");
const platformIdInput = document.getElementById("platformId");
const requestQrButton = document.getElementById("requestQrButton");
const qrBox = document.getElementById("qrBox");
const qrImage = document.getElementById("qrImage");
const qrStatus = document.getElementById("qrStatus");
const queryB30Button = document.getElementById("queryB30Button");
const queryRksButton = document.getElementById("queryRksButton");
const queryBnButton = document.getElementById("queryBnButton");
const imageBnButton = document.getElementById("imageBnButton");
const bestCountInput = document.getElementById("bestCount");
const songForm = document.getElementById("songForm");
const songQueryInput = document.getElementById("songQuery");
const songDifficultySelect = document.getElementById("songDifficulty");
const scoreStatus = document.getElementById("scoreStatus");
const summaryGrid = document.getElementById("summaryGrid");
const recordsTable = document.getElementById("recordsTable");
const imageResult = document.getElementById("imageResult");
const generatedImage = document.getElementById("generatedImage");

let authMode = "token";
let qrPollTimer = null;
let imageObjectUrl = null;
let resolvedScoreApiBase = null;
let resolvingScoreApiBase = null;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setStatus(message, tone = "idle") {
  scoreStatus.textContent = message;
  scoreStatus.dataset.tone = tone;
}

function stripTrailingSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

function getScoreApiCandidates() {
  const candidates = [];
  const savedApiBase = localStorage.getItem("plcScoreApiUrl");
  const isLocalPage =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (savedApiBase) {
    candidates.push(savedApiBase);
  }

  candidates.push("http://127.0.0.1:3000");
  candidates.push("http://localhost:3000");

  if (configuredApiBase) {
    candidates.push(configuredApiBase);
  }

  if (isLocalPage && window.location.port === "3000") {
    candidates.push(window.location.origin);
  }

  candidates.push("");

  return Array.from(new Set(candidates.map(stripTrailingSlash)));
}

async function isScoreProxyAvailable(apiBase) {
  try {
    const response = await fetch(`${apiBase}/phigros/proxy/status`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return false;
    }

    const payload = await response.json();
    return (
      payload?.proxy === "phigros" &&
      payload?.engine === "next-phi-backend"
    );
  } catch (error) {
    return false;
  }
}

async function getScoreApiBase() {
  if (resolvedScoreApiBase !== null) {
    return resolvedScoreApiBase;
  }

  if (resolvingScoreApiBase) {
    return resolvingScoreApiBase;
  }

  resolvingScoreApiBase = (async () => {
    for (const candidate of getScoreApiCandidates()) {
      if (await isScoreProxyAvailable(candidate)) {
        resolvedScoreApiBase = candidate;
        localStorage.setItem("plcScoreApiUrl", candidate);
        return candidate;
      }
    }

    resolvedScoreApiBase = stripTrailingSlash(configuredApiBase);
    return resolvedScoreApiBase;
  })().finally(() => {
    resolvingScoreApiBase = null;
  });

  return resolvingScoreApiBase;
}

function clearOutput() {
  summaryGrid.hidden = true;
  recordsTable.hidden = true;
  imageResult.hidden = true;
  summaryGrid.innerHTML = "";
  recordsTable.innerHTML = "";

  if (imageObjectUrl) {
    URL.revokeObjectURL(imageObjectUrl);
    imageObjectUrl = null;
  }
}

function setBusy(isBusy) {
  [
    queryB30Button,
    queryRksButton,
    queryBnButton,
    imageBnButton,
    requestQrButton
  ].forEach((button) => {
    button.disabled = isBusy;
  });
}

function switchAuthMode(mode) {
  authMode = mode;

  authTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.authMode === mode);
  });

  authPanes.forEach((pane) => {
    pane.classList.toggle("is-active", pane.dataset.authPane === mode);
  });
}

function getBestCount() {
  const n = Number(bestCountInput.value);

  if (!Number.isInteger(n) || n <= 0 || n > 100) {
    throw new Error("Best N 必须是 1 到 100 之间的整数");
  }

  return n;
}

function getIdentityPayload() {
  if (authMode === "platform") {
    const platform = platformNameInput.value.trim();
    const platformId = platformIdInput.value.trim();

    if (!platform || !platformId) {
      throw new Error("请填写平台和平台ID");
    }

    return {
      data_source: "internal",
      platform,
      platform_id: platformId
    };
  }

  const token = sessionTokenInput.value.trim();

  if (!token) {
    throw new Error("请输入 SessionToken");
  }

  return {
    data_source: "internal",
    token
  };
}

async function readJsonResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  if (/^\s*<!doctype html/i.test(text) || /^\s*<html/i.test(text)) {
    return {
      message: "查分代理未部署或请求地址错误，请确认本地 3000 端口服务正在运行"
    };
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return {
      message: text
    };
  }
}

function getResponseData(payload) {
  if (payload && Number(payload.code) >= 400) {
    throw new Error(
      payload.detail || payload.message || "Next-Phi-Backend 返回错误"
    );
  }

  return payload && Object.prototype.hasOwnProperty.call(payload, "data")
    ? payload.data
    : payload;
}

async function requestJson(path, options = {}) {
  const apiBase = await getScoreApiBase();
  const response = await fetch(`${apiBase}${path}`, {
    method: options.method || "POST",
    headers: options.body
      ? {
          "Content-Type": "application/json"
        }
      : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const payload = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      payload?.detail || payload?.message || payload?.error || "请求失败"
    );
  }

  return getResponseData(payload);
}

async function requestImage(path, body) {
  const apiBase = await getScoreApiBase();
  const response = await fetch(`${apiBase}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const payload = await readJsonResponse(response);
    throw new Error(
      payload?.detail || payload?.message || payload?.error || "图片生成失败"
    );
  }

  return response.blob();
}

function formatScore(value) {
  const score = Number(value);
  return Number.isFinite(score) ? Math.round(score).toLocaleString() : "-";
}

function formatPercent(value) {
  const acc = Number(value);
  return Number.isFinite(acc) ? `${acc.toFixed(4)}%` : "-";
}

function formatRks(value) {
  const rks = Number(value);
  return Number.isFinite(rks) ? rks.toFixed(4) : "-";
}

function renderSummary(items) {
  summaryGrid.hidden = false;
  summaryGrid.innerHTML = items
    .map(
      (item) => `
        <div class="summary-item">
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.value)}</strong>
        </div>
      `
    )
    .join("");
}

function renderRecords(records, options = {}) {
  const safeRecords = Array.isArray(records) ? records : [];

  recordsTable.hidden = false;

  if (safeRecords.length === 0) {
    recordsTable.innerHTML = '<div class="empty-records">没有可展示的成绩</div>';
    return;
  }

  recordsTable.innerHTML = `
    <div class="record-head">
      <span>#</span>
      <span>曲目</span>
      <span>难度</span>
      <span>分数</span>
      <span>ACC</span>
      <span>RKS</span>
    </div>
    ${safeRecords
      .map((record, index) => {
        const difficulty = record.difficulty || record.difficulty_str || "-";
        const badges = [
          record.is_ap ? "AP" : "",
          record.is_fc ? "FC" : record.fc ? "FC" : ""
        ]
          .filter(Boolean)
          .join(" ");

        return `
          <div class="record-row">
            <span>${index + 1}</span>
            <span>
              <strong>${escapeHtml(record.song_name || record.song_id || "-")}</strong>
              <small>${escapeHtml(record.song_id || options.source || "")}</small>
            </span>
            <span>${escapeHtml(difficulty)}${badges ? `<em>${badges}</em>` : ""}</span>
            <span>${formatScore(record.score)}</span>
            <span>${formatPercent(record.acc)}</span>
            <span>${formatRks(record.rks)}</span>
          </div>
        `;
      })
      .join("")}
  `;
}

function normalizeB30Records(data) {
  const top27 = Array.isArray(data?.top_27) ? data.top_27 : [];
  const ap3 = Array.isArray(data?.top_3_ap) ? data.top_3_ap : [];

  return [
    ...top27.map((record) => ({
      ...record,
      song_name: record.song_name || record.song_id
    })),
    ...ap3.map((record) => ({
      ...record,
      song_name: record.song_name || record.song_id,
      is_ap: true
    }))
  ];
}

async function requestRksWithFallback(identityPayload) {
  try {
    const data = await requestJson("/phigros/rks", {
      body: identityPayload
    });

    return {
      data,
      fallback: false
    };
  } catch (error) {
    const b30Data = await requestJson("/phigros/b30", {
      body: identityPayload
    });

    return {
      data: {
        overall_rks: b30Data?.overall_rks,
        records: normalizeB30Records(b30Data)
      },
      fallback: true,
      fallbackMessage: error.message
    };
  }
}

async function runQuery(label, handler) {
  setBusy(true);
  clearOutput();
  setStatus(`${label}中...`, "loading");

  try {
    await handler();
    setStatus(`${label}完成`, "success");
  } catch (error) {
    setStatus(error.message || "查询失败", "error");
  } finally {
    setBusy(false);
  }
}

async function queryB30() {
  await runQuery("查询 B30", async () => {
    const data = await requestJson("/phigros/b30", {
      body: getIdentityPayload()
    });
    const records = normalizeB30Records(data);

    renderSummary([
      {
        label: "综合 RKS",
        value: formatRks(data?.overall_rks)
      },
      {
        label: "B27",
        value: String(Array.isArray(data?.top_27) ? data.top_27.length : 0)
      },
      {
        label: "AP Top3",
        value: String(Array.isArray(data?.top_3_ap) ? data.top_3_ap.length : 0)
      }
    ]);
    renderRecords(records);
  });
}

async function queryRks() {
  await runQuery("读取 RKS", async () => {
    const { data, fallback } = await requestRksWithFallback(getIdentityPayload());
    const records = Array.isArray(data?.records) ? data.records : [];

    renderSummary([
      {
        label: "综合 RKS",
        value: formatRks(data?.overall_rks)
      },
      {
        label: "有效谱面",
        value: String(records.length)
      },
      {
        label: fallback ? "来源" : "最高单曲 RKS",
        value: fallback ? "B30 兜底" : formatRks(records[0]?.rks)
      },
      {
        label: fallback ? "最高单曲 RKS" : "最高 ACC",
        value: fallback
          ? formatRks(records[0]?.rks)
          : formatPercent(Math.max(...records.map((record) => Number(record.acc) || 0)))
      },
      {
        label: fallback ? "最高 ACC" : "数据源",
        value: fallback
          ? formatPercent(Math.max(...records.map((record) => Number(record.acc) || 0)))
          : "RKS 接口"
      }
    ]);
    renderRecords(records.slice(0, 50));
  });
}

async function queryBn() {
  await runQuery("查询 Best N", async () => {
    const n = getBestCount();
    const data = await requestJson(`/phigros/bn/${n}`, {
      body: getIdentityPayload()
    });
    const records = Array.isArray(data) ? data : [];

    renderSummary([
      {
        label: `Best ${n}`,
        value: `${records.length} 条`
      },
      {
        label: "最高 RKS",
        value: formatRks(records[0]?.rks)
      },
      {
        label: "最低 RKS",
        value: formatRks(records[records.length - 1]?.rks)
      }
    ]);
    renderRecords(records);
  });
}

async function generateBnImage() {
  await runQuery("生成成绩图", async () => {
    const n = getBestCount();
    const blob = await requestImage(`/phigros/image/bn/${n}?theme=black`, getIdentityPayload());

    imageObjectUrl = URL.createObjectURL(blob);
    generatedImage.src = imageObjectUrl;
    imageResult.hidden = false;
    renderSummary([
      {
        label: "图片类型",
        value: `B${n}`
      },
      {
        label: "格式",
        value: blob.type || "image/png"
      }
    ]);
  });
}

async function querySong(event) {
  event.preventDefault();

  await runQuery("查询单曲", async () => {
    const q = songQueryInput.value.trim();
    const difficulty = songDifficultySelect.value;

    if (!q) {
      throw new Error("请输入歌曲名、ID或别名");
    }

    const params = new URLSearchParams({
      q
    });

    if (difficulty) {
      params.set("difficulty", difficulty);
    }

    const data = await requestJson(`/phigros/song/record?${params.toString()}`, {
      body: getIdentityPayload()
    });
    const records = Object.entries(data || {}).map(([diff, record]) => ({
      ...record,
      song_name: q,
      difficulty: diff
    }));

    renderSummary([
      {
        label: "曲目",
        value: q
      },
      {
        label: "谱面",
        value: String(records.length)
      }
    ]);
    renderRecords(records, {
      source: q
    });
  });
}

function stopQrPolling() {
  if (qrPollTimer) {
    clearInterval(qrPollTimer);
    qrPollTimer = null;
  }
}

async function pollQrStatus(qrId) {
  try {
    const data = await requestJson(
      `/phigros/auth/qrcode/${encodeURIComponent(qrId)}/status`,
      {
        method: "GET"
      }
    );

    qrStatus.textContent = data.status === "scanned" ? "已扫码，等待授权" : "等待扫码";

    if (data.status === "success" && data.sessionToken) {
      stopQrPolling();
      sessionTokenInput.value = data.sessionToken;
      switchAuthMode("token");
      setStatus("扫码成功，已填入 Token", "success");
      qrStatus.textContent = "登录成功";
    }
  } catch (error) {
    stopQrPolling();
    qrStatus.textContent = error.message || "扫码状态异常";
  }
}

async function requestQrCode() {
  clearOutput();
  setStatus("正在获取二维码...", "loading");
  stopQrPolling();

  try {
    const data = await requestJson("/phigros/auth/qrcode", {
      method: "GET"
    });

    qrImage.src = data.qrCodeImage;
    qrBox.hidden = false;
    qrStatus.textContent = "等待扫码";
    setStatus("二维码已生成", "success");
    qrPollTimer = setInterval(() => pollQrStatus(data.qrId), 2500);
  } catch (error) {
    setStatus(error.message || "二维码获取失败", "error");
  }
}

authTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    switchAuthMode(tab.dataset.authMode);
  });
});

queryB30Button.addEventListener("click", queryB30);
queryRksButton.addEventListener("click", queryRks);
queryBnButton.addEventListener("click", queryBn);
imageBnButton.addEventListener("click", generateBnImage);
requestQrButton.addEventListener("click", requestQrCode);
songForm.addEventListener("submit", querySong);

window.PLCMusicPlayer?.init();

getScoreApiBase().then((apiBase) => {
  if (apiBase) {
    setStatus(`查分代理已连接：${apiBase}`, "success");
  }
});
