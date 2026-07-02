const SUPABASE_URL = "https://kpjuerikmmajqyxcocos.supabase.co";
const SUPABASE_KEY = "sb_publishable_Jkj-377OvvQXVtiR-Vdikw_FJbPQ_zs";
const USER_API_URL =
  typeof API_URL !== "undefined"
    ? API_URL
    : window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ? "http://localhost:3000"
      : "https://plc-liangpi-cup.onrender.com";

const authTabs = document.querySelectorAll("[data-auth-mode]");
const authPanes = document.querySelectorAll("[data-auth-pane]");
const userWorkbench = document.querySelector(".user-workbench");
const authPanel = document.getElementById("authPanel");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const sendLoginCodeButton = document.getElementById("sendLoginCodeButton");
const sendRegisterCodeButton = document.getElementById("sendRegisterCodeButton");
const logoutButton = document.getElementById("logoutButton");
const authStatus = document.getElementById("authStatus");
const signedOutCard = document.getElementById("signedOutCard");
const signedInCard = document.getElementById("signedInCard");
const profileEmail = document.getElementById("profileEmail");
const profileNickname = document.getElementById("profileNickname");
const profileEmailStatus = document.getElementById("profileEmailStatus");
const headerNickname = document.getElementById("headerNickname");
const bindingForm = document.getElementById("bindingForm");
const playerSelect = document.getElementById("playerSelect");
const submitBindingButton = document.getElementById("submitBindingButton");
const bindingState = document.getElementById("bindingState");
const bindingHint = document.getElementById("bindingHint");
const bindingResult = document.getElementById("bindingResult");
const boundPlayerName = document.getElementById("boundPlayerName");
const boundPlayerScore = document.getElementById("boundPlayerScore");
const notificationCount = document.getElementById("notificationCount");
const notificationList = document.getElementById("notificationList");
const markAllNotificationsButton = document.getElementById("markAllNotificationsButton");

let authClient = null;
let currentSession = null;
let leaderboardPlayers = [];
let bindingLoadNonce = 0;
let notificationLoadNonce = 0;
const pendingOtp = {
  login: {
    email: ""
  },
  register: {
    email: "",
    nickname: ""
  }
};

function getRedirectUrl() {
  return window.location.href.split("#")[0].split("?")[0];
}

function setStatus(message, tone = "") {
  authStatus.textContent = message;

  if (tone) {
    authStatus.dataset.tone = tone;
  } else {
    delete authStatus.dataset.tone;
  }
}

function setFormDisabled(form, disabled) {
  form.querySelectorAll("button, input").forEach((element) => {
    element.disabled = disabled;
  });
}

function setButtonLoading(button, loading) {
  button.disabled = loading;
}

function getFormText(form, name) {
  return String(new FormData(form).get(name) || "").trim();
}

function normalizeCode(value) {
  return String(value || "").replace(/\s+/g, "").trim();
}

function isOtpCode(value) {
  return /^\d{6,8}$/.test(value);
}

function isEmailLike(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function switchAuthMode(mode) {
  authTabs.forEach((tab) => {
    const isActive = tab.dataset.authMode === mode;

    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  authPanes.forEach((pane) => {
    pane.classList.toggle("is-active", pane.dataset.authPane === mode);
  });
}

function translateAuthError(error) {
  const message = String(error?.message || "");

  if (/Invalid login credentials/i.test(message)) {
    return "验证码不正确或已过期，请检查后再试。";
  }

  if (/Email not confirmed/i.test(message)) {
    return "邮箱还没有完成验证，请重新发送验证码后再试。";
  }

  if (/User already registered|already registered|already exists|user_already_exists/i.test(message)) {
    return "这个邮箱已经注册过，请切换到登录。";
  }

  if (/Signup disabled|Signups not allowed|User not found|user_not_found/i.test(message)) {
    return "这个邮箱还没有注册，请先切换到注册。";
  }

  if (/Token has expired|otp_expired/i.test(message)) {
    return "验证码已过期，请重新发送。";
  }

  if (/Email rate limit exceeded|over_email_send_rate_limit|For security purposes/i.test(message)) {
    return "验证码发送太频繁，请稍后再试。";
  }

  if (/Anonymous sign-ins are disabled/i.test(message)) {
    return "没有读取到邮箱，请重新填写后再试。";
  }

  if (/Failed to fetch|Load failed|NetworkError/i.test(message)) {
    return "网络请求失败，请确认当前页面可以访问 Supabase。";
  }

  return message || "账号操作失败，请稍后再试。";
}

function getUserNickname(user) {
  return (
    user?.user_metadata?.nickname ||
    user?.user_metadata?.Nickname ||
    user?.email?.split("@")[0] ||
    "未设置"
  );
}

async function sendEmailCode(mode) {
  const isRegister = mode === "register";
  const form = isRegister ? registerForm : loginForm;
  const button = isRegister ? sendRegisterCodeButton : sendLoginCodeButton;
  const email = getFormText(form, "email");
  const nickname = isRegister ? getFormText(form, "nickname") : "";

  if (!isEmailLike(email)) {
    setStatus("请先填写正确的邮箱。", "error");
    return;
  }

  if (isRegister && !nickname) {
    setStatus("请先填写昵称。", "error");
    return;
  }

  setButtonLoading(button, true);
  setStatus("正在发送邮箱验证码...", "loading");

  try {
    const { error } = await authClient.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: isRegister,
        data: isRegister
          ? {
              Nickname: nickname,
              nickname
            }
          : undefined,
        emailRedirectTo: getRedirectUrl()
      }
    });

    if (error) {
      throw error;
    }

    pendingOtp[mode].email = email;
    form.elements.code.value = "";

    if (isRegister) {
      pendingOtp.register.nickname = nickname;
    }

    setStatus(
      `验证码已发送到 ${email}，请查看邮箱后输入数字验证码。`,
      "success"
    );
  } catch (error) {
    setStatus(translateAuthError(error), "error");
  } finally {
    setButtonLoading(button, false);
  }
}

function getSessionAuthHeaders() {
  return currentSession?.access_token
    ? {
        Authorization: `Bearer ${currentSession.access_token}`
      }
    : {};
}

function formatScore(score) {
  const number = Number(score);
  return Number.isFinite(number) ? String(number) : "-";
}

function getScoreRank(players, index) {
  const score = Number(players[index]?.score);
  const tiedIndex = players.findIndex((player) => Number(player.score) === score);
  return tiedIndex >= 0 ? tiedIndex + 1 : index + 1;
}

function formatPlayerOption(player, index) {
  const rank = getScoreRank(leaderboardPlayers, index);
  const number = player.number ? ` / 编号 ${player.number}` : "";
  return `第 ${rank} 名 / ${player.nickname} / ${formatScore(player.score)}${number}`;
}

function setBindingState(text, tone = "") {
  bindingState.textContent = text;

  if (tone) {
    bindingState.dataset.tone = tone;
  } else {
    delete bindingState.dataset.tone;
  }
}

function setBindingFormDisabled(disabled) {
  playerSelect.disabled = disabled;
  submitBindingButton.disabled = disabled;
}

function resetBindingPanel() {
  bindingResult.hidden = true;
  boundPlayerName.textContent = "-";
  boundPlayerScore.textContent = "-";
  bindingHint.textContent = "选择排行榜中属于你的成绩，提交后等待赛事组审核通过。";
  setBindingState("未绑定");
  playerSelect.innerHTML = '<option value="">登录后加载排行榜...</option>';
  setBindingFormDisabled(true);
}

function populatePlayerSelect(players) {
  playerSelect.innerHTML = "";

  if (!players.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "暂无可绑定的排行榜成绩";
    playerSelect.appendChild(option);
    setBindingFormDisabled(true);
    return;
  }

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "请选择你的排行榜成绩";
  playerSelect.appendChild(placeholder);

  players.forEach((player, index) => {
    const option = document.createElement("option");
    option.value = String(player.id);
    option.textContent = formatPlayerOption(player, index);
    playerSelect.appendChild(option);
  });

  setBindingFormDisabled(false);
}

function renderBindingPayload(payload) {
  const binding = payload?.binding || null;
  const pendingRequest = payload?.pendingRequest || null;

  if (binding) {
    bindingResult.hidden = false;
    boundPlayerName.textContent = binding.playerNickname || "-";
    boundPlayerScore.textContent = formatScore(binding.playerScore);
    setBindingState("已绑定", "success");
    bindingHint.textContent = pendingRequest
      ? "新的绑定申请正在等待审核，通过后会替换当前显示的海选成绩。"
      : "赛事组已通过你的绑定申请。";
    playerSelect.value = pendingRequest?.playerId || binding.playerId || "";
    return;
  }

  bindingResult.hidden = true;
  boundPlayerName.textContent = "-";
  boundPlayerScore.textContent = "-";

  if (pendingRequest) {
    setBindingState("审核中", "pending");
    bindingHint.textContent = `已提交 ${pendingRequest.playerNickname} / ${formatScore(
      pendingRequest.playerScore
    )}，等待赛事组审核。`;
    playerSelect.value = pendingRequest.playerId || "";
    return;
  }

  setBindingState("未绑定");
  bindingHint.textContent = "选择排行榜中属于你的成绩，提交后等待赛事组审核通过。";
  playerSelect.value = "";
}

async function loadLeaderboardOptions() {
  const response = await fetch(`${USER_API_URL}/players`);

  if (!response.ok) {
    throw new Error("leaderboard-load-failed");
  }

  const players = await response.json();
  leaderboardPlayers = Array.isArray(players) ? players : [];
  populatePlayerSelect(leaderboardPlayers);
}

async function loadBindingPayload() {
  const response = await fetch(`${USER_API_URL}/user/binding`, {
    headers: getSessionAuthHeaders()
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("unauthorized");
    }

    throw new Error("binding-load-failed");
  }

  return response.json();
}

async function refreshBindingPanel() {
  if (!currentSession?.user) {
    resetBindingPanel();
    return;
  }

  const nonce = ++bindingLoadNonce;
  setBindingState("加载中", "loading");
  bindingHint.textContent = "正在读取排行榜和绑定状态...";
  setBindingFormDisabled(true);

  try {
    await loadLeaderboardOptions();
    const payload = await loadBindingPayload();

    if (nonce !== bindingLoadNonce) {
      return;
    }

    renderBindingPayload(payload);
  } catch (error) {
    if (nonce !== bindingLoadNonce) {
      return;
    }

    if (error.message === "unauthorized") {
      setBindingState("需重新登录", "error");
      bindingHint.textContent = "登录状态已失效，请退出后重新登录。";
    } else {
      setBindingState("加载失败", "error");
      bindingHint.textContent = "排行榜绑定状态暂时加载失败，请稍后再试。";
    }

    setBindingFormDisabled(true);
  }
}

async function handleBindingSubmit(event) {
  event.preventDefault();

  if (!currentSession?.user) {
    setStatus("请先登录账号后再提交绑定。", "error");
    return;
  }

  const playerId = playerSelect.value;

  if (!playerId) {
    setStatus("请先在下拉列表中选择你的排行榜成绩。", "error");
    return;
  }

  setBindingFormDisabled(true);
  setBindingState("提交中", "loading");
  setStatus("正在提交绑定审核...", "loading");

  try {
    const response = await fetch(`${USER_API_URL}/user/binding-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getSessionAuthHeaders()
      },
      body: JSON.stringify({
        playerId
      })
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("unauthorized");
      }

      throw new Error("submit-failed");
    }

    const payload = await response.json();
    renderBindingPayload({
      binding: payload.binding,
      pendingRequest: payload.request
    });
    setStatus("绑定申请已提交，等待管理员审核。", "success");
  } catch (error) {
    setBindingState("提交失败", "error");
    bindingHint.textContent =
      error.message === "unauthorized"
        ? "登录状态已失效，请重新登录后再提交。"
        : "绑定申请提交失败，请稍后再试。";
    setStatus(bindingHint.textContent, "error");
  } finally {
    setBindingFormDisabled(false);
  }
}

function formatNotificationTime(value) {
  const time = Date.parse(value || "");

  if (!Number.isFinite(time)) {
    return "";
  }

  return new Date(time).toLocaleString("zh-CN", {
    hour12: false
  });
}

function resetNotificationPanel() {
  notificationCount.textContent = "0 未读";
  notificationList.innerHTML = '<div class="notification-empty">登录后显示消息通知。</div>';
  markAllNotificationsButton.disabled = true;
}

function renderNotifications(payload = {}) {
  const notifications = Array.isArray(payload.notifications)
    ? payload.notifications
    : [];
  const unreadCount = Number(payload.unreadCount) || 0;

  notificationCount.textContent = `${unreadCount} 未读`;
  notificationCount.dataset.tone = unreadCount > 0 ? "pending" : "success";
  markAllNotificationsButton.disabled = unreadCount === 0;

  if (!notifications.length) {
    notificationList.innerHTML = '<div class="notification-empty">暂无消息通知。</div>';
    return;
  }

  notificationList.innerHTML = notifications
    .map((notification) => {
      const unreadClass = notification.read ? "" : " is-unread";
      const action = notification.read
        ? ""
        : `<button type="button" data-notification-read="${escapeHtml(notification.id)}">标为已读</button>`;

      return `
        <article class="notification-item${unreadClass}">
          <div>
            <strong>${escapeHtml(notification.title || "消息通知")}</strong>
            <p>${escapeHtml(notification.message || "")}</p>
            <time>${escapeHtml(formatNotificationTime(notification.createdAt))}</time>
          </div>
          ${action}
        </article>
      `;
    })
    .join("");
}

async function loadNotifications() {
  const response = await fetch(`${USER_API_URL}/user/notifications`, {
    headers: getSessionAuthHeaders()
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("unauthorized");
    }

    throw new Error("notifications-load-failed");
  }

  return response.json();
}

async function refreshNotificationsPanel() {
  if (!currentSession?.user) {
    resetNotificationPanel();
    return;
  }

  const nonce = ++notificationLoadNonce;
  notificationCount.textContent = "读取中";
  notificationCount.dataset.tone = "loading";
  notificationList.innerHTML = '<div class="notification-empty">正在读取消息...</div>';
  markAllNotificationsButton.disabled = true;

  try {
    const payload = await loadNotifications();

    if (nonce !== notificationLoadNonce) {
      return;
    }

    renderNotifications(payload);
  } catch (error) {
    if (nonce !== notificationLoadNonce) {
      return;
    }

    notificationCount.textContent = "读取失败";
    notificationCount.dataset.tone = "error";
    notificationList.innerHTML = '<div class="notification-empty">消息通知暂时加载失败。</div>';
  }
}

async function markNotificationRead(notificationId) {
  if (!currentSession?.user || !notificationId) {
    return;
  }

  try {
    const response = await fetch(
      `${USER_API_URL}/user/notifications/${encodeURIComponent(notificationId)}/read`,
      {
        method: "POST",
        headers: getSessionAuthHeaders()
      }
    );

    if (!response.ok) {
      throw new Error("notification-read-failed");
    }

    await refreshNotificationsPanel();
  } catch (error) {
    setStatus("消息已读状态更新失败，请稍后再试。", "error");
  }
}

async function markAllNotificationsRead() {
  if (!currentSession?.user) {
    return;
  }

  markAllNotificationsButton.disabled = true;

  try {
    const response = await fetch(`${USER_API_URL}/user/notifications/read-all`, {
      method: "POST",
      headers: getSessionAuthHeaders()
    });

    if (!response.ok) {
      throw new Error("notifications-read-all-failed");
    }

    await refreshNotificationsPanel();
    setStatus("消息通知已全部标为已读。", "success");
  } catch (error) {
    setStatus("消息通知更新失败，请稍后再试。", "error");
    markAllNotificationsButton.disabled = false;
  }
}

function handleNotificationListClick(event) {
  const button = event.target.closest?.("[data-notification-read]");

  if (!button) {
    return;
  }

  markNotificationRead(button.dataset.notificationRead);
}

function renderSession(session) {
  const user = session?.user || null;
  currentSession = session || null;

  signedInCard.hidden = !user;
  signedOutCard.hidden = Boolean(user);
  authPanel.hidden = Boolean(user);
  userWorkbench.classList.toggle("is-logged-in", Boolean(user));

  if (!user) {
    bindingLoadNonce += 1;
    notificationLoadNonce += 1;
    headerNickname.textContent = "未登录";
    profileEmail.textContent = "-";
    profileNickname.textContent = "-";
    profileEmailStatus.textContent = "-";
    resetBindingPanel();
    resetNotificationPanel();
    return;
  }

  const nickname = getUserNickname(user);

  headerNickname.textContent = nickname;
  profileEmail.textContent = user.email || "-";
  profileNickname.textContent = nickname;
  profileEmailStatus.textContent = user.email_confirmed_at ? "已确认" : "待确认";
  refreshBindingPanel();
  refreshNotificationsPanel();
}

async function refreshSessionStatus(message) {
  const { data, error } = await authClient.auth.getSession();

  if (error) {
    renderSession(null);
    setStatus(translateAuthError(error), "error");
    return;
  }

  renderSession(data.session);

  if (message) {
    setStatus(message, "success");
    return;
  }

  setStatus(data.session ? "账号已登录。" : "你还没有登录账号。");
}

async function handleLogin(event) {
  event.preventDefault();
  const email = getFormText(loginForm, "email");
  const code = normalizeCode(getFormText(loginForm, "code"));

  if (!isEmailLike(email) || !isOtpCode(code)) {
    setStatus("请填写邮箱和 6 到 8 位数字验证码。", "error");
    return;
  }

  setFormDisabled(loginForm, true);
  setStatus("正在验证登录验证码...", "loading");

  try {
    const { data, error } = await authClient.auth.verifyOtp({
      email,
      token: code,
      type: "email"
    });

    if (error) {
      throw error;
    }

    renderSession(data.session);
    loginForm.reset();
    pendingOtp.login.email = "";
    setStatus("验证码正确，登录成功。", "success");
  } catch (error) {
    setStatus(translateAuthError(error), "error");
  } finally {
    setFormDisabled(loginForm, false);
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const nickname = getFormText(registerForm, "nickname");
  const email = getFormText(registerForm, "email");
  const code = normalizeCode(getFormText(registerForm, "code"));

  if (!nickname || !isEmailLike(email) || !isOtpCode(code)) {
    setStatus("请填写昵称、邮箱和 6 到 8 位数字验证码。", "error");
    return;
  }

  setFormDisabled(registerForm, true);
  setStatus("正在验证注册验证码...", "loading");

  try {
    const { data, error } = await authClient.auth.verifyOtp({
      email,
      token: code,
      type: "email"
    });

    if (error) {
      throw error;
    }

    if (data.user && data.user.user_metadata?.nickname !== nickname) {
      const { error: updateError } = await authClient.auth.updateUser({
        data: {
          Nickname: nickname,
          nickname
        }
      });

      if (updateError) {
        throw updateError;
      }
    }

    registerForm.reset();
    pendingOtp.register.email = "";
    pendingOtp.register.nickname = "";
    renderSession(data.session);
    setStatus("验证码正确，注册成功并已登录。", "success");
  } catch (error) {
    setStatus(translateAuthError(error), "error");
  } finally {
    setFormDisabled(registerForm, false);
  }
}

async function handleLogout() {
  logoutButton.disabled = true;
  setStatus("正在退出登录...", "loading");

  try {
    const { error } = await authClient.auth.signOut();

    if (error) {
      throw error;
    }

    renderSession(null);
    setStatus("已退出登录。", "success");
  } catch (error) {
    setStatus(translateAuthError(error), "error");
  } finally {
    logoutButton.disabled = false;
  }
}

function bootUserPage() {
  if (!window.supabase?.createClient) {
    setStatus("Supabase 客户端加载失败，请刷新页面后再试。", "error");
    return;
  }

  authClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
      storageKey: "plc-user-session"
    }
  });

  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      switchAuthMode(tab.dataset.authMode);
    });
  });

  loginForm.addEventListener("submit", handleLogin);
  registerForm.addEventListener("submit", handleRegister);
  sendLoginCodeButton.addEventListener("click", () => sendEmailCode("login"));
  sendRegisterCodeButton.addEventListener("click", () => sendEmailCode("register"));
  logoutButton.addEventListener("click", handleLogout);
  bindingForm.addEventListener("submit", handleBindingSubmit);
  notificationList.addEventListener("click", handleNotificationListClick);
  markAllNotificationsButton.addEventListener("click", markAllNotificationsRead);

  authClient.auth.onAuthStateChange((_event, session) => {
    renderSession(session);
  });

  refreshSessionStatus();
}

bootUserPage();
