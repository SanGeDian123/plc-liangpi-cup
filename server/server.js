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

app.get("/", (req, res) => {
  res.send("PLC凉皮杯后端运行中");
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

loadInitialPlayersSnapshot().then(refreshPlayersInBackground);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
