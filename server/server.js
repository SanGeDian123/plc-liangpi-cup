const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const crypto = require("crypto");
const vm = require("vm");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "PLC2026";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "plc-admin-token-2026";
const SUPABASE_URL = "https://kpjuerikmmajqyxcocos.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Jkj-377OvvQXVtiR-Vdikw_FJbPQ_zs";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

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
const RUNTIME_DATA_DIR =
  process.env.RUNTIME_DATA_DIR || path.join(__dirname, "data");
const DISPLAY_SETTINGS_PATH =
  process.env.DISPLAY_SETTINGS_PATH ||
  path.join(RUNTIME_DATA_DIR, "display-settings.json");
const USER_BINDINGS_PATH =
  process.env.USER_BINDINGS_PATH ||
  path.join(RUNTIME_DATA_DIR, "user-bindings.json");
const USER_MESSAGES_PATH =
  process.env.USER_MESSAGES_PATH ||
  path.join(RUNTIME_DATA_DIR, "user-messages.json");
const SCHEDULE_DATA_PATH =
  process.env.SCHEDULE_DATA_PATH ||
  path.join(RUNTIME_DATA_DIR, "schedule.json");
const SUPABASE_RUNTIME_BUCKET =
  process.env.SUPABASE_RUNTIME_BUCKET ||
  process.env.SUPABASE_STORAGE_BUCKET ||
  "plc-runtime-data";
const RUNTIME_STORAGE_KEYS = Object.freeze({
  displaySettings: "runtime/display-settings.json",
  userBindings: "runtime/user-bindings.json",
  userMessages: "runtime/user-messages.json",
  schedule: "runtime/schedule.json"
});
const SONG_POOL_DATA_PATH = path.join(
  __dirname,
  "..",
  "client",
  "js",
  "song-pool-data.js"
);
const SCHEDULE_PRESENCE_TIMEOUT_MS =
  Number(process.env.SCHEDULE_PRESENCE_TIMEOUT_MS) || 8000;
const DEFAULT_DISPLAY_SETTINGS = Object.freeze({
  goldDragonPlayerIds: []
});
const DEFAULT_USER_BINDINGS = Object.freeze({
  requests: [],
  bindings: {},
  playerGroups: {}
});
const PLAYER_GROUPS = Object.freeze(["LT组", "LH组", "未分类"]);
const DEFAULT_USER_MESSAGES = Object.freeze({
  songCommentOwners: {},
  notifications: []
});
const DEFAULT_SCHEDULE_DATA = Object.freeze({
  matches: []
});

const playersCache = {
  players: [],
  updatedAt: 0,
  source: "empty",
  snapshotLoaded: false,
  refreshPromise: null,
  lastError: null
};
const displaySettingsCache = {
  loaded: false,
  settings: {
    ...DEFAULT_DISPLAY_SETTINGS
  }
};
const userBindingsCache = {
  loaded: false,
  data: {
    requests: [],
    bindings: {}
  }
};
const userMessagesCache = {
  loaded: false,
  data: {
    songCommentOwners: {},
    notifications: []
  }
};
const scheduleCache = {
  loaded: false,
  data: {
    matches: []
  }
};
let songPoolDataPromise = null;
let songPoolDataMtimeMs = 0;
const runtimeStorageState = {
  bucketReady: false,
  bucketPromise: null
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

function cloneRuntimeDefault(value) {
  return JSON.parse(JSON.stringify(value));
}

function isMissingStorageObjectError(error) {
  const status = String(error?.status || error?.statusCode || "");
  const message = String(error?.message || "");

  return (
    status === "404" ||
    /not found|does not exist|object not found|resource not found/i.test(message)
  );
}

async function ensureSupabaseRuntimeBucket() {
  if (!supabaseAdmin) {
    return false;
  }

  if (runtimeStorageState.bucketReady) {
    return true;
  }

  if (!runtimeStorageState.bucketPromise) {
    runtimeStorageState.bucketPromise = (async () => {
      const { data, error } = await supabaseAdmin.storage.listBuckets();

      if (error) {
        throw error;
      }

      const exists = (data || []).some(
        (bucket) => bucket.name === SUPABASE_RUNTIME_BUCKET
      );

      if (!exists) {
        const { error: createError } = await supabaseAdmin.storage.createBucket(
          SUPABASE_RUNTIME_BUCKET,
          {
            public: false
          }
        );

        if (
          createError &&
          !/already exists|duplicate|exists/i.test(createError.message || "")
        ) {
          throw createError;
        }
      }

      runtimeStorageState.bucketReady = true;
      return true;
    })().catch((error) => {
      runtimeStorageState.bucketPromise = null;
      throw error;
    });
  }

  return runtimeStorageState.bucketPromise;
}

async function readLocalRuntimeJson(localPath, label) {
  try {
    const raw = await fs.readFile(localPath, "utf8");

    return {
      found: true,
      data: JSON.parse(raw)
    };
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`${label} local read failed`, error.message);
    }

    return {
      found: false,
      data: null
    };
  }
}

async function writeLocalRuntimeJson(localPath, data) {
  await fs.mkdir(path.dirname(localPath), {
    recursive: true
  });
  await fs.writeFile(localPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function readSupabaseRuntimeJson(storageKey, label) {
  await ensureSupabaseRuntimeBucket();

  const { data, error } = await supabaseAdmin.storage
    .from(SUPABASE_RUNTIME_BUCKET)
    .download(storageKey);

  if (error) {
    if (isMissingStorageObjectError(error)) {
      return {
        found: false,
        data: null
      };
    }

    throw error;
  }

  try {
    return {
      found: true,
      data: JSON.parse(await data.text())
    };
  } catch (error) {
    console.warn(`${label} Supabase JSON parse failed`, error.message);
    throw error;
  }
}

async function writeSupabaseRuntimeJson(storageKey, data) {
  await ensureSupabaseRuntimeBucket();

  const body = Buffer.from(`${JSON.stringify(data, null, 2)}\n`, "utf8");
  const { error } = await supabaseAdmin.storage
    .from(SUPABASE_RUNTIME_BUCKET)
    .upload(storageKey, body, {
      contentType: "application/json; charset=utf-8",
      upsert: true
    });

  if (error) {
    throw error;
  }
}

async function loadRuntimeJson({
  label,
  storageKey,
  localPath,
  defaults,
  normalize
}) {
  if (supabaseAdmin) {
    try {
      const remote = await readSupabaseRuntimeJson(storageKey, label);

      if (remote.found) {
        return normalize(remote.data);
      }
    } catch (error) {
      console.warn(`${label} Supabase read failed`, error.message);
    }
  }

  const local = await readLocalRuntimeJson(localPath, label);

  if (local.found) {
    const normalized = normalize(local.data);

    if (supabaseAdmin) {
      try {
        await writeSupabaseRuntimeJson(storageKey, normalized);
      } catch (error) {
        console.warn(`${label} Supabase migration failed`, error.message);
      }
    }

    return normalized;
  }

  return normalize(cloneRuntimeDefault(defaults));
}

async function persistRuntimeJson({
  label,
  storageKey,
  localPath,
  data,
  normalize
}) {
  const normalized = normalize(data);

  if (supabaseAdmin) {
    await writeSupabaseRuntimeJson(storageKey, normalized);

    writeLocalRuntimeJson(localPath, normalized).catch((error) => {
      console.warn(`${label} local mirror write failed`, error.message);
    });

    return normalized;
  }

  await writeLocalRuntimeJson(localPath, normalized);
  return normalized;
}

function normalizeGoldDragonPlayerIds(value) {
  const ids = Array.isArray(value) ? value : [];
  const normalized = ids
    .map((id) => String(id || "").trim())
    .filter(Boolean);

  return Array.from(new Set(normalized));
}

function normalizeDisplaySettings(value = {}) {
  return {
    goldDragonPlayerIds: normalizeGoldDragonPlayerIds(
      value.goldDragonPlayerIds
    )
  };
}

async function loadDisplaySettings() {
  if (displaySettingsCache.loaded) {
    return displaySettingsCache.settings;
  }

  displaySettingsCache.settings = await loadRuntimeJson({
    label: "Display settings",
    storageKey: RUNTIME_STORAGE_KEYS.displaySettings,
    localPath: DISPLAY_SETTINGS_PATH,
    defaults: DEFAULT_DISPLAY_SETTINGS,
    normalize: normalizeDisplaySettings
  });

  displaySettingsCache.loaded = true;
  return displaySettingsCache.settings;
}

async function persistDisplaySettings(settings) {
  const normalized = await persistRuntimeJson({
    label: "Display settings",
    storageKey: RUNTIME_STORAGE_KEYS.displaySettings,
    localPath: DISPLAY_SETTINGS_PATH,
    data: settings,
    normalize: normalizeDisplaySettings
  });

  displaySettingsCache.loaded = true;
  displaySettingsCache.settings = normalized;

  return normalized;
}

function normalizeTextValue(value, maxLength = 120) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function normalizeIsoDate(value) {
  const time = Date.parse(value || "");
  return Number.isFinite(time) ? new Date(time).toISOString() : new Date().toISOString();
}

function normalizeBindingStatus(value) {
  return ["pending", "approved", "rejected"].includes(value) ? value : "pending";
}

function normalizePlayerGroup(value, fallback = "") {
  const text = normalizeTextValue(value, 24).replace(/\s+/g, "");

  if (/^LT组?$/i.test(text)) {
    return "LT组";
  }

  if (/^LH组?$/i.test(text)) {
    return "LH组";
  }

  if (text === "未分类" || /^unclassified$/i.test(text) || /^none$/i.test(text)) {
    return "未分类";
  }

  return fallback;
}

function normalizePlayerScore(value) {
  const score = Number(value);
  return Number.isFinite(score) ? score : null;
}

function normalizeBindingRequest(value = {}) {
  const id = normalizeTextValue(value.id, 96);
  const userId = normalizeTextValue(value.userId, 128);
  const playerId = normalizeTextValue(value.playerId, 80);

  if (!id || !userId || !playerId) {
    return null;
  }

  return {
    id,
    userId,
    email: normalizeTextValue(value.email, 180),
    nickname: normalizeTextValue(value.nickname, 48),
    playerId,
    playerNickname: normalizeTextValue(value.playerNickname, 80),
    playerScore: normalizePlayerScore(value.playerScore),
    playerNumber: normalizeTextValue(value.playerNumber, 80),
    playerGroup: normalizePlayerGroup(value.playerGroup),
    status: normalizeBindingStatus(value.status),
    createdAt: normalizeIsoDate(value.createdAt),
    updatedAt: normalizeIsoDate(value.updatedAt)
  };
}

function normalizeBindingRecord(value = {}) {
  const userId = normalizeTextValue(value.userId, 128);
  const playerId = normalizeTextValue(value.playerId, 80);

  if (!userId || !playerId) {
    return null;
  }

  return {
    userId,
    email: normalizeTextValue(value.email, 180),
    nickname: normalizeTextValue(value.nickname, 48),
    playerId,
    playerNickname: normalizeTextValue(value.playerNickname, 80),
    playerScore: normalizePlayerScore(value.playerScore),
    playerNumber: normalizeTextValue(value.playerNumber, 80),
    playerGroup: normalizePlayerGroup(value.playerGroup),
    requestId: normalizeTextValue(value.requestId, 96),
    approvedAt: normalizeIsoDate(value.approvedAt)
  };
}

function normalizeUserBindings(value = {}) {
  const requests = Array.isArray(value.requests)
    ? value.requests.map(normalizeBindingRequest).filter(Boolean)
    : [];
  const bindings = {};
  const playerGroups = {};

  if (value.bindings && typeof value.bindings === "object") {
    Object.entries(value.bindings).forEach(([key, binding]) => {
      const normalized = normalizeBindingRecord({
        ...binding,
        userId: binding?.userId || key
      });

      if (normalized) {
        bindings[normalized.userId] = normalized;
      }
    });
  }

  if (value.playerGroups && typeof value.playerGroups === "object") {
    Object.entries(value.playerGroups).forEach(([key, group]) => {
      const userId = normalizeTextValue(key, 128);
      const playerGroup = normalizePlayerGroup(group);

      if (userId && playerGroup) {
        playerGroups[userId] = playerGroup;
      }
    });
  }

  return {
    requests,
    bindings,
    playerGroups
  };
}

async function loadUserBindings() {
  if (userBindingsCache.loaded) {
    return userBindingsCache.data;
  }

  userBindingsCache.data = await loadRuntimeJson({
    label: "User bindings",
    storageKey: RUNTIME_STORAGE_KEYS.userBindings,
    localPath: USER_BINDINGS_PATH,
    defaults: DEFAULT_USER_BINDINGS,
    normalize: normalizeUserBindings
  });

  userBindingsCache.loaded = true;
  return userBindingsCache.data;
}

async function persistUserBindings(data) {
  const normalized = await persistRuntimeJson({
    label: "User bindings",
    storageKey: RUNTIME_STORAGE_KEYS.userBindings,
    localPath: USER_BINDINGS_PATH,
    data,
    normalize: normalizeUserBindings
  });

  userBindingsCache.loaded = true;
  userBindingsCache.data = normalized;

  return normalized;
}

function getBearerToken(req) {
  const authorization = String(req.headers.authorization || "");
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

function getAuthUserNickname(user) {
  return (
    normalizeTextValue(user?.user_metadata?.nickname, 48) ||
    normalizeTextValue(user?.user_metadata?.Nickname, 48) ||
    normalizeTextValue(user?.email?.split("@")[0], 48) ||
    "未设置"
  );
}

async function requireUser(req, res, next) {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({
        message: "请先登录账号"
      });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        message: "登录状态已失效"
      });
    }

    req.authUser = data.user;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "登录状态校验失败"
    });
  }
}

async function optionalUser(req, res, next) {
  try {
    const token = getBearerToken(req);

    if (!token) {
      req.authUser = null;
      return next();
    }

    const { data, error } = await supabase.auth.getUser(token);
    req.authUser = error ? null : data?.user || null;
    return next();
  } catch (error) {
    req.authUser = null;
    return next();
  }
}

async function getPlayersForBinding() {
  await loadInitialPlayersSnapshot();

  if (playersCache.players.length > 0) {
    return playersCache.players;
  }

  try {
    return await withTimeout(
      refreshPlayersCache(),
      PLAYERS_REFRESH_TIMEOUT_MS,
      "Players refresh timed out"
    );
  } catch (error) {
    console.warn("Players binding lookup failed", error.message);
    return playersCache.players;
  }
}

async function findPlayerForBinding(playerId) {
  const normalizedPlayerId = normalizeTextValue(playerId, 80);
  const players = await getPlayersForBinding();

  return players.find((player) => String(player.id) === normalizedPlayerId);
}

function createPlayerBindingSnapshot(player) {
  return {
    playerId: String(player.id),
    playerNickname: normalizeTextValue(player.nickname, 80),
    playerScore: normalizePlayerScore(player.score),
    playerNumber: normalizeTextValue(player.number, 80)
  };
}

function getLatestPendingBindingRequest(data, userId) {
  return (
    data.requests
      .filter((request) => request.userId === userId && request.status === "pending")
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0] ||
    null
  );
}

function createBindingFromRequest(request, approvedAt) {
  return {
    userId: request.userId,
    email: request.email,
    nickname: request.nickname,
    playerId: request.playerId,
    playerNickname: request.playerNickname,
    playerScore: request.playerScore,
    playerNumber: request.playerNumber,
    playerGroup: normalizePlayerGroup(request.playerGroup),
    requestId: request.id,
    approvedAt
  };
}

function createManualBinding(account, player, approvedAt) {
  const playerSnapshot = createPlayerBindingSnapshot(player);

  return {
    userId: account.userId,
    email: normalizeTextValue(account.email, 180),
    nickname: normalizeTextValue(account.nickname, 48),
    ...playerSnapshot,
    playerGroup: normalizePlayerGroup(account.playerGroup),
    requestId: `manual:${crypto.randomUUID()}`,
    approvedAt
  };
}

async function syncScheduleParticipantsForBinding(binding) {
  if (!binding?.userId) {
    return;
  }

  const data = await loadScheduleDataWithAutoBp();
  let changed = false;
  const applyBinding = (value) => {
    if (!value || value.userId !== binding.userId) {
      return value;
    }

    const next = {
      ...value,
      email: binding.email || value.email,
      nickname: binding.nickname || value.nickname,
      playerId: binding.playerId,
      playerNickname: binding.playerNickname,
      playerNumber: binding.playerNumber,
      playerGroup: binding.playerGroup || value.playerGroup || ""
    };

    if (JSON.stringify(next) !== JSON.stringify(value)) {
      changed = true;
    }

    return next;
  };

  data.matches.forEach((match) => {
    match.participants = match.participants.map(applyBinding);
    match.result.entries = match.result.entries.map(applyBinding);
  });

  if (changed) {
    await persistScheduleData(data);
  }
}

async function syncScheduleParticipantsForAccountGroup(userId, playerGroup) {
  const normalizedUserId = normalizeTextValue(userId, 128);
  const normalizedGroup = normalizePlayerGroup(playerGroup);

  if (!normalizedUserId || !normalizedGroup) {
    return;
  }

  const data = await loadScheduleDataWithAutoBp();
  let changed = false;
  const applyGroup = (value) => {
    if (!value || value.userId !== normalizedUserId) {
      return value;
    }

    const next = {
      ...value,
      playerGroup: normalizedGroup
    };

    if (JSON.stringify(next) !== JSON.stringify(value)) {
      changed = true;
    }

    return next;
  };

  data.matches.forEach((match) => {
    match.participants = match.participants.map(applyGroup);
    match.result.entries = match.result.entries.map(applyGroup);
  });

  if (changed) {
    await persistScheduleData(data);
  }
}

function normalizeSongCommentOwner(value = {}) {
  const commentId = normalizeTextValue(value.commentId, 80);
  const userId = normalizeTextValue(value.userId, 128);

  if (!commentId || !userId) {
    return null;
  }

  return {
    commentId,
    userId,
    email: normalizeTextValue(value.email, 180),
    nickname: normalizeTextValue(value.nickname, 48),
    trackId: normalizeTextValue(value.trackId, 80),
    trackTitle: normalizeTextValue(value.trackTitle, 140),
    stage: normalizeTextValue(value.stage, 24),
    content: normalizeTextValue(value.content, 160),
    createdAt: normalizeIsoDate(value.createdAt)
  };
}

function normalizeNotification(value = {}) {
  const id = normalizeTextValue(value.id, 96);
  const userId = normalizeTextValue(value.userId, 128);

  if (!id || !userId) {
    return null;
  }

  return {
    id,
    userId,
    type: normalizeTextValue(value.type, 48) || "message",
    title: normalizeTextValue(value.title, 80),
    message: normalizeTextValue(value.message, 240),
    trackId: normalizeTextValue(value.trackId, 80),
    trackTitle: normalizeTextValue(value.trackTitle, 140),
    stage: normalizeTextValue(value.stage, 24),
    commentId: normalizeTextValue(value.commentId, 80),
    replyCommentId: normalizeTextValue(value.replyCommentId, 80),
    replyNickname: normalizeTextValue(value.replyNickname, 48),
    read: Boolean(value.read),
    createdAt: normalizeIsoDate(value.createdAt),
    readAt: value.readAt ? normalizeIsoDate(value.readAt) : null
  };
}

function normalizeUserMessages(value = {}) {
  const songCommentOwners = {};

  if (value.songCommentOwners && typeof value.songCommentOwners === "object") {
    Object.entries(value.songCommentOwners).forEach(([key, owner]) => {
      const normalized = normalizeSongCommentOwner({
        ...owner,
        commentId: owner?.commentId || key
      });

      if (normalized) {
        songCommentOwners[normalized.commentId] = normalized;
      }
    });
  }

  const notifications = Array.isArray(value.notifications)
    ? value.notifications.map(normalizeNotification).filter(Boolean)
    : [];

  return {
    songCommentOwners,
    notifications
  };
}

async function loadUserMessages() {
  if (userMessagesCache.loaded) {
    return userMessagesCache.data;
  }

  userMessagesCache.data = await loadRuntimeJson({
    label: "User messages",
    storageKey: RUNTIME_STORAGE_KEYS.userMessages,
    localPath: USER_MESSAGES_PATH,
    defaults: DEFAULT_USER_MESSAGES,
    normalize: normalizeUserMessages
  });

  userMessagesCache.loaded = true;
  return userMessagesCache.data;
}

async function persistUserMessages(data) {
  const normalized = await persistRuntimeJson({
    label: "User messages",
    storageKey: RUNTIME_STORAGE_KEYS.userMessages,
    localPath: USER_MESSAGES_PATH,
    data,
    normalize: normalizeUserMessages
  });

  userMessagesCache.loaded = true;
  userMessagesCache.data = normalized;

  return normalized;
}

function normalizeOptionalIsoDate(value) {
  const time = Date.parse(value || "");
  return Number.isFinite(time) ? new Date(time).toISOString() : "";
}

function normalizeScheduleStatus(value) {
  return ["scheduled", "bp", "live", "finished"].includes(value)
    ? value
    : "scheduled";
}

function normalizeScheduleVisibility(value) {
  return value === "public" ? "public" : "assigned";
}

function normalizeSchedulePoolMode(value) {
  return ["round16", "top8", "custom"].includes(value) ? value : "round16";
}

function normalizeBpCategoryText(value, maxLength = 60) {
  return normalizeTextValue(value, maxLength).replace(/\s+/g, " ");
}

function inferBpCategory(value = {}) {
  const text = [
    value.bpDivision,
    value.bpStage,
    value.bpGroup,
    typeof value.bpCategory === "string" ? value.bpCategory : "",
    value.title,
    value.content
  ]
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .join(" ");
  const normalizedText = text.replace(/\s+/g, " ");
  const divisionMatch = normalizedText.match(/\b(LT|LH)\s*组\b/i);
  const stageMatch = normalizedText.match(
    /(\d+\s*(?:-|进)\s*\d+\s*[（(][一二三四五六七八九十\d]+[）)])/
  );
  const groupMatch = normalizedText.match(
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

function normalizeBpCategory(value = {}) {
  if (typeof value === "string") {
    return {
      division: normalizeBpCategoryText(value, 40),
      stage: "",
      group: ""
    };
  }

  const source = value && typeof value === "object" ? value : {};

  return {
    division: normalizeBpCategoryText(
      source.division || source.type || source.main || source.primary,
      40
    ),
    stage: normalizeBpCategoryText(
      source.stage || source.round || source.phase || source.secondary,
      60
    ),
    group: normalizeBpCategoryText(
      source.group || source.subgroup || source.bracket || source.tertiary,
      60
    )
  };
}

function normalizeScheduleBpCategory(value = {}) {
  const explicit = normalizeBpCategory(value.bpCategory);
  const legacy = normalizeBpCategory({
    division: value.bpDivision || value.bpCategoryDivision,
    stage: value.bpStage || value.bpCategoryStage,
    group: value.bpGroup || value.bpCategoryGroup
  });
  const inferred = inferBpCategory(value);
  const stage = explicit.stage || legacy.stage || inferred.stage;
  const group = explicit.group || legacy.group || inferred.group;

  return {
    division:
      explicit.division ||
      legacy.division ||
      inferred.division ||
      (stage || group ? "LT组" : ""),
    stage,
    group
  };
}

function normalizeParticipantCount(value, fallback = 2) {
  const count = Number(value);

  if (!Number.isInteger(count)) {
    return Math.max(1, Math.min(8, fallback || 2));
  }

  return Math.max(1, Math.min(8, count));
}

function normalizeRandomPickEnabled(value) {
  if (value === false || value === "false" || value === "0" || value === 0) {
    return false;
  }

  return true;
}

function normalizeRandomPickCount(value, fallback = 1) {
  const count = Number(value);
  const fallbackCount = Number(fallback);
  const safeFallback = Number.isFinite(fallbackCount) ? fallbackCount : 1;

  if (!Number.isFinite(count)) {
    return Math.max(1, Math.min(8, Math.round(safeFallback)));
  }

  return Math.max(1, Math.min(8, Math.round(count)));
}

function normalizeDifficulty(value) {
  const difficulty = String(value || "").trim().toUpperCase();

  return ["EZ", "HD", "IN", "AT"].includes(difficulty) ? difficulty : "";
}

function normalizeDifficultyList(value) {
  const raw = Array.isArray(value)
    ? value
    : String(value || "")
        .split(/[,\s/]+/)
        .filter(Boolean);
  const difficulties = raw.map(normalizeDifficulty).filter(Boolean);

  return Array.from(new Set(difficulties));
}

function normalizeTrackIdList(value) {
  const ids = Array.isArray(value)
    ? value
    : String(value || "")
        .split(/[,\s]+/)
        .filter(Boolean);

  return Array.from(
    new Set(
      ids
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0)
    )
  );
}

function normalizeScheduleParticipant(value = {}) {
  const userId = normalizeTextValue(value.userId, 128);

  if (!userId) {
    return null;
  }

  return {
    userId,
    email: normalizeTextValue(value.email, 180),
    nickname: normalizeTextValue(value.nickname, 48),
    playerId: normalizeTextValue(value.playerId, 80),
    playerNickname: normalizeTextValue(value.playerNickname, 80),
    playerNumber: normalizeTextValue(value.playerNumber, 80),
    playerGroup: normalizePlayerGroup(value.playerGroup),
    slotLabel: normalizeTextValue(value.slotLabel, 40)
  };
}

function normalizeScheduleParticipants(value) {
  const participants = Array.isArray(value)
    ? value.map(normalizeScheduleParticipant).filter(Boolean)
    : [];
  const seen = new Set();

  return participants.filter((participant) => {
    if (seen.has(participant.userId)) {
      return false;
    }

    seen.add(participant.userId);
    return true;
  });
}

function normalizePlayerConfirmation(value = {}, participants = []) {
  const source = value && typeof value === "object" ? value : {};
  const enabled = source.enabled === true;
  const participantIds = new Set(participants.map((participant) => participant.userId));
  const confirmedBy = Array.from(
    new Set(
      (Array.isArray(source.confirmedBy) ? source.confirmedBy : [])
        .map((userId) => normalizeTextValue(userId, 128))
        .filter((userId) => participantIds.has(userId))
    )
  );

  return {
    enabled,
    confirmedBy: enabled ? confirmedBy : []
  };
}

function normalizeBpSelection(value = {}, fallbackType = "ban") {
  const userId = normalizeTextValue(value.userId, 128);
  const trackId = Number(value.trackId);
  const difficulty = normalizeDifficulty(value.difficulty);

  if (
    !userId ||
    !Number.isInteger(trackId) ||
    trackId <= 0 ||
    !difficulty
  ) {
    return null;
  }

  return {
    id: normalizeTextValue(value.id, 96) || crypto.randomUUID(),
    type: value.type === "pick" || value.type === "random" ? value.type : fallbackType,
    userId,
    nickname: normalizeTextValue(value.nickname, 48),
    trackId,
    title: normalizeTextValue(value.title, 140),
    artist: normalizeTextValue(value.artist, 140),
    pack: normalizeTextValue(value.pack, 120),
    difficulty,
    createdAt: normalizeIsoDate(value.createdAt)
  };
}

function normalizeBpPresence(value = {}) {
  const presence = {};

  if (!value || typeof value !== "object") {
    return presence;
  }

  Object.entries(value).forEach(([key, item]) => {
    const userId = normalizeTextValue(item?.userId || key, 128);

    if (!userId) {
      return;
    }

    presence[userId] = {
      userId,
      nickname: normalizeTextValue(item?.nickname, 48),
      action: item?.action === "pick" ? "pick" : "ban",
      updatedAt: normalizeIsoDate(item?.updatedAt)
    };
  });

  return presence;
}

function normalizeBpState(value = {}) {
  const legacyRandomPick = value.randomPick
    ? normalizeBpSelection(
        {
          ...value.randomPick,
          userId: value.randomPick.userId || "system",
          type: "random"
        },
        "random"
      )
    : null;
  const randomPicks = Array.isArray(value.randomPicks)
    ? value.randomPicks
        .map((item) =>
          normalizeBpSelection(
            {
              ...item,
              userId: item?.userId || "system",
              type: "random"
            },
            "random"
          )
        )
        .filter(Boolean)
    : legacyRandomPick
      ? [legacyRandomPick]
      : [];

  return {
    bans: Array.isArray(value.bans)
      ? value.bans.map((item) => normalizeBpSelection(item, "ban")).filter(Boolean)
      : [],
    picks: Array.isArray(value.picks)
      ? value.picks.map((item) => normalizeBpSelection(item, "pick")).filter(Boolean)
      : [],
    randomPick: randomPicks[0] || null,
    randomPicks,
    confirmedBy: Array.from(
      new Set(
        (Array.isArray(value.confirmedBy) ? value.confirmedBy : [])
          .map((id) => normalizeTextValue(id, 128))
          .filter(Boolean)
      )
    ),
    presence: normalizeBpPresence(value.presence)
  };
}

function normalizeResultOutcome(value) {
  return ["win", "loss", "draw", "pending"].includes(value) ? value : "pending";
}

function normalizeScheduleResultEntry(value = {}) {
  const userId = normalizeTextValue(value.userId, 128);

  if (!userId) {
    return null;
  }

  const scoreText = normalizeTextValue(value.score, 40);

  return {
    userId,
    nickname: normalizeTextValue(value.nickname, 48),
    playerNickname: normalizeTextValue(value.playerNickname, 80),
    playerGroup: normalizePlayerGroup(value.playerGroup),
    score: scoreText,
    outcome: normalizeResultOutcome(value.outcome),
    note: normalizeTextValue(value.note, 160)
  };
}

function normalizeScheduleResult(value = {}) {
  const entries = Array.isArray(value.entries)
    ? value.entries.map(normalizeScheduleResultEntry).filter(Boolean)
    : [];

  return {
    summary: normalizeTextValue(value.summary, 240),
    entries,
    updatedAt: normalizeOptionalIsoDate(value.updatedAt)
  };
}

function normalizeScheduleMatch(value = {}, options = {}) {
  const now = options.now || new Date().toISOString();
  const participants = normalizeScheduleParticipants(value.participants);
  const participantCount = normalizeParticipantCount(
    value.participantCount,
    participants.length || 2
  );
  const poolMode = normalizeSchedulePoolMode(value.poolMode);
  const randomPickEnabled = normalizeRandomPickEnabled(value.randomPickEnabled);
  const randomPickCount = randomPickEnabled
    ? normalizeRandomPickCount(value.randomPickCount, 1)
    : 0;
  const bp = normalizeBpState(value.bp);
  const playerConfirmation = normalizePlayerConfirmation(
    {
      ...(value.playerConfirmation || {}),
      enabled:
        value.playerConfirmationEnabled === undefined
          ? value.playerConfirmation?.enabled
          : value.playerConfirmationEnabled === true
    },
    participants
  );

  if (!randomPickEnabled) {
    bp.randomPicks = [];
  } else if (bp.randomPicks.length > randomPickCount) {
    bp.randomPicks = bp.randomPicks.slice(0, randomPickCount);
  }

  bp.randomPick = bp.randomPicks[0] || null;

  return {
    id: normalizeTextValue(value.id, 96) || crypto.randomUUID(),
    title: normalizeTextValue(value.title, 120) || "未命名比赛",
    startsAt: normalizeOptionalIsoDate(value.startsAt),
    bpStartsAt: normalizeOptionalIsoDate(value.bpStartsAt),
    content: normalizeTextValue(value.content, 500),
    status: normalizeScheduleStatus(value.status),
    visibility: normalizeScheduleVisibility(value.visibility),
    bpCategory: normalizeScheduleBpCategory(value),
    participantCount,
    poolMode,
    randomPickEnabled,
    randomPickCount,
    customTrackIds: normalizeTrackIdList(value.customTrackIds),
    customDifficulties: normalizeDifficultyList(value.customDifficulties),
    participants,
    playerConfirmation,
    result: normalizeScheduleResult(value.result),
    bp,
    createdAt: normalizeOptionalIsoDate(value.createdAt) || now,
    updatedAt: options.touch ? now : normalizeOptionalIsoDate(value.updatedAt) || now
  };
}

function normalizeScheduleData(value = {}) {
  const matches = Array.isArray(value.matches)
    ? value.matches.map(normalizeScheduleMatch).filter(Boolean)
    : [];

  return {
    matches: matches.sort((a, b) => {
      const aTime = Date.parse(a.startsAt || "") || Number.MAX_SAFE_INTEGER;
      const bTime = Date.parse(b.startsAt || "") || Number.MAX_SAFE_INTEGER;

      return aTime - bTime || Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
    })
  };
}

async function loadScheduleData() {
  if (scheduleCache.loaded) {
    return scheduleCache.data;
  }

  scheduleCache.data = await loadRuntimeJson({
    label: "Schedule data",
    storageKey: RUNTIME_STORAGE_KEYS.schedule,
    localPath: SCHEDULE_DATA_PATH,
    defaults: DEFAULT_SCHEDULE_DATA,
    normalize: normalizeScheduleData
  });

  scheduleCache.loaded = true;
  return scheduleCache.data;
}

async function persistScheduleData(data) {
  const normalized = await persistRuntimeJson({
    label: "Schedule data",
    storageKey: RUNTIME_STORAGE_KEYS.schedule,
    localPath: SCHEDULE_DATA_PATH,
    data,
    normalize: normalizeScheduleData
  });

  scheduleCache.loaded = true;
  scheduleCache.data = normalized;

  return normalized;
}

function applyScheduleAutoBp(data, now = new Date()) {
  if (!data?.matches?.length) {
    return false;
  }

  const nowTime = now.getTime();
  const nowIso = now.toISOString();
  let changed = false;

  data.matches.forEach((match) => {
    const bpTime = Date.parse(match.bpStartsAt || "");

    const playerConfirmation = getPlayerConfirmationProgress(match);

    if (
      match.status === "bp" &&
      Number.isFinite(bpTime) &&
      bpTime > nowTime
    ) {
      match.status = "scheduled";
      match.updatedAt = nowIso;
      changed = true;
      return;
    }

    if (
      match.status === "scheduled" &&
      Number.isFinite(bpTime) &&
      bpTime <= nowTime &&
      playerConfirmation.allConfirmed
    ) {
      match.status = "bp";
      match.updatedAt = nowIso;
      changed = true;
    }
  });

  return changed;
}

async function loadScheduleDataWithAutoBp() {
  const data = await loadScheduleData();

  if (applyScheduleAutoBp(data)) {
    return persistScheduleData(data);
  }

  return data;
}

async function loadSongPoolData() {
  const stats = await fs.stat(SONG_POOL_DATA_PATH);

  if (!songPoolDataPromise || songPoolDataMtimeMs !== stats.mtimeMs) {
    songPoolDataMtimeMs = stats.mtimeMs;
    songPoolDataPromise = (async () => {
      const raw = await fs.readFile(SONG_POOL_DATA_PATH, "utf8");
      const context = {
        window: {}
      };

      vm.runInNewContext(raw, context, {
        filename: SONG_POOL_DATA_PATH
      });

      if (!context.window.PLC_SONG_POOL_DATA?.tracks) {
        throw new Error("Song pool data is not available");
      }

      return context.window.PLC_SONG_POOL_DATA;
    })().catch((error) => {
      songPoolDataPromise = null;
      songPoolDataMtimeMs = 0;
      throw error;
    });
  }

  return songPoolDataPromise;
}

function splitTrackDifficulties(value) {
  return normalizeDifficultyList(value);
}

function trackIsRemoved(track) {
  const note = String(track?.note || "");

  return note.includes("移除") && !note.includes("常驻") && !note.includes("再收录");
}

function getTrackDifficultyChoices(track, match) {
  if (match.poolMode !== "custom") {
    return splitTrackDifficulties(track?.stages?.[match.poolMode]);
  }

  const stageChoices = [
    ...splitTrackDifficulties(track?.stages?.round16),
    ...splitTrackDifficulties(track?.stages?.top8)
  ];
  const uniqueStageChoices = Array.from(new Set(stageChoices));

  if (match.customDifficulties.length === 0) {
    return uniqueStageChoices;
  }

  return uniqueStageChoices.filter((difficulty) =>
    match.customDifficulties.includes(difficulty)
  );
}

async function getMatchPoolTracks(match) {
  const data = await loadSongPoolData();
  const customIds = new Set(match.customTrackIds);

  return data.tracks
    .filter((track) => {
      if (trackIsRemoved(track)) {
        return false;
      }

      if (match.poolMode === "custom") {
        return customIds.has(Number(track.id));
      }

      return Boolean(track?.stages?.[match.poolMode]);
    })
    .map((track) => ({
      trackId: Number(track.id),
      title: normalizeTextValue(track.title, 140),
      artist: normalizeTextValue(track.artist, 140),
      pack: normalizeTextValue(track.pack, 120),
      difficulties: getTrackDifficultyChoices(track, match)
    }))
    .filter((track) => track.trackId && track.difficulties.length > 0);
}

function highestDifficulty(difficulties) {
  const order = ["EZ", "HD", "IN", "AT"];
  const normalized = normalizeDifficultyList(difficulties);

  return normalized.sort((a, b) => order.indexOf(b) - order.indexOf(a))[0] || "";
}

function highestInAtDifficulty(difficulties) {
  const normalized = normalizeDifficultyList(difficulties);

  if (normalized.includes("AT")) {
    return "AT";
  }

  return normalized.includes("IN") ? "IN" : "";
}

async function resolveBpSelection(match, body = {}) {
  const trackId = Number(body.trackId);
  const difficulty = normalizeDifficulty(body.difficulty);

  if (!Number.isInteger(trackId) || trackId <= 0 || !difficulty) {
    return {
      error: "请选择曲目和难度"
    };
  }

  const poolTracks = await getMatchPoolTracks(match);
  const track = poolTracks.find((item) => item.trackId === trackId);

  if (!track) {
    return {
      error: "这首曲目不在本场比赛选曲范围内"
    };
  }

  if (!track.difficulties.includes(difficulty)) {
    return {
      error: "该曲目不支持这个难度"
    };
  }

  return {
    track,
    difficulty
  };
}

function getMatchParticipant(match, userId) {
  return match.participants.find((participant) => participant.userId === userId) || null;
}

function getPlayerConfirmationProgress(match, viewerUserId = "") {
  const confirmation = normalizePlayerConfirmation(
    match?.playerConfirmation,
    match?.participants || []
  );
  const participantIds = (match?.participants || []).map((participant) => participant.userId);
  const allConfirmed =
    !confirmation.enabled ||
    (participantIds.length > 0 &&
      participantIds.every((userId) => confirmation.confirmedBy.includes(userId)));

  return {
    enabled: confirmation.enabled,
    confirmedBy: confirmation.confirmedBy,
    confirmedCount: confirmation.confirmedBy.length,
    total: participantIds.length,
    allConfirmed,
    viewerConfirmed: Boolean(viewerUserId && confirmation.confirmedBy.includes(viewerUserId))
  };
}

function getParticipantDisplayName(participant, fallback = "选手") {
  return (
    participant?.playerNickname ||
    participant?.nickname ||
    participant?.email?.split("@")[0] ||
    fallback
  );
}

function createBpSelectionKey(trackId, difficulty) {
  const normalizedTrackId = Number(trackId);
  const normalizedDifficulty = normalizeDifficulty(difficulty);

  if (
    !Number.isInteger(normalizedTrackId) ||
    normalizedTrackId <= 0 ||
    !normalizedDifficulty
  ) {
    return "";
  }

  return `${normalizedTrackId}:${normalizedDifficulty}`;
}

function getBpSelectionKey(selection) {
  return createBpSelectionKey(selection?.trackId, selection?.difficulty);
}

function getFreshPresence(bp) {
  const now = Date.now();
  const fresh = {};

  Object.entries(bp.presence || {}).forEach(([userId, item]) => {
    const updatedAt = Date.parse(item.updatedAt || "");

    if (Number.isFinite(updatedAt) && now - updatedAt <= SCHEDULE_PRESENCE_TIMEOUT_MS) {
      fresh[userId] = item;
    }
  });

  return fresh;
}

function getBpProgress(match) {
  const participantIds = match.participants.map((participant) => participant.userId);
  const banCount = 2;
  const pickCount = 1;
  const randomPickCount = match.randomPickEnabled === false ? 0 : match.randomPickCount || 1;
  const randomPicks = Array.isArray(match.bp.randomPicks)
    ? match.bp.randomPicks
    : match.bp.randomPick
      ? [match.bp.randomPick]
      : [];
  const countForUser = (items, userId) =>
    items.filter((item) => item.userId === userId).length;
  const allBansDone =
    participantIds.length > 0 &&
    participantIds.every((userId) => countForUser(match.bp.bans, userId) >= banCount);
  const allPicksDone =
    participantIds.length > 0 &&
    participantIds.every((userId) => countForUser(match.bp.picks, userId) >= pickCount);
  const randomPicksDone = randomPicks.length >= randomPickCount;
  const allConfirmed =
    participantIds.length > 0 &&
    participantIds.every((userId) => match.bp.confirmedBy.includes(userId));
  const phase = !participantIds.length
    ? "waiting"
    : !allBansDone
      ? "ban"
      : !allPicksDone
        ? "pick"
        : allConfirmed
          ? "summary"
          : "confirm";

  return {
    phase,
    banCount,
    pickCount,
    randomPickCount,
    requiredBans: participantIds.length * banCount,
    requiredPicks: participantIds.length * pickCount,
    requiredRandomPicks: randomPickCount,
    allBansDone,
    allPicksDone,
    randomPicksDone,
    allConfirmed
  };
}

function isMatchBpOpen(match, now = new Date()) {
  if (match?.status !== "bp") {
    return false;
  }

  const bpTime = Date.parse(match.bpStartsAt || "");
  const playerConfirmation = getPlayerConfirmationProgress(match);

  return (
    playerConfirmation.allConfirmed &&
    (!Number.isFinite(bpTime) || bpTime <= now.getTime())
  );
}

function getMatchBpClosedMessage(match) {
  const bpTime = Date.parse(match?.bpStartsAt || "");

  if (Number.isFinite(bpTime) && bpTime > Date.now()) {
    return `BP 将于 ${new Date(bpTime).toLocaleString("zh-CN")} 开放`;
  }

  const playerConfirmation = getPlayerConfirmationProgress(match);

  if (playerConfirmation.enabled && !playerConfirmation.allConfirmed) {
    return "尚未完成全部选手确认，暂不能 BP";
  }

  if (match?.status === "scheduled") {
    return "比赛尚未开始，暂不能 BP";
  }

  if (match?.status === "finished") {
    return "比赛已结束，不能继续 BP";
  }

  return "当前比赛状态不能进行 BP";
}

async function ensureRandomBpPicks(match) {
  const targetCount = match.randomPickEnabled === false ? 0 : match.randomPickCount || 1;

  if (targetCount <= 0) {
    match.bp.randomPicks = [];
    match.bp.randomPick = null;
    return;
  }

  const progress = getBpProgress(match);

  if (!progress.allPicksDone) {
    return;
  }

  match.bp.randomPicks = Array.isArray(match.bp.randomPicks)
    ? match.bp.randomPicks
    : match.bp.randomPick
      ? [match.bp.randomPick]
      : [];

  if (match.bp.randomPicks.length >= targetCount) {
    match.bp.randomPicks = match.bp.randomPicks.slice(0, targetCount);
    match.bp.randomPick = match.bp.randomPicks[0] || null;
    return;
  }

  const usedSelectionKeys = new Set(
    [...match.bp.bans, ...match.bp.picks, ...match.bp.randomPicks]
      .map(getBpSelectionKey)
      .filter(Boolean)
  );
  const poolTracks = await getMatchPoolTracks(match);

  while (match.bp.randomPicks.length < targetCount) {
    const createCandidates = (inAtOnly) =>
      poolTracks.flatMap((track) =>
        track.difficulties
          .filter((difficulty) => {
            if (inAtOnly && difficulty !== "IN" && difficulty !== "AT") {
              return false;
            }

            return !usedSelectionKeys.has(
              createBpSelectionKey(track.trackId, difficulty)
            );
          })
          .map((difficulty) => ({
            track,
            difficulty
          }))
      );
    const inAtCandidates = createCandidates(true);
    const fallbackCandidates = createCandidates(false);
    const candidates = inAtCandidates.length ? inAtCandidates : fallbackCandidates;

    if (!candidates.length) {
      break;
    }

    const candidate = candidates[crypto.randomInt(candidates.length)];
    const { track, difficulty } = candidate;

    if (!difficulty) {
      break;
    }

    usedSelectionKeys.add(createBpSelectionKey(track.trackId, difficulty));
    match.bp.randomPicks.push({
      id: crypto.randomUUID(),
      type: "random",
      userId: "system",
      nickname: `系统抽取${match.bp.randomPicks.length + 1}`,
      trackId: track.trackId,
      title: track.title,
      artist: track.artist,
      pack: track.pack,
      difficulty,
      createdAt: new Date().toISOString()
    });
  }

  match.bp.randomPick = match.bp.randomPicks[0] || null;
}

function canUserViewMatch(match, user) {
  if (match.visibility === "public") {
    return true;
  }

  return Boolean(user?.id && getMatchParticipant(match, user.id));
}

function serializeParticipant(participant, options = {}) {
  return {
    userId:
      options.admin || options.viewerUserId === participant.userId
        ? participant.userId
        : "",
    email: options.admin ? participant.email : "",
    nickname: participant.nickname,
    playerId: participant.playerId,
    playerNickname: participant.playerNickname,
    playerNumber: participant.playerNumber,
    playerGroup: participant.playerGroup,
    slotLabel: participant.slotLabel,
    displayName: getParticipantDisplayName(participant),
    confirmed: Boolean(options.confirmedParticipantIds?.has(participant.userId))
  };
}

function serializeScheduleMatch(match, options = {}) {
  const viewerUserId = options.viewerUserId || "";
  const participant = viewerUserId ? getMatchParticipant(match, viewerUserId) : null;
  const playerConfirmation = getPlayerConfirmationProgress(match, viewerUserId);
  const confirmedParticipantIds = new Set(playerConfirmation.confirmedBy);
  const bpOpen = isMatchBpOpen(match);
  const bp = normalizeBpState({
    ...match.bp,
    presence: getFreshPresence(match.bp)
  });
  const progress = getBpProgress({
    ...match,
    bp
  });

  return {
    ...match,
    participants: match.participants.map((item) =>
      serializeParticipant(item, {
        admin: options.admin,
        viewerUserId,
        confirmedParticipantIds
      })
    ),
    playerConfirmation: {
      enabled: playerConfirmation.enabled,
      confirmedCount: playerConfirmation.confirmedCount,
      total: playerConfirmation.total,
      allConfirmed: playerConfirmation.allConfirmed,
      viewerConfirmed: playerConfirmation.viewerConfirmed,
      ...(options.admin ? { confirmedBy: playerConfirmation.confirmedBy } : {})
    },
    bpOpen,
    bp: {
      ...bp,
      progress,
      presence: Object.values(bp.presence).map((item) => ({
        userId: options.admin || item.userId === viewerUserId ? item.userId : "",
        nickname: item.nickname,
        action: item.action,
        updatedAt: item.updatedAt
      }))
    },
    viewer: {
      isParticipant: Boolean(participant),
      participant: participant
        ? serializeParticipant(participant, {
            admin: true,
            viewerUserId
          })
        : null
    }
  };
}

function upsertKnownAccount(map, value = {}) {
  const userId = normalizeTextValue(value.userId || value.id, 128);

  if (!userId) {
    return;
  }

  const current = map.get(userId) || {
    userId,
    email: "",
    nickname: "",
    playerId: "",
    playerNickname: "",
    playerNumber: "",
    playerGroup: ""
  };

  map.set(userId, {
    userId,
    email: normalizeTextValue(value.email, 180) || current.email,
    nickname: normalizeTextValue(value.nickname, 48) || current.nickname,
    playerId: normalizeTextValue(value.playerId, 80) || current.playerId,
    playerNickname:
      normalizeTextValue(value.playerNickname, 80) || current.playerNickname,
    playerNumber: normalizeTextValue(value.playerNumber, 80) || current.playerNumber,
    playerGroup: normalizePlayerGroup(value.playerGroup) || current.playerGroup
  });
}

async function listKnownAccounts() {
  const accounts = new Map();
  const bindings = await loadUserBindings();
  const schedule = await loadScheduleDataWithAutoBp();
  let source = "known";

  bindings.requests.forEach((request) => upsertKnownAccount(accounts, request));
  Object.values(bindings.bindings).forEach((binding) =>
    upsertKnownAccount(accounts, binding)
  );
  schedule.matches.forEach((match) => {
    match.participants.forEach((participant) => upsertKnownAccount(accounts, participant));
    match.result.entries.forEach((entry) => upsertKnownAccount(accounts, entry));
  });

  if (supabaseAdmin) {
    try {
      let page = 1;
      let hasMore = true;

      while (hasMore && page <= 20) {
        const { data, error } = await supabaseAdmin.auth.admin.listUsers({
          page,
          perPage: 100
        });

        if (error) {
          throw error;
        }

        const users = Array.isArray(data?.users) ? data.users : [];

        users.forEach((user) => {
          upsertKnownAccount(accounts, {
            userId: user.id,
            email: user.email,
            nickname: getAuthUserNickname(user)
          });
        });

        hasMore = users.length === 100;
        page += 1;
      }

      source = "auth";
    } catch (error) {
      console.warn("Supabase auth users list failed", error.message);
      source = "known";
    }
  }

  Object.entries(bindings.playerGroups || {}).forEach(([userId, playerGroup]) =>
    upsertKnownAccount(accounts, {
      userId,
      playerGroup
    })
  );

  return {
    source,
    accounts: Array.from(accounts.values()).sort((a, b) =>
      getParticipantDisplayName(a, a.email || a.userId).localeCompare(
        getParticipantDisplayName(b, b.email || b.userId),
        "zh-CN"
      )
    )
  };
}

function createSongReplyNotification(parentOwner, replyOwner, meta = {}) {
  const trackTitle =
    normalizeTextValue(meta.trackTitle, 140) ||
    parentOwner.trackTitle ||
    `曲目 ${parentOwner.trackId}`;
  const replyNickname = replyOwner.nickname || "有人";

  return {
    id: crypto.randomUUID(),
    userId: parentOwner.userId,
    type: "song-comment-reply",
    title: "曲库评论有新回复",
    message: `${replyNickname} 回复了你在《${trackTitle}》下的评论。`,
    trackId: parentOwner.trackId,
    trackTitle,
    stage: parentOwner.stage,
    commentId: parentOwner.commentId,
    replyCommentId: replyOwner.commentId,
    replyNickname,
    read: false,
    createdAt: new Date().toISOString(),
    readAt: null
  };
}

async function recordSongCommentOwner(comment, user, meta = {}) {
  if (!comment?.id || !user?.id) {
    return;
  }

  const messages = await loadUserMessages();
  const commentId = String(comment.id);
  const parentCommentId = normalizeTextValue(meta.parentCommentId, 80);
  const owner = {
    commentId,
    userId: user.id,
    email: normalizeTextValue(user.email, 180),
    nickname: getAuthUserNickname(user),
    trackId: normalizeTextValue(meta.trackId || comment.track_id, 80),
    trackTitle: normalizeTextValue(meta.trackTitle, 140),
    stage: normalizeTextValue(meta.stage || comment.stage, 24),
    content: normalizeTextValue(comment.content, 160),
    createdAt: normalizeIsoDate(comment.created_at)
  };

  messages.songCommentOwners[commentId] = owner;

  if (parentCommentId) {
    const parentOwner = messages.songCommentOwners[parentCommentId];

    if (parentOwner && parentOwner.userId !== owner.userId) {
      messages.notifications.push(
        createSongReplyNotification(parentOwner, owner, meta)
      );
    }
  }

  messages.notifications = messages.notifications
    .slice()
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 500);

  await persistUserMessages(messages);
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

app.get("/settings/display", async (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json(await loadDisplaySettings());
});

app.put("/admin/settings/display", checkAdmin, async (req, res) => {
  try {
    const currentSettings = await loadDisplaySettings();
    let goldDragonPlayerIds = currentSettings.goldDragonPlayerIds;

    if (Array.isArray(req.body?.goldDragonPlayerIds)) {
      goldDragonPlayerIds = normalizeGoldDragonPlayerIds(
        req.body.goldDragonPlayerIds
      );
    } else if (req.body?.playerId !== undefined) {
      const playerId = String(req.body.playerId || "").trim();
      const ids = new Set(goldDragonPlayerIds);

      if (playerId && req.body?.enabled === true) {
        ids.add(playerId);
      } else if (playerId) {
        ids.delete(playerId);
      }

      goldDragonPlayerIds = Array.from(ids);
    }

    const settings = await persistDisplaySettings({
      ...currentSettings,
      goldDragonPlayerIds
    });

    res.set("Cache-Control", "no-store");
    res.json(settings);
  } catch (error) {
    res.status(500).json({
      message: "Display settings update failed",
      detail: error.message
    });
  }
});

app.get("/user/binding", requireUser, async (req, res) => {
  const data = await loadUserBindings();
  const userId = req.authUser.id;

  res.set("Cache-Control", "no-store");
  res.json({
    binding: data.bindings[userId] || null,
    pendingRequest: getLatestPendingBindingRequest(data, userId)
  });
});

app.post("/user/binding-requests", requireUser, async (req, res) => {
  const player = await findPlayerForBinding(req.body?.playerId);

  if (!player) {
    return res.status(404).json({
      message: "没有找到这个排行榜成绩"
    });
  }

  const data = await loadUserBindings();
  const user = req.authUser;
  const userId = user.id;
  const now = new Date().toISOString();
  const playerSnapshot = createPlayerBindingSnapshot(player);
  const pendingRequest = getLatestPendingBindingRequest(data, userId);
  const nextRequest = {
    id: pendingRequest?.id || crypto.randomUUID(),
    userId,
    email: normalizeTextValue(user.email, 180),
    nickname: getAuthUserNickname(user),
    ...playerSnapshot,
    status: "pending",
    createdAt: pendingRequest?.createdAt || now,
    updatedAt: now
  };

  if (pendingRequest) {
    data.requests = data.requests.map((request) =>
      request.id === pendingRequest.id ? nextRequest : request
    );
  } else {
    data.requests.push(nextRequest);
  }

  await persistUserBindings(data);

  res.set("Cache-Control", "no-store");
  res.status(201).json({
    request: nextRequest,
    binding: data.bindings[userId] || null
  });
});

app.get("/user/notifications", requireUser, async (req, res) => {
  const data = await loadUserMessages();
  const userId = req.authUser.id;
  const notifications = data.notifications
    .filter((notification) => notification.userId === userId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 50);

  res.set("Cache-Control", "no-store");
  res.json({
    notifications,
    unreadCount: notifications.filter((notification) => !notification.read).length
  });
});

app.post("/user/notifications/:id/read", requireUser, async (req, res) => {
  const data = await loadUserMessages();
  const userId = req.authUser.id;
  const notificationId = normalizeTextValue(req.params.id, 96);
  let updatedNotification = null;
  const now = new Date().toISOString();

  data.notifications = data.notifications.map((notification) => {
    if (notification.id !== notificationId || notification.userId !== userId) {
      return notification;
    }

    updatedNotification = {
      ...notification,
      read: true,
      readAt: notification.readAt || now
    };
    return updatedNotification;
  });

  if (!updatedNotification) {
    return res.status(404).json({
      message: "没有找到这条通知"
    });
  }

  await persistUserMessages(data);

  res.set("Cache-Control", "no-store");
  res.json({
    notification: updatedNotification
  });
});

app.post("/user/notifications/read-all", requireUser, async (req, res) => {
  const data = await loadUserMessages();
  const userId = req.authUser.id;
  const now = new Date().toISOString();
  let changedCount = 0;

  data.notifications = data.notifications.map((notification) => {
    if (notification.userId !== userId || notification.read) {
      return notification;
    }

    changedCount += 1;
    return {
      ...notification,
      read: true,
      readAt: now
    };
  });

  await persistUserMessages(data);

  res.set("Cache-Control", "no-store");
  res.json({
    changedCount
  });
});

app.get("/admin/binding-requests", checkAdmin, async (req, res) => {
  const data = await loadUserBindings();
  const status = normalizeTextValue(req.query.status, 24);
  const requests =
    status === "all"
      ? data.requests
      : data.requests.filter((request) => request.status === "pending");

  res.set("Cache-Control", "no-store");
  res.json({
    requests: requests
      .slice()
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
  });
});

app.post("/admin/binding-requests/:id/approve", checkAdmin, async (req, res) => {
  const data = await loadUserBindings();
  const requestId = normalizeTextValue(req.params.id, 96);
  const request = data.requests.find((item) => item.id === requestId);

  if (!request || request.status !== "pending") {
    return res.status(404).json({
      message: "没有找到待审核的绑定申请"
    });
  }

  const now = new Date().toISOString();
  const approvedRequest = {
    ...request,
    status: "approved",
    updatedAt: now
  };

  data.requests = data.requests.map((item) => {
    if (item.id === requestId) {
      return approvedRequest;
    }

    if (item.userId === request.userId && item.status === "pending") {
      return {
        ...item,
        status: "rejected",
        updatedAt: now
      };
    }

    return item;
  });

  data.bindings[request.userId] = createBindingFromRequest(approvedRequest, now);

  await persistUserBindings(data);
  await syncScheduleParticipantsForBinding(data.bindings[request.userId]);

  res.set("Cache-Control", "no-store");
  res.json({
    request: approvedRequest,
    binding: data.bindings[request.userId]
  });
});

app.post("/admin/binding-requests/:id/reject", checkAdmin, async (req, res) => {
  const data = await loadUserBindings();
  const requestId = normalizeTextValue(req.params.id, 96);
  const request = data.requests.find((item) => item.id === requestId);

  if (!request || request.status !== "pending") {
    return res.status(404).json({
      message: "没有找到待审核的绑定申请"
    });
  }

  const now = new Date().toISOString();
  const rejectedRequest = {
    ...request,
    status: "rejected",
    updatedAt: now
  };

  data.requests = data.requests.map((item) =>
    item.id === requestId ? rejectedRequest : item
  );

  await persistUserBindings(data);

  res.set("Cache-Control", "no-store");
  res.json({
    request: rejectedRequest
  });
});

app.put("/admin/accounts/:userId/binding", checkAdmin, async (req, res) => {
  const userId = normalizeTextValue(req.params.userId, 128);
  const player = await findPlayerForBinding(req.body?.playerId);

  if (!userId) {
    return res.status(400).json({
      message: "账号 ID 无效"
    });
  }

  if (!player) {
    return res.status(400).json({
      message: "没有找到指定排行榜账号"
    });
  }

  const accounts = await listKnownAccounts();
  const account = accounts.accounts.find((item) => item.userId === userId);

  if (!account) {
    return res.status(404).json({
      message: "没有找到这个账号"
    });
  }

  if (account.playerId) {
    return res.status(409).json({
      message: "这个账号已经绑定排行榜账号"
    });
  }

  const data = await loadUserBindings();
  const now = new Date().toISOString();
  const binding = createManualBinding(account, player, now);

  data.requests = data.requests.map((request) =>
    request.userId === userId && request.status === "pending"
      ? {
          ...request,
          status: "rejected",
          updatedAt: now
        }
      : request
  );
  data.bindings[userId] = binding;

  await persistUserBindings(data);
  await syncScheduleParticipantsForBinding(binding);

  res.set("Cache-Control", "no-store");
  res.json({
    binding
  });
});

app.put("/admin/accounts/:userId/player-group", checkAdmin, async (req, res) => {
  const userId = normalizeTextValue(req.params.userId, 128);
  const playerGroup = normalizePlayerGroup(req.body?.playerGroup);

  if (!userId) {
    return res.status(400).json({
      message: "账号 ID 无效"
    });
  }

  if (!playerGroup) {
    return res.status(400).json({
      message: "选手分组无效"
    });
  }

  const accounts = await listKnownAccounts();
  const account = accounts.accounts.find((item) => item.userId === userId);

  if (!account) {
    return res.status(404).json({
      message: "没有找到这个账号"
    });
  }

  const data = await loadUserBindings();

  data.playerGroups = {
    ...(data.playerGroups || {}),
    [userId]: playerGroup
  };

  await persistUserBindings(data);
  await syncScheduleParticipantsForAccountGroup(userId, playerGroup);

  res.set("Cache-Control", "no-store");
  res.json({
    userId,
    playerGroup
  });
});

app.get("/schedule/matches", optionalUser, async (req, res) => {
  const data = await loadScheduleDataWithAutoBp();
  const viewerUserId = req.authUser?.id || "";
  const matches = data.matches
    .filter((match) => canUserViewMatch(match, req.authUser))
    .map((match) =>
      serializeScheduleMatch(match, {
        viewerUserId
      })
    );

  res.set("Cache-Control", "no-store");
  res.json({
    matches,
    serverNow: new Date().toISOString()
  });
});

app.get("/schedule/matches/:id", optionalUser, async (req, res) => {
  const data = await loadScheduleDataWithAutoBp();
  const matchId = normalizeTextValue(req.params.id, 96);
  const match = data.matches.find((item) => item.id === matchId);

  if (!match || !canUserViewMatch(match, req.authUser)) {
    return res.status(404).json({
      message: "没有找到这场比赛"
    });
  }

  res.set("Cache-Control", "no-store");
  res.json({
    match: serializeScheduleMatch(match, {
      viewerUserId: req.authUser?.id || ""
    }),
    serverNow: new Date().toISOString()
  });
});

app.post("/schedule/matches/:id/player-confirmation", requireUser, async (req, res) => {
  const data = await loadScheduleDataWithAutoBp();
  const matchId = normalizeTextValue(req.params.id, 96);
  const match = data.matches.find((item) => item.id === matchId);
  const participant = match ? getMatchParticipant(match, req.authUser.id) : null;

  if (!match || !participant) {
    return res.status(403).json({
      message: "你不是这场比赛的参赛选手"
    });
  }

  if (match.status !== "scheduled") {
    return res.status(400).json({
      message: "只有未开始的比赛可以进行选手确认"
    });
  }

  const confirmation = getPlayerConfirmationProgress(match, req.authUser.id);

  if (!confirmation.enabled) {
    return res.status(400).json({
      message: "本场比赛未启用选手确认"
    });
  }

  if (!confirmation.confirmedBy.includes(participant.userId)) {
    match.playerConfirmation.confirmedBy.push(participant.userId);
  }

  match.updatedAt = new Date().toISOString();
  applyScheduleAutoBp(data);

  const saved = await persistScheduleData(data);
  const savedMatch = saved.matches.find((item) => item.id === matchId) || match;

  res.set("Cache-Control", "no-store");
  res.json({
    match: serializeScheduleMatch(savedMatch, {
      viewerUserId: req.authUser.id
    })
  });
});

app.get("/schedule/song-pool", async (req, res) => {
  try {
    const data = await loadSongPoolData();

    res.set("Cache-Control", "no-store");
    res.json(data);
  } catch (error) {
    console.error("[schedule] Failed to load song pool:", error);
    res.status(500).json({
      message: "曲库暂时不可用"
    });
  }
});

app.post("/schedule/matches/:id/bp/presence", requireUser, async (req, res) => {
  const data = await loadScheduleDataWithAutoBp();
  const matchId = normalizeTextValue(req.params.id, 96);
  const match = data.matches.find((item) => item.id === matchId);
  const participant = match ? getMatchParticipant(match, req.authUser.id) : null;

  if (!match || !participant) {
    return res.status(403).json({
      message: "你不是这场比赛的参赛选手"
    });
  }

  if (!isMatchBpOpen(match)) {
    return res.status(400).json({
      message: getMatchBpClosedMessage(match)
    });
  }

  const action = req.body?.action === "pick" ? "pick" : "ban";
  const now = new Date().toISOString();

  match.bp.presence = getFreshPresence(match.bp);
  match.bp.presence[participant.userId] = {
    userId: participant.userId,
    nickname: getParticipantDisplayName(participant),
    action,
    updatedAt: now
  };
  match.updatedAt = now;

  const saved = await persistScheduleData(data);
  const savedMatch = saved.matches.find((item) => item.id === matchId) || match;

  res.set("Cache-Control", "no-store");
  res.json({
    match: serializeScheduleMatch(savedMatch, {
      viewerUserId: req.authUser.id
    })
  });
});

app.post("/schedule/matches/:id/bp/actions", requireUser, async (req, res) => {
  const data = await loadScheduleDataWithAutoBp();
  const matchId = normalizeTextValue(req.params.id, 96);
  const match = data.matches.find((item) => item.id === matchId);
  const participant = match ? getMatchParticipant(match, req.authUser.id) : null;

  if (!match || !participant) {
    return res.status(403).json({
      message: "你不是这场比赛的参赛选手"
    });
  }

  if (!isMatchBpOpen(match)) {
    return res.status(400).json({
      message: getMatchBpClosedMessage(match)
    });
  }

  const type = req.body?.type === "pick" ? "pick" : "ban";
  const progress = getBpProgress(match);
  const userBans = match.bp.bans.filter((item) => item.userId === participant.userId);
  const userPicks = match.bp.picks.filter((item) => item.userId === participant.userId);

  if (type === "ban" && progress.phase !== "ban") {
    return res.status(400).json({
      message: "当前已进入选曲阶段"
    });
  }

  if (type === "ban" && userBans.length >= progress.banCount) {
    return res.status(400).json({
      message: "你的禁用曲目数量已满"
    });
  }

  if (type === "pick" && !progress.allBansDone) {
    return res.status(400).json({
      message: "所有选手完成禁用后才能选曲"
    });
  }

  if (type === "pick" && userPicks.length >= progress.pickCount) {
    return res.status(400).json({
      message: "你的选曲数量已满"
    });
  }

  const resolved = await resolveBpSelection(match, req.body);

  if (resolved.error) {
    return res.status(400).json({
      message: resolved.error
    });
  }

  const selectedKey = createBpSelectionKey(
    resolved.track.trackId,
    resolved.difficulty
  );
  const bannedSelectionKeys = new Set(
    match.bp.bans.map(getBpSelectionKey).filter(Boolean)
  );
  const pickedSelectionKeys = new Set(
    match.bp.picks.map(getBpSelectionKey).filter(Boolean)
  );

  if (type === "ban" && bannedSelectionKeys.has(selectedKey)) {
    return res.status(400).json({
      message: "这个谱面已经被禁用"
    });
  }

  if (type === "pick" && bannedSelectionKeys.has(selectedKey)) {
    return res.status(400).json({
      message: "不能选择已被禁用的谱面"
    });
  }

  if (type === "pick" && pickedSelectionKeys.has(selectedKey)) {
    return res.status(400).json({
      message: "这个谱面已经被选走"
    });
  }

  const now = new Date().toISOString();
  const selection = {
    id: crypto.randomUUID(),
    type,
    userId: participant.userId,
    nickname: getParticipantDisplayName(participant),
    trackId: resolved.track.trackId,
    title: resolved.track.title,
    artist: resolved.track.artist,
    pack: resolved.track.pack,
    difficulty: resolved.difficulty,
    createdAt: now
  };

  if (type === "ban") {
    match.bp.bans.push(selection);
  } else {
    match.bp.picks.push(selection);
  }

  delete match.bp.presence[participant.userId];
  await ensureRandomBpPicks(match);

  match.updatedAt = now;

  const saved = await persistScheduleData(data);
  const savedMatch = saved.matches.find((item) => item.id === matchId) || match;

  res.set("Cache-Control", "no-store");
  res.json({
    match: serializeScheduleMatch(savedMatch, {
      viewerUserId: req.authUser.id
    })
  });
});

app.post("/schedule/matches/:id/bp/confirm", requireUser, async (req, res) => {
  const data = await loadScheduleDataWithAutoBp();
  const matchId = normalizeTextValue(req.params.id, 96);
  const match = data.matches.find((item) => item.id === matchId);
  const participant = match ? getMatchParticipant(match, req.authUser.id) : null;

  if (!match || !participant) {
    return res.status(403).json({
      message: "你不是这场比赛的参赛选手"
    });
  }

  if (!isMatchBpOpen(match)) {
    return res.status(400).json({
      message: getMatchBpClosedMessage(match)
    });
  }

  await ensureRandomBpPicks(match);

  const progress = getBpProgress(match);

  if (!progress.allPicksDone) {
    return res.status(400).json({
      message: "选曲尚未完成"
    });
  }

  if (!progress.randomPicksDone) {
    return res.status(400).json({
      message: "可随机抽选的谱面不足，请调整随机抽选数量或曲池范围"
    });
  }

  if (!match.bp.confirmedBy.includes(participant.userId)) {
    match.bp.confirmedBy.push(participant.userId);
  }

  match.updatedAt = new Date().toISOString();

  const saved = await persistScheduleData(data);
  const savedMatch = saved.matches.find((item) => item.id === matchId) || match;

  res.set("Cache-Control", "no-store");
  res.json({
    match: serializeScheduleMatch(savedMatch, {
      viewerUserId: req.authUser.id
    })
  });
});

app.get("/admin/accounts", checkAdmin, async (req, res) => {
  const accounts = await listKnownAccounts();

  res.set("Cache-Control", "no-store");
  res.json(accounts);
});

app.get("/admin/schedule/matches", checkAdmin, async (req, res) => {
  const data = await loadScheduleDataWithAutoBp();

  res.set("Cache-Control", "no-store");
  res.json({
    matches: data.matches.map((match) =>
      serializeScheduleMatch(match, {
        admin: true
      })
    )
  });
});

app.post("/admin/schedule/matches", checkAdmin, async (req, res) => {
  const data = await loadScheduleDataWithAutoBp();
  const now = new Date().toISOString();
  const match = normalizeScheduleMatch(
    {
      ...req.body,
      id: req.body?.id || crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    },
    {
      now
    }
  );

  data.matches.push(match);
  applyScheduleAutoBp(data);

  const saved = await persistScheduleData(data);
  const savedMatch = saved.matches.find((item) => item.id === match.id) || match;

  res.set("Cache-Control", "no-store");
  res.status(201).json({
    match: serializeScheduleMatch(savedMatch, {
      admin: true
    })
  });
});

app.put("/admin/schedule/matches/:id", checkAdmin, async (req, res) => {
  const data = await loadScheduleDataWithAutoBp();
  const matchId = normalizeTextValue(req.params.id, 96);
  const index = data.matches.findIndex((item) => item.id === matchId);

  if (index === -1) {
    return res.status(404).json({
      message: "没有找到这场比赛"
    });
  }

  const existing = data.matches[index];
  const now = new Date().toISOString();
  const next = normalizeScheduleMatch(
    {
      ...existing,
      ...req.body,
      id: existing.id,
      createdAt: existing.createdAt,
      bp: req.body?.bp === undefined ? existing.bp : req.body.bp,
      result: req.body?.result === undefined ? existing.result : req.body.result,
      updatedAt: now
    },
    {
      now,
      touch: true
    }
  );

  data.matches[index] = next;
  applyScheduleAutoBp(data);

  const saved = await persistScheduleData(data);
  const savedMatch = saved.matches.find((item) => item.id === matchId) || next;

  res.set("Cache-Control", "no-store");
  res.json({
    match: serializeScheduleMatch(savedMatch, {
      admin: true
    })
  });
});

app.delete("/admin/schedule/matches/:id", checkAdmin, async (req, res) => {
  const data = await loadScheduleDataWithAutoBp();
  const matchId = normalizeTextValue(req.params.id, 96);
  const before = data.matches.length;

  data.matches = data.matches.filter((match) => match.id !== matchId);

  if (data.matches.length === before) {
    return res.status(404).json({
      message: "没有找到这场比赛"
    });
  }

  await persistScheduleData(data);

  res.set("Cache-Control", "no-store");
  res.json({
    success: true
  });
});

app.post("/admin/schedule/matches/:id/reset-bp", checkAdmin, async (req, res) => {
  const data = await loadScheduleDataWithAutoBp();
  const matchId = normalizeTextValue(req.params.id, 96);
  const match = data.matches.find((item) => item.id === matchId);

  if (!match) {
    return res.status(404).json({
      message: "没有找到这场比赛"
    });
  }

  match.bp = normalizeBpState({});
  match.updatedAt = new Date().toISOString();

  const saved = await persistScheduleData(data);
  const savedMatch = saved.matches.find((item) => item.id === matchId) || match;

  res.set("Cache-Control", "no-store");
  res.json({
    match: serializeScheduleMatch(savedMatch, {
      admin: true
    })
  });
});

app.put("/admin/schedule/matches/:id/result", checkAdmin, async (req, res) => {
  const data = await loadScheduleDataWithAutoBp();
  const matchId = normalizeTextValue(req.params.id, 96);
  const match = data.matches.find((item) => item.id === matchId);

  if (!match) {
    return res.status(404).json({
      message: "没有找到这场比赛"
    });
  }

  match.result = normalizeScheduleResult({
    ...req.body,
    updatedAt: new Date().toISOString()
  });

  if (match.result.entries.length) {
    match.status = "finished";
  }

  match.updatedAt = new Date().toISOString();

  const saved = await persistScheduleData(data);
  const savedMatch = saved.matches.find((item) => item.id === matchId) || match;

  res.set("Cache-Control", "no-store");
  res.json({
    match: serializeScheduleMatch(savedMatch, {
      admin: true
    })
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

app.post("/players/:id/comments", optionalUser, async (req, res) => {
  const playerId = Number(req.params.id);
  const nickname = req.authUser
    ? getAuthUserNickname(req.authUser)
    : normalizeCommentText(req.body.nickname, 32);
  const content = normalizeCommentText(req.body.content, 500);

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

app.post("/song-pool/tracks/:id/comments", optionalUser, async (req, res) => {
  const trackId = normalizeTrackId(req.params.id);
  const stage = normalizeSongPoolStage(req.body.stage);
  const nickname = req.authUser
    ? getAuthUserNickname(req.authUser)
    : normalizeCommentText(req.body.nickname, 32);
  const content = normalizeCommentText(req.body.content, 500);
  const difficulty = normalizeSongDifficulty(req.body.difficulty);
  const parentCommentId = normalizeCommentParentId(req.body.parentCommentId);
  const trackTitle = normalizeCommentText(req.body.trackTitle, 140);

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

      const fallbackComments = (fallbackData || []).map((comment) => ({
          ...comment,
          parent_comment_id: null
        }));

      if (fallbackComments[0] && req.authUser) {
        try {
          await recordSongCommentOwner(fallbackComments[0], req.authUser, {
            trackId,
            trackTitle,
            stage,
            parentCommentId: null
          });
        } catch (notifyError) {
          console.warn("Song comment notification failed", notifyError.message);
        }
      }

      return res.json(fallbackComments);
    }

    return res.status(500).json(error);
  }

  if (data?.[0] && req.authUser) {
    try {
      await recordSongCommentOwner(data[0], req.authUser, {
        trackId,
        trackTitle,
        stage,
        parentCommentId
      });
    } catch (notifyError) {
      console.warn("Song comment notification failed", notifyError.message);
    }
  }

  res.json(data);
});

loadInitialPlayersSnapshot().then(refreshPlayersInBackground);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    supabaseAdmin
      ? `Runtime data storage: Supabase Storage bucket "${SUPABASE_RUNTIME_BUCKET}"`
      : `Runtime data storage: local JSON files in "${RUNTIME_DATA_DIR}"`
  );
});
