let adminToken = localStorage.getItem("adminToken");

(function () {
  const EDITING_MATCH_STORAGE_KEY = "scheduleAdminEditingMatchId";
  const STATUS_LABELS = {
    scheduled: "未开始",
    bp: "BP中",
    live: "比赛中",
    finished: "已结束"
  };
  const POOL_LABELS = {
    round16: "16进8曲池",
    top8: "8强赛曲池",
    custom: "自定义曲池"
  };
  const OUTCOME_LABELS = {
    pending: "待定",
    win: "胜",
    loss: "负",
    draw: "平"
  };
  const DEFAULT_BP_CATEGORY = Object.freeze({
    division: "LT组",
    stage: "16-8(一)",
    group: "16-8 A组"
  });
  const ACCOUNT_GROUPS = Object.freeze(["LT组", "LH组", "未分类"]);

  const state = {
    accounts: [],
    leaderboardPlayers: [],
    leaderboardLoadError: "",
    isLeaderboardLoading: false,
    matches: [],
    editingId: "",
    accountSearch: "",
    playerBindingSearch: "",
    bindingAccountId: "",
    isBindingAccount: false,
    groupUpdatingUserIds: new Set(),
    collapsedAccountGroups: new Set(),
    trackSearch: "",
    selectedParticipants: new Set(),
    customTrackIds: new Set(),
    isSavingPlayerConfirmation: false,
    pendingConfirm: null
  };

  const els = {
    loginPanel: document.getElementById("loginPanel"),
    dashboard: document.getElementById("dashboard"),
    loginForm: document.getElementById("loginForm"),
    adminPassword: document.getElementById("adminPassword"),
    loginMsg: document.getElementById("loginMsg"),
    logout: document.getElementById("logoutButton"),
    reload: document.getElementById("reloadButton"),
    accountSource: document.getElementById("accountSource"),
    accountSearch: document.getElementById("accountSearch"),
    accountList: document.getElementById("accountList"),
    accountBindingPanel: document.getElementById("accountBindingPanel"),
    accountBindingTitle: document.getElementById("accountBindingTitle"),
    accountBindingHint: document.getElementById("accountBindingHint"),
    playerBindingSearch: document.getElementById("playerBindingSearch"),
    playerBindingList: document.getElementById("playerBindingList"),
    closeAccountBinding: document.getElementById("closeAccountBindingButton"),
    editorTitle: document.getElementById("editorTitle"),
    newMatch: document.getElementById("newMatchButton"),
    form: document.getElementById("matchForm"),
    matchTitle: document.getElementById("matchTitle"),
    matchSortOrder: document.getElementById("matchSortOrder"),
    matchStartsAt: document.getElementById("matchStartsAt"),
    bpStartsAt: document.getElementById("bpStartsAt"),
    playerConfirmationEnabled: document.getElementById("playerConfirmationEnabled"),
    matchStatus: document.getElementById("matchStatus"),
    matchVisibility: document.getElementById("matchVisibility"),
    participantCount: document.getElementById("participantCount"),
    randomPickEnabled: document.getElementById("randomPickEnabled"),
    randomPickCount: document.getElementById("randomPickCount"),
    poolMode: document.getElementById("poolMode"),
    bpCategoryDivision: document.getElementById("bpCategoryDivision"),
    bpCategoryStage: document.getElementById("bpCategoryStage"),
    bpCategoryGroup: document.getElementById("bpCategoryGroup"),
    matchContent: document.getElementById("matchContent"),
    bpRuleSummary: document.getElementById("bpRuleSummary"),
    participantSummary: document.getElementById("participantSummary"),
    pickedAccountList: document.getElementById("pickedAccountList"),
    customPoolPanel: document.getElementById("customPoolPanel"),
    customPoolSummary: document.getElementById("customPoolSummary"),
    customDifficulties: Array.from(document.querySelectorAll("[name='customDifficulty']")),
    trackSearch: document.getElementById("trackSearch"),
    customTrackList: document.getElementById("customTrackList"),
    saveMatch: document.getElementById("saveMatchButton"),
    resetForm: document.getElementById("resetFormButton"),
    resultEditor: document.getElementById("resultEditor"),
    resultSummary: document.getElementById("resultSummary"),
    resultEntryList: document.getElementById("resultEntryList"),
    saveResult: document.getElementById("saveResultButton"),
    editorMsg: document.getElementById("editorMsg"),
    matchList: document.getElementById("adminMatchList"),
    dialog: document.getElementById("confirmDialog"),
    confirmText: document.getElementById("confirmText"),
    confirmAction: document.getElementById("confirmActionButton")
  };

  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;
  }

  function setMessage(element, message, isError = false) {
    element.textContent = message || "";
    element.classList.toggle("is-error", isError);
  }

  function showLogin() {
    els.loginPanel.hidden = false;
    els.dashboard.hidden = true;
  }

  function showDashboard() {
    els.loginPanel.hidden = true;
    els.dashboard.hidden = false;
  }

  function clearSession() {
    localStorage.removeItem("adminToken");
    adminToken = null;
    showLogin();
  }

  async function fetchAdmin(path, options = {}) {
    const headers = {
      ...(options.headers || {}),
      "x-admin-token": adminToken
    };

    if (options.body && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        clearSession();
      }

      throw new Error(payload.message || "请求失败");
    }

    return payload;
  }

  function getAccountName(account) {
    return (
      account.playerNickname ||
      account.nickname ||
      account.email?.split("@")[0] ||
      account.userId ||
      "未命名账号"
    );
  }

  function getAccountById(userId) {
    return state.accounts.find((account) => account.userId === userId) || null;
  }

  function normalizePlayerGroupLabel(value) {
    const text = String(value || "").trim().replace(/\s+/g, "");

    if (/^LT组?$/i.test(text)) {
      return "LT组";
    }

    if (/^LH组?$/i.test(text)) {
      return "LH组";
    }

    return text === "未分类" ? "未分类" : "";
  }

  function getAccountPlayerGroup(account = {}) {
    const explicitGroup = normalizePlayerGroupLabel(account.playerGroup);

    if (explicitGroup) {
      return explicitGroup;
    }

    const numberGroup = normalizePlayerGroupLabel(
      String(account.playerNumber || "").split(/[-_#\s]/)[0]
    );

    return numberGroup || "未分类";
  }

  function normalizeSearch(value) {
    return String(value || "").trim().toLowerCase();
  }

  function normalizeCategoryText(value) {
    return String(value || "").trim().replace(/\s+/g, " ");
  }

  function inferBpCategory(match = {}) {
    const text = [
      match.bpDivision,
      match.bpStage,
      match.bpGroup,
      typeof match.bpCategory === "string" ? match.bpCategory : "",
      match.title,
      match.content
    ]
      .map(normalizeCategoryText)
      .filter(Boolean)
      .join(" ");
    const divisionMatch = text.match(/\b(LT|LH)\s*组\b/i);
    const stageMatch = text.match(
      /(\d+\s*(?:-|进)\s*\d+\s*[（(][一二三四五六七八九十\d]+[）)])/
    );
    const groupMatch = text.match(
      /(\d+\s*(?:-|进)\s*\d+\s*[A-Za-z]\s*组)/
    );
    const stage = stageMatch
      ? stageMatch[1].replace(/\s*(?:-|进)\s*/g, "-").replace(/\s+/g, "")
      : "";
    const group = groupMatch
      ? groupMatch[1]
          .replace(/\s*(?:-|进)\s*/g, "-")
          .replace(/\s+([A-Za-z]\s*组)/g, " $1")
          .replace(/([A-Za-z])\s*组/g, (_, letter) => `${letter.toUpperCase()}组`)
      : "";

    return {
      division: divisionMatch
        ? `${divisionMatch[1].toUpperCase()}组`
        : stage || group
          ? "LT组"
          : "",
      stage,
      group
    };
  }

  function getMatchBpCategory(match = {}) {
    const category = typeof match.bpCategory === "string"
      ? { division: match.bpCategory }
      : match.bpCategory || {};
    const inferred = inferBpCategory(match);
    const stage =
      normalizeCategoryText(category.stage) ||
      normalizeCategoryText(category.round || category.phase || category.secondary) ||
      normalizeCategoryText(match.bpStage) ||
      normalizeCategoryText(match.bpCategoryStage) ||
      inferred.stage;
    const group =
      normalizeCategoryText(category.group) ||
      normalizeCategoryText(category.subgroup || category.bracket || category.tertiary) ||
      normalizeCategoryText(match.bpGroup) ||
      normalizeCategoryText(match.bpCategoryGroup) ||
      inferred.group;

    return {
      division:
        normalizeCategoryText(category.division || category.type || category.main || category.primary) ||
        normalizeCategoryText(match.bpDivision) ||
        inferred.division ||
        (stage || group ? "LT组" : ""),
      stage,
      group
    };
  }

  function getEditableBpCategory(match = {}) {
    const category = getMatchBpCategory(match);
    const division = ["LT组", "LH组"].includes(category.division)
      ? category.division
      : DEFAULT_BP_CATEGORY.division;

    return {
      division,
      stage: category.stage || DEFAULT_BP_CATEGORY.stage,
      group: category.group || DEFAULT_BP_CATEGORY.group
    };
  }

  function formatBpCategory(match) {
    const category = getMatchBpCategory(match);

    return [category.division, category.stage, category.group]
      .filter(Boolean)
      .join(" / ");
  }

  function getPlayerLabel(player) {
    return (
      player.nickname ||
      player.name ||
      player.playerNickname ||
      `排行榜账号 ${player.id}`
    );
  }

  function getPlayerMeta(player) {
    return [
      player.number ? `编号 ${player.number}` : "",
      Number.isFinite(Number(player.score)) ? `分数 ${player.score}` : "",
      player.id ? `ID ${player.id}` : ""
    ]
      .filter(Boolean)
      .join(" · ");
  }

  function getFilteredBindingPlayers() {
    const needle = normalizeSearch(state.playerBindingSearch);

    return state.leaderboardPlayers
      .filter((player) => {
        if (!needle) {
          return true;
        }

        return [
          player.id,
          player.number,
          player.nickname,
          player.name,
          player.playerNickname,
          player.score
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      })
      .slice(0, 80);
  }

  function renderAccountBindingPanel() {
    const account = state.bindingAccountId ? getAccountById(state.bindingAccountId) : null;

    els.accountBindingPanel.hidden = !account;
    els.playerBindingList.innerHTML = "";

    if (!account) {
      return;
    }

    els.accountBindingTitle.textContent = `绑定：${account.nickname || account.email || account.userId}`;
    els.accountBindingHint.textContent = "选择排行榜账号后会立即绑定到这个账号。";

    if (account.playerId) {
      els.playerBindingList.appendChild(
        createElement("p", "empty-line", "这个账号已经绑定排行榜账号。")
      );
      return;
    }

    if (state.isLeaderboardLoading) {
      els.playerBindingList.appendChild(
        createElement("p", "empty-line", "正在读取排行榜账号...")
      );
      return;
    }

    if (state.leaderboardLoadError) {
      els.playerBindingList.appendChild(
        createElement("p", "empty-line", state.leaderboardLoadError)
      );
      return;
    }

    if (!state.leaderboardPlayers.length) {
      els.playerBindingList.appendChild(
        createElement("p", "empty-line", "暂无可绑定的排行榜账号")
      );
      return;
    }

    const players = getFilteredBindingPlayers();

    if (!players.length) {
      els.playerBindingList.appendChild(
        createElement("p", "empty-line", "没有找到匹配的排行榜账号")
      );
      return;
    }

    players.forEach((player) => {
      const item = createElement("div", "player-binding-item");
      const main = createElement("div", "account-main");
      main.appendChild(createElement("strong", "", getPlayerLabel(player)));
      main.appendChild(createElement("span", "", getPlayerMeta(player) || "暂无排行榜信息"));

      const button = createElement("button", "ghost-action", "绑定");
      button.type = "button";
      button.disabled = state.isBindingAccount;
      button.addEventListener("click", () => bindAccountToPlayer(player.id));

      item.append(main, button);
      els.playerBindingList.appendChild(item);
    });
  }

  function renderAccounts() {
    const needle = normalizeSearch(state.accountSearch);
    const accounts = state.accounts.filter((account) => {
      if (!needle) {
        return true;
      }

      return [
        account.email,
        account.nickname,
        account.playerNickname,
        account.playerNumber,
        getAccountPlayerGroup(account),
        account.userId
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });

    els.accountList.innerHTML = "";

    if (!accounts.length) {
      els.accountList.appendChild(createElement("p", "empty-line", "没有找到账号"));
      return;
    }

    ACCOUNT_GROUPS.forEach((group) => {
      const groupAccounts = accounts.filter((account) => getAccountPlayerGroup(account) === group);
      const section = createElement("section", "account-group");
      const header = createElement("button", "account-group-header");
      const collapsed = state.collapsedAccountGroups.has(group);
      header.type = "button";
      header.setAttribute("aria-expanded", String(!collapsed));
      header.addEventListener("click", () => {
        if (collapsed) {
          state.collapsedAccountGroups.delete(group);
        } else {
          state.collapsedAccountGroups.add(group);
        }

        renderAccounts();
      });

      const title = createElement("span", "account-group-title");
      title.appendChild(createElement("strong", "", group));
      title.appendChild(createElement("span", "", `${groupAccounts.length} 人`));
      header.append(
        title,
        createElement("span", "account-group-toggle", collapsed ? "展开" : "折叠")
      );
      section.appendChild(header);

      if (!collapsed) {
        const body = createElement("div", "account-group-body");

        if (!groupAccounts.length) {
          body.appendChild(createElement("p", "empty-line", "此分类暂无选手"));
        } else {
          groupAccounts.forEach((account) => {
            body.appendChild(renderAccountItem(account));
          });
        }

        section.appendChild(body);
      }

      els.accountList.appendChild(section);
    });

    renderAccountBindingPanel();
  }

  function renderAccountItem(account) {
    const item = createElement("div", "account-item");
    const currentGroup = getAccountPlayerGroup(account);
    const isUpdatingGroup = state.groupUpdatingUserIds.has(account.userId);
    item.classList.toggle("is-bindable", !account.playerId);
    item.classList.toggle("is-group-updating", isUpdatingGroup);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("aria-label", `选择 ${getAccountName(account)} 参赛`);
    checkbox.checked = state.selectedParticipants.has(account.userId);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        state.selectedParticipants.add(account.userId);
      } else {
        state.selectedParticipants.delete(account.userId);
      }

      renderParticipants();
      renderAccounts();
      renderResultEditor();
    });

    const main = createElement("div", "account-main");
    main.appendChild(createElement("strong", "", getAccountName(account)));
    main.appendChild(
      createElement("span", "", account.email || account.nickname || "无邮箱信息")
    );

    if (account.playerNickname) {
      main.appendChild(
        createElement("span", "", `绑定：${account.playerNickname} ${account.playerNumber || ""}`.trim())
      );
    } else {
      main.appendChild(createElement("span", "", "未绑定排行榜账号，点击可手动绑定"));
    }

    main.appendChild(createElement("span", "account-group-current", `当前分类：${currentGroup}`));

    if (!account.playerId) {
      item.addEventListener("click", (event) => {
        if (event.target === checkbox || event.target.closest("button")) {
          return;
        }

        openAccountBinding(account.userId);
      });
    }

    const bindButton = createElement(
      "button",
      account.playerId ? "ghost-action account-bind-action" : "primary-action account-bind-action",
      account.playerId ? "已绑定" : "绑定"
    );
    bindButton.type = "button";
    bindButton.disabled = Boolean(account.playerId);
    bindButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openAccountBinding(account.userId);
    });

    const groupActions = createElement("div", "account-group-actions");
    ACCOUNT_GROUPS.forEach((group) => {
      const button = createElement(
        "button",
        `account-group-chip ${currentGroup === group ? "is-active" : ""}`.trim(),
        group
      );
      button.type = "button";
      button.disabled = isUpdatingGroup;
      button.setAttribute("aria-pressed", String(currentGroup === group));
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        updateAccountPlayerGroup(account.userId, group);
      });
      groupActions.appendChild(button);
    });

    item.append(checkbox, main, bindButton, groupActions);
    return item;
  }

  async function updateAccountPlayerGroup(userId, playerGroup) {
    const account = getAccountById(userId);
    const normalizedGroup = normalizePlayerGroupLabel(playerGroup);

    if (!account || !normalizedGroup || state.groupUpdatingUserIds.has(userId)) {
      return;
    }

    const previousGroup = account.playerGroup || "";
    state.groupUpdatingUserIds.add(userId);
    state.accounts = state.accounts.map((item) =>
      item.userId === userId ? { ...item, playerGroup: normalizedGroup } : item
    );
    renderAccounts();
    renderParticipants();
    renderResultEditor();

    try {
      const payload = await fetchAdmin(`/admin/accounts/${encodeURIComponent(userId)}/player-group`, {
        method: "PUT",
        body: JSON.stringify({
          playerGroup: normalizedGroup
        })
      });
      const savedGroup = normalizePlayerGroupLabel(payload.playerGroup) || normalizedGroup;

      state.accounts = state.accounts.map((item) =>
        item.userId === userId ? { ...item, playerGroup: savedGroup } : item
      );
      await loadMatches();
      setMessage(els.editorMsg, `选手分类已更新：${getAccountName(account)} -> ${savedGroup}`);
    } catch (error) {
      state.accounts = state.accounts.map((item) =>
        item.userId === userId ? { ...item, playerGroup: previousGroup } : item
      );
      setMessage(els.editorMsg, error.message || "分类保存失败", true);
    } finally {
      state.groupUpdatingUserIds.delete(userId);
      renderAccounts();
      renderParticipants();
      renderResultEditor();
    }
  }

  function renderParticipants() {
    const selected = Array.from(state.selectedParticipants)
      .map(getAccountById)
      .filter(Boolean);

    els.participantSummary.textContent = `${selected.length} 人`;
    els.pickedAccountList.innerHTML = "";

    if (!selected.length) {
      els.pickedAccountList.appendChild(
        createElement("p", "empty-line", "从左侧账号列表勾选参赛账号")
      );
    } else {
      selected.forEach((account) => {
        const item = createElement("div", "picked-account");
        item.appendChild(createElement("strong", "", getAccountName(account)));
        item.appendChild(createElement("span", "", account.email || account.userId));
        els.pickedAccountList.appendChild(item);
      });
    }

    renderBpRule();
  }

  function renderBpRule() {
    const count = Math.max(1, Math.min(8, Number(els.participantCount.value) || 2));
    const randomEnabled = els.randomPickEnabled.checked;
    const randomCount = randomEnabled
      ? Math.max(1, Math.min(8, Number(els.randomPickCount.value) || 1))
      : 0;

    els.randomPickCount.disabled = !randomEnabled;

    els.bpRuleSummary.textContent = randomEnabled
      ? `${count} 人：共禁用 ${count * 2} 首，选曲 ${count} 首，系统抽取 ${randomCount} 首。`
      : `${count} 人：共禁用 ${count * 2} 首，选曲 ${count} 首，不进行系统随机抽选。`;
  }

  function getSongPoolData() {
    return window.PLC_SONG_POOL_DATA || {
      tracks: []
    };
  }

  function normalizeDifficulties(value) {
    const values = Array.isArray(value)
      ? value
      : String(value || "")
          .split(/[,\s/]+/)
          .filter(Boolean);

    return Array.from(
      new Set(
        values
          .map((item) => String(item).trim().toUpperCase())
          .filter((item) => ["EZ", "HD", "IN", "AT"].includes(item))
      )
    );
  }

  function isRemovedTrack(track) {
    const note = String(track?.note || "");

    return note.includes("移除") && !note.includes("常驻") && !note.includes("再收录");
  }

  function getTrackStageText(track) {
    return [
      track.stages?.round16 ? `16进8:${track.stages.round16}` : "",
      track.stages?.top8 ? `8强:${track.stages.top8}` : ""
    ]
      .filter(Boolean)
      .join(" · ");
  }

  function getFilteredTracks() {
    const needle = normalizeSearch(state.trackSearch);

    return getSongPoolData()
      .tracks.filter((track) => !isRemovedTrack(track))
      .filter((track) => {
        if (!needle) {
          return true;
        }

        return [track.title, track.artist, track.pack, track.version]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      });
  }

  function renderCustomPool() {
    const isCustom = els.poolMode.value === "custom";

    els.customPoolPanel.hidden = !isCustom;
    els.customPoolSummary.textContent = `${state.customTrackIds.size} 首`;
    els.customTrackList.innerHTML = "";

    if (!isCustom) {
      return;
    }

    const tracks = getFilteredTracks();

    if (!tracks.length) {
      els.customTrackList.appendChild(createElement("p", "empty-line", "没有找到曲目"));
      return;
    }

    tracks.forEach((track) => {
      const item = createElement("label", "track-item");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = state.customTrackIds.has(Number(track.id));
      item.classList.toggle("is-selected", checkbox.checked);
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          state.customTrackIds.add(Number(track.id));
        } else {
          state.customTrackIds.delete(Number(track.id));
        }

        renderCustomPool();
      });

      const main = createElement("div", "track-main");
      main.appendChild(createElement("strong", "", track.title || `曲目 ${track.id}`));
      main.appendChild(
        createElement("span", "", `${track.pack || "未知曲包"} · ${getTrackStageText(track) || "暂无阶段难度"}`)
      );

      item.append(checkbox, main);
      els.customTrackList.appendChild(item);
    });
  }

  function toDatetimeLocal(value) {
    const time = Date.parse(value || "");

    if (!Number.isFinite(time)) {
      return "";
    }

    const date = new Date(time);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    return local.toISOString().slice(0, 16);
  }

  function fromDatetimeLocal(value) {
    if (!value) {
      return "";
    }

    const time = Date.parse(value);

    return Number.isFinite(time) ? new Date(time).toISOString() : "";
  }

  function formatDateTime(value) {
    const time = Date.parse(value || "");

    if (!Number.isFinite(time)) {
      return "时间待定";
    }

    return new Date(time).toLocaleString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  }

  function getEditingMatch() {
    return state.matches.find((match) => match.id === state.editingId) || null;
  }

  function renderResultEditor() {
    const match = getEditingMatch();

    els.resultEditor.hidden = !match;
    els.resultEntryList.innerHTML = "";

    if (!match) {
      return;
    }

    const entries = new Map((match.result?.entries || []).map((entry) => [entry.userId, entry]));
    const participants = Array.from(state.selectedParticipants)
      .map(getAccountById)
      .filter(Boolean);

    els.resultSummary.value = match.result?.summary || "";

    if (!participants.length) {
      els.resultEntryList.appendChild(
        createElement("p", "empty-line", "先选择参赛账号，再填写比赛结果。")
      );
      return;
    }

    participants.forEach((account) => {
      const entry = entries.get(account.userId) || {};
      const row = createElement("div", "result-entry");

      const name = createElement("div", "");
      name.appendChild(createElement("strong", "", getAccountName(account)));
      name.appendChild(createElement("span", "", account.email || account.userId));

      const scoreLabel = createElement("label", "");
      scoreLabel.appendChild(createElement("span", "", "得分"));
      const scoreInput = document.createElement("input");
      scoreInput.type = "text";
      scoreInput.value = entry.score || "";
      scoreInput.dataset.resultField = "score";
      scoreInput.dataset.userId = account.userId;
      scoreLabel.appendChild(scoreInput);

      const outcomeLabel = createElement("label", "");
      outcomeLabel.appendChild(createElement("span", "", "胜负"));
      const outcomeSelect = document.createElement("select");
      outcomeSelect.dataset.resultField = "outcome";
      outcomeSelect.dataset.userId = account.userId;
      Object.entries(OUTCOME_LABELS).forEach(([value, label]) => {
        const option = createElement("option", "", label);
        option.value = value;
        option.selected = (entry.outcome || "pending") === value;
        outcomeSelect.appendChild(option);
      });
      outcomeLabel.appendChild(outcomeSelect);

      const noteLabel = createElement("label", "");
      noteLabel.appendChild(createElement("span", "", "备注"));
      const noteInput = document.createElement("input");
      noteInput.type = "text";
      noteInput.value = entry.note || "";
      noteInput.dataset.resultField = "note";
      noteInput.dataset.userId = account.userId;
      noteLabel.appendChild(noteInput);

      row.append(name, scoreLabel, outcomeLabel, noteLabel);
      els.resultEntryList.appendChild(row);
    });
  }

  function buildParticipant(account) {
    return {
      userId: account.userId,
      email: account.email,
      nickname: account.nickname,
      playerId: account.playerId,
      playerNickname: account.playerNickname,
      playerNumber: account.playerNumber,
      playerGroup: getAccountPlayerGroup(account)
    };
  }

  function collectMatchPayload() {
    const bpCategory = {
      division: normalizeCategoryText(els.bpCategoryDivision.value),
      stage: normalizeCategoryText(els.bpCategoryStage.value),
      group: normalizeCategoryText(els.bpCategoryGroup.value)
    };

    return {
      title: els.matchTitle.value.trim(),
      sortOrder: els.matchSortOrder.value === ""
        ? null
        : Number(els.matchSortOrder.value),
      startsAt: fromDatetimeLocal(els.matchStartsAt.value),
      bpStartsAt: fromDatetimeLocal(els.bpStartsAt.value),
      playerConfirmationEnabled: els.playerConfirmationEnabled.checked,
      content: els.matchContent.value.trim(),
      status: els.matchStatus.value,
      visibility: els.matchVisibility.value,
      participantCount: Number(els.participantCount.value) || 2,
      randomPickEnabled: els.randomPickEnabled.checked,
      randomPickCount: Number(els.randomPickCount.value) || 1,
      poolMode: els.poolMode.value,
      bpCategory,
      bpDivision: bpCategory.division,
      bpStage: bpCategory.stage,
      bpGroup: bpCategory.group,
      customTrackIds: Array.from(state.customTrackIds),
      customDifficulties: els.customDifficulties
        .filter((input) => input.checked)
        .map((input) => input.value),
      participants: Array.from(state.selectedParticipants)
        .map(getAccountById)
        .filter(Boolean)
        .map(buildParticipant)
    };
  }

  function resetForm(options = {}) {
    const preserveEditingSelection = options.preserveEditingSelection === true;

    state.editingId = "";
    state.selectedParticipants = new Set();
    state.customTrackIds = new Set();
    state.trackSearch = "";
    state.isSavingPlayerConfirmation = false;
    els.playerConfirmationEnabled.disabled = false;
    els.playerConfirmationEnabled
      .closest(".player-confirmation-toggle")
      ?.classList.remove("is-saving");

    if (!preserveEditingSelection) {
      sessionStorage.removeItem(EDITING_MATCH_STORAGE_KEY);
    }

    els.editorTitle.textContent = "新增比赛";
    els.matchTitle.value = "";
    els.matchSortOrder.value = "";
    els.matchStartsAt.value = "";
    els.bpStartsAt.value = "";
    els.playerConfirmationEnabled.checked = false;
    els.matchStatus.value = "scheduled";
    els.matchVisibility.value = "assigned";
    els.participantCount.value = "2";
    els.randomPickEnabled.checked = true;
    els.randomPickCount.value = "1";
    els.poolMode.value = "round16";
    els.bpCategoryDivision.value = DEFAULT_BP_CATEGORY.division;
    els.bpCategoryStage.value = DEFAULT_BP_CATEGORY.stage;
    els.bpCategoryGroup.value = DEFAULT_BP_CATEGORY.group;
    els.matchContent.value = "";
    els.trackSearch.value = "";
    els.customDifficulties.forEach((input) => {
      input.checked = true;
    });
    els.resultSummary.value = "";
    setMessage(els.editorMsg, "");
    renderBpRule();
    renderParticipants();
    renderAccounts();
    renderCustomPool();
    renderResultEditor();
  }

  function editMatch(match, options = {}) {
    state.editingId = match.id;
    sessionStorage.setItem(EDITING_MATCH_STORAGE_KEY, match.id);
    state.selectedParticipants = new Set(
      (match.participants || []).map((participant) => participant.userId).filter(Boolean)
    );
    state.customTrackIds = new Set((match.customTrackIds || []).map(Number));
    state.trackSearch = "";

    els.editorTitle.textContent = "编辑比赛";
    els.matchTitle.value = match.title || "";
    els.matchSortOrder.value = Number.isFinite(match.sortOrder)
      ? String(match.sortOrder)
      : "";
    els.matchStartsAt.value = toDatetimeLocal(match.startsAt);
    els.bpStartsAt.value = toDatetimeLocal(match.bpStartsAt);
    els.playerConfirmationEnabled.checked = Boolean(match.playerConfirmation?.enabled);
    els.matchStatus.value = match.status || "scheduled";
    els.matchVisibility.value = match.visibility || "assigned";
    els.participantCount.value = String(match.participantCount || 2);
    els.randomPickEnabled.checked = match.randomPickEnabled !== false;
    els.randomPickCount.value = String(match.randomPickCount || 1);
    els.poolMode.value = match.poolMode || "round16";
    const category = getEditableBpCategory(match);
    els.bpCategoryDivision.value = category.division;
    els.bpCategoryStage.value = category.stage;
    els.bpCategoryGroup.value = category.group;
    els.matchContent.value = match.content || "";
    els.trackSearch.value = "";
    els.customDifficulties.forEach((input) => {
      const difficulties = normalizeDifficulties(match.customDifficulties);
      input.checked = difficulties.length ? difficulties.includes(input.value) : true;
    });

    renderBpRule();
    renderParticipants();
    renderAccounts();
    renderCustomPool();
    renderResultEditor();
    setMessage(els.editorMsg, `正在编辑：${match.title}`);
    if (options.scroll !== false) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }

  function renderTags(container, tags) {
    tags.forEach((tag) => {
      const element = createElement("span", `tag ${tag.className || ""}`.trim(), tag.text);
      container.appendChild(element);
    });
  }

  function renderMatches() {
    els.matchList.innerHTML = "";

    if (!state.matches.length) {
      els.matchList.appendChild(createElement("p", "empty-line", "暂无比赛，先在上方新增一场。"));
      return;
    }

    state.matches.forEach((match) => {
      const card = createElement("div", "match-card");
      const body = createElement("div", "match-card-body");
      body.appendChild(createElement("strong", "", match.title));

      const meta = createElement("div", "match-card-meta");
      renderTags(meta, [
        {
          text: formatDateTime(match.startsAt)
        },
        {
          text: match.bpStartsAt ? `BP ${formatDateTime(match.bpStartsAt)}` : "BP手动开放"
        },
        {
          text: STATUS_LABELS[match.status] || "未开始",
          className: match.status === "finished" ? "is-finished" : ""
        },
        {
          text: match.visibility === "public" ? "公开" : "定向",
          className: match.visibility === "public" ? "is-public" : ""
        },
        {
          text: POOL_LABELS[match.poolMode] || "曲池"
        },
        {
          text: formatBpCategory(match) || "未分类"
        },
        {
          text: `${match.participants?.length || 0}/${match.participantCount || 0}人`
        },
        ...(Number.isFinite(match.sortOrder)
          ? [
              {
                text: `排序 ${match.sortOrder}`
              }
            ]
          : []),
        ...(match.playerConfirmation?.enabled
          ? [
              {
                text: `选手确认 ${match.playerConfirmation.confirmedCount || 0}/${match.playerConfirmation.total || match.participants?.length || 0}`,
                className: match.playerConfirmation.allConfirmed ? "is-confirmed" : ""
              }
            ]
          : []),
        {
          text: match.randomPickEnabled === false
            ? "无随机"
            : `随机 ${match.randomPickCount || 1} 首`
        }
      ]);
      body.appendChild(meta);

      if (match.content) {
        body.appendChild(createElement("p", "", match.content));
      }

      const actions = createElement("div", "match-card-actions");
      const editButton = createElement("button", "ghost-action", "编辑");
      editButton.type = "button";
      editButton.addEventListener("click", () => editMatch(match));

      const resetButton = createElement("button", "ghost-action", "重置BP");
      resetButton.type = "button";
      resetButton.addEventListener("click", () =>
        openConfirm(`确认重置《${match.title}》的 BP 记录？`, () => resetBp(match.id))
      );

      const deleteButton = createElement("button", "danger-action", "删除");
      deleteButton.type = "button";
      deleteButton.addEventListener("click", () =>
        openConfirm(`确认删除《${match.title}》？删除后无法恢复。`, () => deleteMatch(match.id))
      );

      actions.append(editButton, resetButton, deleteButton);
      card.append(body, actions);
      els.matchList.appendChild(card);
    });
  }

  async function loadAccounts() {
    const payload = await fetchAdmin("/admin/accounts");

    state.accounts = Array.isArray(payload.accounts) ? payload.accounts : [];
    els.accountSource.textContent =
      payload.source === "auth" ? `Auth 全量 · ${state.accounts.length}` : `已知账号 · ${state.accounts.length}`;
    renderAccounts();
    renderParticipants();
    renderResultEditor();
  }

  async function loadMatches() {
    const payload = await fetchAdmin("/admin/schedule/matches");

    state.matches = Array.isArray(payload.matches) ? payload.matches : [];
    renderMatches();
    renderResultEditor();

    if (!state.editingId) {
      const rememberedMatchId = sessionStorage.getItem(EDITING_MATCH_STORAGE_KEY) || "";
      const rememberedMatch = state.matches.find((match) => match.id === rememberedMatchId);

      if (rememberedMatch) {
        editMatch(rememberedMatch, {
          scroll: false
        });
      } else if (rememberedMatchId) {
        sessionStorage.removeItem(EDITING_MATCH_STORAGE_KEY);
      }
    }
  }

  async function loadLeaderboardPlayers() {
    state.isLeaderboardLoading = true;
    state.leaderboardLoadError = "";
    renderAccountBindingPanel();

    try {
      const response = await fetch(`${API_URL}/players`);
      const payload = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(payload.message || "排行榜账号读取失败");
      }

      const players = Array.isArray(payload) ? payload : payload.players;
      state.leaderboardPlayers = Array.isArray(players)
        ? players.filter((player) => player && player.id !== undefined && player.id !== null)
        : [];
    } catch (error) {
      state.leaderboardPlayers = [];
      state.leaderboardLoadError = error.message || "排行榜账号读取失败，请稍后重试";
    } finally {
      state.isLeaderboardLoading = false;
      renderAccountBindingPanel();
    }
  }

  function openAccountBinding(userId) {
    const account = getAccountById(userId);

    if (!account) {
      return;
    }

    state.bindingAccountId = account.userId;
    state.playerBindingSearch = "";
    els.playerBindingSearch.value = "";
    renderAccountBindingPanel();

    if (!state.leaderboardPlayers.length && !state.isLeaderboardLoading) {
      loadLeaderboardPlayers();
    }

    window.requestAnimationFrame(() => {
      els.playerBindingSearch.focus();
    });
  }

  function closeAccountBinding() {
    state.bindingAccountId = "";
    state.playerBindingSearch = "";
    els.playerBindingSearch.value = "";
    renderAccountBindingPanel();
  }

  async function bindAccountToPlayer(playerId) {
    const account = getAccountById(state.bindingAccountId);

    if (!account || !playerId || state.isBindingAccount) {
      return;
    }

    state.isBindingAccount = true;
    renderAccountBindingPanel();
    setMessage(els.editorMsg, "正在绑定排行榜账号...");

    try {
      const payload = await fetchAdmin(`/admin/accounts/${encodeURIComponent(account.userId)}/binding`, {
        method: "PUT",
        body: JSON.stringify({
          playerId
        })
      });
      const binding = payload.binding || {};

      state.accounts = state.accounts.map((item) =>
        item.userId === account.userId ? { ...item, ...binding } : item
      );
      await Promise.all([loadAccounts(), loadMatches()]);
      closeAccountBinding();
      renderParticipants();
      renderResultEditor();
      setMessage(els.editorMsg, "排行榜账号已绑定。");
    } catch (error) {
      setMessage(els.editorMsg, error.message || "绑定失败", true);
    } finally {
      state.isBindingAccount = false;
      renderAccountBindingPanel();
    }
  }

  async function loadDashboard() {
    if (!adminToken) {
      showLogin();
      return;
    }

    showDashboard();
    setMessage(els.editorMsg, "正在加载后台数据...");

    try {
      await Promise.all([loadAccounts(), loadMatches(), loadLeaderboardPlayers()]);
      setMessage(els.editorMsg, "后台数据已同步。");
    } catch (error) {
      setMessage(els.editorMsg, error.message || "后台加载失败", true);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    const password = els.adminPassword.value.trim();

    if (!password) {
      setMessage(els.loginMsg, "请输入管理员密码", true);
      return;
    }

    setMessage(els.loginMsg, "正在登录...");

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password
        })
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || "密码错误");
      }

      adminToken = payload.token;
      localStorage.setItem("adminToken", adminToken);
      els.adminPassword.value = "";
      setMessage(els.loginMsg, "");
      await loadDashboard();
    } catch (error) {
      localStorage.removeItem("adminToken");
      adminToken = null;
      setMessage(els.loginMsg, error.message || "登录失败", true);
    }
  }

  async function saveMatch(event) {
    event.preventDefault();

    const payload = collectMatchPayload();

    if (!payload.title) {
      setMessage(els.editorMsg, "比赛标题不能为空", true);
      return;
    }

    if (payload.poolMode === "custom" && payload.customTrackIds.length === 0) {
      setMessage(els.editorMsg, "自定义曲池至少选择一首曲目", true);
      return;
    }

    els.saveMatch.disabled = true;
    setMessage(els.editorMsg, "正在保存比赛...");

    try {
      let savedMatch = null;

      if (state.editingId) {
        const updated = await fetchAdmin(`/admin/schedule/matches/${encodeURIComponent(state.editingId)}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        savedMatch = updated.match || null;
      } else {
        const created = await fetchAdmin("/admin/schedule/matches", {
          method: "POST",
          body: JSON.stringify(payload)
        });

        state.editingId = created.match?.id || "";
        if (state.editingId) {
          sessionStorage.setItem(EDITING_MATCH_STORAGE_KEY, state.editingId);
        }
        savedMatch = created.match || null;
      }

      await Promise.all([loadAccounts(), loadMatches()]);
      const returnedStage = normalizeCategoryText(
        savedMatch?.bpCategory?.stage ||
          savedMatch?.bpStage ||
          savedMatch?.bpCategoryStage
      );

      if (payload.bpCategory.stage && returnedStage !== payload.bpCategory.stage) {
        setMessage(
          els.editorMsg,
          "比赛已保存，但当前后端没有返回 BP 分类阶段字段；请发布后端后再刷新验证。",
          true
        );
      } else {
        setMessage(els.editorMsg, "比赛已保存。");
      }
    } catch (error) {
      setMessage(els.editorMsg, error.message || "保存失败", true);
    } finally {
      els.saveMatch.disabled = false;
    }
  }

  async function savePlayerConfirmationSetting() {
    const enabled = els.playerConfirmationEnabled.checked;

    if (!state.editingId) {
      setMessage(els.editorMsg, "新建比赛将在点击“保存比赛”后应用选手确认设置。");
      return;
    }

    if (state.isSavingPlayerConfirmation) {
      return;
    }

    state.isSavingPlayerConfirmation = true;
    els.playerConfirmationEnabled.disabled = true;
    els.playerConfirmationEnabled
      .closest(".player-confirmation-toggle")
      ?.classList.add("is-saving");
    setMessage(els.editorMsg, "正在保存选手确认设置...");

    try {
      const payload = await fetchAdmin(
        `/admin/schedule/matches/${encodeURIComponent(state.editingId)}/player-confirmation`,
        {
          method: "PUT",
          body: JSON.stringify({ enabled })
        }
      );
      const savedMatch = payload.match;

      if (!savedMatch) {
        throw new Error("后端没有返回已保存的比赛数据");
      }

      state.matches = state.matches.map((match) =>
        match.id === savedMatch.id ? savedMatch : match
      );
      els.playerConfirmationEnabled.checked = Boolean(
        savedMatch.playerConfirmation?.enabled
      );
      renderMatches();
      setMessage(
        els.editorMsg,
        savedMatch.playerConfirmation?.enabled
          ? "选手确认已开启，并已自动保存。"
          : "选手确认已关闭，并已自动保存。"
      );
    } catch (error) {
      els.playerConfirmationEnabled.checked = !enabled;
      setMessage(
        els.editorMsg,
        error.message || "选手确认设置保存失败，请稍后重试。",
        true
      );
    } finally {
      state.isSavingPlayerConfirmation = false;
      els.playerConfirmationEnabled.disabled = false;
      els.playerConfirmationEnabled
        .closest(".player-confirmation-toggle")
        ?.classList.remove("is-saving");
    }
  }

  function collectResultPayload() {
    const participants = Array.from(state.selectedParticipants)
      .map(getAccountById)
      .filter(Boolean);

    return {
      summary: els.resultSummary.value.trim(),
      entries: participants.map((account) => {
        const getValue = (field) => {
          const input = els.resultEntryList.querySelector(
            `[data-user-id="${CSS.escape(account.userId)}"][data-result-field="${field}"]`
          );

          return input ? input.value.trim() : "";
        };

        return {
          userId: account.userId,
          nickname: account.nickname,
          playerNickname: account.playerNickname,
          score: getValue("score"),
          outcome: getValue("outcome") || "pending",
          note: getValue("note")
        };
      })
    };
  }

  async function saveResult() {
    if (!state.editingId) {
      setMessage(els.editorMsg, "先选择一场比赛再保存结果", true);
      return;
    }

    els.saveResult.disabled = true;
    setMessage(els.editorMsg, "正在保存比赛结果...");

    try {
      await fetchAdmin(`/admin/schedule/matches/${encodeURIComponent(state.editingId)}/result`, {
        method: "PUT",
        body: JSON.stringify(collectResultPayload())
      });
      await loadMatches();
      setMessage(els.editorMsg, "比赛结果已保存。");
    } catch (error) {
      setMessage(els.editorMsg, error.message || "结果保存失败", true);
    } finally {
      els.saveResult.disabled = false;
    }
  }

  async function deleteMatch(matchId) {
    setMessage(els.editorMsg, "正在删除比赛...");

    try {
      await fetchAdmin(`/admin/schedule/matches/${encodeURIComponent(matchId)}`, {
        method: "DELETE"
      });

      if (state.editingId === matchId) {
        resetForm();
      }

      await loadMatches();
      setMessage(els.editorMsg, "比赛已删除。");
    } catch (error) {
      setMessage(els.editorMsg, error.message || "删除失败", true);
    }
  }

  async function resetBp(matchId) {
    setMessage(els.editorMsg, "正在重置 BP...");

    try {
      await fetchAdmin(`/admin/schedule/matches/${encodeURIComponent(matchId)}/reset-bp`, {
        method: "POST"
      });
      await loadMatches();
      setMessage(els.editorMsg, "BP 已重置。");
    } catch (error) {
      setMessage(els.editorMsg, error.message || "BP 重置失败", true);
    }
  }

  function openConfirm(message, action) {
    state.pendingConfirm = action;
    els.confirmText.textContent = message;
    els.dialog.classList.add("is-open");
    els.dialog.setAttribute("aria-hidden", "false");
    els.confirmAction.focus();
  }

  function closeConfirm() {
    state.pendingConfirm = null;
    els.dialog.classList.remove("is-open");
    els.dialog.setAttribute("aria-hidden", "true");
  }

  function bindEvents() {
    els.loginForm.addEventListener("submit", handleLogin);
    els.logout.addEventListener("click", clearSession);
    els.reload.addEventListener("click", loadDashboard);
    els.form.addEventListener("submit", saveMatch);
    els.newMatch.addEventListener("click", resetForm);
    els.resetForm.addEventListener("click", resetForm);
    els.saveResult.addEventListener("click", saveResult);

    els.accountSearch.addEventListener("input", (event) => {
      state.accountSearch = event.target.value;
      renderAccounts();
    });
    els.closeAccountBinding.addEventListener("click", closeAccountBinding);
    els.playerBindingSearch.addEventListener("input", (event) => {
      state.playerBindingSearch = event.target.value;
      renderAccountBindingPanel();
    });

    els.participantCount.addEventListener("input", renderBpRule);
    els.randomPickEnabled.addEventListener("change", renderBpRule);
    els.playerConfirmationEnabled.addEventListener(
      "change",
      savePlayerConfirmationSetting
    );
    els.randomPickCount.addEventListener("input", renderBpRule);
    els.poolMode.addEventListener("change", renderCustomPool);
    els.trackSearch.addEventListener("input", (event) => {
      state.trackSearch = event.target.value;
      renderCustomPool();
    });

    els.confirmAction.addEventListener("click", async () => {
      const action = state.pendingConfirm;
      closeConfirm();

      if (typeof action === "function") {
        await action();
      }
    });

    document.querySelectorAll("[data-close-dialog]").forEach((element) => {
      element.addEventListener("click", closeConfirm);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeConfirm();
      }
    });
  }

  bindEvents();
  resetForm({
    preserveEditingSelection: true
  });

  if (adminToken) {
    loadDashboard();
  } else {
    showLogin();
  }
})();
