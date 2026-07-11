(function () {
  const state = {
    items: [],
    totals: {},
    type: "all",
    search: "",
    difficulty: "all",
    sort: "total",
    loading: false,
    timer: 0
  };

  const els = {
    totalActions: document.getElementById("totalActions"),
    totalMatches: document.getElementById("totalMatches"),
    totalBans: document.getElementById("totalBans"),
    totalPicks: document.getElementById("totalPicks"),
    totalTracks: document.getElementById("totalTracks"),
    refresh: document.getElementById("refreshButton"),
    search: document.getElementById("selectlistSearch"),
    difficulty: document.getElementById("difficultyFilter"),
    sort: document.getElementById("sortBy"),
    typeTabs: Array.from(document.querySelectorAll("[data-type]")),
    resultCount: document.getElementById("resultCount"),
    updatedAt: document.getElementById("updatedAt"),
    grid: document.getElementById("selectionGrid"),
    message: document.getElementById("loadMessage")
  };

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function formatTime(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "刚刚更新"
      : `更新于 ${date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
  }

  function getFilteredItems() {
    const keyword = state.search.toLowerCase();
    return state.items
      .filter((item) => state.type === "all" || Number(item[`${state.type}Count`]) > 0)
      .filter((item) => state.difficulty === "all" || item.difficulty === state.difficulty)
      .filter((item) => {
        if (!keyword) return true;
        const aliases = window.PLC_SONG_ALIASES?.[item.trackId] || [];
        return [item.title, item.artist, item.pack, ...aliases]
          .some((value) => String(value || "").toLowerCase().includes(keyword));
      })
      .sort((a, b) => {
        if (state.sort === "ban") return b.banCount - a.banCount || b.totalCount - a.totalCount;
        if (state.sort === "pick") return b.pickCount - a.pickCount || b.totalCount - a.totalCount;
        if (state.sort === "name") return a.title.localeCompare(b.title, "zh-CN", { numeric: true, sensitivity: "base" }) || a.difficulty.localeCompare(b.difficulty);
        return b.totalCount - a.totalCount || b.pickCount - a.pickCount;
      });
  }

  function renderTotals() {
    els.totalActions.textContent = state.totals.actions || 0;
    els.totalMatches.textContent = `${state.totals.matches || 0} 场比赛`;
    els.totalBans.textContent = state.totals.bans || 0;
    els.totalPicks.textContent = state.totals.picks || 0;
    els.totalTracks.textContent = state.totals.tracks || 0;
  }

  function renderItems() {
    const items = getFilteredItems();
    els.grid.innerHTML = "";
    els.resultCount.textContent = `${items.length} 个谱面`;

    if (!items.length) {
      els.grid.appendChild(createElement("div", "empty-state", state.items.length ? "没有符合筛选条件的谱面" : "暂无 Ban / Pick 数据"));
      return;
    }

    items.forEach((item, index) => {
      const card = createElement("article", "selection-card");
      card.style.setProperty("--enter-index", String(Math.min(index, 12)));
      const rank = createElement("span", "selection-rank", String(index + 1).padStart(2, "0"));
      const info = createElement("div", "selection-info");
      const titleRow = createElement("div", "selection-title-row");
      titleRow.appendChild(createElement("strong", "", item.title));
      titleRow.appendChild(createElement("span", `difficulty-badge is-${String(item.difficulty).toLowerCase()}`, item.difficulty));
      if (item.adjusted) titleRow.appendChild(createElement("span", "verified-badge", "后台校准"));
      info.appendChild(titleRow);
      info.appendChild(createElement("p", "selection-meta", [item.artist, item.pack, `${item.matchCount || 0} 场涉及`].filter(Boolean).join(" · ")));

      const counts = createElement("div", "selection-counts");
      const ban = createElement("div", "count-block is-ban");
      ban.appendChild(createElement("span", "", "BAN"));
      ban.appendChild(createElement("strong", "", item.banCount));
      const pick = createElement("div", "count-block is-pick");
      pick.appendChild(createElement("span", "", "PICK"));
      pick.appendChild(createElement("strong", "", item.pickCount));
      counts.append(ban, pick);

      const bar = createElement("div", "ratio-bar");
      const total = Math.max(1, item.totalCount);
      const banBar = createElement("span", "is-ban");
      banBar.style.width = `${(item.banCount / total) * 100}%`;
      const pickBar = createElement("span", "is-pick");
      pickBar.style.width = `${(item.pickCount / total) * 100}%`;
      bar.append(banBar, pickBar);
      info.appendChild(bar);

      card.append(rank, info, counts);
      els.grid.appendChild(card);
    });
  }

  function setLoading(loading, message = "") {
    state.loading = loading;
    els.refresh.disabled = loading;
    els.message.textContent = message;
    els.message.hidden = !message;
  }

  async function loadData(options = {}) {
    if (state.loading) return;
    setLoading(true, options.silent ? "" : "正在同步 BP 数据...");
    try {
      const response = await fetch(`${API_URL}/schedule/selectlist`, { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || "统计数据读取失败");
      state.items = Array.isArray(payload.items) ? payload.items : [];
      state.totals = payload.totals || {};
      renderTotals();
      renderItems();
      els.updatedAt.textContent = formatTime(payload.updatedAt);
      setLoading(false);
    } catch (error) {
      setLoading(false, error.message || "统计数据读取失败，请稍后重试");
    }
  }

  function restartPolling() {
    window.clearInterval(state.timer);
    state.timer = window.setInterval(() => loadData({ silent: true }), 10000);
  }

  els.typeTabs.forEach((button) => button.addEventListener("click", () => {
    state.type = button.dataset.type;
    els.typeTabs.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    renderItems();
  }));
  els.search.addEventListener("input", (event) => { state.search = event.target.value.trim(); renderItems(); });
  els.difficulty.addEventListener("change", (event) => { state.difficulty = event.target.value; renderItems(); });
  els.sort.addEventListener("change", (event) => { state.sort = event.target.value; renderItems(); });
  els.refresh.addEventListener("click", () => loadData());
  document.addEventListener("visibilitychange", () => {
    restartPolling();
    if (!document.hidden) loadData({ silent: true });
  });

  loadData();
  restartPolling();
})();
