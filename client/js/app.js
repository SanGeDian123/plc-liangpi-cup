let currentCommentPlayerId = null;
let commentRequestId = 0;

function updateCountdown() {
  const endTime = new Date("2026-07-03T23:59:00");
  const now = new Date();
  const diff = endTime - now;
  const countdownEl = document.getElementById("countdown");

  if (diff <= 0) {
    countdownEl.innerText = "海选已截止";
    return;
  }

  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  countdownEl.innerText = `距离海选截止：${days}天${hours}小时`;
}

setInterval(updateCountdown, 1000 * 60);
updateCountdown();

function renderPlayers(players, meta = {}) {
  renderTop3(players.slice(0, 3));
  renderRanking(players);

  const updateTime = document.getElementById("updateTime");

  if (updateTime) {
    const updatedAt = meta.updatedAt ? new Date(meta.updatedAt) : new Date();
    const sourceLabel =
      meta.source && meta.source !== "api" ? "\uff08\u5feb\u7167\uff09" : "";

    updateTime.textContent =
      "\u6700\u540e\u66f4\u65b0\uff1a" +
      updatedAt.toLocaleString() +
      sourceLabel;
  }
}

function renderPlayersError() {
  const top3 = document.getElementById("top3");
  const list = document.getElementById("rankingList");
  const updateTime = document.getElementById("updateTime");

  if (top3 && top3.children.length === 0) {
    top3.innerHTML =
      '<div class="ranking-empty">\u6392\u884c\u699c\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u5237\u65b0</div>';
  }

  if (list && list.children.length === 0) {
    list.innerHTML =
      '<div class="ranking-empty">\u6392\u884c\u699c\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u5237\u65b0</div>';
  }

  if (updateTime) {
    updateTime.textContent =
      "\u6392\u884c\u699c\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u5237\u65b0";
  }
}

async function loadPlayers() {
  if (window.PLCPlayersCache?.hydrate) {
    window.PLCPlayersCache.hydrate({
      onUpdate: renderPlayers,
      onError: renderPlayersError
    });
    return;
  }

  try {
    const res = await fetch(`${API_URL}/players`);

    if (!res.ok) {
      throw new Error("Players request failed");
    }

    renderPlayers(await res.json(), {
      source: "api",
      updatedAt: Date.now()
    });
  } catch (error) {
    renderPlayersError();
  }
}

function renderTop3(players) {
  const container = document.getElementById("top3");
  container.innerHTML = "";

  players.forEach((p, index) => {
    const div = document.createElement("div");

    div.className = "top-card " + (index === 0 ? "first" : "");
    div.onclick = () => openComments(p.id, p.nickname);

    div.innerHTML = `
      <div class="rank">#${index + 1}</div>
      <div class="nickname">${escapeHtml(p.nickname)}</div>
      <div class="score">${p.score}</div>
    `;

    container.appendChild(div);
  });
}

function renderRanking(players) {
  const list = document.getElementById("rankingList");
  list.innerHTML = "";

  players.forEach((p, index) => {
    if (index === 0) {
      const groupTop = document.createElement("div");
      groupTop.className = "group-divider";
      groupTop.innerHTML = `
        <div class="group-line"></div>
        <div class="group-text">LT组</div>
        <div class="group-line"></div>
      `;
      list.appendChild(groupTop);
    }

    const div = document.createElement("div");

    div.className = "rank-item";
    div.onclick = () => openComments(p.id, p.nickname);

    div.innerHTML = `
      <div>#${index + 1}</div>
      <div>${escapeHtml(p.nickname)}</div>
      <div>${p.score}</div>
    `;

    list.appendChild(div);

    if (index === 15) {
      const groupBottom = document.createElement("div");
      groupBottom.className = "group-divider";
      groupBottom.innerHTML = `
        <div class="group-line"></div>
        <div class="group-text">LH组</div>
        <div class="group-line"></div>
      `;
      list.appendChild(groupBottom);
    }

    if (index === 31) {
      const groupOverflow = document.createElement("div");
      groupOverflow.className = "group-divider";
      groupOverflow.innerHTML = `
        <div class="group-line"></div>
        <div class="group-text">OVER FLOW</div>
        <div class="group-line"></div>
      `;
      list.appendChild(groupOverflow);
    }
  });
}

async function openComments(playerId, nickname) {
  currentCommentPlayerId = playerId;
  commentRequestId++;

  const requestId = commentRequestId;

  document.getElementById("commentTitle").innerText =
    `${nickname} 的成绩排行评论`;

  document.getElementById("commentList").innerHTML =
    `<div class="empty-comment">评论加载中...</div>`;

  document.getElementById("commentContent").value = "";
  document.getElementById("commentModal").style.display = "flex";

  await loadComments(playerId, requestId);
}

function closeComments() {
  commentRequestId++;
  currentCommentPlayerId = null;

  document.getElementById("commentModal").style.display = "none";
  document.getElementById("commentList").innerHTML = "";
}

async function loadComments(playerId, requestId = commentRequestId) {
  const res = await fetch(`${API_URL}/players/${playerId}/comments`);
  const comments = await res.json();

  if (requestId !== commentRequestId || playerId !== currentCommentPlayerId) {
    return;
  }

  const list = document.getElementById("commentList");
  list.innerHTML = "";

  if (!Array.isArray(comments) || comments.length === 0) {
    list.innerHTML = `<div class="empty-comment">暂无评论</div>`;
    return;
  }

  comments.forEach((c) => {
    const div = document.createElement("div");

    div.className = "comment-item";

    div.innerHTML = `
      <div class="comment-name">${escapeHtml(c.nickname)}</div>
      <div class="comment-content">${escapeHtml(c.content)}</div>
      <div class="comment-time">${new Date(c.created_at).toLocaleString()}</div>
    `;

    list.appendChild(div);
  });
}

async function submitComment() {
  const nickname = document.getElementById("commentNickname").value.trim();
  const content = document.getElementById("commentContent").value.trim();

  if (!nickname || !content) {
    alert("请输入昵称和评论内容");
    return;
  }

  const playerId = currentCommentPlayerId;

  document.getElementById("commentList").innerHTML =
    `<div class="empty-comment">评论发布中...</div>`;

  const res = await fetch(`${API_URL}/players/${playerId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nickname,
      content
    })
  });

  if (!res.ok) {
    alert("评论发布失败");
    return;
  }

  document.getElementById("commentContent").value = "";

  await loadComments(playerId);
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadPlayers();
