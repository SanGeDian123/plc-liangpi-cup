let adminToken = localStorage.getItem("adminToken");
let pendingDeletePlayerId = null;
let displaySettings = {
  goldDragonPlayerIds: []
};

function showLogin() {
  document.getElementById("loginPanel").style.display = "block";
  document.getElementById("adminPanel").style.display = "none";
}

function showAdmin() {
  document.getElementById("loginPanel").style.display = "none";
  document.getElementById("adminPanel").style.display = "block";
}

function setMessage(elementId, message, isError = false) {
  const element = document.getElementById(elementId);

  if (!element) {
    return;
  }

  element.innerText = message;
  element.classList.toggle("is-error", isError);
}

function showAdminMessage(message, isError = false) {
  setMessage("adminMsg", message, isError);
}

function showBindingReviewMessage(message, isError = false) {
  setMessage("bindingReviewMsg", message, isError);
}

function clearAdminSession() {
  localStorage.removeItem("adminToken");
  adminToken = null;
  showLogin();
}

function isGoldDragonPlayerId(playerId) {
  return displaySettings.goldDragonPlayerIds.includes(String(playerId));
}

async function adminLogin() {
  const password = document.getElementById("adminPassword").value.trim();
  const msg = document.getElementById("loginMsg");

  msg.innerText = "";

  if (!password) {
    msg.innerText = "请输入管理员密码";
    return;
  }

  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      password
    })
  });

  if (!res.ok) {
    msg.innerText = "密码错误，请重试";
    localStorage.removeItem("adminToken");
    return;
  }

  const data = await res.json();

  adminToken = data.token;
  localStorage.setItem("adminToken", adminToken);

  showAdmin();
  loadAdmin();
}

async function loadAdmin() {
  if (!adminToken) {
    showLogin();
    return;
  }

  showAdmin();
  await loadDisplaySettings();
  await loadBindingRequests();

  if (!adminToken) {
    return;
  }

  const res = await fetch(`${API_URL}/players`);

  if (!res.ok) {
    showAdminMessage("选手列表加载失败，请稍后重试", true);
    return;
  }

  const players = await res.json();
  const list = document.getElementById("adminList");
  list.innerHTML = "";

  players.forEach((p) => {
    const div = document.createElement("div");
    div.className = "admin-item";
    const hasGoldDragon = isGoldDragonPlayerId(p.id);

    div.innerHTML = `
      <input value="${escapeHtml(p.nickname)}" id="name-${p.id}" placeholder="昵称">
      <input value="${escapeHtml(p.number || "")}" id="number-${p.id}" placeholder="编号">
      <input value="${p.score}" id="score-${p.id}" placeholder="成绩" type="number">
      <div class="dragon-toggle-cell">
        <span>金龙</span>
        <label class="switch-control compact-switch" title="金龙模式">
          <input
            type="checkbox"
            data-gold-dragon-player-id="${p.id}"
            onchange="updatePlayerDragonEffect(${p.id}, this.checked)"
            ${hasGoldDragon ? "checked" : ""}
          >
          <span aria-hidden="true"></span>
        </label>
      </div>

      <button onclick="updatePlayer(${p.id})">保存</button>
      <button class="danger" onclick="deletePlayer(${p.id})">删除</button>
    `;

    list.appendChild(div);
  });
}

async function loadDisplaySettings() {
  try {
    const res = await fetch(`${API_URL}/settings/display`);

    if (!res.ok) {
      throw new Error("settings request failed");
    }

    const settings = await res.json();

    displaySettings = {
      goldDragonPlayerIds: Array.isArray(settings.goldDragonPlayerIds)
        ? settings.goldDragonPlayerIds.map(String)
        : []
    };
  } catch (error) {
    displaySettings = {
      goldDragonPlayerIds: []
    };
    showAdminMessage("金龙模式状态加载失败，请刷新后台", true);
  }
}

function formatBindingScore(score) {
  const number = Number(score);
  return Number.isFinite(number) ? String(number) : "-";
}

function formatBindingTime(value) {
  const time = Date.parse(value || "");

  if (!Number.isFinite(time)) {
    return "-";
  }

  return new Date(time).toLocaleString("zh-CN", {
    hour12: false
  });
}

function renderBindingRequests(requests) {
  const list = document.getElementById("bindingReviewList");

  if (!list) {
    return;
  }

  list.innerHTML = "";

  if (!requests.length) {
    const empty = document.createElement("div");
    empty.className = "binding-review-empty";
    empty.textContent = "暂无待审核绑定申请";
    list.appendChild(empty);
    return;
  }

  requests.forEach((request) => {
    const item = document.createElement("div");
    item.className = "binding-review-item";
    item.innerHTML = `
      <div class="binding-review-main">
        <strong>${escapeHtml(request.nickname || "未设置昵称")}</strong>
        <span>${escapeHtml(request.email || "无邮箱")}</span>
      </div>
      <div>
        <span class="binding-review-label">海选名</span>
        <strong>${escapeHtml(request.playerNickname || "-")}</strong>
      </div>
      <div>
        <span class="binding-review-label">成绩</span>
        <strong>${escapeHtml(formatBindingScore(request.playerScore))}</strong>
      </div>
      <div>
        <span class="binding-review-label">提交时间</span>
        <strong>${escapeHtml(formatBindingTime(request.updatedAt || request.createdAt))}</strong>
      </div>
    `;

    const actions = document.createElement("div");
    actions.className = "binding-review-actions";

    const approveButton = document.createElement("button");
    approveButton.type = "button";
    approveButton.textContent = "通过";
    approveButton.addEventListener("click", () => {
      approveBindingRequest(request.id);
    });

    const rejectButton = document.createElement("button");
    rejectButton.type = "button";
    rejectButton.className = "danger";
    rejectButton.textContent = "拒绝";
    rejectButton.addEventListener("click", () => {
      rejectBindingRequest(request.id);
    });

    actions.append(approveButton, rejectButton);
    item.appendChild(actions);
    list.appendChild(item);
  });
}

async function loadBindingRequests() {
  if (!adminToken) {
    renderBindingRequests([]);
    return;
  }

  showBindingReviewMessage("正在加载绑定审核...");

  try {
    const res = await fetch(`${API_URL}/admin/binding-requests`, {
      headers: {
        "x-admin-token": adminToken
      }
    });

    if (!res.ok) {
      if (res.status === 401) {
        clearAdminSession();
        return;
      }

      throw new Error("binding-review-load-failed");
    }

    const data = await res.json();
    const requests = Array.isArray(data.requests) ? data.requests : [];

    renderBindingRequests(requests);
    showBindingReviewMessage(
      requests.length ? `当前有 ${requests.length} 条待审核申请` : "暂无待审核绑定申请"
    );
  } catch (error) {
    renderBindingRequests([]);
    showBindingReviewMessage("绑定审核加载失败，请稍后刷新后台", true);
  }
}

async function reviewBindingRequest(id, action) {
  if (!adminToken) {
    clearAdminSession();
    return;
  }

  const isApprove = action === "approve";
  const actionText = isApprove ? "通过" : "拒绝";

  showBindingReviewMessage(`正在${actionText}绑定申请...`);

  try {
    const res = await fetch(
      `${API_URL}/admin/binding-requests/${encodeURIComponent(id)}/${action}`,
      {
        method: "POST",
        headers: {
          "x-admin-token": adminToken
        }
      }
    );

    if (!res.ok) {
      if (res.status === 401) {
        clearAdminSession();
        return;
      }

      throw new Error("binding-review-update-failed");
    }

    showBindingReviewMessage(`绑定申请已${actionText}`);
    await loadBindingRequests();
  } catch (error) {
    showBindingReviewMessage(`绑定申请${actionText}失败，请稍后重试`, true);
  }
}

function approveBindingRequest(id) {
  reviewBindingRequest(id, "approve");
}

function rejectBindingRequest(id) {
  reviewBindingRequest(id, "reject");
}

async function updatePlayerDragonEffect(playerId, enabled) {
  const playerKey = String(playerId);
  const toggle = document.querySelector(
    `[data-gold-dragon-player-id="${playerKey}"]`
  );
  const previousValue = !enabled;

  if (!adminToken) {
    if (toggle) {
      toggle.checked = previousValue;
    }

    clearAdminSession();
    return;
  }

  if (toggle) {
    toggle.disabled = true;
  }

  showAdminMessage(enabled ? "正在开启金龙模式..." : "正在关闭金龙模式...");

  try {
    const res = await fetch(`${API_URL}/admin/settings/display`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": adminToken
      },
      body: JSON.stringify({
        playerId: playerKey,
        enabled
      })
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("unauthorized");
      }

      if (toggle) {
        toggle.checked = previousValue;
      }

      showAdminMessage("保存失败，请稍后重试", true);
      return;
    }

    const settings = await res.json();
    displaySettings = {
      goldDragonPlayerIds: Array.isArray(settings.goldDragonPlayerIds)
        ? settings.goldDragonPlayerIds.map(String)
        : []
    };

    if (toggle) {
      toggle.checked = isGoldDragonPlayerId(playerKey);
    }

    showAdminMessage(
      isGoldDragonPlayerId(playerKey) ? "金龙模式已开启" : "金龙模式已关闭"
    );
  } catch (error) {
    if (toggle) {
      toggle.checked = previousValue;
    }

    const isUnauthorized = error.message === "unauthorized";

    showAdminMessage(
      isUnauthorized ? "登录已失效，请重新登录后台后再试" : "保存失败，请稍后重试",
      true
    );

    if (isUnauthorized) {
      clearAdminSession();
    }
  } finally {
    if (toggle) {
      toggle.disabled = false;
    }
  }
}

async function addPlayer() {
  const nickname = document.getElementById("nickname").value.trim();
  const number = document.getElementById("number").value.trim();
  const score = document.getElementById("score").value.trim();

  if (!nickname || !score) {
    showAdminMessage("请输入昵称和成绩", true);
    return;
  }

  const res = await fetch(`${API_URL}/players`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": adminToken
    },
    body: JSON.stringify({
      nickname,
      number,
      score: Number(score)
    })
  });

  if (!res.ok) {
    showAdminMessage("新增失败，请重新登录后台", true);
    clearAdminSession();
    return;
  }

  document.getElementById("nickname").value = "";
  document.getElementById("number").value = "";
  document.getElementById("score").value = "";

  showAdminMessage("选手已新增");
  loadAdmin();
}

async function updatePlayer(id) {
  const nickname = document.getElementById(`name-${id}`).value.trim();
  const number = document.getElementById(`number-${id}`).value.trim();
  const score = document.getElementById(`score-${id}`).value.trim();

  if (!nickname || !score) {
    showAdminMessage("昵称和成绩不能为空", true);
    return;
  }

  const res = await fetch(`${API_URL}/players/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": adminToken
    },
    body: JSON.stringify({
      nickname,
      number,
      score: Number(score)
    })
  });

  if (!res.ok) {
    showAdminMessage("保存失败，请重新登录后台", true);
    clearAdminSession();
    return;
  }

  showAdminMessage("选手信息已保存");
  loadAdmin();
}

function deletePlayer(id) {
  pendingDeletePlayerId = id;

  const dialog = document.getElementById("adminConfirmDialog");

  if (!dialog) {
    return;
  }

  dialog.classList.add("is-open");
  dialog.setAttribute("aria-hidden", "false");
  dialog.querySelector(".danger")?.focus();
}

function closeDeleteDialog() {
  pendingDeletePlayerId = null;

  const dialog = document.getElementById("adminConfirmDialog");

  if (!dialog) {
    return;
  }

  dialog.classList.remove("is-open");
  dialog.setAttribute("aria-hidden", "true");
}

async function confirmDeletePlayer() {
  const id = pendingDeletePlayerId;

  if (!id) {
    closeDeleteDialog();
    return;
  }

  const res = await fetch(`${API_URL}/players/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-token": adminToken
    }
  });

  if (!res.ok) {
    closeDeleteDialog();
    showAdminMessage("删除失败，请重新登录后台", true);
    clearAdminSession();
    return;
  }

  closeDeleteDialog();
  showAdminMessage("选手已删除");
  loadAdmin();
}

function logoutAdmin() {
  clearAdminSession();
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDeleteDialog();
  }
});

loadAdmin();
