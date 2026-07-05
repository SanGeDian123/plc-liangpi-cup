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

  const state = {
    matches: [],
    activeMatchId: "",
    activeMatch: null,
    trackSearch: "",
    selectedTrackId: "",
    selectedDifficulty: "",
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
    lastPresenceAt: 0,
    isSubmitting: false,
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
    bpSubmitCancelButton: document.getElementById("bpSubmitCancelButton")
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

  async function fetchJson(path, options = {}) {
    const headers = {
      ...(options.headers || {})
    };
    const token = getAccessToken();

    if (options.body && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.message || "请求失败");
    }

    return payload;
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
    return match?.status === "bp";
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

    state.matches.forEach((match) => {
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
          text: match.bpStartsAt ? `BP ${formatDateTime(match.bpStartsAt)}` : "BP手动开放"
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
      els.matchList.appendChild(card);
    });
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
  }

  function renderTrackOptions() {
    const match = state.activeMatch;
    const action = getCurrentAction(match);
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
    els.bpStageLabel.textContent = STAGE_LABELS[match.poolMode] || "Ban/Pick";
    els.bpTitle.textContent = match.title;
    els.bpMeta.textContent = [
      `比赛 ${formatDateTime(match.startsAt)}`,
      match.bpStartsAt ? `BP ${formatDateTime(match.bpStartsAt)}` : "BP手动开放",
      formatRandomRule(match),
      match.content || "暂无比赛说明"
    ].join(" · ");
    els.bpStatus.textContent = STATUS_LABELS[match.status] || "未开始";
    els.banProgress.textContent = `${match.bp?.bans?.length || 0}/${progress.requiredBans || 0}`;
    els.pickProgress.textContent = `${match.bp?.picks?.length || 0}/${progress.requiredPicks || 0}`;

    renderParticipantRow(match);
    renderIdentityRow(match);
    renderPresence(match);
    renderSelectionList(els.banList, match.bp?.bans || [], "暂无禁用曲目", "is-ban");
    renderSelectionList(els.pickList, match.bp?.picks || [], "暂无选择曲目", "is-pick");
    renderSummary(match);
    renderResult(match);
    renderActionPanel(match);
  }

  async function loadMatches(showLoading = true) {
    if (showLoading) {
      els.summary.textContent = "正在同步赛事日程...";
    }

    try {
      await window.PLCAccount?.ready;
      const payload = await fetchJson("/schedule/matches");

      state.matches = Array.isArray(payload.matches) ? payload.matches : [];
      els.summary.textContent = state.matches.length
        ? `当前有 ${state.matches.length} 场可见比赛。`
        : "暂无可见比赛；公开赛事会直接显示，定向赛事需要登录对应账号。";

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
      els.summary.textContent = error.message || "赛程加载失败，请稍后重试。";
      state.matches = [];
      renderMatchList();
    }
  }

  async function fetchActiveMatch() {
    if (!state.activeMatchId) {
      return;
    }

    const requestedMatchId = state.activeMatchId;

    try {
      const payload = await fetchJson(
        `/schedule/matches/${encodeURIComponent(requestedMatchId)}`
      );

      if (state.activeMatchId !== requestedMatchId) {
        return;
      }

      queueRandomPickReveal(state.activeMatch, payload.match);
      state.activeMatch = payload.match;
      state.matches = state.matches.map((match) =>
        match.id === payload.match.id ? payload.match : match
      );
      renderMatchList();
      renderActiveMatch();
    } catch (error) {
      if (state.activeMatchId !== requestedMatchId) {
        return;
      }

      setActionMessage(error.message || "比赛状态刷新失败", true);
    }
  }

  function getPollingInterval() {
    return document.hidden ? 12000 : 2500;
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
    state.trackOptionsSignature = "";
    state.difficultyOptionsSignature = "";
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
    state.activeMatchId = matchId;
    state.activeMatch = state.matches.find((match) => match.id === matchId) || null;
    state.trackSearch = "";
    state.selectedTrackId = "";
    state.selectedDifficulty = "";
    state.trackOptionsSignature = "";
    state.difficultyOptionsSignature = "";
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
          })
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
      els.submitBp.disabled = false;
      els.bpSubmitConfirmButton.disabled = false;
      els.bpSubmitCancelButton.disabled = false;
    }
  }

  async function confirmBpSummary() {
    const match = state.activeMatch;

    if (!match || state.isSubmitting) {
      return;
    }

    state.isSubmitting = true;
    els.confirmBp.disabled = true;
    setActionMessage("正在确认选曲总结...");

    try {
      const payload = await fetchJson(
        `/schedule/matches/${encodeURIComponent(match.id)}/bp/confirm`,
        {
          method: "POST"
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
      els.confirmBp.disabled = false;
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
    els.bpSubmitConfirmButton?.addEventListener("click", confirmPendingBpAction);
    document.querySelectorAll("[data-bp-confirm-close]").forEach((element) => {
      element.addEventListener("click", () => closeBpConfirmDialog());
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
    els.difficultySelect.addEventListener("focus", () => sendPresence(getCurrentAction()));
    els.difficultySelect.addEventListener("change", () => {
      state.selectedDifficulty = els.difficultySelect.value;
      sendPresence(getCurrentAction());
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeBpConfirmDialog();
      }
    });

    document.addEventListener("visibilitychange", () => {
      startPolling();

      if (!document.hidden) {
        fetchActiveMatch();
      }
    });

    window.PLCAccount?.onChange?.(() => {
      loadMatches(false);
      fetchActiveMatch();
    });
  }

  bindEvents();
  loadMatches();
})();
