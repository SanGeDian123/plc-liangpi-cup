let adminToken = localStorage.getItem("adminToken");

async function adminLogin() {
  const password = prompt("请输入管理员密码");

  if (!password) {
    document.body.innerHTML = "<h1>未输入密码，无法访问后台</h1>";
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
    alert("管理员密码错误");
    localStorage.removeItem("adminToken");
    document.body.innerHTML = "<h1>无权限访问</h1>";
    return;
  }

  const data = await res.json();

  adminToken = data.token;
  localStorage.setItem("adminToken", adminToken);

  loadAdmin();
}

async function loadAdmin() {
  if (!adminToken) {
    return adminLogin();
  }

  const res = await fetch(`${API_URL}/players`);
  const players = await res.json();

  const list = document.getElementById("adminList");
  list.innerHTML = "";

  players.forEach((p) => {
    const div = document.createElement("div");
    div.className = "admin-item";

    div.innerHTML = `
      <input value="${escapeHtml(p.nickname)}" id="name-${p.id}" placeholder="昵称">
      <input value="${escapeHtml(p.number || "")}" id="number-${p.id}" placeholder="编号">
      <input value="${p.score}" id="score-${p.id}" placeholder="成绩" type="number">

      <button onclick="updatePlayer(${p.id})">保存</button>
      <button class="danger" onclick="deletePlayer(${p.id})">删除</button>
    `;

    list.appendChild(div);
  });
}

async function addPlayer() {
  const nickname = document.getElementById("nickname").value.trim();
  const number = document.getElementById("number").value.trim();
  const score = document.getElementById("score").value.trim();

  if (!nickname || !score) {
    alert("请输入昵称和成绩");
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
    alert("新增失败，请重新登录后台");
    localStorage.removeItem("adminToken");
    return adminLogin();
  }

  document.getElementById("nickname").value = "";
  document.getElementById("number").value = "";
  document.getElementById("score").value = "";

  loadAdmin();
}

async function updatePlayer(id) {
  const nickname = document.getElementById(`name-${id}`).value.trim();
  const number = document.getElementById(`number-${id}`).value.trim();
  const score = document.getElementById(`score-${id}`).value.trim();

  if (!nickname || !score) {
    alert("昵称和成绩不能为空");
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
    alert("保存失败，请重新登录后台");
    localStorage.removeItem("adminToken");
    return adminLogin();
  }

  loadAdmin();
}

async function deletePlayer(id) {
  if (!confirm("确定删除该选手吗？此操作不可恢复。")) {
    return;
  }

  const res = await fetch(`${API_URL}/players/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-token": adminToken
    }
  });

  if (!res.ok) {
    alert("删除失败，请重新登录后台");
    localStorage.removeItem("adminToken");
    return adminLogin();
  }

  loadAdmin();
}

function logoutAdmin() {
  localStorage.removeItem("adminToken");
  location.reload();
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadAdmin();
