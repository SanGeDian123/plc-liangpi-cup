(function () {
  const STAGE_LABELS = {
    round16: "16进8曲池",
    top8: "8强赛曲池",
    custom: "自定义曲池"
  };
  const STATUS_LABELS = {
    scheduled: "未开始",
    bp: "BP中",
    live: "比赛中",
    finished: "已结束"
  };
  const OUTCOME_LABELS = {
    win: "胜",
    loss: "负",
    draw: "平",
    pending: "待定"
  };

  const SONG_POOL_API_PATH = "/schedule/song-pool";
  const SONG_POOL_RETRY_COOLDOWN_MS = 3000;
  const SCHEDULE_LOAD_TIMEOUT_MS = 8000;
  const SESSION_REFRESH_TIMEOUT_MS = 1200;
  const SCHEDULE_RETRY_DELAY_MS = 3500;

  const state = {
    matches: [],
    finishedMatchesExpanded: false,
    activeMatchId: "",
    activeMatch: null,
    trackSearch: "",
    selectedTrackId: "",
    selectedDifficulty: "",
    libraryTrackId: "",
    trackOptionsSignature: "",
    difficultyOptionsSignature: "",
    randomReveal: {
      key: "",
      pendingKey: "",
      done: false,
      running: false,
      timer: 0,
      target: null,
      targets: []
    },
    pollTimer: 0,
    isLoadingMatches: false,
    isFetchingActiveMatch: false,
    activeMatchFetchPromise: null,
    songPoolLoading: false,
    songPoolLoadFailed: false,
    songPoolLoadPromise: null,
    songPoolLastAttemptAt: 0,
    songPoolRetryTimer: 0,
    scheduleLoadRetryTimer: 0,
    hasRequestedAccountRefresh: false,
    serverTimeOffsetMs: 0,
    bpCountdownTimer: 0,
    bpCountdownMatchId: "",
    lastPresenceAt: 0,
    isSubmitting: false,
    isConfirmingPlayer: false,
    playerConfirmationMessage: "",
    playerConfirmationMessageIsError: false,
    pendingBpAction: null,
    bpConfirmCloseTimer: 0,
    selectionAnimation: {
      matchId: "",
      banKeys: new Set(),
      pickKeys: new Set()
    }
  };

  const els = {
    layout: document.querySelector(".schedule-layout"),
    matchListPanel: document.querySelector(".match-list-panel"),
    summary: document.getElementById("scheduleSummary"),
    refresh: document.getElementById("refreshMatchesButton"),
    matchList: document.getElementById("matchList"),
    bpPanel: document.getElementById("bpPanel"),
    bpEmpty: document.getElementById("bpEmpty"),
    bpWorkbench: document.getElementById("bpWorkbench"),
    backToMatches: document.getElementById("backToMatchesButton"),
    bpStageLabel: document.getElementById("bpStageLabel"),
    bpTitle: document.getElementById("bpTitle"),
    bpMeta: document.getElementById("bpMeta"),
    bpStatus: document.getElementById("bpStatus"),
    participantRow: document.getElementById("participantRow"),
    myNickname: document.getElementById("myNickname"),
    opponentNickname: document.getElementById("opponentNickname"),
    playerConfirmationPanel: document.getElementById("playerConfirmationPanel"),
    playerConfirmationCount: document.getElementById("playerConfirmationCount"),
    playerConfirmationHint: document.getElementById("playerConfirmationHint"),
    playerConfirmationRoster: document.getElementById("playerConfirmationRoster"),
    playerConfirmationCountdown: document.getElementById("playerConfirmationCountdown"),
    playerConfirmationCountdownValue: document.getElementById("playerConfirmationCountdownValue"),
    playerConfirmationCountdownHint: document.getElementById("playerConfirmationCountdownHint"),
    confirmPlayerConfirmation: document.getElementById("confirmPlayerConfirmationButton"),
    playerConfirmationMessage: document.getElementById("playerConfirmationMessage"),
    livePresence: document.getElementById("livePresence"),
    banProgress: document.getElementById("banProgress"),
    pickProgress: document.getElementById("pickProgress"),
    banList: document.getElementById("banList"),
    pickList: document.getElementById("pickList"),
    actionPanel: document.getElementById("actionPanel"),
    actionQuota: document.getElementById("actionQuota"),
    bpForm: document.getElementById("bpForm"),
    trackSearch: document.getElementById("trackSearch"),
    trackSelect: document.getElementById("trackSelect"),
    difficultySelect: document.getElementById("difficultySelect"),
    difficultyPicker: document.getElementById("difficultyPicker"),
    openBpLibrary: document.getElementById("openBpLibraryButton"),
    bpPickerTrack: document.getElementById("bpPickerTrack"),
    bpPickerMeta: document.getElementById("bpPickerMeta"),
    submitBp: document.getElementById("submitBpButton"),
    confirmBp: document.getElementById("confirmBpButton"),
    actionMessage: document.getElementById("actionMessage"),
    summaryPanel: document.getElementById("summaryPanel"),
    summaryList: document.getElementById("summaryList"),
    confirmProgress: document.getElementById("confirmProgress"),
    resultPanel: document.getElementById("resultPanel"),
    resultList: document.getElementById("resultList"),
    bpSubmitDialog: document.getElementById("bpSubmitDialog"),
    bpSubmitConfirmType: document.getElementById("bpSubmitConfirmType"),
    bpSubmitConfirmTitle: document.getElementById("bpSubmitConfirmTitle"),
    bpSubmitConfirmMatch: document.getElementById("bpSubmitConfirmMatch"),
    bpSubmitConfirmAction: document.getElementById("bpSubmitConfirmAction"),
    bpSubmitConfirmTrack: document.getElementById("bpSubmitConfirmTrack"),
    bpSubmitConfirmMeta: document.getElementById("bpSubmitConfirmMeta"),
    bpSubmitConfirmDifficulty: document.getElementById("bpSubmitConfirmDifficulty"),
    bpSubmitConfirmMessage: document.getElementById("bpSubmitConfirmMessage"),
    bpSubmitConfirmButton: document.getElementById("bpSubmitConfirmButton"),
    bpSubmitCancelButton: document.getElementById("bpSubmitCancelButton"),
    bpLibraryDialog: document.getElementById("bpLibraryDialog"),
    bpLibraryList: document.getElementById("bpLibraryList"),
    bpLibraryHint: document.getElementById("bpLibraryHint")
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

  function getAccessToken() {
    return window.PLCAccount?.getAccessToken?.() || "";
  }

  async function waitForPromise(promise, timeoutMs) {
    if (!promise || !timeoutMs) {
      return promise;
    }

    let timeoutId = 0;

    try {
      return await Promise.race([
        promise,
        new Promise((resolve) => {
          timeoutId = window.setTimeout(() => resolve(undefined), timeoutMs);
        })
      ]);
    } finally {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    }
  }

  async function fetchJson(path, options = {}) {
    const {
      authMode = "auto",
      refreshSession = authMode !== "omit",
      sessionTimeoutMs = SESSION_REFRESH_TIMEOUT_MS,
      timeoutMs = 15000,
      ...fetchOptions
    } = options;
    const headers = {
      ...(fetchOptions.headers || {})
    };

    if (refreshSession) {
      await waitForPromise(window.PLCAccount?.ensureFreshSession?.(), sessionTimeoutMs);
    }

    const token = authMode === "omit" ? "" : getAccessToken();

    if (fetchOptions.body && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const controller = timeoutMs && !fetchOptions.signal
      ? new AbortController()
      : null;
    const timeoutId = controller
      ? window.setTimeout(() => controller.abort(), timeoutMs)
      : 0;

    try {
      const response = await fetch(`${API_URL}${path}`, {
        ...fetchOptions,
        headers,
        signal: fetchOptions.signal || controller?.signal
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || "请求失败");
      }

      return payload;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("请求超时，请稍后重试。");
      }

      throw error;
    } finally {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    }
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

  function normalizeText(value, fallback = "-") {
    const text = String(value || "").trim();

    return text || fallback;
  }

  function hasSongPoolData() {
    return Array.isArray(window.PLC_SONG_POOL_DATA?.tracks);
  }

  function getSongPoolData() {
    return hasSongPoolData() ? window.PLC_SONG_POOL_DATA : {
      tracks: []
    };
  }

  function loadSongPoolData(options = {}) {
    const forceFresh = Boolean(options.forceFresh || state.songPoolLoadFailed);

    if (hasSongPoolData() && !forceFresh) {
      state.songPoolLoadFailed = false;
      return Promise.resolve(window.PLC_SONG_POOL_DATA);
    }

    if (state.songPoolLoadPromise) {
      return state.songPoolLoadPromise;
    }

    state.songPoolLoading = true;
    state.songPoolLoadFailed = false;
    state.songPoolLastAttemptAt = Date.now();
    state.songPoolLoadPromise = fetchJson(SONG_POOL_API_PATH, {
      authMode: "omit",
      refreshSession: false,
      cache: "no-store",
      timeoutMs: SCHEDULE_LOAD_TIMEOUT_MS
    })
      .then((data) => {
        if (!Array.isArray(data?.tracks)) {
          throw new Error("song-pool-data-unavailable");
        }

        window.PLC_SONG_POOL_DATA = data;
        state.songPoolLoadFailed = false;
        return data;
      })
      .catch((error) => {
        state.songPoolLoadPromise = null;
        state.songPoolLoadFailed = true;
        throw error;
      })
      .finally(() => {
        state.songPoolLoading = false;
      });

    return state.songPoolLoadPromise;
  }

  function scheduleSongPoolRetry(matchId) {
    window.clearTimeout(state.songPoolRetryTimer);
    state.songPoolRetryTimer = window.setTimeout(() => {
      if (state.activeMatchId === matchId && !hasSongPoolData()) {
        ensureSongPoolForActiveMatch(matchId, {
          force: true
        });
      }
    }, SONG_POOL_RETRY_COOLDOWN_MS);
  }

  function ensureSongPoolForActiveMatch(matchId = state.activeMatchId, options = {}) {
    if (!matchId || hasSongPoolData()) {
      return;
    }

    if (state.songPoolLoading) {
      return;
    }

    if (
      state.songPoolLoadFailed &&
      !options.force &&
      Date.now() - state.songPoolLastAttemptAt < SONG_POOL_RETRY_COOLDOWN_MS
    ) {
      scheduleSongPoolRetry(matchId);
      return;
    }

    loadSongPoolData({
      forceFresh: options.force || state.songPoolLoadFailed
    })
      .then(() => {
        if (state.activeMatchId === matchId) {
          window.clearTimeout(state.songPoolRetryTimer);
          renderActiveMatch();
        }
      })
      .catch(() => {
        if (state.activeMatchId === matchId) {
          setActionMessage("曲库暂时加载失败，正在自动重试。", true);
          renderTrackOptions();
          renderBpLibrary();
          scheduleSongPoolRetry(matchId);
        }
      });
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

  function getTrackDifficulties(track, match) {
    if (match.poolMode !== "custom") {
      return normalizeDifficulties(track?.stages?.[match.poolMode]);
    }

    const stageDifficulties = normalizeDifficulties([
      ...normalizeDifficulties(track?.stages?.round16),
      ...normalizeDifficulties(track?.stages?.top8)
    ]);
    const customDifficulties = normalizeDifficulties(match.customDifficulties);

    if (!customDifficulties.length) {
      return stageDifficulties;
    }

    return stageDifficulties.filter((difficulty) =>
      customDifficulties.includes(difficulty)
    );
  }

  function getPoolTracks(match) {
    const data = getSongPoolData();
    const customIds = new Set((match.customTrackIds || []).map(Number));

    return data.tracks
      .filter((track) => {
        if (isRemovedTrack(track)) {
          return false;
        }

        if (match.poolMode === "custom") {
          return customIds.has(Number(track.id));
        }

        return Boolean(track?.stages?.[match.poolMode]);
      })
      .map((track) => ({
        ...track,
        difficulties: getTrackDifficulties(track, match)
      }))
      .filter((track) => track.difficulties.length > 0);
  }

  function matchesSearch(track) {
    if (!state.trackSearch) {
      return true;
    }

    const needle = state.trackSearch.toLowerCase();
    const haystack = [track.title, track.artist, track.pack]
      .map((item) => String(item || "").toLowerCase())
      .join(" ");

    return haystack.includes(needle);
  }

  function getViewerUserId(match = state.activeMatch) {
    return match?.viewer?.participant?.userId || window.PLCAccount?.getUser?.()?.id || "";
  }

  function getParticipantName(participant, fallback = "选手") {
    return (
      participant?.displayName ||
      participant?.playerNickname ||
      participant?.nickname ||
      participant?.email?.split("@")[0] ||
      fallback
    );
  }

  function isBpOpen(match) {
    return match?.bpOpen === true;
  }

  function syncServerTime(serverNow) {
    const time = Date.parse(serverNow || "");

    if (Number.isFinite(time)) {
      state.serverTimeOffsetMs = time - Date.now();
    }
  }

  function getServerNow() {
    return Date.now() + state.serverTimeOffsetMs;
  }

  function formatBpCountdown(remainingMs) {
    const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  }

  function stopBpCountdown() {
    window.clearInterval(state.bpCountdownTimer);
    state.bpCountdownTimer = 0;
    state.bpCountdownMatchId = "";
  }

  function renderBpCountdown(match) {
    const confirmation = getPlayerConfirmationInfo(match);
    const bpTime = Date.parse(match?.bpStartsAt || "");
    const shouldShow =
      match?.status === "scheduled" &&
      confirmation.enabled &&
      confirmation.allConfirmed &&
      Number.isFinite(bpTime);

    if (!shouldShow) {
      els.playerConfirmationCountdown.hidden = true;
      stopBpCountdown();
      return;
    }

    const updateCountdown = () => {
      const remainingMs = bpTime - getServerNow();

      els.playerConfirmationCountdownValue.textContent = formatBpCountdown(remainingMs);
      els.playerConfirmationCountdownHint.textContent =
        remainingMs > 0
          ? `BP 将于 ${formatDateTime(match.bpStartsAt)} 开放`
          : "正在同步 BP 开放状态...";

      if (remainingMs <= 0) {
        stopBpCountdown();
        fetchActiveMatch();
      }

      return remainingMs <= 0;
    };

    els.playerConfirmationCountdown.hidden = false;
    const countdownFinished = updateCountdown();

    if (countdownFinished) {
      return;
    }

    if (state.bpCountdownMatchId === match.id && state.bpCountdownTimer) {
      return;
    }

    stopBpCountdown();
    state.bpCountdownMatchId = match.id;
    state.bpCountdownTimer = window.setInterval(() => {
      if (state.activeMatch?.id !== match.id) {
        stopBpCountdown();
        return;
      }

      updateCountdown();
    }, 250);
  }

  function getPlayerConfirmationInfo(match) {
    const confirmation = match?.playerConfirmation || {};
    const total = Number(confirmation.total ?? match?.participants?.length ?? 0);
    const confirmedCount = Number(confirmation.confirmedCount ?? 0);

    return {
      enabled: confirmation.enabled === true,
      total: Number.isFinite(total) && total >= 0 ? total : 0,
      confirmedCount: Number.isFinite(confirmedCount) && confirmedCount >= 0 ? confirmedCount : 0,
      allConfirmed: confirmation.allConfirmed === true,
      viewerConfirmed: confirmation.viewerConfirmed === true
    };
  }

  function isBpOpeningHiddenByConfirmation(match) {
    const confirmation = getPlayerConfirmationInfo(match);

    return match?.status === "scheduled" && confirmation.enabled && !confirmation.allConfirmed;
  }

  function getBpOpeningMeta(match) {
    if (isBpOpeningHiddenByConfirmation(match)) {
      return "全部选手确认后显示 BP 开放时间";
    }

    return match?.bpStartsAt
      ? `BP ${formatDateTime(match.bpStartsAt)}`
      : "BP手动开放";
  }

  function getCurrentAction(match = state.activeMatch) {
    if (!match?.viewer?.isParticipant || !isBpOpen(match)) {
      return "";
    }

    const userId = getViewerUserId(match);
    const progress = match.bp?.progress || {};

    if (progress.phase === "ban") {
      const bans = (match.bp.bans || []).filter((item) => item.userId === userId);

      return bans.length < progress.banCount ? "ban" : "";
    }

    if (progress.phase === "pick") {
      const picks = (match.bp.picks || []).filter((item) => item.userId === userId);

      return picks.length < progress.pickCount ? "pick" : "";
    }

    return "";
  }

  function setActionMessage(message, isError = false, isWaiting = false) {
    els.actionMessage.textContent = message || "";
    els.actionMessage.classList.toggle("is-error", isError);
    els.actionMessage.classList.toggle("is-waiting", Boolean(message && isWaiting && !isError));
  }

  function renderTags(container, tags) {
    tags.forEach((tag) => {
      const element = createElement("span", `tag ${tag.className || ""}`.trim(), tag.text);
      container.appendChild(element);
    });
  }

  function formatRandomRule(match) {
    return match.randomPickEnabled === false
      ? "无系统随机"
      : `系统随机 ${match.randomPickCount || 1} 首`;
  }

  function normalizeBpCategoryText(value) {
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
      .map(normalizeBpCategoryText)
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

  function getMatchBpCategory(match = {}, withFallback = true) {
    const rawCategory = typeof match.bpCategory === "string"
      ? { division: match.bpCategory }
      : match.bpCategory || {};
    const inferred = inferBpCategory(match);
    const stage =
      normalizeBpCategoryText(rawCategory.stage) ||
      normalizeBpCategoryText(rawCategory.round || rawCategory.phase || rawCategory.secondary) ||
      normalizeBpCategoryText(match.bpStage) ||
      normalizeBpCategoryText(match.bpCategoryStage) ||
      inferred.stage;
    const group =
      normalizeBpCategoryText(rawCategory.group) ||
      normalizeBpCategoryText(rawCategory.subgroup || rawCategory.bracket || rawCategory.tertiary) ||
      normalizeBpCategoryText(match.bpGroup) ||
      normalizeBpCategoryText(match.bpCategoryGroup) ||
      inferred.group;
    const division =
      normalizeBpCategoryText(rawCategory.division || rawCategory.type || rawCategory.main || rawCategory.primary) ||
      normalizeBpCategoryText(match.bpDivision) ||
      inferred.division ||
      (stage || group ? "LT组" : "");

    return {
      division: division || (withFallback ? "未分类" : ""),
      stage,
      group
    };
  }

  function getMatchCategoryPath(match) {
    const category = getMatchBpCategory(match, false);

    return [category.division, category.stage, category.group]
      .filter(Boolean)
      .join(" / ");
  }

  function renderMatchCard(match) {
    const card = createElement("button", "match-card");
    card.type = "button";
    card.dataset.matchId = match.id;
    card.classList.toggle("is-active", match.id === state.activeMatchId);

    const top = createElement("div", "match-card-top");
    const title = createElement("h3", "", match.title);
    top.appendChild(title);
    renderTags(top, [
      {
        text: STATUS_LABELS[match.status] || "未开始",
        className: match.status === "finished" ? "is-finished" : ""
      },
      {
        text: match.visibility === "public" ? "公开" : "定向",
        className: match.visibility === "public" ? "is-public" : ""
      }
    ]);

    const meta = createElement("div", "match-card-meta");
    renderTags(meta, [
      {
        text: formatDateTime(match.startsAt)
      },
      {
        text: getBpOpeningMeta(match)
      },
      {
        text: STAGE_LABELS[match.poolMode] || "曲池"
      },
      {
        text: `${match.participants?.length || 0}/${match.participantCount || 0}人`
      },
      {
        text: formatRandomRule(match)
      }
    ]);

    const content = createElement("p", "", match.content || "暂无比赛说明");

    card.append(top, meta, content);
    card.addEventListener("click", () => selectMatch(match.id));

    return card;
  }

  function getOrCreateCategoryEntry(map, key, label, createEntry) {
    if (!map.has(key)) {
      map.set(key, createEntry(label));
    }

    return map.get(key);
  }

  function buildMatchCategoryTree(matches) {
    const root = [];
    const rootMap = new Map();

    matches.forEach((match) => {
      const category = getMatchBpCategory(match);
      const division = getOrCreateCategoryEntry(
        rootMap,
        category.division,
        category.division,
        (label) => {
          const entry = {
            label,
            count: 0,
            direct: [],
            stages: [],
            stageMap: new Map()
          };
          root.push(entry);
          return entry;
        }
      );

      division.count += 1;

      if (!category.stage && !category.group) {
        division.direct.push(match);
        return;
      }

      const stageKey = category.stage || "";
      const stage = getOrCreateCategoryEntry(
        division.stageMap,
        stageKey,
        category.stage,
        (label) => {
          const entry = {
            label,
            direct: [],
            groups: [],
            groupMap: new Map()
          };
          division.stages.push(entry);
          return entry;
        }
      );

      if (!category.group) {
        stage.direct.push(match);
        return;
      }

      const group = getOrCreateCategoryEntry(
        stage.groupMap,
        category.group,
        category.group,
        (label) => {
          const entry = {
            label,
            matches: []
          };
          stage.groups.push(entry);
          return entry;
        }
      );
      group.matches.push(match);
    });

    root.sort((a, b) => {
      const rank = {
        "LT组": 0,
        "LH组": 1,
        "未分类": 99
      };
      const aRank = rank[a.label] ?? 10;
      const bRank = rank[b.label] ?? 10;

      return aRank - bRank || a.label.localeCompare(b.label, "zh-CN");
    });

    return root;
  }

  function appendMatchCards(container, matches) {
    if (!matches.length) {
      return;
    }

    const stack = createElement("div", "match-category-card-stack");
    matches.forEach((match) => {
      stack.appendChild(renderMatchCard(match));
    });
    container.appendChild(stack);
  }

  function renderMatchCategoryTree(tree, container = els.matchList) {
    tree.forEach((division) => {
      const section = createElement("section", "match-category-section");
      const heading = createElement("div", "match-category-heading");
      heading.appendChild(createElement("h3", "", division.label));
      heading.appendChild(createElement("span", "", `${division.count} 场`));
      section.appendChild(heading);

      appendMatchCards(section, division.direct);

      division.stages.forEach((stage) => {
        const stageBlock = createElement("div", "match-category-stage");

        if (stage.label) {
          stageBlock.appendChild(createElement("h4", "", stage.label));
        }

        appendMatchCards(stageBlock, stage.direct);

        stage.groups.forEach((group) => {
          const groupBlock = createElement("div", "match-category-group");
          appendMatchCards(groupBlock, group.matches);
          stageBlock.appendChild(groupBlock);
        });

        section.appendChild(stageBlock);
      });

      container.appendChild(section);
    });
  }

  function renderFinishedMatchSection(matches) {
    if (!matches.length) {
      return;
    }

    const section = createElement("section", "finished-match-section");
    const heading = createElement("div", "finished-match-heading");
    const toggle = createElement("button", "finished-match-toggle");
    const title = createElement("span", "", "已结束比赛");
    const count = createElement("span", "finished-match-count", `${matches.length} 场`);
    const indicator = createElement("span", "finished-match-indicator", "展开");
    const content = createElement("div", "finished-match-content");
    const contentId = "finishedMatchContent";

    toggle.type = "button";
    toggle.setAttribute("aria-expanded", String(state.finishedMatchesExpanded));
    toggle.setAttribute("aria-controls", contentId);
    content.id = contentId;
    content.hidden = !state.finishedMatchesExpanded;
    indicator.textContent = state.finishedMatchesExpanded ? "收起" : "展开";
    toggle.append(title, count, indicator);
    toggle.addEventListener("click", () => {
      state.finishedMatchesExpanded = !state.finishedMatchesExpanded;
      renderMatchList();
    });

    heading.appendChild(toggle);
    section.append(heading, content);
    els.matchList.appendChild(section);
    renderMatchCategoryTree(buildMatchCategoryTree(matches), content);
  }

  function renderMatchList() {
    els.matchList.innerHTML = "";

    if (!state.matches.length) {
      const empty = createElement(
        "p",
        "empty-line",
        "暂无可见比赛。登录并完成绑定后，可看到分配给你的赛事。"
      );
      els.matchList.appendChild(empty);
      return;
    }

    const activeMatches = state.matches.filter((match) => match.status !== "finished");
    const finishedMatches = state.matches.filter((match) => match.status === "finished");

    renderMatchCategoryTree(buildMatchCategoryTree(activeMatches));
    renderFinishedMatchSection(finishedMatches);
  }

  function renderParticipantRow(match) {
    els.participantRow.innerHTML = "";

    if (!match.participants?.length) {
      els.participantRow.appendChild(createElement("span", "empty-line", "后台尚未指定参赛账号"));
      return;
    }

    const viewerUserId = getViewerUserId(match);

    match.participants.forEach((participant, index) => {
      const chip = createElement(
        "span",
        "participant-chip",
        getParticipantName(participant, `选手${index + 1}`)
      );
      chip.classList.toggle("is-me", Boolean(participant.userId && participant.userId === viewerUserId));
      els.participantRow.appendChild(chip);
    });
  }

  function renderIdentityRow(match) {
    const viewerUserId = getViewerUserId(match);
    const participant = match.viewer?.participant;
    const opponents = (match.participants || []).filter(
      (item) => !viewerUserId || item.userId !== viewerUserId
    );
    const opponentLabel = els.opponentNickname.previousElementSibling;

    if (participant) {
      els.myNickname.textContent = getParticipantName(participant, "我");
      els.opponentNickname.textContent =
        opponents.map((item, index) => getParticipantName(item, `选手${index + 1}`)).join(" / ") ||
        "等待分配";
      opponentLabel.textContent = opponents.length > 1 ? "对手" : "对方";
      return;
    }

    els.myNickname.textContent = window.PLCAccount?.getNickname?.() || "观众";
    els.opponentNickname.textContent =
      (match.participants || [])
        .map((item, index) => getParticipantName(item, `选手${index + 1}`))
        .join(" / ") || "等待分配";
    opponentLabel.textContent = "参赛选手";
  }

  function renderPlayerConfirmation(match) {
    const confirmation = getPlayerConfirmationInfo(match);
    const isWaitingForConfirmation =
      confirmation.enabled && match.status === "scheduled";

    els.playerConfirmationPanel.hidden = !isWaitingForConfirmation;

    if (!isWaitingForConfirmation) {
      stopBpCountdown();
      return;
    }

    const total = confirmation.total || match.participants?.length || 0;
    const confirmedCount = Math.min(confirmation.confirmedCount, total);
    const isParticipant = Boolean(match.viewer?.isParticipant);

    els.playerConfirmationPanel.classList.toggle("is-complete", confirmation.allConfirmed);
    els.playerConfirmationCount.textContent = `${confirmedCount}/${total}`;
    els.playerConfirmationHint.textContent = confirmation.allConfirmed
      ? `全部选手已确认，${getBpOpeningMeta(match)}。`
      : total
        ? "全部参赛选手确认后，将显示 BP 开放时间。"
        : "等待后台指定参赛账号后开启确认。";
    els.playerConfirmationRoster.innerHTML = "";

    (match.participants || []).forEach((participant, index) => {
      const item = createElement("div", "player-confirmation-roster-item");
      const name = createElement(
        "strong",
        "",
        getParticipantName(participant, `选手${index + 1}`)
      );
      const status = createElement(
        "span",
        "player-confirmation-state",
        participant.confirmed ? "已确认" : "待确认"
      );

      item.classList.toggle("is-confirmed", Boolean(participant.confirmed));
      item.append(name, status);
      els.playerConfirmationRoster.appendChild(item);
    });

    renderBpCountdown(match);

    els.confirmPlayerConfirmation.hidden =
      !isParticipant || confirmation.viewerConfirmed || confirmation.allConfirmed;
    els.confirmPlayerConfirmation.disabled = state.isConfirmingPlayer;
    els.confirmPlayerConfirmation.textContent = state.isConfirmingPlayer
      ? "正在确认..."
      : "确认参赛";
    els.playerConfirmationMessage.textContent = state.playerConfirmationMessage;
    els.playerConfirmationMessage.classList.toggle(
      "is-error",
      state.playerConfirmationMessageIsError
    );
  }

  function renderPresence(match) {
    if (!isBpOpen(match)) {
      els.livePresence.hidden = true;
      els.livePresence.textContent = "";
      return;
    }

    const viewerUserId = getViewerUserId(match);
    const active = (match.bp?.presence || []).filter(
      (item) => !item.userId || item.userId !== viewerUserId
    );

    if (!active.length) {
      els.livePresence.hidden = true;
      els.livePresence.textContent = "";
      return;
    }

    els.livePresence.hidden = false;
    els.livePresence.textContent = active
      .map((item) => `${normalizeText(item.nickname, "对手")}选手选择中...`)
      .join(" ");
  }

  function getSelectionAnimationKeys(typeClass) {
    const matchId = state.activeMatch?.id || "";

    if (state.selectionAnimation.matchId !== matchId) {
      state.selectionAnimation = {
        matchId,
        banKeys: new Set(),
        pickKeys: new Set()
      };
    }

    return typeClass === "is-ban"
      ? state.selectionAnimation.banKeys
      : state.selectionAnimation.pickKeys;
  }

  function getSelectionRenderKey(selection, typeClass) {
    return (
      selection.id ||
      [
        typeClass,
        selection.userId || "",
        selection.trackId || "",
        selection.difficulty || "",
        selection.createdAt || ""
      ].join(":")
    );
  }

  function renderSelectionList(container, selections, emptyText, typeClass) {
    container.innerHTML = "";

    if (!selections.length) {
      container.appendChild(createElement("p", "empty-line", emptyText));
      getSelectionAnimationKeys(typeClass).clear();
      return;
    }

    const animationKeys = getSelectionAnimationKeys(typeClass);

    selections.forEach((selection) => {
      const item = createElement("div", `selection-item ${typeClass}`);
      const selectionKey = getSelectionRenderKey(selection, typeClass);

      if (selectionKey && !animationKeys.has(selectionKey)) {
        item.classList.add("is-entering");
      }

      if (selectionKey) {
        animationKeys.add(selectionKey);
      }

      item.appendChild(
        createElement("strong", "", `${selection.title || `曲目 ${selection.trackId}`} [${selection.difficulty}]`)
      );

      const meta = createElement("div", "selection-meta");
      meta.appendChild(createElement("span", "", selection.nickname || "选手"));
      meta.appendChild(createElement("span", "", selection.pack || "曲包未知"));
      item.appendChild(meta);
      container.appendChild(item);
    });
  }

  function getRandomPicks(match) {
    if (match?.randomPickEnabled === false) {
      return [];
    }

    const picks = Array.isArray(match?.bp?.randomPicks)
      ? match.bp.randomPicks
      : match?.bp?.randomPick
        ? [match.bp.randomPick]
        : [];
    const progress = match?.bp?.progress || {};
    const expected = Number(progress.randomPickCount ?? match?.randomPickCount ?? picks.length);
    const limit = Number.isFinite(expected) && expected > 0 ? expected : picks.length;

    return picks.slice(0, limit);
  }

  function isRandomPickReady(match, progress = match?.bp?.progress || {}) {
    const required = Number(progress.randomPickCount ?? match?.randomPickCount ?? 1);

    if (match?.randomPickEnabled === false || !required) {
      return true;
    }

    return getRandomPicks(match).length >= required;
  }

  function getRandomPickRevealKey(match) {
    const randomPicks = getRandomPicks(match);

    if (!match?.id || !randomPicks.length) {
      return "";
    }

    return `${match.id}:${randomPicks
      .map((randomPick) => randomPick.id || `${randomPick.trackId}:${randomPick.difficulty}`)
      .join("|")}`;
  }

  function queueRandomPickReveal(previousMatch, nextMatch) {
    if (!previousMatch || !nextMatch || previousMatch.id !== nextMatch.id) {
      return;
    }

    const previousPicks = getRandomPicks(previousMatch);
    const nextPicks = getRandomPicks(nextMatch);
    const previousKey = getRandomPickRevealKey(previousMatch);
    const nextKey = getRandomPickRevealKey(nextMatch);

    if (nextKey && (!previousKey || nextPicks.length > previousPicks.length)) {
      state.randomReveal.pendingKey = nextKey;
    }
  }

  function renderSummary(match) {
    const picks = match.bp?.picks || [];
    const randomPicks = getRandomPicks(match);
    const progress = match.bp?.progress || {};
    const confirmed = match.bp?.confirmedBy?.length || 0;
    const total = match.participants?.length || 0;

    els.summaryPanel.hidden = !randomPicks.length && !picks.length;
    els.summaryList.innerHTML = "";
    els.confirmProgress.textContent = `${confirmed}/${total} 已确认`;

    picks.forEach((selection) => {
      const item = createElement("div", "summary-item is-pick");
      item.appendChild(createElement("strong", "", `${selection.title} [${selection.difficulty}]`));
      item.appendChild(
        createElement("div", "summary-meta", `${selection.nickname || "选手"} 选择 · ${selection.pack || "曲包未知"}`)
      );
      els.summaryList.appendChild(item);
    });

    if (randomPicks.length) {
      const revealKey = getRandomPickRevealKey(match);
      const shouldAnimate = state.randomReveal.pendingKey === revealKey;

      if (state.randomReveal.key !== revealKey) {
        window.clearTimeout(state.randomReveal.timer);
        state.randomReveal = {
          key: revealKey,
          pendingKey: shouldAnimate ? revealKey : "",
          done: !shouldAnimate,
          running: false,
          timer: 0,
          target: null,
          targets: []
        };
      } else {
        state.randomReveal.targets = [];
      }

      randomPicks.forEach((randomPick, index) => {
        const item = createElement("div", "summary-item is-random");
        const title = createElement("strong", "random-roll-title", "");

        if (state.randomReveal.done) {
          title.textContent = `${randomPick.title} [${randomPick.difficulty}]`;
        } else {
          title.textContent = "系统抽取中...";
          item.classList.add("is-rolling");
        }

        state.randomReveal.targets.push({
          element: title,
          randomPick,
          index
        });
        item.appendChild(title);
        item.appendChild(
          createElement(
            "div",
            "summary-meta random-roll-label",
            state.randomReveal.done
              ? `随机抽取曲目 ${index + 1}`
              : `正在随机抽取第 ${index + 1} 首曲目...`
          )
        );
        els.summaryList.appendChild(item);
      });
      startRandomPickReveal(match, randomPicks);
    } else if (progress.allPicksDone && !isRandomPickReady(match, progress)) {
      els.summaryList.appendChild(createElement("p", "empty-line", "系统抽取曲目生成中..."));
    }
  }

  function getRandomRollTitles(match, randomPicks) {
    const usedKeys = new Set(
      [...(match.bp?.bans || []), ...(match.bp?.picks || []), ...randomPicks]
        .map((item) => getBpSelectionKey(item.trackId, item.difficulty))
        .filter(Boolean)
    );
    const randomTrackIds = new Set(randomPicks.map((item) => Number(item.trackId)));
    const titles = getPoolTracks(match)
      .filter((track) =>
        track.difficulties.some(
          (difficulty) =>
            (difficulty === "IN" || difficulty === "AT") &&
            !usedKeys.has(getBpSelectionKey(track.id, difficulty))
        ) ||
        randomTrackIds.has(Number(track.id))
      )
      .map((track) => track.title)
      .filter(Boolean);
    const uniqueTitles = Array.from(
      new Set([...titles, ...randomPicks.map((item) => item.title)].filter(Boolean))
    );

    return uniqueTitles.length ? uniqueTitles : ["系统曲目"];
  }

  function startRandomPickReveal(match, randomPicks) {
    const reveal = state.randomReveal;

    if (reveal.done || reveal.running || !reveal.targets?.length) {
      return;
    }

    const titles = getRandomRollTitles(match, randomPicks);
    const totalSteps = 28;
    let step = 0;

    reveal.running = true;

    const tick = () => {
      const targets = state.randomReveal.targets || [];

      if (!targets.length || state.randomReveal.key !== reveal.key) {
        return;
      }

      if (step >= totalSteps) {
        targets.forEach(({ element, randomPick, index }) => {
          element.textContent = `${randomPick.title} [${randomPick.difficulty}]`;
          element.closest(".summary-item")?.classList.remove("is-rolling");

          const label = element.parentElement?.querySelector(".random-roll-label");

          if (label) {
            label.textContent = `随机抽取曲目 ${index + 1}`;
          }
        });

        state.randomReveal.done = true;
        state.randomReveal.running = false;
        state.randomReveal.timer = 0;
        state.randomReveal.pendingKey = "";
        return;
      }

      targets.forEach(({ element, index }) => {
        const title =
          titles[
            (step * 7 + index * 5 + Math.floor(Math.random() * titles.length)) %
              titles.length
          ];
        element.textContent = `${title} ...`;
      });
      step += 1;

      const ratio = step / totalSteps;
      const delay = 36 + Math.round(290 * ratio * ratio * ratio);
      state.randomReveal.timer = window.setTimeout(tick, delay);
    };

    tick();
  }

  function renderResult(match) {
    const result = match.result || {};
    const entries = result.entries || [];

    els.resultPanel.hidden = !entries.length && !result.summary;
    els.resultPanel.classList.toggle("is-finished", Boolean(entries.length));
    els.resultList.innerHTML = "";

    if (result.summary) {
      els.resultList.appendChild(createElement("p", "empty-line", result.summary));
    }

    entries.forEach((entry) => {
      const item = createElement("div", "result-item");
      const row = createElement("div", "result-row");
      const name = createElement("strong", "", entry.playerNickname || entry.nickname || "选手");
      const outcome = createElement(
        "span",
        entry.outcome === "win" ? "winner" : entry.outcome === "loss" ? "loser" : "",
        OUTCOME_LABELS[entry.outcome] || "待定"
      );
      row.append(name, outcome);
      item.appendChild(row);
      item.appendChild(createElement("div", "selection-meta", `得分：${entry.score || "-"}`));

      if (entry.note) {
        item.appendChild(createElement("div", "selection-meta", entry.note));
      }

      els.resultList.appendChild(item);
    });
  }

  function getBpSelectionKey(trackId, difficulty) {
    const normalizedTrackId = Number(trackId);
    const normalizedDifficulty = String(difficulty || "").trim().toUpperCase();

    if (!Number.isInteger(normalizedTrackId) || normalizedTrackId <= 0 || !normalizedDifficulty) {
      return "";
    }

    return `${normalizedTrackId}:${normalizedDifficulty}`;
  }

  function getUnavailableDifficultyKeys(match, action) {
    const keys = new Set(
      (match.bp?.bans || [])
        .map((item) => getBpSelectionKey(item.trackId, item.difficulty))
        .filter(Boolean)
    );

    if (action === "pick") {
      (match.bp?.picks || []).forEach((item) => {
        const key = getBpSelectionKey(item.trackId, item.difficulty);

        if (key) {
          keys.add(key);
        }
      });
    }

    return keys;
  }

  function getAvailableTracks(match, action) {
    const unavailableKeys = getUnavailableDifficultyKeys(match, action);

    return getPoolTracks(match)
      .filter(matchesSearch)
      .map((track) => ({
        ...track,
        difficulties: track.difficulties.filter(
          (difficulty) =>
            !unavailableKeys.has(getBpSelectionKey(track.id, difficulty))
        )
      }))
      .filter((track) => track.difficulties.length > 0);
  }

  function getActionLabel(action) {
    return action === "ban" ? "禁用" : "选曲";
  }

  function setBpConfirmMessage(message, isError = false) {
    if (!els.bpSubmitConfirmMessage) {
      return;
    }

    els.bpSubmitConfirmMessage.textContent = message || "";
    els.bpSubmitConfirmMessage.classList.toggle("is-error", isError);
  }

  function getBpTrackById(match, trackId) {
    return getPoolTracks(match).find((track) => Number(track.id) === Number(trackId)) || null;
  }

  function validateBpSelection(match, action, trackId, difficulty) {
    if (!match || !action) {
      return {
        error: "当前没有可提交的 BP 操作。"
      };
    }

    if (action !== getCurrentAction(match)) {
      return {
        error: "当前 BP 阶段已经变化，请重新选择。"
      };
    }

    const normalizedTrackId = Number(trackId);
    const normalizedDifficulty = String(difficulty || "").trim().toUpperCase();
    const track = getBpTrackById(match, normalizedTrackId);

    if (!track || !normalizedDifficulty) {
      return {
        error: "请重新选择曲目和难度。"
      };
    }

    if (!track.difficulties.includes(normalizedDifficulty)) {
      return {
        error: "该曲目当前不可提交这个难度。"
      };
    }

    const selectionKey = getBpSelectionKey(normalizedTrackId, normalizedDifficulty);

    if (getUnavailableDifficultyKeys(match, action).has(selectionKey)) {
      return {
        error: action === "ban"
          ? "这个谱面已经被禁用，请重新选择。"
          : "这个谱面已经不可选择，请重新选择。"
      };
    }

    return {
      track,
      difficulty: normalizedDifficulty
    };
  }

  function buildBpActionDraft() {
    const match = state.activeMatch;
    const action = getCurrentAction(match);
    const trackId = Number(els.trackSelect.value);
    const difficulty = els.difficultySelect.value;
    const validation = validateBpSelection(match, action, trackId, difficulty);

    state.selectedTrackId = trackId ? String(trackId) : "";
    state.selectedDifficulty = difficulty || "";

    if (validation.error) {
      setActionMessage(validation.error, true);
      return null;
    }

    return {
      matchId: match.id,
      matchTitle: match.title,
      action,
      trackId,
      difficulty: validation.difficulty,
      track: validation.track
    };
  }

  function openBpConfirmDialog(draft) {
    if (!draft || !els.bpSubmitDialog) {
      return;
    }

    window.clearTimeout(state.bpConfirmCloseTimer);
    state.pendingBpAction = draft;
    els.bpSubmitDialog.dataset.action = draft.action;
    els.bpSubmitConfirmType.textContent = draft.action === "ban" ? "Ban" : "Pick";
    els.bpSubmitConfirmTitle.textContent = `确认${getActionLabel(draft.action)}`;
    els.bpSubmitConfirmMatch.textContent = draft.matchTitle || "-";
    els.bpSubmitConfirmAction.textContent = getActionLabel(draft.action);
    els.bpSubmitConfirmTrack.textContent = draft.track?.title || `曲目 ${draft.trackId}`;
    els.bpSubmitConfirmMeta.textContent =
      [draft.track?.pack, draft.track?.artist].filter(Boolean).join(" / ") || "-";
    els.bpSubmitConfirmDifficulty.textContent = draft.difficulty || "-";
    setBpConfirmMessage("");
    els.bpSubmitDialog.classList.remove("is-closing");
    els.bpSubmitDialog.classList.add("is-open");
    els.bpSubmitDialog.setAttribute("aria-hidden", "false");
    els.bpSubmitConfirmButton.disabled = false;
    els.bpSubmitCancelButton.disabled = false;
    els.bpSubmitConfirmButton.focus();
  }

  function closeBpConfirmDialog(force = false) {
    if (!els.bpSubmitDialog || (!force && state.isSubmitting)) {
      return;
    }

    const wasOpen = els.bpSubmitDialog.classList.contains("is-open");

    state.pendingBpAction = null;
    delete els.bpSubmitDialog.dataset.action;
    setBpConfirmMessage("");
    window.clearTimeout(state.bpConfirmCloseTimer);
    els.bpSubmitDialog.classList.remove("is-open");
    els.bpSubmitDialog.setAttribute("aria-hidden", "true");

    if (!wasOpen) {
      els.bpSubmitDialog.classList.remove("is-closing");
      state.bpConfirmCloseTimer = 0;
      return;
    }

    els.bpSubmitDialog.classList.add("is-closing");
    state.bpConfirmCloseTimer = window.setTimeout(() => {
      els.bpSubmitDialog.classList.remove("is-closing");
      state.bpConfirmCloseTimer = 0;
    }, 180);
  }

  function getTrackOptionsSignature(action, tracks) {
    return `${action || ""}|${tracks
      .map((track) => `${track.id}:${track.difficulties.join("/")}`)
      .join("|")}`;
  }

  function getDifficultyOptionsSignature(track) {
    return track
      ? `${track.id}:${track.difficulties.join("/")}`
      : "";
  }

  function isBpLibraryOpen() {
    return Boolean(els.bpLibraryDialog?.classList.contains("is-open"));
  }

  function getSelectedTrack() {
    const match = state.activeMatch;
    const action = getCurrentAction(match);
    const trackId = Number(els.trackSelect.value);

    if (!trackId || !action || !hasSongPoolData()) {
      return null;
    }

    return getAvailableTracks(match, action).find((track) => Number(track.id) === trackId) || null;
  }

  function syncBpPicker() {
    if (!els.openBpLibrary) {
      return;
    }

    renderDifficultyPicker();

    const action = getCurrentAction(state.activeMatch);
    const selectedTrack = getSelectedTrack();
    const fallback = els.trackSelect.selectedOptions?.[0]?.textContent || "等待 BP 阶段";
    const isWaitingForSongPool = Boolean(action && !hasSongPoolData());
    const isDisabled = !action || (!selectedTrack && !isWaitingForSongPool);

    els.openBpLibrary.disabled = isDisabled;
    els.bpPickerTrack.textContent = selectedTrack?.title || fallback;
    els.bpPickerMeta.textContent = selectedTrack
      ? [selectedTrack.pack, selectedTrack.artist].filter(Boolean).join(" / ") || "曲目信息未填写"
      : isWaitingForSongPool
        ? "曲库准备中，可打开查看状态"
        : "打开曲库后选择曲目";

    if (isBpLibraryOpen()) {
      renderBpLibrary();
    }
  }

  function renderBpLibraryEmpty(message) {
    els.bpLibraryList.innerHTML = "";
    els.bpLibraryList.appendChild(createElement("p", "empty-line", message));
  }

  function renderDifficultyPicker() {
    if (!els.difficultyPicker) {
      return;
    }

    const options = Array.from(els.difficultySelect.options);
    const selectedDifficulty = els.difficultySelect.value;
    const isDisabled = els.difficultySelect.disabled || !options.length || !selectedDifficulty;

    els.difficultyPicker.innerHTML = "";
    els.difficultyPicker.classList.toggle("is-disabled", isDisabled);
    els.difficultyPicker.setAttribute("aria-disabled", isDisabled ? "true" : "false");

    if (isDisabled) {
      const placeholder = createElement(
        "span",
        "bp-difficulty-placeholder",
        options[0]?.textContent || "等待曲目"
      );
      els.difficultyPicker.appendChild(placeholder);
      return;
    }

    options.forEach((option) => {
      const button = createElement("button", "bp-difficulty-option", option.textContent || option.value);
      const isSelected = option.value === selectedDifficulty;

      button.type = "button";
      button.dataset.difficulty = option.value;
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", isSelected ? "true" : "false");
      button.classList.toggle("is-selected", isSelected);
      els.difficultyPicker.appendChild(button);
    });
  }

  function selectDifficultyOption(difficulty) {
    if (els.difficultySelect.disabled) {
      return;
    }

    const option = Array.from(els.difficultySelect.options).find(
      (item) => item.value === difficulty
    );

    if (!option) {
      return;
    }

    els.difficultySelect.value = option.value;
    state.selectedDifficulty = option.value;
    renderDifficultyPicker();
    syncBpPicker();
    sendPresence(getCurrentAction());
  }

  function renderBpLibrary() {
    if (!els.bpLibraryList) {
      return;
    }

    const match = state.activeMatch;
    const action = getCurrentAction(match);

    if (!action) {
      els.bpLibraryHint.textContent = "当前还不是你的 BP 操作阶段。";
      renderBpLibraryEmpty("等待 BP 阶段");
      return;
    }

    if (!hasSongPoolData()) {
      els.bpLibraryHint.textContent = state.songPoolLoadFailed
        ? "曲库暂时加载失败，正在自动重试。"
        : "曲库正在加载，稍等一下。";
      renderBpLibraryEmpty(state.songPoolLoadFailed ? "曲库加载失败，正在重试..." : "曲库加载中...");
      ensureSongPoolForActiveMatch(match?.id);
      return;
    }

    const tracks = getAvailableTracks(match, action);
    const selectedTrackId = Number(els.trackSelect.value);
    const selectedDifficulty = els.difficultySelect.value || state.selectedDifficulty;
    const libraryTrack =
      tracks.find((track) => String(track.id) === String(state.libraryTrackId)) ||
      tracks.find((track) => Number(track.id) === selectedTrackId) ||
      tracks[0] ||
      null;

    state.libraryTrackId = libraryTrack ? String(libraryTrack.id) : "";

    els.bpLibraryHint.textContent = state.trackSearch
      ? "当前列表已按搜索内容筛选。点击曲目完成选择。"
      : "点击曲目完成选择。";
    els.bpLibraryList.innerHTML = "";

    if (!tracks.length) {
      renderBpLibraryEmpty(state.trackSearch ? "没有匹配的可选谱面" : "暂无可选谱面");
      return;
    }

    tracks.forEach((track) => {
      const item = createElement("button", "bp-library-item");
      const isSelectedTrack = String(track.id) === String(state.libraryTrackId);
      item.type = "button";
      item.dataset.libraryTrackId = String(track.id);
      item.classList.toggle("is-selected", isSelectedTrack);

      const title = createElement("div", "bp-library-title");
      title.appendChild(createElement("strong", "", track.title || `曲目 ${track.id}`));
      title.appendChild(
        createElement("span", "", [track.pack, track.artist].filter(Boolean).join(" / ") || "曲目信息未填写")
      );

      const difficultyRow = createElement("div", "bp-library-difficulties");
      track.difficulties.forEach((difficulty) => {
        const badge = createElement("span", "bp-library-difficulty-badge", difficulty);
        badge.classList.toggle(
          "is-selected",
          isSelectedTrack && difficulty === selectedDifficulty
        );
        difficultyRow.appendChild(badge);
      });

      title.appendChild(difficultyRow);
      item.appendChild(title);
      els.bpLibraryList.appendChild(item);
    });
  }

  function openBpLibrary() {
    if (!els.bpLibraryDialog || els.openBpLibrary.disabled) {
      return;
    }

    const selectedTrack = getSelectedTrack();
    state.libraryTrackId = selectedTrack?.id ? String(selectedTrack.id) : state.selectedTrackId;
    if (!hasSongPoolData()) {
      ensureSongPoolForActiveMatch(state.activeMatch?.id, {
        force: state.songPoolLoadFailed
      });
    }
    renderBpLibrary();
    els.bpLibraryDialog.classList.add("is-open");
    els.bpLibraryDialog.setAttribute("aria-hidden", "false");
    els.openBpLibrary.setAttribute("aria-expanded", "true");
    const firstChoice = els.bpLibraryList.querySelector(".bp-library-item");
    (firstChoice || els.bpLibraryDialog.querySelector("[data-bp-library-close]"))?.focus();
  }

  function closeBpLibrary() {
    if (!els.bpLibraryDialog?.classList.contains("is-open")) {
      return;
    }

    els.bpLibraryDialog.classList.remove("is-open");
    els.bpLibraryDialog.setAttribute("aria-hidden", "true");
    els.openBpLibrary?.setAttribute("aria-expanded", "false");
    els.openBpLibrary?.focus();
  }

  function chooseBpLibraryTrack(trackId) {
    const match = state.activeMatch;
    const action = getCurrentAction(match);
    const track = action && hasSongPoolData()
      ? getAvailableTracks(match, action).find((item) => Number(item.id) === Number(trackId))
      : null;

    if (!track) {
      return;
    }

    state.libraryTrackId = String(track.id);
    els.trackSelect.value = String(track.id);
    state.selectedTrackId = String(track.id);
    renderDifficultyOptions();
    syncBpPicker();
    closeBpLibrary();
    sendPresence(action);
  }

  function renderDifficultyOptions() {
    const match = state.activeMatch;
    const trackId = Number(els.trackSelect.value);
    const action = getCurrentAction(match);
    const track = getAvailableTracks(match, action).find((item) => Number(item.id) === trackId);
    const previousDifficulty = els.difficultySelect.value || state.selectedDifficulty;
    const signature = getDifficultyOptionsSignature(track);

    if (!track) {
      if (state.difficultyOptionsSignature !== signature || !els.difficultySelect.disabled) {
        els.difficultySelect.innerHTML = "";
        els.difficultySelect.appendChild(createElement("option", "", "无可选难度"));
      }

      els.difficultySelect.disabled = true;
      state.selectedDifficulty = "";
      state.difficultyOptionsSignature = signature;
      syncBpPicker();
      return;
    }

    const nextDifficulty = track.difficulties.includes(previousDifficulty)
      ? previousDifficulty
      : track.difficulties[0] || "";

    if (
      state.difficultyOptionsSignature === signature &&
      !els.difficultySelect.disabled &&
      els.difficultySelect.options.length === track.difficulties.length
    ) {
      if (els.difficultySelect.value !== nextDifficulty) {
        els.difficultySelect.value = nextDifficulty;
      }

      state.selectedDifficulty = nextDifficulty;
      syncBpPicker();
      return;
    }

    els.difficultySelect.innerHTML = "";
    track.difficulties.forEach((difficulty) => {
      const option = createElement("option", "", difficulty);
      option.value = difficulty;
      els.difficultySelect.appendChild(option);
    });

    els.difficultySelect.value = nextDifficulty;
    state.selectedDifficulty = nextDifficulty;
    state.difficultyOptionsSignature = signature;
    els.difficultySelect.disabled = false;
    syncBpPicker();
  }

  function renderTrackOptions() {
    const match = state.activeMatch;
    const action = getCurrentAction(match);

    if (action && !hasSongPoolData()) {
      const optionText = state.songPoolLoadFailed
        ? "曲库加载失败，正在重试"
        : state.songPoolLoading
          ? "曲库加载中..."
          : "正在准备曲库...";
      const signature = `loading:${action}:${optionText}`;

      if (state.trackOptionsSignature !== signature || !els.trackSelect.disabled) {
        els.trackSelect.innerHTML = "";
        els.trackSelect.appendChild(createElement("option", "", optionText));
      }

      els.difficultySelect.innerHTML = "";
      els.difficultySelect.appendChild(createElement("option", "", "等待曲库加载"));
      els.trackSelect.disabled = true;
      els.difficultySelect.disabled = true;
      els.submitBp.disabled = true;
      state.selectedTrackId = "";
      state.selectedDifficulty = "";
      state.trackOptionsSignature = signature;
      state.difficultyOptionsSignature = "loading";
      ensureSongPoolForActiveMatch(match?.id);
      syncBpPicker();
      return;
    }

    const availableTracks = action ? getAvailableTracks(match, action) : [];
    const previousTrackId = els.trackSelect.value || state.selectedTrackId;
    let tracks = availableTracks;
    const previousTrack = previousTrackId
      ? availableTracks.find((track) => String(track.id) === String(previousTrackId))
      : null;

    if (
      previousTrack &&
      !tracks.some((track) => String(track.id) === String(previousTrack.id))
    ) {
      tracks = tracks.concat(previousTrack);
    }

    const signature = getTrackOptionsSignature(action, tracks);

    if (!tracks.length) {
      if (state.trackOptionsSignature !== signature || !els.trackSelect.disabled) {
        els.trackSelect.innerHTML = "";
        els.trackSelect.appendChild(createElement("option", "", action ? "没有可选曲目" : "等待 BP 阶段"));
      }

      els.trackSelect.disabled = true;
      els.submitBp.disabled = true;
      state.selectedTrackId = "";
      state.trackOptionsSignature = signature;
      renderDifficultyOptions();
      return;
    }

    const selectedTrack = tracks.find((track) => String(track.id) === String(previousTrackId)) || tracks[0];
    const nextTrackId = String(selectedTrack.id);

    if (
      state.trackOptionsSignature === signature &&
      !els.trackSelect.disabled &&
      els.trackSelect.options.length === tracks.length
    ) {
      if (els.trackSelect.value !== nextTrackId) {
        els.trackSelect.value = nextTrackId;
      }

      state.selectedTrackId = nextTrackId;
      els.submitBp.disabled = state.isSubmitting;
      renderDifficultyOptions();
      return;
    }

    els.trackSelect.innerHTML = "";
    tracks.forEach((track) => {
      const option = createElement(
        "option",
        "",
        `${track.title} · ${track.difficulties.join("/")}`
      );
      option.value = String(track.id);
      els.trackSelect.appendChild(option);
    });

    els.trackSelect.value = nextTrackId;
    state.selectedTrackId = nextTrackId;
    state.trackOptionsSignature = signature;
    els.trackSelect.disabled = false;
    els.submitBp.disabled = state.isSubmitting;
    renderDifficultyOptions();
  }

  function renderActionPanel(match) {
    const action = getCurrentAction(match);
    const progress = match.bp?.progress || {};
    const viewerUserId = getViewerUserId(match);
    const confirmed = (match.bp?.confirmedBy || []).includes(viewerUserId);

    els.bpForm.hidden = !action;
    els.confirmBp.hidden =
      !match.viewer?.isParticipant ||
      !isBpOpen(match) ||
      progress.phase !== "confirm" ||
      confirmed ||
      !isRandomPickReady(match, progress);

    if (!match.viewer?.isParticipant) {
      els.actionQuota.textContent = "观众模式";
      setActionMessage("你可以查看公开赛事进度和赛后结果。");
      renderTrackOptions();
      return;
    }

    if (!isBpOpen(match)) {
      const playerConfirmation = getPlayerConfirmationInfo(match);

      if (
        match.status === "scheduled" &&
        playerConfirmation.enabled &&
        !playerConfirmation.allConfirmed
      ) {
        els.actionQuota.textContent = "等待选手确认";
        setActionMessage(
          playerConfirmation.viewerConfirmed
            ? "你已确认参赛，正在等待其余选手确认。"
            : "请先在上方确认参赛；全部选手确认后将显示 BP 开放时间。",
          false,
          true
        );
        renderTrackOptions();
        return;
      }

      els.actionQuota.textContent =
        match.status === "scheduled" ? "比赛未开始" : "BP未开放";
      setActionMessage(
        match.status === "scheduled"
          ? match.bpStartsAt
            ? `可以查看比赛详情，BP 将于 ${formatDateTime(match.bpStartsAt)} 自动开放。`
            : "请等待本场比赛开放BP。"
          : "当前比赛状态不能进行 Ban/Pick。"
      );
      renderTrackOptions();
      return;
    }

    if (action === "ban") {
      const used = (match.bp.bans || []).filter((item) => item.userId === viewerUserId).length;
      els.actionQuota.textContent = `禁用 ${used}/${progress.banCount}`;
      els.submitBp.textContent = "提交禁用";
      setActionMessage("请选择曲目和难度；双方可同时禁用。");
    } else if (action === "pick") {
      const used = (match.bp.picks || []).filter((item) => item.userId === viewerUserId).length;
      els.actionQuota.textContent = `选曲 ${used}/${progress.pickCount}`;
      els.submitBp.textContent = "提交选曲";
      setActionMessage("已禁用的谱面不会出现在可选列表中。");
    } else if (progress.phase === "confirm") {
      els.actionQuota.textContent = confirmed ? "已确认" : "等待确认";
      setActionMessage(
        !isRandomPickReady(match, progress)
          ? "系统随机抽选尚未完成，请等待后台调整曲池或随机数量。"
          : confirmed
            ? "你已确认本场选曲总结。"
            : "请确认下方选曲总结。"
      );
    } else if (progress.phase === "summary") {
      els.actionQuota.textContent = "总结完成";
      setActionMessage("双方已确认本场 BP 结果。");
    } else if (progress.phase === "waiting") {
      els.actionQuota.textContent = "等待参赛账号";
      setActionMessage("后台尚未指定参赛账号。", true);
    } else {
      els.actionQuota.textContent = "等待其他选手";
      setActionMessage("等待其他参赛选手完成当前阶段。", false, true);
    }

    renderTrackOptions();
  }

  function renderActiveMatch() {
    const match = state.activeMatch;

    if (!match) {
      stopBpCountdown();
      els.layout.classList.remove("is-detail");
      els.matchListPanel.hidden = false;
      els.bpPanel.hidden = true;
      els.bpEmpty.hidden = false;
      els.bpWorkbench.hidden = true;
      return;
    }

    const progress = match.bp?.progress || {};

    els.layout.classList.add("is-detail");
    els.matchListPanel.hidden = true;
    els.bpPanel.hidden = false;
    els.bpEmpty.hidden = true;
    els.bpWorkbench.hidden = false;
    els.bpStageLabel.textContent =
      getMatchCategoryPath(match) || STAGE_LABELS[match.poolMode] || "Ban/Pick";
    els.bpTitle.textContent = match.title;
    els.bpMeta.textContent = [
      `比赛 ${formatDateTime(match.startsAt)}`,
      getBpOpeningMeta(match),
      STAGE_LABELS[match.poolMode] || "曲池",
      formatRandomRule(match),
      match.content || "暂无比赛说明"
    ].join(" · ");
    els.bpStatus.textContent = STATUS_LABELS[match.status] || "未开始";
    els.banProgress.textContent = `${match.bp?.bans?.length || 0}/${progress.requiredBans || 0}`;
    els.pickProgress.textContent = `${match.bp?.picks?.length || 0}/${progress.requiredPicks || 0}`;

    renderParticipantRow(match);
    renderIdentityRow(match);
    renderPlayerConfirmation(match);
    renderPresence(match);
    renderSelectionList(els.banList, match.bp?.bans || [], "暂无禁用曲目", "is-ban");
    renderSelectionList(els.pickList, match.bp?.picks || [], "暂无选择曲目", "is-pick");
    renderSummary(match);
    renderResult(match);
    renderActionPanel(match);
  }

  function scheduleMatchesRetry(options = {}) {
    window.clearTimeout(state.scheduleLoadRetryTimer);
    state.scheduleLoadRetryTimer = window.setTimeout(() => {
      loadMatches(false, options);
    }, SCHEDULE_RETRY_DELAY_MS);
  }

  function refreshMatchesAfterAccountReady() {
    if (state.hasRequestedAccountRefresh) {
      return;
    }

    state.hasRequestedAccountRefresh = true;
    waitForPromise(window.PLCAccount?.ready, 2500).then(() => {
      loadMatches(false, {
        authMode: "auto"
      });
      fetchActiveMatch();
    });
  }

  async function loadMatches(showLoading = true, options = {}) {
    if (state.isLoadingMatches) {
      return;
    }

    const authMode = options.authMode || "auto";
    state.isLoadingMatches = true;
    els.refresh.disabled = true;

    if (showLoading) {
      els.summary.textContent = "正在同步赛事日程...";
    }

    try {
      const payload = await fetchJson("/schedule/matches", {
        authMode,
        refreshSession: authMode !== "omit",
        timeoutMs: options.timeoutMs || SCHEDULE_LOAD_TIMEOUT_MS
      });

      syncServerTime(payload.serverNow);
      state.matches = Array.isArray(payload.matches) ? payload.matches : [];
      els.summary.textContent = state.matches.length
        ? `当前有 ${state.matches.length} 场可见比赛。`
        : "暂无可见比赛；公开赛事会直接显示，定向赛事需要登录对应账号。";
      window.clearTimeout(state.scheduleLoadRetryTimer);

      if (state.activeMatchId) {
        const active = state.matches.find((match) => match.id === state.activeMatchId);

        if (active) {
          queueRandomPickReveal(state.activeMatch, active);
          state.activeMatch = active;
        } else {
          goBackToMatches();
        }
      }

      renderMatchList();
      renderActiveMatch();
    } catch (error) {
      els.summary.textContent = `${error.message || "赛程加载失败，请稍后重试。"} 正在自动重试...`;
      state.matches = [];
      renderMatchList();
      scheduleMatchesRetry({
        authMode
      });
    } finally {
      state.isLoadingMatches = false;
      els.refresh.disabled = false;
      refreshMatchesAfterAccountReady();
    }
  }

  async function fetchActiveMatch() {
    if (state.isFetchingActiveMatch) {
      return state.activeMatchFetchPromise;
    }

    state.isFetchingActiveMatch = true;
    state.activeMatchFetchPromise = fetchActiveMatchOnce().finally(() => {
      state.isFetchingActiveMatch = false;
      state.activeMatchFetchPromise = null;
    });

    return state.activeMatchFetchPromise;
  }

  async function fetchActiveMatchOnce() {
    if (!state.activeMatchId) {
      return;
    }

    const requestedMatchId = state.activeMatchId;

    try {
      const payload = await fetchJson(
        `/schedule/matches/${encodeURIComponent(requestedMatchId)}`,
        {
          timeoutMs: SCHEDULE_LOAD_TIMEOUT_MS
        }
      );

      if (state.activeMatchId !== requestedMatchId) {
        return;
      }

      syncServerTime(payload.serverNow);
      queueRandomPickReveal(state.activeMatch, payload.match);
      state.activeMatch = payload.match;
      state.matches = state.matches.map((match) =>
        match.id === payload.match.id ? payload.match : match
      );
      renderMatchList();
      renderActiveMatch();
      startPolling();
    } catch (error) {
      if (state.activeMatchId !== requestedMatchId) {
        return;
      }

      setActionMessage(error.message || "比赛状态刷新失败", true);
    }
  }

  function getPollingInterval() {
    if (document.hidden) {
      return 15000;
    }

    return isBpOpen(state.activeMatch) ? 2500 : 8000;
  }

  function startPolling() {
    window.clearInterval(state.pollTimer);

    if (!state.activeMatchId) {
      return;
    }

    state.pollTimer = window.setInterval(fetchActiveMatch, getPollingInterval());
  }

  function goBackToMatches() {
    state.activeMatchId = "";
    state.activeMatch = null;
    state.trackSearch = "";
    state.selectedTrackId = "";
    state.selectedDifficulty = "";
    state.libraryTrackId = "";
    state.trackOptionsSignature = "";
    state.difficultyOptionsSignature = "";
    state.isConfirmingPlayer = false;
    state.playerConfirmationMessage = "";
    state.playerConfirmationMessageIsError = false;
    closeBpLibrary();
    closeBpConfirmDialog();
    window.clearTimeout(state.randomReveal.timer);
    state.randomReveal = {
      key: "",
      pendingKey: "",
      done: false,
      running: false,
      timer: 0,
      target: null,
      targets: []
    };
    els.trackSearch.value = "";
    window.clearInterval(state.pollTimer);
    renderMatchList();
    renderActiveMatch();
  }

  async function selectMatch(matchId) {
    closeBpLibrary();
    state.activeMatchId = matchId;
    state.activeMatch = state.matches.find((match) => match.id === matchId) || null;
    state.trackSearch = "";
    state.selectedTrackId = "";
    state.selectedDifficulty = "";
    state.libraryTrackId = "";
    state.trackOptionsSignature = "";
    state.difficultyOptionsSignature = "";
    state.isConfirmingPlayer = false;
    state.playerConfirmationMessage = "";
    state.playerConfirmationMessageIsError = false;
    window.clearTimeout(state.randomReveal.timer);
    state.randomReveal = {
      key: "",
      pendingKey: "",
      done: false,
      running: false,
      timer: 0,
      target: null,
      targets: []
    };
    els.trackSearch.value = "";
    renderMatchList();
    renderActiveMatch();
    startPolling();
    await fetchActiveMatch();
  }

  async function sendPresence(action) {
    const match = state.activeMatch;

    if (!match?.viewer?.isParticipant || !action) {
      return;
    }

    const now = Date.now();

    if (now - state.lastPresenceAt < 1800) {
      return;
    }

    state.lastPresenceAt = now;

    try {
      await fetchJson(
        `/schedule/matches/${encodeURIComponent(match.id)}/bp/presence`,
        {
          method: "POST",
          body: JSON.stringify({
            action
          })
        }
      );
    } catch (error) {
      // Presence is a soft signal; the BP action itself remains authoritative.
    }
  }

  async function submitBpAction(event) {
    event.preventDefault();

    if (state.isSubmitting) {
      return;
    }

    const draft = buildBpActionDraft();

    if (draft) {
      openBpConfirmDialog(draft);
    }
  }

  async function confirmPendingBpAction() {
    const pending = state.pendingBpAction;

    if (!pending || state.isSubmitting) {
      return;
    }

    let match = state.activeMatch;
    let validation = validateBpSelection(match, pending.action, pending.trackId, pending.difficulty);

    if (pending.matchId !== match?.id || validation.error) {
      const message = validation.error || "当前比赛已经变化，请重新选择。";
      setBpConfirmMessage(message, true);
      setActionMessage(message, true);
      return;
    }

    state.isSubmitting = true;
    window.clearInterval(state.pollTimer);
    els.submitBp.disabled = true;
    els.bpSubmitConfirmButton.disabled = true;
    els.bpSubmitCancelButton.disabled = true;
    setBpConfirmMessage(`正在提交${getActionLabel(pending.action)}...`);
    setActionMessage(pending.action === "ban" ? "正在提交禁用..." : "正在提交选曲...");

    try {
      await fetchActiveMatch();

      match = state.activeMatch;
      validation = validateBpSelection(match, pending.action, pending.trackId, pending.difficulty);

      if (pending.matchId !== match?.id || validation.error) {
        throw new Error(validation.error || "当前比赛已经变化，请重新选择。");
      }

      const payload = await fetchJson(
        `/schedule/matches/${encodeURIComponent(pending.matchId)}/bp/actions`,
        {
          method: "POST",
          body: JSON.stringify({
            type: pending.action,
            trackId: pending.trackId,
            difficulty: pending.difficulty
          }),
          timeoutMs: 12000
        }
      );

      queueRandomPickReveal(state.activeMatch, payload.match);
      state.activeMatch = payload.match;
      state.matches = state.matches.map((item) =>
        item.id === payload.match.id ? payload.match : item
      );
      setActionMessage(pending.action === "ban" ? "禁用已提交。" : "选曲已提交。");
      closeBpConfirmDialog(true);
      renderMatchList();
      renderActiveMatch();
    } catch (error) {
      const message = error.message || "提交失败，请稍后重试。";
      setBpConfirmMessage(message, true);
      setActionMessage(message, true);
    } finally {
      state.isSubmitting = false;
      if (state.activeMatchId) {
        startPolling();
      }
      renderTrackOptions();
      els.bpSubmitConfirmButton.disabled = false;
      els.bpSubmitCancelButton.disabled = false;
    }
  }

  async function confirmPlayerConfirmation() {
    const match = state.activeMatch;
    const confirmation = getPlayerConfirmationInfo(match);

    if (
      !match ||
      state.isConfirmingPlayer ||
      match.status !== "scheduled" ||
      !match.viewer?.isParticipant ||
      !confirmation.enabled ||
      confirmation.viewerConfirmed
    ) {
      return;
    }

    state.isConfirmingPlayer = true;
    state.playerConfirmationMessage = "正在提交参赛确认...";
    state.playerConfirmationMessageIsError = false;
    renderPlayerConfirmation(match);

    try {
      const payload = await fetchJson(
        `/schedule/matches/${encodeURIComponent(match.id)}/player-confirmation`,
        {
          method: "POST",
          timeoutMs: 12000
        }
      );

      queueRandomPickReveal(state.activeMatch, payload.match);
      state.activeMatch = payload.match;
      state.matches = state.matches.map((item) =>
        item.id === payload.match.id ? payload.match : item
      );
      state.playerConfirmationMessage = payload.match.playerConfirmation?.allConfirmed
        ? "全部选手已确认，BP 开放时间已显示。"
        : "已确认参赛，正在等待其余选手确认。";
    } catch (error) {
      state.playerConfirmationMessage = error.message || "确认失败，请稍后重试。";
      state.playerConfirmationMessageIsError = true;
    } finally {
      state.isConfirmingPlayer = false;
      renderMatchList();
      renderActiveMatch();

      if (state.activeMatchId) {
        startPolling();
      }
    }
  }

  async function confirmBpSummary() {
    const match = state.activeMatch;

    if (!match || state.isSubmitting) {
      return;
    }

    state.isSubmitting = true;
    window.clearInterval(state.pollTimer);
    els.confirmBp.disabled = true;
    setActionMessage("正在确认选曲总结...");

    try {
      const payload = await fetchJson(
        `/schedule/matches/${encodeURIComponent(match.id)}/bp/confirm`,
        {
          method: "POST",
          timeoutMs: 12000
        }
      );

      queueRandomPickReveal(state.activeMatch, payload.match);
      state.activeMatch = payload.match;
      state.matches = state.matches.map((item) =>
        item.id === payload.match.id ? payload.match : item
      );
      setActionMessage("已确认选曲总结。");
      renderMatchList();
      renderActiveMatch();
    } catch (error) {
      setActionMessage(error.message || "确认失败，请稍后重试。", true);
    } finally {
      state.isSubmitting = false;
      if (state.activeMatchId) {
        startPolling();
      }
      renderActionPanel(state.activeMatch);
    }
  }

  function bindEvents() {
    els.refresh.addEventListener("click", () => {
      loadMatches();
      fetchActiveMatch();
    });

    els.backToMatches.addEventListener("click", goBackToMatches);
    els.bpForm.addEventListener("submit", submitBpAction);
    els.confirmBp.addEventListener("click", confirmBpSummary);
    els.confirmPlayerConfirmation?.addEventListener("click", confirmPlayerConfirmation);
    els.bpSubmitConfirmButton?.addEventListener("click", confirmPendingBpAction);
    document.querySelectorAll("[data-bp-confirm-close]").forEach((element) => {
      element.addEventListener("click", () => closeBpConfirmDialog());
    });
    document.querySelectorAll("[data-bp-library-close]").forEach((element) => {
      element.addEventListener("click", () => closeBpLibrary());
    });
    els.openBpLibrary?.addEventListener("click", openBpLibrary);
    els.bpLibraryList?.addEventListener("click", (event) => {
      const button = event.target.closest?.("[data-library-track-id]");

      if (!button) {
        return;
      }

      chooseBpLibraryTrack(button.dataset.libraryTrackId);
    });

    els.trackSearch.addEventListener("input", (event) => {
      state.trackSearch = event.target.value.trim();
      renderTrackOptions();
      sendPresence(getCurrentAction());
    });

    els.trackSearch.addEventListener("focus", () => sendPresence(getCurrentAction()));
    els.trackSelect.addEventListener("focus", () => sendPresence(getCurrentAction()));
    els.trackSelect.addEventListener("change", () => {
      state.selectedTrackId = els.trackSelect.value;
      renderDifficultyOptions();
      sendPresence(getCurrentAction());
    });
    els.difficultyPicker?.addEventListener("click", (event) => {
      const button = event.target.closest?.("[data-difficulty]");

      if (!button) {
        return;
      }

      selectDifficultyOption(button.dataset.difficulty);
    });
    els.difficultyPicker?.addEventListener("focusin", () => sendPresence(getCurrentAction()));
    els.difficultySelect.addEventListener("focus", () => sendPresence(getCurrentAction()));
    els.difficultySelect.addEventListener("change", () => {
      state.selectedDifficulty = els.difficultySelect.value;
      renderDifficultyPicker();
      syncBpPicker();
      sendPresence(getCurrentAction());
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (isBpLibraryOpen()) {
          closeBpLibrary();
          return;
        }

        closeBpConfirmDialog();
      }
    });

    document.addEventListener("visibilitychange", () => {
      startPolling();

      if (!document.hidden) {
        fetchActiveMatch();
      }
    });

    let didSkipInitialAccountChange = false;
    window.PLCAccount?.onChange?.(() => {
      if (!didSkipInitialAccountChange) {
        didSkipInitialAccountChange = true;
        return;
      }

      loadMatches(false, {
        authMode: "auto"
      });
      fetchActiveMatch();
    });
  }

  bindEvents();
  loadMatches(true, {
    authMode: "omit"
  });
})();
