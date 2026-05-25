let currentCommentPlayerId = null;

async function loadPlayers() {
  const res = await fetch(`${API_URL}/players`);
  const players = await res.json();

  renderTop3(players.slice(0, 3));
  renderRanking(players);

  document.getElementById("updateTime").innerHTML =
    "最后更新：" + new Date().toLocaleString();
}

function renderTop3(players) {
  const container = document.getElementById("top3");

  container.innerHTML = "";

  players.forEach((p, index) => {
    const div = document.createElement("div");

    div.className =
      "top-card " +
      (index === 0 ? "first" : "");

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
    const div = document.createElement("div");

    div.className = "rank-item";
    div.onclick = () => openComments(p.id, p.nickname);

    div.innerHTML = `
      <div>#${index + 1}</div>
      <div>${escapeHtml(p.nickname)}</div>
      <div>${p.score}</div>
    `;

    list.appendChild(div);
  });
}

async function openComments(playerId, nickname) {
  currentCommentPlayerId = playerId;

  document.getElementById("commentTitle").innerText =
    `${nickname} 的成绩排行评论`;

  document.getElementById("commentModal").style.display = "flex";

  await loadComments(playerId);
}

function closeComments() {
  document.getElementById("commentModal").style.display = "none";
}

async function loadComments(playerId) {
  const res = await fetch(`${API_URL}/players/${playerId}/comments`);
  const comments = await res.json();

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

  const res = await fetch(`${API_URL}/players/${currentCommentPlayerId}/comments`, {
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

  await loadComments(currentCommentPlayerId);
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
