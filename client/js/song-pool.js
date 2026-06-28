(function () {
  const data = window.PLC_SONG_POOL_DATA;

  const state = {
    stage: "round16",
    search: "",
    difficulty: "all",
    pack: "all"
  };

  const els = {
    source: document.getElementById("poolSource"),
    stageName: document.getElementById("activeStageName"),
    stageCount: document.getElementById("activeStageCount"),
    grid: document.getElementById("trackGrid"),
    empty: document.getElementById("emptyState"),
    search: document.getElementById("poolSearch"),
    difficulty: document.getElementById("difficultyFilter"),
    pack: document.getElementById("packFilter"),
    tabs: Array.from(document.querySelectorAll("[data-stage]"))
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getStage() {
    return data.stages.find((stage) => stage.id === state.stage) || data.stages[0];
  }

  function trackDifficulty(track) {
    return track.stages[state.stage];
  }

  function isRemovedTrack(track) {
    const note = track.note || "";
    return note.includes("\u79fb\u9664") && !note.includes("\u5e38\u9a7b") && !note.includes("\u518d\u6536\u5f55");
  }

  function tracksInStage() {
    return data.tracks.filter((track) => Boolean(trackDifficulty(track)) && !isRemovedTrack(track));
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function matchesSearch(track) {
    if (!state.search) {
      return true;
    }

    const haystack = [
      track.title,
      track.pack
    ].map(normalize).join(" ");

    return haystack.includes(state.search);
  }

  function filteredTracks() {
    return tracksInStage().filter((track) => {
      const difficulty = trackDifficulty(track);
      const difficultyOk = state.difficulty === "all" || difficulty === state.difficulty;
      const packOk = state.pack === "all" || track.pack === state.pack;
      return difficultyOk && packOk && matchesSearch(track);
    });
  }

  function renderDifficultyOptions(stageTracks) {
    const difficultyOrder = ["IN", "IN AT", "EZ HD IN", "EZ HD IN AT"];
    const difficulties = Array.from(new Set(stageTracks.map(trackDifficulty).filter(Boolean))).sort((a, b) => {
      const aIndex = difficultyOrder.indexOf(a);
      const bIndex = difficultyOrder.indexOf(b);
      return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    });
    const currentDifficultyExists = state.difficulty === "all" || difficulties.includes(state.difficulty);

    if (!currentDifficultyExists) {
      state.difficulty = "all";
    }

    els.difficulty.innerHTML = [
      '<option value="all">全部</option>',
      ...difficulties.map((difficulty) => `<option value="${escapeHtml(difficulty)}">${escapeHtml(difficulty)}</option>`)
    ].join("");
    els.difficulty.value = state.difficulty;
  }

  function renderPackOptions(stageTracks) {
    const packs = Array.from(new Set(stageTracks.map((track) => track.pack).filter(Boolean))).sort((a, b) => {
      return a.localeCompare(b, "zh-Hans-CN");
    });
    const currentPackExists = state.pack === "all" || packs.includes(state.pack);

    if (!currentPackExists) {
      state.pack = "all";
    }

    els.pack.innerHTML = [
      '<option value="all">全部曲包</option>',
      ...packs.map((pack) => `<option value="${escapeHtml(pack)}">${escapeHtml(pack)}</option>`)
    ].join("");
    els.pack.value = state.pack;
  }

  function renderCards(tracks) {
    els.grid.innerHTML = tracks.map((track) => {
      const difficulty = trackDifficulty(track);
      const pack = track.pack ? `<span class="track-pack">${escapeHtml(track.pack)}</span>` : "";

      return `
        <article class="track-card">
          <div class="track-main">
            <h2 class="track-title">${escapeHtml(track.title)}</h2>
            <div class="track-meta">
              ${pack}
            </div>
          </div>
          <span class="difficulty-text" aria-label="可选难度">${escapeHtml(difficulty)}</span>
        </article>
      `;
    }).join("");

    els.empty.hidden = tracks.length > 0;
  }

  function renderSummary(stageTracks) {
    const stage = getStage();

    els.stageName.textContent = stage.label;
    els.stageCount.textContent = `${stageTracks.length} 首`;
  }

  function renderTabs() {
    els.tabs.forEach((tab) => {
      const isActive = tab.dataset.stage === state.stage;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });
  }

  function render() {
    const stageTracks = tracksInStage();
    renderDifficultyOptions(stageTracks);
    renderPackOptions(stageTracks);
    const visibleTracks = filteredTracks();
    renderTabs();
    renderSummary(stageTracks);
    renderCards(visibleTracks);
  }

  function init() {
    if (!data || !Array.isArray(data.tracks)) {
      els.source.textContent = "曲库数据载入失败。";
      els.empty.hidden = false;
      return;
    }

    els.source.textContent = `数据范围：${data.sourceRange.replace("Phigros ", "")}`;

    els.tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        state.stage = tab.dataset.stage;
        render();
      });
    });

    els.search.addEventListener("input", (event) => {
      state.search = normalize(event.target.value);
      render();
    });

    els.difficulty.addEventListener("change", (event) => {
      state.difficulty = event.target.value;
      render();
    });

    els.pack.addEventListener("change", (event) => {
      state.pack = event.target.value;
      render();
    });

    render();
  }

  init();
})();
