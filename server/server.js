const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "PLC2026";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "plc-admin-token-2026";

const supabase = createClient(
  "https://kpjuerikmmajqyxcocos.supabase.co",
  "sb_publishable_Jkj-377OvvQXVtiR-Vdikw_FJbPQ_zs"
);

const PLAYERS_CACHE_TTL_MS =
  Number(process.env.PLAYERS_CACHE_TTL_MS) || 60 * 1000;
const PLAYERS_REFRESH_TIMEOUT_MS =
  Number(process.env.PLAYERS_REFRESH_TIMEOUT_MS) || 8000;
const PLAYERS_SNAPSHOT_MAX_AGE_MS =
  Number(process.env.PLAYERS_SNAPSHOT_MAX_AGE_MS) || 24 * 60 * 60 * 1000;
const PLAYERS_SEED_SNAPSHOT_PATH = path.join(
  __dirname,
  "players-snapshot.json"
);
const PLAYERS_RUNTIME_SNAPSHOT_PATH =
  process.env.PLAYERS_SNAPSHOT_PATH ||
  path.join(os.tmpdir(), "plc-liangpi-cup-players.json");
const PHI_BACKEND_URL = (
  process.env.PHI_BACKEND_URL || "http://127.0.0.1:8080"
).replace(/\/+$/, "");
const PHI_BACKEND_TIMEOUT_MS =
  Number(process.env.PHI_BACKEND_TIMEOUT_MS) || 15000;

const playersCache = {
  players: [],
  updatedAt: 0,
  source: "empty",
  snapshotLoaded: false,
  refreshPromise: null,
  lastError: null
};

app.use(
  cors({
    origin: "*",
    exposedHeaders: ["X-Players-Cache", "X-Players-Updated-At"]
  })
);
app.use(express.json());

function normalizePlayers(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(Boolean)
    .map((player) => ({
      ...player,
      score: Number(player.score)
    }))
    .filter((player) => Number.isFinite(player.score))
    .sort((a, b) => b.score - a.score);
}

function getPlayersFromSnapshotPayload(payload) {
  return normalizePlayers(Array.isArray(payload) ? payload : payload?.players);
}

function parseSnapshotTime(value) {
  const time = Date.parse(value || "");
  return Number.isFinite(time) ? time : 0;
}

function isSnapshotUsable(payload) {
  const updatedAt = parseSnapshotTime(payload?.updatedAt || payload?.updated_at);
  const expiresAt = parseSnapshotTime(payload?.expiresAt || payload?.expires_at);
  const now = Date.now();

  if (expiresAt && expiresAt <= now) {
    return false;
  }

  if (updatedAt && now - updatedAt > PLAYERS_SNAPSHOT_MAX_AGE_MS) {
    return false;
  }

  return true;
}

function setPlayersCache(players, source, updatedAt = Date.now()) {
  playersCache.players = normalizePlayers(players);
  playersCache.updatedAt = updatedAt;
  playersCache.source = source;
  playersCache.lastError = null;
}

async function readPlayersSnapshot(filePath, source) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const payload = JSON.parse(raw);
    const players = getPlayersFromSnapshotPayload(payload);

    if (players.length === 0 || !isSnapshotUsable(payload)) {
      return null;
    }

    return {
      players,
      source,
      updatedAt: parseSnapshotTime(payload?.updatedAt || payload?.updated_at)
    };
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`Players snapshot read failed: ${source}`, error.message);
    }

    return null;
  }
}

async function loadInitialPlayersSnapshot() {
  if (playersCache.snapshotLoaded) {
    return;
  }

  const snapshot = await readPlayersSnapshot(
    PLAYERS_RUNTIME_SNAPSHOT_PATH,
    "runtime-snapshot"
  );

  if (snapshot) {
    setPlayersCache(
      snapshot.players,
      snapshot.source,
      snapshot.updatedAt || Date.now()
    );
  } else {
    const seedSnapshot = await readPlayersSnapshot(
      PLAYERS_SEED_SNAPSHOT_PATH,
      "seed-snapshot"
    );

    if (seedSnapshot) {
      setPlayersCache(
        seedSnapshot.players,
        seedSnapshot.source,
        seedSnapshot.updatedAt || Date.now()
      );
    }
  }

  playersCache.snapshotLoaded = true;
}

async function persistPlayersSnapshot(players) {
  const updatedAt = playersCache.updatedAt || Date.now();
  const payload = {
    updatedAt: new Date(updatedAt).toISOString(),
    expiresAt: new Date(updatedAt + PLAYERS_SNAPSHOT_MAX_AGE_MS).toISOString(),
    source: "runtime-snapshot",
    players: normalizePlayers(players)
  };

  await fs.mkdir(path.dirname(PLAYERS_RUNTIME_SNAPSHOT_PATH), {
    recursive: true
  });
  await fs.writeFile(
    PLAYERS_RUNTIME_SNAPSHOT_PATH,
    `${JSON.stringify(payload, null, 2)}\n`,
    "utf8"
  );
}

async function fetchPlayersFromSupabase() {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("score", { ascending: false });

  if (error) {
    throw error;
  }

  return normalizePlayers(data);
}

async function refreshPlayersCache() {
  if (playersCache.refreshPromise) {
    return playersCache.refreshPromise;
  }

  playersCache.refreshPromise = (async () => {
    const players = await fetchPlayersFromSupabase();
    setPlayersCache(players, "supabase");

    persistPlayersSnapshot(players).catch((error) => {
      console.warn("Players snapshot write failed", error.message);
    });

    return playersCache.players;
  })().finally(() => {
    playersCache.refreshPromise = null;
  });

  return playersCache.refreshPromise;
}

function refreshPlayersInBackground() {
  refreshPlayersCache().catch((error) => {
    playersCache.lastError = error;
    console.warn("Players refresh failed", error.message);
  });
}

function isPlayersCacheFresh() {
  return (
    playersCache.players.length > 0 &&
    Date.now() - playersCache.updatedAt < PLAYERS_CACHE_TTL_MS
  );
}

function withTimeout(promise, timeoutMs, message) {
  let timer = null;

  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function sendPlayers(res, players, source = playersCache.source) {
  res.set("Cache-Control", "no-cache");
  res.set("X-Players-Cache", source);

  if (playersCache.updatedAt) {
    res.set(
      "X-Players-Updated-At",
      new Date(playersCache.updatedAt).toISOString()
    );
  }

  res.json(players);
}

function mergePlayersIntoCache(rows) {
  const updates = normalizePlayers(rows);

  if (updates.length === 0) {
    return;
  }

  const byId = new Map(
    playersCache.players.map((player) => [String(player.id), player])
  );

  updates.forEach((player) => {
    byId.set(String(player.id), player);
  });

  setPlayersCache(Array.from(byId.values()), "mutation");
  persistPlayersSnapshot(playersCache.players).catch((error) => {
    console.warn("Players snapshot write failed", error.message);
  });
}

function removePlayerFromCache(id) {
  if (playersCache.players.length === 0) {
    return;
  }

  setPlayersCache(
    playersCache.players.filter((player) => String(player.id) !== String(id)),
    "mutation"
  );
  persistPlayersSnapshot(playersCache.players).catch((error) => {
    console.warn("Players snapshot write failed", error.message);
  });
}

function checkAdmin(req, res, next) {
  const token = req.headers["x-admin-token"];

  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({
      message: "无管理员权限"
    });
  }

  next();
}

function normalizeSongLikeUserKey(value) {
  const key = String(value || "").trim();

  if (
    key.length < 12 ||
    key.length > 96 ||
    !/^[a-zA-Z0-9._:-]+$/.test(key)
  ) {
    return "";
  }

  return key;
}

function normalizeSongPoolStage(value) {
  const stage = String(value || "").trim();

  return stage === "round16" || stage === "top8" ? stage : "";
}

function normalizeTrackId(value) {
  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : 0;
}

function normalizeCommentParentId(value) {
  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : null;
}

async function countSongLikes(trackId, stage) {
  const { count, error } = await supabase
    .from("song_likes")
    .select("*", {
      count: "exact",
      head: true
    })
    .eq("track_id", trackId)
    .eq("stage", stage);

  if (error) {
    throw error;
  }

  return count || 0;
}

function normalizeCommentText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function normalizeSongDifficulty(value) {
  const difficulty = String(value || "").trim().toUpperCase();

  return ["EZ", "HD", "IN", "AT"].includes(difficulty) ? difficulty : "";
}

function isSongPoolTableMissing(error) {
  return error?.code === "PGRST205" || error?.code === "42P01";
}

function isSongPoolColumnMissing(error) {
  return (
    error?.code === "PGRST204" ||
    error?.code === "42703" ||
    /schema cache/i.test(error?.message || "")
  );
}

function sendSongPoolTableMissing(res) {
  return res.status(503).json({
    message: "曲库数据库表尚未创建，请先执行 server/song-pool-schema.sql"
  });
}

function normalizePhiBody(body = {}) {
  const normalized = { ...body };

  if (normalized.source && !normalized.data_source) {
    normalized.data_source = normalized.source;
  }

  if (!normalized.data_source) {
    normalized.data_source = "internal";
  }

  if (
    !normalized.qq &&
    String(normalized.platform || "").toLowerCase() === "qq" &&
    normalized.platform_id
  ) {
    normalized.qq = normalized.platform_id;
  }

  delete normalized.source;

  Object.keys(normalized).forEach((key) => {
    if (normalized[key] === "") {
      delete normalized[key];
    }
  });

  return normalized;
}

function buildPhiUrl(pathname, query = {}) {
  const url = new URL(pathname, `${PHI_BACKEND_URL}/`);

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, item));
    } else {
      url.searchParams.set(key, value);
    }
  });

  return url;
}

async function fetchPhi(pathname, options = {}) {
  if (typeof fetch !== "function") {
    throw new Error("当前 Node.js 运行时不支持 fetch");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PHI_BACKEND_TIMEOUT_MS);

  try {
    return await fetch(buildPhiUrl(pathname, options.query), {
      method: options.method || "GET",
      headers: options.headers,
      body: options.body,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}

function sendPhiError(res, error) {
  const timedOut = error.name === "AbortError";

  res.status(timedOut ? 504 : 502).json({
    message: timedOut
      ? "Phi-Backend 请求超时"
      : "Phi-Backend 暂时不可用",
    detail: error.message
  });
}

async function proxyPhiJson(req, res, pathname, options = {}) {
  try {
    const hasBody = options.method !== "GET";
    const response = await fetchPhi(pathname, {
      method: options.method || "POST",
      query: options.query || req.query,
      headers: hasBody
        ? {
            "Content-Type": "application/json"
          }
        : undefined,
      body: hasBody ? JSON.stringify(normalizePhiBody(req.body)) : undefined
    });
    const text = await response.text();
    const contentType = response.headers.get("content-type") || "application/json";

    res.status(response.status);
    res.set("Cache-Control", "no-store");
    res.set(
      "Content-Type",
      contentType.includes("json") ? "application/json" : contentType
    );
    res.send(text);
  } catch (error) {
    sendPhiError(res, error);
  }
}

async function proxyPhiBinary(req, res, pathname, options = {}) {
  try {
    const response = await fetchPhi(pathname, {
      method: options.method || "POST",
      query: options.query || req.query,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(normalizePhiBody(req.body))
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get("content-type") || "application/octet-stream";

    res.status(response.status);
    res.set("Cache-Control", "no-store");
    res.set("Content-Type", contentType);
    res.send(buffer);
  } catch (error) {
    sendPhiError(res, error);
  }
}

app.get("/", (req, res) => {
  res.send("PLC凉皮杯后端运行中");
});

app.get("/phigros/proxy/status", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({
    status: "ok",
    proxy: "phigros",
    backendUrl: PHI_BACKEND_URL
  });
});

app.get("/phigros/status", async (req, res) => {
  await proxyPhiJson(req, res, "/status", {
    method: "GET"
  });
});

app.get("/phigros/auth/qrcode", async (req, res) => {
  await proxyPhiJson(req, res, "/auth/qrcode", {
    method: "GET"
  });
});

app.get("/phigros/auth/qrcode/:qrId/status", async (req, res) => {
  await proxyPhiJson(
    req,
    res,
    `/auth/qrcode/${encodeURIComponent(req.params.qrId)}/status`,
    {
      method: "GET"
    }
  );
});

app.post("/phigros/bind", async (req, res) => {
  await proxyPhiJson(req, res, "/bind");
});

app.post("/phigros/rks", async (req, res) => {
  await proxyPhiJson(req, res, "/rks");
});

app.post("/phigros/b30", async (req, res) => {
  await proxyPhiJson(req, res, "/b30");
});

app.post("/phigros/bn/:n", async (req, res) => {
  const n = Number(req.params.n);

  if (!Number.isInteger(n) || n <= 0 || n > 100) {
    return res.status(400).json({
      message: "Best N 参数必须是 1 到 100 之间的整数"
    });
  }

  await proxyPhiJson(req, res, `/bn/${n}`);
});

app.get("/phigros/song/search", async (req, res) => {
  await proxyPhiJson(req, res, "/song/search", {
    method: "GET"
  });
});

app.post("/phigros/song/record", async (req, res) => {
  await proxyPhiJson(req, res, "/song/search/record");
});

app.post("/phigros/image/bn/:n", async (req, res) => {
  const n = Number(req.params.n);

  if (!Number.isInteger(n) || n <= 0 || n > 100) {
    return res.status(400).json({
      message: "Best N 参数必须是 1 到 100 之间的整数"
    });
  }

  await proxyPhiBinary(req, res, `/image/bn/${n}`);
});

app.post("/phigros/image/song", async (req, res) => {
  await proxyPhiBinary(req, res, "/image/song");
});

app.post("/admin/login", (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    return res.json({
      token: ADMIN_TOKEN
    });
  }

  res.status(401).json({
    message: "密码错误"
  });
});

app.get("/players", async (req, res) => {
  await loadInitialPlayersSnapshot();

  const wantsRefresh = req.query.refresh === "1" || req.query.fresh === "1";

  if (playersCache.players.length > 0 && !wantsRefresh) {
    if (!isPlayersCacheFresh()) {
      refreshPlayersInBackground();
    }

    return sendPlayers(res, playersCache.players);
  }

  try {
    const players = await withTimeout(
      refreshPlayersCache(),
      PLAYERS_REFRESH_TIMEOUT_MS,
      "Players refresh timed out"
    );

    return sendPlayers(res, players);
  } catch (error) {
    if (playersCache.players.length > 0) {
      console.warn("Serving stale players snapshot", error.message);
      return sendPlayers(res, playersCache.players, "stale-snapshot");
    }

    return res.status(503).json({
      message: "Players are temporarily unavailable"
    });
  }
});

app.post("/players", checkAdmin, async (req, res) => {
  const { nickname, score, number } = req.body;

  if (!nickname || score === undefined) {
    return res.status(400).json({
      message: "昵称和成绩不能为空"
    });
  }

  const { data, error } = await supabase
    .from("players")
    .insert([
      {
        nickname,
        score: Number(score),
        number
      }
    ])
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  await loadInitialPlayersSnapshot();
  mergePlayersIntoCache(data);
  refreshPlayersInBackground();

  res.json(data);
});

app.put("/players/:id", checkAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { nickname, score, number } = req.body;

  if (!nickname || score === undefined) {
    return res.status(400).json({
      message: "昵称和成绩不能为空"
    });
  }

  const { data, error } = await supabase
    .from("players")
    .update({
      nickname,
      score: Number(score),
      number
    })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  await loadInitialPlayersSnapshot();
  mergePlayersIntoCache(data);
  refreshPlayersInBackground();

  res.json(data);
});

app.delete("/players/:id", checkAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const { error } = await supabase
    .from("players")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(500).json(error);
  }

  await loadInitialPlayersSnapshot();
  removePlayerFromCache(id);
  refreshPlayersInBackground();

  res.json({
    success: true
  });
});

app.get("/players/:id/comments", async (req, res) => {
  const playerId = Number(req.params.id);

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("player_id", playerId)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

app.post("/players/:id/comments", async (req, res) => {
  const playerId = Number(req.params.id);
  const { nickname, content } = req.body;

  if (!nickname || !content) {
    return res.status(400).json({
      message: "昵称和评论不能为空"
    });
  }

  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        player_id: playerId,
        nickname,
        content
      }
    ])
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

app.get("/song-pool/likes", async (req, res) => {
  const stage = normalizeSongPoolStage(req.query.stage);
  const userKey = normalizeSongLikeUserKey(req.query.userKey);

  let likesQuery = supabase
    .from("song_likes")
    .select("track_id, stage")
    .limit(10000);

  if (stage) {
    likesQuery = likesQuery.eq("stage", stage);
  }

  const { data: likeRows, error: likesError } = await likesQuery;

  if (likesError) {
    if (isSongPoolTableMissing(likesError)) {
      res.set("Cache-Control", "no-store");
      return res.json({
        counts: [],
        liked: []
      });
    }

    return res.status(500).json(likesError);
  }

  const byTrack = new Map();

  (likeRows || []).forEach((row) => {
    const key = `${row.stage}:${row.track_id}`;
    byTrack.set(key, (byTrack.get(key) || 0) + 1);
  });

  let liked = [];

  if (userKey) {
    let likedQuery = supabase
      .from("song_likes")
      .select("track_id, stage")
      .eq("user_key", userKey)
      .limit(10000);

    if (stage) {
      likedQuery = likedQuery.eq("stage", stage);
    }

    const { data: likedRows, error: likedError } = await likedQuery;

    if (likedError) {
      if (isSongPoolTableMissing(likedError)) {
        res.set("Cache-Control", "no-store");
        return res.json({
          counts: [],
          liked: []
        });
      }

      return res.status(500).json(likedError);
    }

    liked = (likedRows || []).map((row) => ({
      trackId: row.track_id,
      stage: row.stage
    }));
  }

  res.set("Cache-Control", "no-store");
  res.json({
    counts: Array.from(byTrack.entries()).map(([key, likes]) => {
      const [rowStage, trackId] = key.split(":");

      return {
        trackId: Number(trackId),
        stage: rowStage,
        likes
      };
    }),
    liked
  });
});

app.post("/song-pool/tracks/:id/likes", async (req, res) => {
  const trackId = normalizeTrackId(req.params.id);
  const stage = normalizeSongPoolStage(req.body.stage);
  const userKey = normalizeSongLikeUserKey(req.body.userKey);

  if (!trackId || !stage || !userKey) {
    return res.status(400).json({
      message: "曲目、阶段或用户标识无效"
    });
  }

  const { error } = await supabase
    .from("song_likes")
    .insert([
      {
        track_id: trackId,
        stage,
        user_key: userKey
      }
    ]);

  if (error && error.code !== "23505") {
    if (isSongPoolTableMissing(error)) {
      return sendSongPoolTableMissing(res);
    }

    return res.status(500).json(error);
  }

  try {
    const likes = await countSongLikes(trackId, stage);

    return res.json({
      trackId,
      stage,
      likes,
      liked: true,
      alreadyLiked: Boolean(error)
    });
  } catch (countError) {
    return res.status(500).json(countError);
  }
});

app.get("/song-pool/tracks/:id/comments", async (req, res) => {
  const trackId = normalizeTrackId(req.params.id);
  const stage = normalizeSongPoolStage(req.query.stage);

  if (!trackId || !stage) {
    return res.status(400).json({
      message: "曲目或阶段无效"
    });
  }

  const { data, error } = await supabase
    .from("song_comments")
    .select("id, track_id, stage, parent_comment_id, difficulty, nickname, content, created_at")
    .eq("track_id", trackId)
    .eq("stage", stage)
    .order("created_at", { ascending: false });

  if (error) {
    if (isSongPoolTableMissing(error)) {
      res.set("Cache-Control", "no-store");
      return res.json([]);
    }

    if (isSongPoolColumnMissing(error)) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("song_comments")
        .select("id, track_id, stage, difficulty, nickname, content, created_at")
        .eq("track_id", trackId)
        .eq("stage", stage)
        .order("created_at", { ascending: false });

      if (fallbackError) {
        return res.status(500).json(fallbackError);
      }

      res.set("Cache-Control", "no-store");
      return res.json(
        (fallbackData || []).map((comment) => ({
          ...comment,
          parent_comment_id: null
        }))
      );
    }

    return res.status(500).json(error);
  }

  res.set("Cache-Control", "no-store");
  res.json(data);
});

app.post("/song-pool/tracks/:id/comments", async (req, res) => {
  const trackId = normalizeTrackId(req.params.id);
  const stage = normalizeSongPoolStage(req.body.stage);
  const nickname = normalizeCommentText(req.body.nickname, 32);
  const content = normalizeCommentText(req.body.content, 500);
  const difficulty = normalizeSongDifficulty(req.body.difficulty);
  const parentCommentId = normalizeCommentParentId(req.body.parentCommentId);

  if (!trackId || !stage || !nickname || !content) {
    return res.status(400).json({
      message: "曲目、阶段、昵称和评论不能为空"
    });
  }

  const { data, error } = await supabase
    .from("song_comments")
    .insert([
      {
        track_id: trackId,
        stage,
        parent_comment_id: parentCommentId,
        difficulty: difficulty || null,
        nickname,
        content
      }
    ])
    .select("id, track_id, stage, parent_comment_id, difficulty, nickname, content, created_at");

  if (error) {
    if (isSongPoolTableMissing(error)) {
      return sendSongPoolTableMissing(res);
    }

    if (isSongPoolColumnMissing(error) && parentCommentId) {
      return res.status(503).json({
        message: "评论回复字段尚未创建，请重新执行 server/song-pool-schema.sql"
      });
    }

    if (isSongPoolColumnMissing(error)) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("song_comments")
        .insert([
          {
            track_id: trackId,
            stage,
            difficulty: difficulty || null,
            nickname,
            content
          }
        ])
        .select("id, track_id, stage, difficulty, nickname, content, created_at");

      if (fallbackError) {
        return res.status(500).json(fallbackError);
      }

      return res.json(
        (fallbackData || []).map((comment) => ({
          ...comment,
          parent_comment_id: null
        }))
      );
    }

    return res.status(500).json(error);
  }

  res.json(data);
});

loadInitialPlayersSnapshot().then(refreshPlayersInBackground);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
