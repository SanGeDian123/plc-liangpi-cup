(function () {
  const data = window.PLC_SONG_POOL_DATA;
  const API_BASE =
    typeof API_URL !== "undefined"
      ? API_URL
      : window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000"
        : "https://plc-liangpi-cup.onrender.com";

  const USER_KEY_STORAGE = "plc.songPool.userKey.v1";
  const NICKNAME_STORAGE = "plc.songPool.nickname.v1";

  const state = {
    stage: "round16",
    search: "",
    difficulty: "all",
    pack: "all",
    sortBy: "version",
    sortOrder: "asc",
    likes: new Map(),
    liked: new Set(),
    activeTrack: null,
    currentComments: [],
    replyTarget: null,
    commentsRequestId: 0,
    userKey: getOrCreateUserKey(),
    isLiking: false,
    isSubmittingComment: false,
    closeTimer: null
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
    sortBy: document.getElementById("sortBy"),
    sortOrder: document.getElementById("sortOrder"),
    tabs: Array.from(document.querySelectorAll("[data-stage]")),
    overview: document.getElementById("trackOverview"),
    overviewClose: document.getElementById("overviewClose"),
    overviewStage: document.getElementById("overviewStage"),
    overviewTitle: document.getElementById("overviewTitle"),
    overviewLikes: document.getElementById("overviewLikes"),
    overviewDifficulty: document.getElementById("overviewDifficulty"),
    overviewLikeButton: document.getElementById("overviewLikeButton"),
    overviewLikeCount: document.getElementById("overviewLikeCount"),
    overviewLikeNote: document.getElementById("overviewLikeNote"),
    overviewCommentCount: document.getElementById("overviewCommentCount"),
    commentList: document.getElementById("songCommentList"),
    commentForm: document.getElementById("songCommentForm"),
    replyTarget: document.getElementById("songReplyTarget"),
    replyText: document.getElementById("songReplyText"),
    clearReply: document.getElementById("clearSongReply"),
    commentNickname: document.getElementById("songCommentNickname"),
    commentDifficulty: document.getElementById("songCommentDifficulty"),
    commentContent: document.getElementById("songCommentContent")
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getOrCreateUserKey() {
    try {
      const stored = localStorage.getItem(USER_KEY_STORAGE);

      if (stored && stored.length >= 12) {
        return stored;
      }

      const randomValue =
        window.crypto && typeof window.crypto.randomUUID === "function"
          ? window.crypto.randomUUID()
          : `${Date.now().toString(36)}:${Math.random().toString(36).slice(2)}`;
      const key = `song:${randomValue}`;

      localStorage.setItem(USER_KEY_STORAGE, key);
      return key;
    } catch (error) {
      return `song:${Date.now().toString(36)}:${Math.random().toString(36).slice(2)}`;
    }
  }

  function getStoredNickname() {
    try {
      return localStorage.getItem(NICKNAME_STORAGE) || "";
    } catch (error) {
      return "";
    }
  }

  function storeNickname(nickname) {
    try {
      localStorage.setItem(NICKNAME_STORAGE, nickname);
    } catch (error) {
      // Ignore private-mode storage errors.
    }
  }

  function likeKey(trackId, stage = state.stage) {
    return `${stage}:${trackId}`;
  }

  function getStage() {
    return data.stages.find((stage) => stage.id === state.stage) || data.stages[0];
  }

  function getStageById(stageId) {
    return data.stages.find((stage) => stage.id === stageId) || data.stages[0];
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

  function getLikeCount(trackId, stage = state.stage) {
    return state.likes.get(likeKey(trackId, stage)) || 0;
  }

  function hasLiked(trackId, stage = state.stage) {
    return state.liked.has(likeKey(trackId, stage));
  }

  function filteredTracks() {
    return tracksInStage().filter((track) => {
      const difficulty = trackDifficulty(track);
      const difficultyOk = state.difficulty === "all" || difficulty === state.difficulty;
      const packOk = state.pack === "all" || track.pack === state.pack;
      return difficultyOk && packOk && matchesSearch(track);
    });
  }

  function compareVersions(aVersion, bVersion) {
    const aParts = String(aVersion || "0").split(".").map((part) => Number(part) || 0);
    const bParts = String(bVersion || "0").split(".").map((part) => Number(part) || 0);
    const length = Math.max(aParts.length, bParts.length);

    for (let index = 0; index < length; index += 1) {
      const diff = (aParts[index] || 0) - (bParts[index] || 0);

      if (diff !== 0) {
        return diff;
      }
    }

    return 0;
  }

  function compareByVersion(a, b) {
    return (
      compareVersions(a.version, b.version) ||
      (Number(a.order) || 0) - (Number(b.order) || 0) ||
      a.id - b.id
    );
  }

  function sortTracks(tracks) {
    const direction = state.sortOrder === "desc" ? -1 : 1;

    return [...tracks].sort((a, b) => {
      if (state.sortBy === "likes") {
        const likeDiff = getLikeCount(a.id) - getLikeCount(b.id);

        if (likeDiff !== 0) {
          return likeDiff * direction;
        }

        return compareByVersion(a, b);
      }

      return compareByVersion(a, b) * direction;
    });
  }

  function getDifficultyChoices(track) {
    return String(trackDifficulty(track) || "")
      .split(/\s+/)
      .filter(Boolean);
  }

  function getRowAnimationDelay(index) {
    return Math.round(360 * (1 - Math.exp(-index / 6)));
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
    els.grid.innerHTML = tracks.map((track, index) => {
      const difficulty = trackDifficulty(track);
      const pack = track.pack ? `<span class="track-pack">${escapeHtml(track.pack)}</span>` : "";
      const likes = getLikeCount(track.id);
      const likedClass = hasLiked(track.id) ? " is-liked" : "";

      return `
        <article
          class="track-card${likedClass}"
          role="button"
          tabindex="0"
          data-track-id="${track.id}"
          style="--row-delay:${getRowAnimationDelay(index)}ms"
          aria-label="${escapeHtml(track.title)} 总览"
        >
          <div class="track-main">
            <h2 class="track-title">${escapeHtml(track.title)}</h2>
            <div class="track-meta">
              ${pack}
            </div>
          </div>
          <div class="track-side">
            <span class="track-like-count" data-like-track="${track.id}" aria-label="赞数 ${likes}">${likes}</span>
            <span class="difficulty-text" aria-label="可选难度">${escapeHtml(difficulty)}</span>
          </div>
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
    renderTabs();
    renderSummary(stageTracks);
    renderCards(sortTracks(filteredTracks()));

    if (state.activeTrack && !els.overview.hidden) {
      renderOverview();
    }
  }

  function setStageLikes(stage, payload) {
    const nextLikes = new Map(state.likes);
    const nextLiked = new Set(state.liked);

    data.tracks.forEach((track) => {
      nextLikes.delete(likeKey(track.id, stage));
      nextLiked.delete(likeKey(track.id, stage));
    });

    (payload.counts || []).forEach((row) => {
      if (row.stage === stage) {
        nextLikes.set(likeKey(row.trackId, stage), Number(row.likes) || 0);
      }
    });

    (payload.liked || []).forEach((row) => {
      if (row.stage === stage) {
        nextLiked.add(likeKey(row.trackId, stage));
      }
    });

    state.likes = nextLikes;
    state.liked = nextLiked;
  }

  async function fetchJson(url, options) {
    const response = await fetch(url, options);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.message || "请求失败");
    }

    return payload;
  }

  async function loadLikes(stage = state.stage) {
    try {
      const params = new URLSearchParams({
        stage,
        userKey: state.userKey
      });
      const payload = await fetchJson(`${API_BASE}/song-pool/likes?${params}`);

      setStageLikes(stage, payload || {});
      render();
    } catch (error) {
      console.warn("Song pool likes failed to load", error);
    }
  }

  function openOverview(track) {
    window.clearTimeout(state.closeTimer);
    state.activeTrack = track;
    state.currentComments = [];
    state.replyTarget = null;
    state.commentsRequestId += 1;
    els.commentNickname.value = getStoredNickname();
    els.commentContent.value = "";
    renderReplyTarget();
    els.overview.hidden = false;
    els.overview.classList.remove("is-closing");
    document.body.classList.add("overview-open");
    renderOverview();
    loadComments(track, state.commentsRequestId);
    els.overviewClose.focus({ preventScroll: true });
  }

  function closeOverview() {
    if (els.overview.hidden || els.overview.classList.contains("is-closing")) {
      return;
    }

    state.commentsRequestId += 1;
    els.overview.classList.add("is-closing");
    window.clearTimeout(state.closeTimer);
    state.closeTimer = window.setTimeout(() => {
      state.activeTrack = null;
      els.overview.hidden = true;
      els.overview.classList.remove("is-closing");
      document.body.classList.remove("overview-open");
      els.commentList.innerHTML = "";
      state.currentComments = [];
      state.replyTarget = null;
      renderReplyTarget();
    }, 180);
  }

  function renderCommentDifficultyOptions(track) {
    const choices = getDifficultyChoices(track);
    const currentValue = els.commentDifficulty.value;

    els.commentDifficulty.innerHTML = [
      '<option value="">不选择难度</option>',
      ...choices.map((difficulty) => `<option value="${escapeHtml(difficulty)}">${escapeHtml(difficulty)}</option>`)
    ].join("");
    els.commentDifficulty.value = choices.includes(currentValue) ? currentValue : "";
  }

  function renderOverview() {
    const track = state.activeTrack;

    if (!track) {
      return;
    }

    const stage = getStageById(state.stage);
    const likes = getLikeCount(track.id);
    const liked = hasLiked(track.id);

    els.overviewStage.textContent = stage.label;
    els.overviewTitle.textContent = track.title;
    els.overviewLikes.textContent = String(likes);
    els.overviewDifficulty.textContent = trackDifficulty(track);
    els.overviewLikeCount.textContent = String(likes);
    els.overviewLikeButton.disabled = liked || state.isLiking;
    els.overviewLikeButton.classList.toggle("is-liked", liked);
    els.overviewLikeButton.setAttribute("aria-pressed", String(liked));
    els.overviewLikeButton.querySelector("span").textContent = liked ? "已赞" : "赞";
    els.overviewLikeNote.textContent = liked
      ? "这个阶段你已经给这首曲目点过赞。"
      : "每个用户每首曲目每个阶段可赞一次。";
    renderCommentDifficultyOptions(track);
  }

  function renderCommentList(comments) {
    state.currentComments = comments;
    els.overviewCommentCount.textContent = String(comments.length);

    if (comments.length === 0) {
      els.commentList.innerHTML = '<div class="empty-comment">暂无评论</div>';
      return;
    }

    const commentMap = new Map();
    const repliesByParent = new Map();
    const roots = [];

    comments.forEach((comment) => {
      commentMap.set(Number(comment.id), comment);
    });

    comments.forEach((comment) => {
      const parentId = Number(comment.parent_comment_id) || 0;

      if (parentId && commentMap.has(parentId)) {
        const replies = repliesByParent.get(parentId) || [];
        replies.push(comment);
        repliesByParent.set(parentId, replies);
      } else {
        roots.push(comment);
      }
    });

    function renderComment(comment, depth = 0) {
      const difficulty = comment.difficulty
        ? `<span class="comment-difficulty comment-difficulty-${escapeHtml(comment.difficulty.toLowerCase())}">${escapeHtml(comment.difficulty)}</span>`
        : "";
      const createdAt = comment.created_at
        ? new Date(comment.created_at).toLocaleString("zh-CN", { hour12: false })
        : "";
      const replies = repliesByParent.get(Number(comment.id)) || [];
      const replyHtml = replies.length
        ? `<div class="song-comment-replies">${replies.map((reply) => renderComment(reply, depth + 1)).join("")}</div>`
        : "";

      return `
        <article
          class="song-comment-item${depth > 0 ? " is-reply" : ""}"
          role="button"
          tabindex="0"
          data-comment-id="${Number(comment.id)}"
          aria-label="回复 ${escapeHtml(comment.nickname)}"
        >
          <div class="song-comment-meta">
            <strong>${escapeHtml(comment.nickname)}</strong>
            ${difficulty}
          </div>
          <p>${escapeHtml(comment.content)}</p>
          <time>${escapeHtml(createdAt)}</time>
        </article>
        ${replyHtml}
      `;
    }

    els.commentList.innerHTML = roots.map((comment) => renderComment(comment)).join("");
  }

  function renderReplyTarget() {
    if (!state.replyTarget) {
      els.replyTarget.hidden = true;
      els.replyText.textContent = "";
      return;
    }

    els.replyTarget.hidden = false;
    els.replyText.textContent = `正在回复 @${state.replyTarget.nickname}`;
  }

  function setReplyTarget(comment) {
    state.replyTarget = comment
      ? {
          id: Number(comment.id),
          nickname: comment.nickname || "匿名"
        }
      : null;
    renderReplyTarget();
    els.commentContent.focus({ preventScroll: true });
  }

  async function loadComments(track, requestId = state.commentsRequestId) {
    els.overviewCommentCount.textContent = "0";
    els.commentList.innerHTML = '<div class="empty-comment">评论加载中...</div>';

    try {
      const params = new URLSearchParams({
        stage: state.stage
      });
      const comments = await fetchJson(`${API_BASE}/song-pool/tracks/${track.id}/comments?${params}`);

      if (requestId !== state.commentsRequestId || state.activeTrack?.id !== track.id) {
        return;
      }

      state.replyTarget = null;
      renderReplyTarget();
      renderCommentList(Array.isArray(comments) ? comments : []);
    } catch (error) {
      if (requestId !== state.commentsRequestId || state.activeTrack?.id !== track.id) {
        return;
      }

      els.commentList.innerHTML = '<div class="empty-comment">评论加载失败</div>';
    }
  }

  async function likeActiveTrack() {
    const track = state.activeTrack;

    if (!track || state.isLiking || hasLiked(track.id)) {
      return;
    }

    state.isLiking = true;
    renderOverview();

    try {
      const payload = await fetchJson(`${API_BASE}/song-pool/tracks/${track.id}/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          stage: state.stage,
          userKey: state.userKey
        })
      });

      state.likes.set(likeKey(track.id), Number(payload.likes) || getLikeCount(track.id) + 1);
      state.liked.add(likeKey(track.id));
      render();
      animateLike(track.id);
    } catch (error) {
      alert(error.message || "点赞失败");
    } finally {
      state.isLiking = false;
      renderOverview();
    }
  }

  function animateLike(trackId) {
    const likeNodes = Array.from(document.querySelectorAll(`[data-like-track="${trackId}"]`));

    els.overviewLikeButton.classList.remove("is-popping");
    els.overviewLikes.classList.remove("is-bumping");
    likeNodes.forEach((node) => node.classList.remove("is-bumping"));

    void els.overviewLikeButton.offsetWidth;

    els.overviewLikeButton.classList.add("is-popping");
    els.overviewLikes.classList.add("is-bumping");
    likeNodes.forEach((node) => node.classList.add("is-bumping"));
  }

  async function submitComment(event) {
    event.preventDefault();

    const track = state.activeTrack;
    const nickname = els.commentNickname.value.trim();
    const content = els.commentContent.value.trim();
    const difficulty = els.commentDifficulty.value;

    if (!track || state.isSubmittingComment) {
      return;
    }

    if (!nickname || !content) {
      alert("请输入昵称和评论内容");
      return;
    }

    state.isSubmittingComment = true;
    els.commentForm.classList.add("is-submitting");
    storeNickname(nickname);

    try {
      await fetchJson(`${API_BASE}/song-pool/tracks/${track.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          stage: state.stage,
          nickname,
          content,
          difficulty,
          parentCommentId: state.replyTarget?.id || null
        })
      });

      els.commentContent.value = "";
      els.commentDifficulty.value = "";
      state.replyTarget = null;
      renderReplyTarget();
      await loadComments(track);
    } catch (error) {
      alert(error.message || "评论发布失败");
    } finally {
      state.isSubmittingComment = false;
      els.commentForm.classList.remove("is-submitting");
    }
  }

  function findTrackFromCard(card) {
    const trackId = Number(card?.dataset.trackId);

    return data.tracks.find((track) => track.id === trackId);
  }

  function initEvents() {
    els.tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        if (tab.dataset.stage === state.stage) {
          return;
        }

        state.stage = tab.dataset.stage;
        render();
        loadLikes(state.stage);
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

    els.sortBy.addEventListener("change", (event) => {
      state.sortBy = event.target.value;
      render();
    });

    els.sortOrder.addEventListener("change", (event) => {
      state.sortOrder = event.target.value;
      render();
    });

    els.grid.addEventListener("click", (event) => {
      const card = event.target.closest(".track-card");
      const track = findTrackFromCard(card);

      if (track) {
        openOverview(track);
      }
    });

    els.grid.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      const card = event.target.closest(".track-card");
      const track = findTrackFromCard(card);

      if (track) {
        event.preventDefault();
        openOverview(track);
      }
    });

    els.overviewClose.addEventListener("click", closeOverview);
    els.overview.addEventListener("click", (event) => {
      if (event.target === els.overview) {
        closeOverview();
      }
    });
    els.overviewLikeButton.addEventListener("click", likeActiveTrack);
    els.clearReply.addEventListener("click", () => {
      state.replyTarget = null;
      renderReplyTarget();
    });
    els.commentList.addEventListener("click", (event) => {
      const item = event.target.closest?.(".song-comment-item");
      const commentId = Number(item?.dataset.commentId);
      const comment = state.currentComments.find((entry) => Number(entry.id) === commentId);

      if (comment) {
        setReplyTarget(comment);
      }
    });
    els.commentList.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      const item = event.target.closest?.(".song-comment-item");
      const commentId = Number(item?.dataset.commentId);
      const comment = state.currentComments.find((entry) => Number(entry.id) === commentId);

      if (comment) {
        event.preventDefault();
        setReplyTarget(comment);
      }
    });
    els.commentForm.addEventListener("submit", submitComment);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !els.overview.hidden) {
        closeOverview();
      }
    });
  }

  function init() {
    if (!data || !Array.isArray(data.tracks)) {
      els.source.textContent = "曲库数据载入失败。";
      els.empty.hidden = false;
      return;
    }

    els.source.textContent = `数据范围：${data.sourceRange.replace("Phigros ", "")}`;
    initEvents();
    render();
    loadLikes(state.stage);
  }

  init();
})();
